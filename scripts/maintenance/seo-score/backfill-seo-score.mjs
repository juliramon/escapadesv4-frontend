#!/usr/bin/env node
/**
 * Calcula i desa la puntuació SEO (`seoScore`) de les publicacions.
 *
 * El panell d'administració ensenyava una puntuació al llistat i una altra
 * dins del formulari: el llistat només mirava les metadades, perquè l'API no
 * hi envia el cos de les fitxes, i el formulari hi sumava l'extensió, els
 * subtítols, les imatges i els enllaços. Ara el formulari desa la seva
 * puntuació a la fitxa i el llistat la llegeix tal qual. Aquest script la
 * calcula per a les publicacions que ja existien, amb el mateix codi que fa
 * servir el formulari (`utils/seo.js`, empaquetat amb esbuild en arrencar).
 *
 * Toca Activity, Place, Story, List i TripEntry. Es puntua el mateix cos que
 * al formulari: `description` i `reasons` a les fitxes, i `description` a la
 * resta. El formulari el llegeix després de passar per TipTap, que normalitza
 * l'HTML; en publicacions antigues el recompte de paraules o d'enllaços pot
 * variar una mica, i queda corregit el primer cop que es desen.
 *
 * Seguretat:
 * - Només s'executa contra bases de dades el nom de les quals acaba en `-dev`,
 *   i des de fora de la carpeta del backend. Per a qualsevol altra cal
 *   `--production-db=<nom exacte>`, que ha de coincidir amb el de la URI i
 *   amb el de la connexió.
 * - Per defecte és un dry-run: llista què canviaria i no escriu res.
 * - Amb `--apply` primer desa una còpia de seguretat i després escriu cada
 *   document només si `seoScore` no ha canviat des que s'ha llegit.
 * - `--restore <fitxer>` desfà una execució a partir de la seva còpia.
 * - Escriu amb el driver directament: no passa per Mongoose i no toca
 *   `updatedAt`, que el sitemap fa servir de `lastmod`.
 *
 * Ús (MONGODB_URI ha d'incloure el nom de la base de dades):
 *   MONGODB_URI="mongodb+srv://…/getaways-guru-dev?…" node backfill-seo-score.mjs
 *   MONGODB_URI="…" node backfill-seo-score.mjs --apply
 *   MONGODB_URI="…" node backfill-seo-score.mjs --all [--apply]
 *   MONGODB_URI="…" node backfill-seo-score.mjs --restore backups/<fitxer>.json [--apply]
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { BSON, MongoClient } from "mongodb";

// La còpia de seguretat es desa en EJSON perquè els `_id` tornin com a ObjectId.
const { EJSON } = BSON;

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SEO_MODULE = path.resolve(HERE, "../../../utils/seo.js");

/** Camps que formen el cos que puntua el formulari de cada col·lecció. */
const COLLECTIONS = {
	activities: ["description", "reasons"],
	places: ["description", "reasons"],
	stories: ["description"],
	lists: ["description"],
	tripentries: ["description"],
};

const DEV_SUFFIX = "-dev";
const BACKEND_DIR_NAME = "escapadesv4-backend";

const USAGE = `Ús: MONGODB_URI="…/<base>-dev?…" node backfill-seo-score.mjs [opcions]

  (sense opcions)       dry-run: puntua les publicacions sense seoScore i no
                        escriu res
  --all                 recalcula també les que ja en tenen (per exemple,
                        després de canviar les comprovacions de utils/seo.js)
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
		all: false,
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
		else if (arg === "--all") args.all = true;
		else if (name === "--restore") args.restore = path.resolve(value());
		else if (name === "--backup-dir") args.backupDir = path.resolve(value());
		else if (name === "--production-db") args.productionDb = value();
		else if (arg === "--help" || arg === "-h") args.help = true;
		else throw new UsageError(`Opció desconeguda: ${arg}`);
	}
	if (args.apply && args.dryRun) {
		throw new UsageError("--apply i --dry-run no es poden combinar.");
	}
	if (args.restore && args.all) {
		throw new UsageError("--restore i --all no es poden combinar.");
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
/* Puntuació                                                                */
/* ------------------------------------------------------------------------ */

/**
 * Carrega `analyzeSeo` del frontend. `utils/seo.js` és ESM amb imports sense
 * extensió, com la resta del codi de Next, i Node no el pot importar tal
 * qual: esbuild l'empaqueta amb les seves dependències i s'importa des de
 * memòria. Així la puntuació surt exactament del mateix codi que el
 * formulari.
 */
const loadAnalyzeSeo = async () => {
	const result = await build({
		entryPoints: [SEO_MODULE],
		bundle: true,
		format: "esm",
		platform: "node",
		write: false,
		logLevel: "silent",
	});
	const code = result.outputFiles[0].text;
	const url = `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;
	const { analyzeSeo } = await import(url);
	return analyzeSeo;
};

