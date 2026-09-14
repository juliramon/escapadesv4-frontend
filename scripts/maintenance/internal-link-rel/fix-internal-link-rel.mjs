#!/usr/bin/env node
/**
 * Treu `rel` i `target` dels enllaços interns ja publicats.
 *
 * Fins que l'editor no va distingir enllaços interns i externs
 * (`utils/internalLinks.js`), l'extensió Link de TipTap posava
 * `target="_blank" rel="noopener noreferrer nofollow"` a tots els enllaços.
 * Els nous ja surten nets, però el contingut publicat conserva el `nofollow`
 * als interns, que no reparteix autoritat entre publicacions del mateix web.
 *
 * Aquest script reescriu `description` i `reasons` d'Activity, Place, Story,
 * List i TripEntry. Només toca els `<a>` amb href intern i només n'elimina els
 * atributs `rel` i `target`: la resta de l'HTML queda idèntic byte a byte. Els
 * externs no es toquen, que n'hi ha d'afiliació que han de mantenir `nofollow`.
 *
 * Seguretat:
 * - Només s'executa contra bases de dades el nom de les quals acaba en `-dev`,
 *   i des de fora de la carpeta del backend. Per a qualsevol altra cal
 *   `--production-db=<nom exacte>`, que ha de coincidir amb el de la URI i
 *   amb el de la connexió.
 * - Per defecte és un dry-run: llista què canviaria i no escriu res.
 * - Amb `--apply` primer desa una còpia de seguretat i després escriu cada
 *   document només si el camp no ha canviat des que s'ha llegit.
 * - `--restore <fitxer>` desfà una execució a partir de la seva còpia.
 * - Escriu amb el driver directament: no passa per Mongoose i no toca
 *   `updatedAt`.
 *
 * Ús (MONGODB_URI ha d'incloure el nom de la base de dades):
 *   MONGODB_URI="mongodb+srv://…/getaways-guru-dev?…" node fix-internal-link-rel.mjs
 *   MONGODB_URI="…" node fix-internal-link-rel.mjs --apply
 *   MONGODB_URI="…" node fix-internal-link-rel.mjs --restore backups/<fitxer>.json [--apply]
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BSON, MongoClient } from "mongodb";
import { parseFragment, serialize } from "parse5";

// La còpia de seguretat es desa en EJSON perquè els `_id` tornin com a ObjectId.
const { EJSON } = BSON;

const HERE = path.dirname(fileURLToPath(import.meta.url));

const COLLECTIONS = ["activities", "places", "stories", "lists", "tripentries"];
const FIELDS = ["description", "reasons"];
const STRIPPED_ATTRS = ["rel", "target"];

// Els mateixos hosts que `utils/internalLinks.js`.
const SITE_HOSTS = ["escapadesenparella.cat", "www.escapadesenparella.cat"];
const DEV_SUFFIX = "-dev";
const BACKEND_DIR_NAME = "escapadesv4-backend";

const USAGE = `Ús: MONGODB_URI="…/<base>-dev?…" node fix-internal-link-rel.mjs [opcions]

  (sense opcions)       dry-run: llista els canvis i no escriu res
  --apply               escriu els canvis (desa abans una còpia de seguretat)
  --restore <fitxer>    desfà una execució a partir de la seva còpia (dry-run
                        si no s'hi afegeix --apply)
  --backup-dir <dir>    on es desen les còpies (per defecte ./backups)
  --production-db=<nom> permet una base de dades que no acaba en -dev; ha de
                        ser el nom exacte de la base de dades de la URI
  --help                aquesta ajuda`;

class UsageError extends Error {}

const parseArgs = (argv) => {
	const args = {
		apply: false,
		restore: null,
		backupDir: path.join(HERE, "backups"),
	};
	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		const [name, inline] = arg.split(/=(.*)/s);
		const value = () => {
			const next = inline ?? argv[++i];
			if (!next) throw new UsageError(`Falta el valor de ${name}.`);
			return next;
		};
		if (arg === "--apply") args.apply = true;
		else if (arg === "--dry-run") args.dryRun = true;
		else if (name === "--restore") args.restore = path.resolve(value());
		else if (name === "--backup-dir") args.backupDir = path.resolve(value());
		else if (name === "--production-db") args.productionDb = value();
		else if (arg === "--help" || arg === "-h") args.help = true;
		else throw new UsageError(`Opció desconeguda: ${arg}`);
	}
	if (args.apply && args.dryRun) {
		throw new UsageError("--apply i --dry-run no es poden combinar.");
	}
	return args;
};

/* ------------------------------------------------------------------------ */
/* Guards                                                                   */
/* ------------------------------------------------------------------------ */

