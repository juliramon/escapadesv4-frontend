#!/usr/bin/env node
/**
 * Crea destinacions noves a partir d'un fitxer (`destinations-new.json`).
 *
 * Les destinacions són l'única cosa del pla que no es pot fer editant: cal
 * crear el document. 82 fitxes no tenen cap destinació assignada perquè la
 * seva zona no en té pàgina, i mentre no existeixi no se'ls pot posar.
 *
 * Seguretat, com la resta d'scripts d'aquesta carpeta:
 * - Només bases de dades acabades en `-dev`, llevat que `--production-db` en
 *   doni el nom exacte, i sempre des de fora de la carpeta del backend.
 * - Per defecte és un dry-run.
 * - No crea res si ja hi ha una destinació amb el mateix slug.
 * - Amb `--apply` desa una còpia amb els identificadors creats; `--undo
 *   <fitxer>` els esborra (només si no s'han tocat des que es van crear).
 *
 * Ús:
 *   MONGODB_URI="…/getaways-guru-dev?…" node create-destinations.mjs
 *   MONGODB_URI="…" node create-destinations.mjs --apply
 *   MONGODB_URI="…" node create-destinations.mjs --undo backups/<fitxer>.json --apply
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BSON, MongoClient, ObjectId } from "mongodb";

const { EJSON } = BSON;
const HERE = path.dirname(fileURLToPath(import.meta.url));

const COLLECTION = "destinations";
const DEV_SUFFIX = "-dev";
const BACKEND_DIR_NAME = "escapadesv4-backend";

/** Camps del model `Destination`; els tres primers són obligatoris. */
const REQUIRED = ["slug", "title", "longTitle"];
const OPTIONAL = [
	"subtitle",
	"image",
	"reviewText",
	"carouselImages",
	"mapLocation",
	"mostLikedText",
	"pointsOfInterestText",
	"mustSeeText",
	"seoTextHeader",
	"seoText",
	"sponsorURL",
	"sponsorLogo",
	"sponsorClaim",
];

const USAGE = `Ús: MONGODB_URI="…/<base>-dev?…" node create-destinations.mjs [opcions]

  (sense opcions)       dry-run: diu què crearia
  --file <fitxer>       destinacions a crear (per defecte ./destinations-new.json)
  --apply               les crea (desa abans la còpia amb els identificadors)
  --undo <fitxer>       esborra les destinacions creades en aquella execució
  --backup-dir <dir>    on es desen les còpies (per defecte ./backups)
  --production-db=<nom> permet una base de dades que no acaba en -dev
  --help                aquesta ajuda`;

class UsageError extends Error {}

const parseArgs = (argv) => {
	const args = {
		apply: false,
		undo: null,
		file: path.join(HERE, "destinations-new.json"),
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
		else if (name === "--file") args.file = path.resolve(value());
		else if (name === "--undo") args.undo = path.resolve(value());
		else if (name === "--backup-dir") args.backupDir = path.resolve(value());
		else if (name === "--production-db") args.productionDb = value();
		else if (arg === "--help" || arg === "-h") args.help = true;
		else throw new UsageError(`Opció desconeguda: ${arg}`);
	}
	return args;
};

const dbNameFromUri = (uri) => {
	try {
		return decodeURIComponent(new URL(uri).pathname.replace(/^\//, ""));
	} catch (err) {
		throw new UsageError("MONGODB_URI no és una URI vàlida.");
	}
};

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
		`La base de dades (${source}) és "${name || "(cap)"}" i no acaba en "${DEV_SUFFIX}".`,
	);
};

const assertOutsideBackend = (paths) => {
	for (const value of paths) {
		const segments = path.resolve(value).toLowerCase().split(/[\\/]+/);
		if (segments.includes(BACKEND_DIR_NAME)) {
			throw new UsageError(`No es pot treballar dins de ${BACKEND_DIR_NAME}: ${value}`);
		}
	}
};

const buildDoc = (entry) => {
	for (const field of REQUIRED) {
		if (!String(entry[field] || "").trim()) {
			throw new UsageError(`Falta "${field}" a una de les destinacions.`);
		}
	}
	const doc = {
		_id: new ObjectId(),
		isRemoved: false,
		isSponsored: false,
		isFeatured: false,
		carouselImages: [],
		createdAt: new Date(),
		updatedAt: new Date(),
		__v: 0,
	};
	for (const field of REQUIRED) doc[field] = entry[field];
	for (const field of OPTIONAL) {
		if (entry[field] !== undefined) doc[field] = entry[field];
	}
	return doc;
};