/** Les mateixes dades que el formulari passa a `analyzeSeo`. */
const scoreOf = (analyzeSeo, doc, fields) =>
	analyzeSeo({
		title: doc.title || "",
		subtitle: doc.subtitle || "",
		metaTitle: doc.metaTitle || "",
		metaDescription: doc.metaDescription || "",
		slug: doc.slug || "",
		html: fields.map((field) => doc[field] || "").join(""),
		hasCover: Boolean(doc.cover),
	}).score;

/* ------------------------------------------------------------------------ */
/* Base de dades                                                            */
/* ------------------------------------------------------------------------ */

const storedScore = (doc) =>
	typeof doc?.seoScore === "number" ? doc.seoScore : null;

const collectPlan = async (db, analyzeSeo, { all }) => {
	const plan = [];
	const stats = {};

	for (const [name, fields] of Object.entries(COLLECTIONS)) {
		const counts = { documents: 0, missing: 0, changed: 0, unchanged: 0 };
		stats[name] = counts;
		const filter = { isRemoved: { $ne: true } };
		if (!all) filter.seoScore = null;
		const projection = Object.fromEntries(
			[
				"title",
				"subtitle",
				"metaTitle",
				"metaDescription",
				"slug",
				"cover",
				"seoScore",
				...fields,
			].map((field) => [field, 1]),
		);
		const cursor = db
			.collection(name)
			.find(filter, { projection })
			.sort({ _id: 1 });

		for await (const doc of cursor) {
			counts.documents++;
			const before = storedScore(doc);
			const after = scoreOf(analyzeSeo, doc, fields);
			if (before === after) {
				counts.unchanged++;
				continue;
			}
			if (before === null) counts.missing++;
			else counts.changed++;
			plan.push({
				collection: name,
				_id: doc._id,
				label: doc.slug || doc.title || "",
				before,
				after,
			});
		}
	}
	return { plan, stats };
};

const printPlan = ({ plan, stats }) => {
	for (const item of plan) {
		console.log(
			`${item.collection.padEnd(12)} ${String(item.before ?? "—").padStart(3)} → ${String(item.after).padStart(3)}  ${item.label}`,
		);
	}

	console.log("\nResum");
	for (const [name, counts] of Object.entries(stats)) {
		console.log(
			`  ${name.padEnd(12)} ${counts.documents} revisades · ${counts.missing} sense puntuació · ${counts.changed} amb una altra · ${counts.unchanged} ja al dia`,
		);
	}
	console.log(`  A escriure: ${plan.length} documents`);
};

const writeBackup = async (backupDir, database, plan) => {
	await fs.mkdir(backupDir, { recursive: true });
	const stamp = new Date().toISOString().replace(/[:.]/g, "-");
	const file = path.join(backupDir, `seo-score-${database}-${stamp}.json`);
	const entries = plan.map(({ collection, _id, before, after }) => ({
		collection,
		_id,
		before,
		after,
	}));
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

/** `null` vol dir que el document no tenia puntuació: es treu el camp. */
const setScore = (value) =>
	value === null
		? { $unset: { seoScore: "" } }
		: { $set: { seoScore: value } };

const backfill = async (db, args) => {
	const analyzeSeo = await loadAnalyzeSeo();
	const collected = await collectPlan(db, analyzeSeo, args);
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
		// Només s'escriu si la puntuació no ha canviat des que s'ha llegit
		// (`null` també casa amb el camp absent).
		const res = await db
			.collection(item.collection)
			.updateOne({ _id: item._id, seoScore: item.before }, setScore(item.after));
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
			.findOne({ _id: entry._id }, { projection: { seoScore: 1 } });
		const current = storedScore(doc);
		if (current === entry.after) pending.push(entry);
		else if (current === entry.before) alreadyRestored++;
		else conflicts.push(entry);
	}

	console.log(`Entrades a la còpia: ${backup.entries.length}`);
	console.log(`  Per restaurar: ${pending.length}`);
	console.log(`  Ja restaurades: ${alreadyRestored}`);
	console.log(`  Desades després (no es toquen): ${conflicts.length}`);
	conflicts.forEach((entry) =>
		console.log(`    ${entry.collection} ${entry._id}`),
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
				{ _id: entry._id, seoScore: entry.after },
				setScore(entry.before),
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
		else await backfill(db, args);
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

export { loadAnalyzeSeo, scoreOf };