const dbNameFromUri = (uri) => {
	try {
		return decodeURIComponent(new URL(uri).pathname.replace(/^\//, ""));
	} catch (err) {
		throw new UsageError("MONGODB_URI no és una URI vàlida.");
	}
};

const hostFromUri = (uri) => {
	try {
		return new URL(uri).host;
	} catch (err) {
		return "?";
	}
};

/**
 * Torna `true` si la base de dades és la de producció autoritzada amb
 * `--production-db`. Qualsevol altra que no acabi en `-dev` avorta.
 */
const guardDatabase = (name, source, productionDb) => {
	if (name && name.endsWith(DEV_SUFFIX)) {
		if (productionDb) {
			throw new UsageError(
				`--production-db no té sentit amb una base de dades de proves ("${name}").`,
			);
		}
		return false;
	}
	if (productionDb && name === productionDb) return true;
	throw new UsageError(
		`La base de dades (${source}) és "${name || "(cap)"}" i no acaba en "${DEV_SUFFIX}". ` +
			"Aquest script només s'executa contra bases de dades de proves, " +
			"llevat que --production-db en doni el nom exacte.",
	);
};

/**
 * Crear fitxers dins del backend fa reiniciar nodemon, i un procés antic
 * apuntant a producció es pot quedar el port: res d'aquest script hi ha de
 * viure ni escriure-hi.
 */
const assertOutsideBackend = (paths) => {
	for (const value of paths) {
		const segments = path.resolve(value).toLowerCase().split(/[\\/]+/);
		if (segments.includes(BACKEND_DIR_NAME)) {
			throw new UsageError(
				`No es pot executar ni escriure dins de ${BACKEND_DIR_NAME}: ${value}`,
			);
		}
	}
};

/* ------------------------------------------------------------------------ */
/* HTML                                                                     */
/* ------------------------------------------------------------------------ */

const isSiteUrl = (value) => {
	try {
		const url = new URL(value);
		return (
			(url.protocol === "https:" || url.protocol === "http:") &&
			SITE_HOSTS.includes(url.hostname)
		);
	} catch (err) {
		return false;
	}
};

/**
 * `internal`, `external`, `ambiguous` o `none`.
 *
 * Un href sense esquema que no comença per `/`, `#`, `?` o `./` (per exemple
 * `www.booking.com/…`) és tècnicament relatiu, però gairebé sempre és un
 * extern mal escrit: no es toca i es llista perquè es revisi a mà.
 */
const classifyHref = (rawHref) => {
	const href = String(rawHref ?? "").trim();
	if (!href) return "none";
	if (href.startsWith("//")) {
		return isSiteUrl(`https:${href}`) ? "internal" : "external";
	}
	if (/^(\/|#|\?|\.\.?\/)/.test(href)) return "internal";
	if (/^[a-z][a-z0-9+.-]*:/i.test(href)) {
		return isSiteUrl(href) ? "internal" : "external";
	}
	return "ambiguous";
};

const walk = (node, visit) => {
	visit(node);
	for (const child of node.childNodes || []) walk(child, visit);
	if (node.content) walk(node.content, visit);
};

/**
 * Treu `rel` i `target` dels `<a>` interns d'un fragment HTML.
 *
 * parse5 dóna la posició exacta de cada atribut dins del text original, així
 * que no es reserialitza res: només s'eliminen aquests trossos (amb l'espai
 * que els precedeix) i la resta de la cadena queda intacta. Després es
 * comprova que el DOM resultant és exactament l'original sense aquests
 * atributs; si no quadra (atributs duplicats, HTML estrany), llança i el camp
 * es deixa com està.
 */
const rewriteHtml = (html) => {
	const tree = parseFragment(html, { sourceCodeLocationInfo: true });
	const result = {
		html,
		links: [],
		ambiguous: [],
		external: 0,
		internalClean: 0,
	};
	const edits = [];
	const changedNodes = [];

	walk(tree, (node) => {
		if (node.nodeName !== "a") return;
		const href = node.attrs.find((attr) => attr.name === "href")?.value;
		const kind = classifyHref(href);
		if (kind === "external") result.external++;
		if (kind === "ambiguous") result.ambiguous.push(href);
		if (kind !== "internal") return;

		const present = node.attrs.filter((attr) =>
			STRIPPED_ATTRS.includes(attr.name),
		);
		if (!present.length) {
			result.internalClean++;
			return;
		}
		const locations = node.sourceCodeLocation?.startTag?.attrs || {};
		for (const attr of present) {
			const location = locations[attr.name];
			if (!location) {
				throw new Error(`sense posició per a ${attr.name} a ${href}`);
			}
			let start = location.startOffset;
			while (start > 0 && /[\t\n\f\r ]/.test(html[start - 1])) start--;
			edits.push({ start, end: location.endOffset, name: attr.name });
		}
		result.links.push({
			href,
			removed: Object.fromEntries(
				present.map((attr) => [attr.name, attr.value]),
			),
		});
		changedNodes.push(node);
	});

	if (!edits.length) return result;

	// De darrere cap endavant, perquè els offsets pendents continuïn valent.
	edits.sort((a, b) => b.start - a.start);
	let output = html;
	let limit = Infinity;
	for (const edit of edits) {
		const removed = output.slice(edit.start, edit.end);
		if (
			edit.end > limit ||
			!new RegExp(`^\\s+${edit.name}(?![\\w-])`, "i").test(removed)
		) {
			throw new Error(`tros inesperat en treure ${edit.name}: ${removed}`);
		}
		output = output.slice(0, edit.start) + output.slice(edit.end);
		limit = edit.start;
	}

	changedNodes.forEach((node) => {
		node.attrs = node.attrs.filter(
			(attr) => !STRIPPED_ATTRS.includes(attr.name),
		);
	});
	if (serialize(tree) !== serialize(parseFragment(output))) {
		throw new Error("el DOM resultant no és l'original sense rel/target");
	}

	result.html = output;
	return result;
};

/* ------------------------------------------------------------------------ */
/* Base de dades                                                            */
/* ------------------------------------------------------------------------ */

const labelOf = (doc) => doc.slug || doc.title || "";

const describeRemoved = (removed) =>
	Object.entries(removed)
		.map(([name, value]) => `${name}="${value}"`)
		.join(" ");

const collectPlan = async (db) => {
	const plan = [];
	const stats = {
		documents: 0,
		links: 0,
		external: 0,
		internalClean: 0,
		ambiguous: [],
		errors: [],
		byCollection: {},
	};

	for (const name of COLLECTIONS) {
		const counts = { documents: 0, fields: 0, links: 0 };
		stats.byCollection[name] = counts;
		const cursor = db
			.collection(name)
			.find(
				{ $or: FIELDS.map((field) => ({ [field]: { $type: "string" } })) },
				{
					projection: Object.fromEntries(
						["title", "slug", ...FIELDS].map((field) => [field, 1]),
					),
				},
			)
			.sort({ _id: 1 });

		for await (const doc of cursor) {
			stats.documents++;
			const fields = [];
			for (const field of FIELDS) {
				const before = doc[field];
				if (typeof before !== "string") continue;
				const where = `${name} ${doc._id} (${labelOf(doc)}) · ${field}`;
				let result;
				try {
					result = rewriteHtml(before);
				} catch (err) {
					stats.errors.push({ where, message: err.message });
					continue;
				}
				stats.external += result.external;
				stats.internalClean += result.internalClean;
				result.ambiguous.forEach((href) =>
					stats.ambiguous.push({ where, href }),
				);
				if (result.html === before) continue;
				fields.push({
					field,
					before,
					after: result.html,
					links: result.links,
				});
				counts.fields++;
				counts.links += result.links.length;
				stats.links += result.links.length;
			}
			if (fields.length) {
				counts.documents++;
				plan.push({
					collection: name,
					_id: doc._id,
					label: labelOf(doc),
					fields,
				});
			}
		}
	}
	return { plan, stats };
};

const printPlan = ({ plan, stats }) => {
	for (const item of plan) {
		console.log(`\n${item.collection} ${item._id} · ${item.label}`);
		for (const field of item.fields) {
			console.log(`  ${field.field}`);
			for (const link of field.links) {
				console.log(`    ${link.href}`);
				console.log(`      treu ${describeRemoved(link.removed)}`);
			}
		}
	}

	const changedDocs = plan.length;
	console.log("\nResum");
	console.log(`  Documents revisats: ${stats.documents}`);
	console.log(
		`  A canviar: ${changedDocs} documents, ${stats.links} enllaços interns`,
	);
	for (const [name, counts] of Object.entries(stats.byCollection)) {
		console.log(
			`    ${name.padEnd(12)} ${counts.documents} documents · ${counts.fields} camps · ${counts.links} enllaços`,
		);
	}
	console.log(`  Enllaços interns ja nets: ${stats.internalClean}`);
	console.log(`  Enllaços externs (no es toquen): ${stats.external}`);
	if (stats.ambiguous.length) {
		console.log(
			`  Enllaços sense esquema (no es toquen, cal revisar-los a mà): ${stats.ambiguous.length}`,
		);
		stats.ambiguous.forEach(({ where, href }) =>
			console.log(`    ${where}: ${href}`),
		);
	}
	if (stats.errors.length) {
		console.log(`  Camps que no s'han pogut processar: ${stats.errors.length}`);
		stats.errors.forEach(({ where, message }) =>
			console.log(`    ${where}: ${message}`),
		);
	}
};

const writeBackup = async (backupDir, database, plan) => {
	await fs.mkdir(backupDir, { recursive: true });
	const stamp = new Date().toISOString().replace(/[:.]/g, "-");
	const file = path.join(backupDir, `internal-link-rel-${database}-${stamp}.json`);
	const entries = plan.flatMap((item) =>
		item.fields.map(({ field, before, after }) => ({
			collection: item.collection,
			_id: item._id,
			field,
			before,
			after,
		})),
	);
	await fs.writeFile(
		file,
		EJSON.stringify(
			{ database, createdAt: new Date().toISOString(), entries },
			null,
			2,
		),
		{ flag: "wx" },
	);
	return file;
};

const fix = async (db, args) => {
	const collected = await collectPlan(db);
	printPlan(collected);
	const { plan } = collected;

	if (!args.apply) {
		console.log("\nDry-run: no s'ha escrit res. Per aplicar-ho, afegeix --apply.");
		return;
	}
	if (!plan.length) {
		console.log("\nNo hi ha res a escriure.");
		return;
	}

	const backupFile = await writeBackup(args.backupDir, db.databaseName, plan);
	console.log(`\nCòpia de seguretat: ${backupFile}`);

	let written = 0;
	const conflicts = [];
	for (const item of plan) {
		// Només s'escriu si cap camp no ha canviat des que s'ha llegit.
		const filter = { _id: item._id };
		const $set = {};
		item.fields.forEach(({ field, before, after }) => {
			filter[field] = before;
			$set[field] = after;
		});
		const res = await db.collection(item.collection).updateOne(filter, { $set });
		if (res.modifiedCount === 1) written++;
		else conflicts.push(item);
	}
	console.log(`Escrits: ${written} de ${plan.length} documents.`);
	conflicts.forEach((item) =>
		console.log(
			`  No escrit (ha canviat mentrestant): ${item.collection} ${item._id} · ${item.label}`,
		),
	);
	if (conflicts.length) process.exitCode = 1;
};

const restore = async (db, args) => {
	const backup = EJSON.parse(await fs.readFile(args.restore, "utf8"));
	if (backup.database !== db.databaseName) {
		throw new UsageError(
			`La còpia és de "${backup.database}" i la connexió és a "${db.databaseName}".`,
		);
	}

	const pending = [];
	let alreadyRestored = 0;
	const conflicts = [];
	for (const entry of backup.entries) {
		const doc = await db
			.collection(entry.collection)
			.findOne({ _id: entry._id }, { projection: { [entry.field]: 1 } });
		const current = doc?.[entry.field];
		if (current === entry.after) pending.push(entry);
		else if (current === entry.before) alreadyRestored++;
		else conflicts.push(entry);
	}

	console.log(`Entrades a la còpia: ${backup.entries.length}`);
	console.log(`  Per restaurar: ${pending.length}`);
	console.log(`  Ja restaurades: ${alreadyRestored}`);
	console.log(`  Editades després (no es toquen): ${conflicts.length}`);
	conflicts.forEach((entry) =>
		console.log(`    ${entry.collection} ${entry._id} · ${entry.field}`),
	);

	if (!args.apply) {
		console.log("\nDry-run: no s'ha escrit res. Per restaurar, afegeix --apply.");
		return;
	}
	let written = 0;
	for (const entry of pending) {
		const res = await db
			.collection(entry.collection)
			.updateOne(
				{ _id: entry._id, [entry.field]: entry.after },
				{ $set: { [entry.field]: entry.before } },
			);
		written += res.modifiedCount;
	}
	console.log(`Restaurades: ${written} de ${pending.length}.`);
	if (written !== pending.length) process.exitCode = 1;
};

/* ------------------------------------------------------------------------ */

const main = async () => {
	const args = parseArgs(process.argv.slice(2));
	if (args.help) {
		console.log(USAGE);
		return;
	}
	assertOutsideBackend([process.cwd(), HERE, args.backupDir]);

	const uri = process.env.MONGODB_URI;
	if (!uri) {
		throw new UsageError(
			"Cal MONGODB_URI, amb el nom de la base de dades (acabat en -dev).",
		);
	}
	guardDatabase(dbNameFromUri(uri), "MONGODB_URI", args.productionDb);

	const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 });
	await client.connect();
	try {
		const db = client.db();
		const isProduction = guardDatabase(
			db.databaseName,
			"connexió",
			args.productionDb,
		);
		console.log(`Base de dades: ${db.databaseName} (${hostFromUri(uri)})`);
		if (isProduction) console.log("ATENCIÓ: base de dades de PRODUCCIÓ");
		console.log(
			args.apply ? "Mode: APLICA ELS CANVIS" : "Mode: dry-run (no escriu res)",
		);
		if (args.restore) await restore(db, args);
		else await fix(db, args);
	} finally {
		await client.close();
	}
};

const isEntryPoint =
	process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isEntryPoint) {
	main().catch((err) => {
		if (err instanceof UsageError) {
			console.error(`${err.message}\n\n${USAGE}`);
			process.exit(2);
		}
		console.error(err);
		process.exit(1);
	});
}

export { classifyHref, rewriteHtml };