const words = (html) => {
	const text = String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
	return text ? text.split(" ").length : 0;
};

const create = async (db, args) => {
	const entries = JSON.parse(await fs.readFile(args.file, "utf8")).destinations || [];
	const pending = [];
	for (const entry of entries) {
		const existing = await db.collection(COLLECTION).findOne({ slug: entry.slug });
		if (existing) {
			console.log(`  ja existeix, no es toca: ${entry.slug} (${existing._id})`);
			continue;
		}
		pending.push(buildDoc(entry));
	}

	for (const doc of pending) {
		const total =
			words(doc.seoTextHeader) + words(doc.reviewText) + words(doc.seoText);
		console.log(
			`\n  ${doc.slug} · ${doc.title}\n    ${total} paraules · ${(String(doc.seoText || "").match(/<a /g) || []).length} enllaços interns · imatge ${doc.image ? "sí" : "NO"}`,
		);
	}
	console.log(`\nA crear: ${pending.length} destinacions.`);

	if (!args.apply) {
		console.log("\nDry-run: no s'ha creat res. Per crear-les, afegeix --apply.");
		return;
	}
	if (!pending.length) return;

	await fs.mkdir(args.backupDir, { recursive: true });
	const stamp = new Date().toISOString().replace(/[:.]/g, "-");
	const file = path.join(args.backupDir, `destinations-created-${db.databaseName}-${stamp}.json`);
	await fs.writeFile(
		file,
		EJSON.stringify({ database: db.databaseName, createdAt: new Date().toISOString(), documents: pending }, null, 2, { relaxed: false }),
		{ flag: "wx" },
	);
	console.log(`Còpia amb els identificadors: ${file}`);

	const result = await db.collection(COLLECTION).insertMany(pending);
	console.log(`Creades: ${result.insertedCount} de ${pending.length}.`);
};

const undo = async (db, args) => {
	const backup = EJSON.parse(await fs.readFile(args.undo, "utf8"), { relaxed: false });
	if (backup.database !== db.databaseName) {
		throw new UsageError(
			`La còpia és de "${backup.database}" i la connexió és a "${db.databaseName}".`,
		);
	}
	const ids = backup.documents.map((doc) => doc._id);
	const found = await db.collection(COLLECTION).find({ _id: { $in: ids } }).toArray();
	console.log(`Destinacions de la còpia: ${ids.length} · encara hi són: ${found.length}`);
	// Si algú les ha editat des del panell, val més no esborrar-les a cegues.
	const edited = found.filter((doc) => {
		const original = backup.documents.find((item) => String(item._id) === String(doc._id));
		return EJSON.stringify(doc.seoText ?? null) !== EJSON.stringify(original.seoText ?? null);
	});
	edited.forEach((doc) => console.log(`  editada després, no es toca: ${doc.slug}`));

	if (!args.apply) {
		console.log("\nDry-run: no s'ha esborrat res. Per esborrar-les, afegeix --apply.");
		return;
	}
	const removable = ids.filter((id) => !edited.some((doc) => String(doc._id) === String(id)));
	const result = await db.collection(COLLECTION).deleteMany({ _id: { $in: removable } });
	console.log(`Esborrades: ${result.deletedCount}.`);
};

const main = async () => {
	const args = parseArgs(process.argv.slice(2));
	if (args.help) {
		console.log(USAGE);
		return;
	}
	assertOutsideBackend([process.cwd(), HERE, args.backupDir]);

	const uri = process.env.MONGODB_URI;
	if (!uri) throw new UsageError("Cal MONGODB_URI, amb el nom de la base de dades.");
	guardDatabase(dbNameFromUri(uri), "MONGODB_URI", args.productionDb);

	const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 });
	await client.connect();
	try {
		const db = client.db();
		const isProduction = guardDatabase(db.databaseName, "connexió", args.productionDb);
		console.log(`Base de dades: ${db.databaseName}`);
		if (isProduction) console.log("ATENCIÓ: base de dades de PRODUCCIÓ");
		console.log(args.apply ? "Mode: ESCRIU" : "Mode: dry-run (no escriu res)");
		if (args.undo) await undo(db, args);
		else await create(db, args);
	} finally {
		await client.close();
	}
};

main().catch((err) => {
	if (err instanceof UsageError) {
		console.error(`${err.message}\n\n${USAGE}`);
		process.exit(2);
	}
	console.error(err);
	process.exit(1);
});
