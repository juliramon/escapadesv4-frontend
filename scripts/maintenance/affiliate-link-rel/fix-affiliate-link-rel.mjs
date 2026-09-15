#!/usr/bin/env node
/**
 * Afegeix `rel="sponsored"` als enllaços d'afiliació ja publicats.
 *
 * L'editor marca els enllaços nous (`utils/internalLinks.js`), però el
 * contingut publicat porta escrit el `rel` que tenia el dia que es va desar:
 * 27 enllaços a Amazon amb `tag=`, un parell a Booking amb `aid=` i uns
 * quants a Civitatis i IATI porten només `nofollow`. Google demana
 * `sponsored` per als enllaços que deixen comissió.
 *
 * Aquest script reescriu `description` i `reasons` d'Activity, Place, Story,
 * List i TripEntry. Només toca l'atribut `rel` dels `<a>` que
 * `isAffiliateUrl` reconeix com d'afiliació, i hi conserva els valors que ja
 * hi havia (`nofollow`, `noopener`, `noreferrer`): la resta de l'HTML queda
 * idèntica byte a byte. Els enllaços externs que no es reconeixen es llisten
 * al final perquè es puguin revisar a mà.
 *
 * Segueix les mateixes regles de seguretat que `internal-link-rel`, que és
 * d'on surt aquesta manera de fer:
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
 *   MONGODB_URI="mongodb+srv://…/getaways-guru-dev?…" node fix-affiliate-link-rel.mjs
 *   MONGODB_URI="…" node fix-affiliate-link-rel.mjs --apply
 *   MONGODB_URI="…" node fix-affiliate-link-rel.mjs --restore backups/<fitxer>.json [--apply]
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

// Els mateixos hosts que `utils/internalLinks.js`.
const SITE_HOSTS = ["escapadesenparella.cat", "www.escapadesenparella.cat"];
const DEV_SUFFIX = "-dev";
const BACKEND_DIR_NAME = "escapadesv4-backend";

const SPONSORED = "sponsored";
const DEFAULT_REL = "sponsored nofollow";

const USAGE = `Ús: MONGODB_URI="…/<base>-dev?…" node fix-affiliate-link-rel.mjs [opcions]

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
/* Afiliació                                                                */
/* ------------------------------------------------------------------------ */

/*
 * Mateixes regles que `utils/affiliate.js`. Aquí hi són copiades i no
 * importades perquè l'script s'executa sol, amb les seves dependències i sense
 * el build del web; si les regles del web canvien, cal repassar-les aquí.
 */

const AFFILIATE_NETWORK_HOSTS = [
	"anrdoezrs.net",
	"jdoqocy.com",
	"tkqlhce.com",
	"dpbolvw.net",
	"kqzyfj.com",
	"qksrv.net",
	"awin1.com",
	"tidd.ly",
	"prf.hn",
	"linksynergy.com",
	"tradedoubler.com",
	"tradetracker.net",
];

const AFFILIATE_PARAMS = [
	"affiliate",
	"affiliate_id",
	"affiliateid",
	"aff",
	"aff_id",
	"cjevent",
	"awc",
	"irclickid",
	"ranmid",
	"ransiteid",
	"partner_id",
	"partnerid",
];

const HOST_AFFILIATE_PARAMS = [
	{ match: "amazon.", params: ["tag", "ascsubtag"] },
	{ match: "booking.com", params: ["aid", "label"] },
	{ match: "centraldereservas", params: ["idafiliado", "afiliado"] },
	{ match: "civitatis", params: ["aid", "partner", "ag"] },
	{ match: "getyourguide", params: ["partner_id", "cmp"] },
	{ match: "iatiseguros", params: ["agencia", "partner"] },
];

