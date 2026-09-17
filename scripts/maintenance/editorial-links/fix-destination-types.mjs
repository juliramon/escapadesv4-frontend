#!/usr/bin/env node
/**
 * Passa a text els identificadors de `destinations` desats com a ObjectId.
 *
 * El model `Activity` i `Place` declaren `destinations` com a `[String]`, i
 * el backend hi busca cadenes (`{destinations: {$in: [paramsId]}}`). Una
 * assignació feta amb ObjectId no la troba ningú: la fitxa queda assignada
 * però la pàgina de la destinació surt buida. Això és el que va passar amb
 * les assignacions del 16 i el 17 de setembre.
 *
 * Mateixos guards que la resta: només bases de dades `-dev` llevat que
 * `--production-db` en doni el nom exacte, dry-run per defecte, còpia de
 * seguretat abans d'escriure i `--restore` per desfer-ho.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BSON, MongoClient } from "mongodb";

const { EJSON } = BSON;
const HERE = path.dirname(fileURLToPath(import.meta.url));
const COLLECTIONS = ["activities", "places"];
const DEV_SUFFIX = "-dev";
const BACKEND_DIR_NAME = "escapadesv4-backend";

const USAGE = `Ús: MONGODB_URI="…/<base>-dev?…" node fix-destination-types.mjs [opcions]

  (sense opcions)       dry-run
  --apply               escriu els canvis (amb còpia de seguretat)
  --restore <fitxer>    torna els valors de la còpia
  --backup-dir <dir>    on es desen les còpies (per defecte ./backups)
  --production-db=<nom> permet una base de dades que no acaba en -dev`;

class UsageError extends Error {}

const parseArgs = (argv) => {
	const args = { apply: false, restore: null, backupDir: path.join(HERE, "backups") };
	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		const [name, inline] = arg.split(/=(.*)/s);
		const value = () => inline ?? argv[++i];
		if (arg === "--apply") args.apply = true;
		else if (name === "--restore") args.restore = path.resolve(value());
		else if (name === "--backup-dir") args.backupDir = path.resolve(value());
		else if (name === "--production-db") args.productionDb = value();
		else if (arg === "--help" || arg === "-h") args.help = true;
		else throw new UsageError(`Opció desconeguda: ${arg}`);
	}
	return args;
};

const guardDatabase = (name, source, productionDb) => {
	if (name && name.endsWith(DEV_SUFFIX)) return false;
	if (productionDb && name === productionDb) return true;
	throw new UsageError(
		`La base de dades (${source}) és "${name || "(cap)"}" i no acaba en "${DEV_SUFFIX}".`,
	);
};

const main = async () => {
	const args = parseArgs(process.argv.slice(2));
	if (args.help) {
		console.log(USAGE);
		return;
	}
	for (const dir of [process.cwd(), HERE, args.backupDir]) {
		if (path.resolve(dir).toLowerCase().split(/[\\/]+/).includes(BACKEND_DIR_NAME)) {
			throw new UsageError(`No es pot treballar dins de ${BACKEND_DIR_NAME}.`);
		}
	}
	const uri = process.env.MONGODB_URI;
	if (!uri) throw new UsageError("Cal MONGODB_URI.");
	const uriDb = decodeURIComponent(new URL(uri).pathname.replace(/^\//, ""));
	guardDatabase(uriDb, "MONGODB_URI", args.productionDb);

	const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 });
	await client.connect();
	try {
		const db = client.db();
		const isProduction = guardDatabase(db.databaseName, "connexió", args.productionDb);
		console.log(`Base de dades: ${db.databaseName}`);
		if (isProduction) console.log("ATENCIÓ: base de dades de PRODUCCIÓ");

		if (args.restore) {
			const backup = EJSON.parse(await fs.readFile(args.restore, "utf8"), { relaxed: false });
			let done = 0;
			for (const entry of backup.entries) {
				const res = await db
					.collection(entry.collection)
					.updateOne({ _id: entry._id }, { $set: { destinations: entry.before } });
				done += res.modifiedCount;
			}
			console.log(`Restaurades: ${done} de ${backup.entries.length}.`);
			return;
		}

		const plan = [];
		for (const collection of COLLECTIONS) {
			const docs = await db
				.collection(collection)
				.find({ destinations: { $type: "objectId" } }, { projection: { slug: 1, destinations: 1 } })
				.toArray();
			for (const doc of docs) {
				plan.push({
					collection,
					_id: doc._id,
					slug: doc.slug,
					before: doc.destinations,
					after: doc.destinations.map((value) => String(value)),
				});
			}
		}
		console.log(`Fitxes amb identificadors com a ObjectId: ${plan.length}`);
		plan.slice(0, 5).forEach((item) => console.log(`  ${item.collection} ${item.slug}`));
		if (plan.length > 5) console.log(`  … i ${plan.length - 5} més`);

		if (!args.apply) {
			console.log("\nDry-run: no s'ha escrit res. Per aplicar-ho, afegeix --apply.");
			return;
		}
		if (!plan.length) return;

		await fs.mkdir(args.backupDir, { recursive: true });
		const stamp = new Date().toISOString().replace(/[:.]/g, "-");
		const file = path.join(args.backupDir, `destination-types-${db.databaseName}-${stamp}.json`);
		await fs.writeFile(
			file,
			EJSON.stringify({ database: db.databaseName, entries: plan }, null, 2, { relaxed: false }),
			{ flag: "wx" },
		);
		console.log(`Còpia de seguretat: ${file}`);

		let written = 0;
		for (const item of plan) {
			const res = await db
				.collection(item.collection)
				.updateOne(
					{ _id: item._id, destinations: item.before },
					{ $set: { destinations: item.after } },
				);
			written += res.modifiedCount;
		}
		console.log(`Corregides: ${written} de ${plan.length}.`);
		if (written !== plan.length) process.exitCode = 1;
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