const isAffiliateUrl = (url) => {
	let parsed;
	try {
		parsed = new URL(String(url || "").trim());
	} catch (error) {
		return false;
	}
	if (!/^https?:$/i.test(parsed.protocol)) return false;

	const host = parsed.hostname.toLowerCase();
	if (AFFILIATE_NETWORK_HOSTS.some((network) => host.endsWith(network))) {
		return true;
	}

	const wrapped = parsed.searchParams.get("url");
	if (wrapped && /^https?:\/\//i.test(decodeURIComponent(wrapped))) return true;

	const params = new Set(
		[...parsed.searchParams.keys()].map((key) => key.toLowerCase()),
	);
	if (AFFILIATE_PARAMS.some((param) => params.has(param))) return true;

	return HOST_AFFILIATE_PARAMS.some(
		(partner) =>
			host.includes(partner.match) &&
			partner.params.some((param) => params.has(param)),
	);
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

/** `internal`, `external`, `ambiguous` o `none`, com a `internal-link-rel`. */
const classifyHref = (rawHref) => {
	const href = String(rawHref ?? "").trim();
	if (!href) return "none";
	if (href.startsWith("//")) {
		return isSiteUrl(`https:${href}`) ? "internal" : "external";
	}
	if (/^(\/|#|\?|\.\.?\/)/.test(href)) return "internal";
	if (/^[a-z][a-z\d+.-]*:/i.test(href)) {
		return isSiteUrl(href) ? "internal" : "external";
	}
	return "ambiguous";
};

const walk = (node, visit) => {
	visit(node);
	for (const child of node.childNodes || []) walk(child, visit);
	if (node.content) walk(node.content, visit);
};

/** `rel` amb `sponsored` al davant i sense repetir el que ja hi havia. */
const relWithSponsored = (current) => {
	const tokens = String(current || "")
		.split(/\s+/)
		.filter(Boolean);
	const rest = tokens.filter(
		(token) => token.toLowerCase() !== SPONSORED.toLowerCase(),
	);
	return [SPONSORED, ...rest].join(" ");
};

const escapeAttribute = (value) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

/**
 * Afegeix `sponsored` al `rel` dels `<a>` d'afiliació d'un fragment HTML.
 *
 * parse5 dóna la posició exacta de cada atribut dins del text original, així
 * que no es reserialitza res: es canvia només el tros del `rel` (o s'insereix
 * darrere de `<a` quan no n'hi ha) i la resta de la cadena queda intacta.
 * Després es comprova que el DOM resultant és exactament l'original amb els
 * `rel` nous; si no quadra (atributs duplicats, HTML estrany), llança i el
 * camp es deixa com està.
 */
const rewriteHtml = (html) => {
	const tree = parseFragment(html, { sourceCodeLocationInfo: true });
	const result = {
		html,
		links: [],
		ambiguous: [],
		unmarked: [],
		alreadySponsored: 0,
	};
	const edits = [];
	const changedNodes = [];

	walk(tree, (node) => {
		if (node.nodeName !== "a") return;
		const href = node.attrs.find((attr) => attr.name === "href")?.value;
		const kind = classifyHref(href);
		if (kind === "ambiguous") result.ambiguous.push(href);
		if (kind !== "external") return;

		if (!isAffiliateUrl(href)) {
			result.unmarked.push(href);
			return;
		}

		const rel = node.attrs.find((attr) => attr.name === "rel");
		const current = rel ? rel.value : "";
		if (
			current
				.split(/\s+/)
				.some((token) => token.toLowerCase() === SPONSORED.toLowerCase())
		) {
			result.alreadySponsored++;
			return;
		}

		const startTag = node.sourceCodeLocation?.startTag;
		if (!startTag) throw new Error(`sense posició per a l'enllaç ${href}`);
		const next = rel ? relWithSponsored(current) : DEFAULT_REL;

		if (rel) {
			const location = startTag.attrs?.rel;
			if (!location) throw new Error(`sense posició per al rel de ${href}`);
			edits.push({
				start: location.startOffset,
				end: location.endOffset,
				text: `rel="${escapeAttribute(next)}"`,
				expect: /^rel(?![\w-])/i,
			});
		} else {
			// Just darrere de `<a`: l'ordre dels atributs no canvia res i
			// estalvia haver d'endevinar on s'acaba l'etiqueta.
			const at = startTag.startOffset + "<a".length;
			edits.push({
				start: at,
				end: at,
				text: ` rel="${escapeAttribute(next)}"`,
				expect: null,
			});
		}

		result.links.push({ href, before: current || null, after: next });
		changedNodes.push({ node, rel: next, inserted: !rel });
	});

	if (!edits.length) return result;

	// De darrere cap endavant, perquè els offsets pendents continuïn valent.
	edits.sort((a, b) => b.start - a.start);
	let output = html;
	let limit = Infinity;
	for (const edit of edits) {
		const replaced = output.slice(edit.start, edit.end);
		if (edit.end > limit || (edit.expect && !edit.expect.test(replaced))) {
			throw new Error(`tros inesperat en escriure el rel: ${replaced}`);
		}
		output = output.slice(0, edit.start) + edit.text + output.slice(edit.end);
		limit = edit.start;
	}

	changedNodes.forEach(({ node, rel, inserted }) => {
		const attr = node.attrs.find((item) => item.name === "rel");
		if (attr) attr.value = rel;
		// El text el posa just darrere de `<a`, i parse5 serialitza els
		// atributs en l'ordre de la llista: han de coincidir perquè la
		// comprovació de sota tingui sentit.
		else if (inserted) node.attrs.unshift({ name: "rel", value: rel });
		else node.attrs.push({ name: "rel", value: rel });
	});
	if (serialize(tree) !== serialize(parseFragment(output))) {
		throw new Error("el DOM resultant no és l'original amb els rel nous");
	}

	result.html = output;
	return result;
};

/* ------------------------------------------------------------------------ */
/* Base de dades                                                            */
/* ------------------------------------------------------------------------ */

const labelOf = (doc) => doc.slug || doc.title || "";

const collectPlan = async (db) => {
	const plan = [];
	const stats = {
		documents: 0,
		links: 0,
		alreadySponsored: 0,
		unmarked: [],
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
				stats.alreadySponsored += result.alreadySponsored;
				result.unmarked.forEach((href) =>
					stats.unmarked.push({ where, href }),
				);
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

/** Els externs que no s'han marcat, agrupats per domini. */
const groupByHost = (entries) => {
	const hosts = new Map();
	for (const entry of entries) {
		let host;
		try {
			host = new URL(entry.href).hostname.replace(/^www\./, "");
		} catch (err) {
			host = "(?)";
		}
		hosts.set(host, (hosts.get(host) || 0) + 1);
	}
	return [...hosts.entries()].sort((a, b) => b[1] - a[1]);
};

const printPlan = ({ plan, stats }) => {
	for (const item of plan) {
		console.log(`\n${item.collection} ${item._id} · ${item.label}`);
		for (const field of item.fields) {
			console.log(`  ${field.field}`);
			for (const link of field.links) {
				console.log(`    ${link.href}`);
				console.log(
					`      rel: ${link.before ? `"${link.before}"` : "(cap)"} → "${link.after}"`,
				);
			}
		}
	}

	console.log("\nResum");
	console.log(`  Documents revisats: ${stats.documents}`);
	console.log(
		`  A canviar: ${plan.length} documents, ${stats.links} enllaços d'afiliació`,
	);
	for (const [name, counts] of Object.entries(stats.byCollection)) {
		console.log(
			`    ${name.padEnd(12)} ${counts.documents} documents · ${counts.fields} camps · ${counts.links} enllaços`,
		);
	}
	console.log(`  Ja marcats amb sponsored: ${stats.alreadySponsored}`);
	console.log(
		`  Externs que no s'han marcat: ${stats.unmarked.length} (per domini)`,
	);
	groupByHost(stats.unmarked).forEach(([host, count]) =>
		console.log(`    ${String(count).padStart(4)} ${host}`),
	);
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
	const file = path.join(
		backupDir,
		`affiliate-link-rel-${database}-${stamp}.json`,
	);
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

export { classifyHref, isAffiliateUrl, rewriteHtml };
