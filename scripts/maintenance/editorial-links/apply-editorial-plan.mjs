#!/usr/bin/env node
/**
 * Aplica el pla d'enllaços i contingut del 15/09 (`editorial-plan.json`).
 *
 * El pla surt de creuar tot el contingut publicat: quines històries expliquen
 * el mateix lloc que una fitxa, quines pàgines anomenen una fitxa sense
 * enllaçar-la, quins enllaços porten a un 404 i quines fitxes no tenen
 * destinació. Són unes dues-centes edicions petites que a mà, des del panell,
 * són una tarda llarga i fàcils de deixar a mitges.
 *
 * Operacions, en aquest ordre (`--only` en tria algunes):
 *
 * - `broken`: els enllaços trencats de l'issue #46. Es redirigeixen a la
 *   pàgina actual quan n'hi ha; si no, es treu l'enllaç i es conserva el
 *   text. Als d'Amazon sense esquema s'hi afegeix `https://` i `sponsored`.
 * - `related`: `relatedStory` a les fitxes que tenen una història del mateix
 *   lloc. Només si encara no en tenen cap.
 * - `links`: un enllaç intern a la primera menció del lloc dins del text.
 *   Només dins de text que no és ja un enllaç, i només si la pàgina no
 *   enllaça ja la fitxa. L'ancoratge és el text tal com està escrit: no es
 *   reescriu res. Si no es troba cap de les formes del nom, es llista.
 * - `alt`: text alternatiu a les imatges del cos de les llistes que no en
 *   tenen, amb el títol de l'element (l'`<h2>` o `<h3>` anterior).
 * - `destinations`: afegeix la destinació a les fitxes que no la tenen.
 *
 * Seguretat, igual que `internal-link-rel`:
 * - Només s'executa contra bases de dades el nom de les quals acaba en `-dev`,
 *   i des de fora de la carpeta del backend. Per a qualsevol altra cal
 *   `--production-db=<nom exacte>`.
 * - Per defecte és un dry-run: llista què canviaria i no escriu res.
 * - Amb `--apply` primer desa una còpia de seguretat i després escriu cada
 *   document només si cap dels camps no ha canviat des que s'ha llegit.
 * - `--restore <fitxer>` desfà una execució a partir de la seva còpia.
 * - Escriu amb el driver directament: no passa per Mongoose i no toca
 *   `updatedAt`.
 * - Cada canvi d'HTML es comprova tornant-lo a llegir: el text visible ha de
 *   quedar idèntic. Si no quadra, aquell canvi no es fa i es llista.
 *
 * Ús (MONGODB_URI ha d'incloure el nom de la base de dades):
 *   MONGODB_URI="mongodb+srv://…/getaways-guru-dev?…" node apply-editorial-plan.mjs
 *   MONGODB_URI="…" node apply-editorial-plan.mjs --only=broken,links --apply
 *   MONGODB_URI="…" node apply-editorial-plan.mjs --restore backups/<fitxer>.json [--apply]
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BSON, MongoClient } from "mongodb";
import { parseFragment } from "parse5";

const { EJSON } = BSON;

const HERE = path.dirname(fileURLToPath(import.meta.url));

const OPERATIONS = ["broken", "related", "links", "alt", "destinations"];
const SITE_HOSTS = ["escapadesenparella.cat", "www.escapadesenparella.cat"];
const DEV_SUFFIX = "-dev";
const BACKEND_DIR_NAME = "escapadesv4-backend";

/** Llocs on no es posa cap enllaç nou encara que hi surti el nom. */
const NO_LINK_ANCESTORS = new Set([
	"a",
	"h1",
	"script",
	"style",
	"figcaption",
	"button",
]);

const USAGE = `Ús: MONGODB_URI="…/<base>-dev?…" node apply-editorial-plan.mjs [opcions]

  (sense opcions)       dry-run de totes les operacions: llista els canvis
  --only=<llista>       només aquestes operacions, separades per comes:
                        ${OPERATIONS.join(", ")}
  --plan <fitxer>       pla a aplicar (per defecte ./editorial-plan.json)
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
		only: OPERATIONS,
		plan: path.join(HERE, "editorial-plan.json"),
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
		else if (name === "--only") {
			args.only = value()
				.split(",")
				.map((item) => item.trim())
				.filter(Boolean);
			const unknown = args.only.filter((item) => !OPERATIONS.includes(item));
			if (unknown.length) {
				throw new UsageError(`Operació desconeguda: ${unknown.join(", ")}`);
			}
		} else if (name === "--plan") args.plan = path.resolve(value());
		else if (name === "--restore") args.restore = path.resolve(value());
		else if (name === "--backup-dir") args.backupDir = path.resolve(value());
		else if (name === "--production-db") args.productionDb = value();
		else if (arg === "--help" || arg === "-h") args.help = true;
		else throw new UsageError(`Opció desconeguda: ${arg}`);
	}
	return args;
};

/* ------------------------------------------------------------------------ */
/* Guards (els mateixos que internal-link-rel)                              */
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

const walk = (node, visit, ancestors = []) => {
	visit(node, ancestors);
	const next = [...ancestors, node];
	for (const child of node.childNodes || []) walk(child, visit, next);
	if (node.content) walk(node.content, visit, next);
};

const attrOf = (node, name) =>
	(node.attrs || []).find((attr) => attr.name === name)?.value;

const textOf = (node) =>
	node.nodeName === "#text"
		? node.value
		: (node.childNodes || []).map(textOf).join("");

const visibleText = (html) =>
	textOf(parseFragment(html)).replace(/\s+/g, " ").trim();

const escapeAttr = (value) =>
	String(value)
		.replace(/&/g, "&amp;")
		.replace(/"/g, "&quot;")
		.replace(/</g, "&lt;");

const isInternalUrl = (value) => {
	try {
		return SITE_HOSTS.includes(new URL(value).hostname);
	} catch (err) {
		return false;
	}
};

/** Camí d'un enllaç intern, sense barra final, per comparar destinacions. */
const pathOf = (href) => {
	const value = String(href || "").trim();
	try {
		const url = new URL(value, "https://escapadesenparella.cat");
		if (!SITE_HOSTS.includes(url.hostname)) return null;
		if (!/^(https?:|\/)/i.test(value)) return null;
		return url.pathname.replace(/\/+$/, "") || "/";
	} catch (err) {
		return null;
	}
};

const anchorsOf = (html) => {
	const found = [];
	walk(parseFragment(html), (node) => {
		if (node.nodeName === "a") found.push(attrOf(node, "href") || "");
	});
	return found;
};

/** Aplica talls de darrere cap endavant; falla si se solapen. */
const applyEdits = (html, edits) => {
	const sorted = [...edits].sort((a, b) => b.start - a.start);
	let output = html;
	let limit = Infinity;
	for (const edit of sorted) {
		if (edit.end > limit) throw new Error("dos canvis se solapen");
		output = output.slice(0, edit.start) + edit.text + output.slice(edit.end);
		limit = edit.start;
	}
	return output;
};

const mergeRel = (existing, required) => {
	const tokens = String(existing || "")
		.split(/\s+/)
		.filter((token) => token && !required.includes(token));
	return [...tokens, ...required].join(" ");
};

/**
 * Enllaços trencats. `item.from` (href exacte) o `item.fromPrefix`; destí a
 * `item.to`, per text a `item.byText` o, amb `addScheme`, el mateix href amb
 * `https://`. Sense destí, es treu l'enllaç i es conserva el text.
 */
const fixBrokenLinks = (html, item, notes) => {
	const tree = parseFragment(html, { sourceCodeLocationInfo: true });
	const edits = [];
	walk(tree, (node) => {
		if (node.nodeName !== "a") return;
		const href = attrOf(node, "href");
		if (href === undefined) return;
		const matches = item.from
			? href === item.from
			: href.startsWith(item.fromPrefix);
		if (!matches) return;

		const text = textOf(node).replace(/\s+/g, " ").trim();
		const location = node.sourceCodeLocation;
		let to = item.to ?? null;
		if (item.byText) to = item.byText[text] ?? null;
		if (item.addScheme) to = `https://${href}`;

		if (!to) {
			if (!location.endTag) throw new Error(`<a> sense tancar: ${href}`);
			edits.push({
				start: location.startTag.startOffset,
				end: location.startTag.endOffset,
				text: "",
			});
			edits.push({
				start: location.endTag.startOffset,
				end: location.endTag.endOffset,
				text: "",
			});
			notes.push(`treu l'enllaç de «${text}» (${href})`);
			return;
		}

		// Els interns van nets (sense rel ni target), com els que fa l'editor.
		// Els externs conserven target i rel, i els d'afiliació hi sumen
		// `sponsored`.
		const internal = isInternalUrl(to);
		const attrs = [];
		if (!internal && attrOf(node, "target")) {
			attrs.push(`target="${escapeAttr(attrOf(node, "target"))}"`);
		}
		if (!internal) {
			const rel = item.addScheme
				? mergeRel(attrOf(node, "rel"), ["sponsored", "nofollow"])
				: attrOf(node, "rel");
			if (rel) attrs.push(`rel="${escapeAttr(rel)}"`);
		}
		attrs.push(`href="${escapeAttr(to)}"`);
		for (const attr of node.attrs) {
			if (["href", "rel", "target"].includes(attr.name)) continue;
			attrs.push(`${attr.name}="${escapeAttr(attr.value)}"`);
		}
		edits.push({
			start: location.startTag.startOffset,
			end: location.startTag.endOffset,
			text: `<a ${attrs.join(" ")}>`,
		});
		notes.push(`«${text}»: ${href} → ${to}`);
	});
	if (!edits.length) return html;
	const output = applyEdits(html, edits);
	if (visibleText(output) !== visibleText(html)) {
		throw new Error("el text visible ha canviat");
	}
	return output;
};

/** Vocals i lletres que als textos surten amb accent o sense («Lluís»/«Lluis»). */
const ACCENT_CLASSES = {
	a: "[aàáâä]",
	e: "[eèéêë]",
	i: "[iìíîï]",
	o: "[oòóôö]",
	u: "[uùúûü]",
	c: "[cç]",
	n: "[nñ]",
};

/**
 * Patró d'un nom tal com pot estar escrit a l'HTML desat: espais o `&nbsp;`,
 * apòstrof recte o tipogràfic, `&` o `&amp;`, amb accents o sense i sense
 * distingir majúscules. No pot començar ni acabar enmig d'una paraula.
 */
const anchorPattern = (anchor) => {
	const body = [...anchor.trim()]
		.map((char) => {
			if (/\s/.test(char)) return "(?:\\s|&nbsp;|&#160;)+";
			if (char === "'" || char === "’") {
				return "(?:'|’|&#39;|&#x27;|&rsquo;|&apos;)";
			}
			if (char === "&") return "(?:&amp;|&)";
			const base = char.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
			if (ACCENT_CLASSES[base]) return ACCENT_CLASSES[base];
			return char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		})
		.join("")
		.replace(/(\(\?:\\s\|&nbsp;\|&#160;\)\+)+/g, "(?:\\s|&nbsp;|&#160;)+");
	return new RegExp(`(?<![\\p{L}\\p{N}])${body}(?![\\p{L}\\p{N}])`, "iu");
};

/** Un enllaç nou a la primera menció. Torna "added", "already" o "missing". */
const addTextLink = (html, item, notes) => {
	const target = pathOf(item.href);
	if (anchorsOf(html).some((href) => pathOf(href) === target)) {
		notes.push(`ja enllaça ${target}`);
		return { html, status: "already" };
	}

	const tree = parseFragment(html, { sourceCodeLocationInfo: true });
	const textNodes = [];
	walk(tree, (node, ancestors) => {
		if (node.nodeName !== "#text") return;
		if (ancestors.some((ancestor) => NO_LINK_ANCESTORS.has(ancestor.nodeName))) {
			return;
		}
		textNodes.push(node);
	});

	for (const anchor of item.anchors) {
		const pattern = anchorPattern(anchor);
		for (const node of textNodes) {
			const location = node.sourceCodeLocation;
			const raw = html.slice(location.startOffset, location.endOffset);
			const match = pattern.exec(raw);
			if (!match) continue;
			const start = location.startOffset + match.index;
			const end = start + match[0].length;
			const output =
				html.slice(0, start) +
				`<a href="${escapeAttr(item.href)}">` +
				match[0] +
				"</a>" +
				html.slice(end);
			if (
				visibleText(output) !== visibleText(html) ||
				anchorsOf(output).length !== anchorsOf(html).length + 1
			) {
				notes.push(`NO FET (el resultat no quadra): «${anchor}» → ${target}`);
				return { html, status: "missing" };
			}
			notes.push(`enllaça «${textOf(parseFragment(match[0]))}» → ${target}`);
			return { html: output, status: "added" };
		}
	}
	notes.push(`no trobat: «${item.anchors.join("» / «")}» → ${target}`);
	return { html, status: "missing" };
};

/** «3. Castell de Miravet:» → «Castell de Miravet». */
const cleanHeading = (text) =>
	String(text || "")
		.replace(/\s+/g, " ")
		.replace(/^\s*#?\d+\s*[.)\-–:]?\s*/, "")
		.replace(/[\s:–-]+$/, "")
		.trim();

const plainTokens = (value) =>
	String(value || "")
		.normalize("NFD")
		.replace(/\p{M}/gu, "")
		.toLowerCase()
		.split(/[^a-z0-9]+/)
		.filter((token) => token.length > 2);

/** Paraules del nom del fitxer, sense el sufix aleatori de Cloudinary. */
const fileTokens = (src) => {
	const file = String(src || "").split("/").pop().replace(/\.[a-z0-9]+$/i, "");
	return plainTokens(file.replace(/_[a-z0-9]{5,8}$/i, ""));
};

/**
 * `alt` a les imatges del cos que no en tenen, amb el títol de l'element.
 *
 * A les llistes cada element és una foto seguida del seu `<h2>`, així que
 * el títol bo és el següent, no l'anterior. Però no sempre: a «9 castells»
 * la foto de Montclús va just abans del títol de Montsoriu. Per això mana el
 * `<h2>` amb qui el nom del fitxer comparteix més paraules pròpies (les que
 * no són del slug de la llista), i només si no n'hi ha cap es fa servir el
 * següent. Els `<h3>` («Com arribar al…») no compten.
 */
const addImageAlts = (html, list, notes) => {
	const tree = parseFragment(html, { sourceCodeLocationInfo: true });
	const edits = [];
	const sequence = [];
	walk(tree, (node) => {
		if (node.nodeName === "h2") {
			const text = cleanHeading(textOf(node));
			if (text) sequence.push({ heading: text, tokens: new Set(plainTokens(text)) });
		} else if (node.nodeName === "img") sequence.push({ img: node });
	});
	const headings = sequence.filter((item) => item.heading);
	const generic = new Set(plainTokens(list.slug));

	const headingFor = (index, img) => {
		const own = fileTokens(attrOf(img, "src")).filter(
			(token) => !generic.has(token),
		);
		let best = null;
		let bestScore = 0;
		let tie = false;
		for (const item of headings) {
			const score = own.filter((token) => item.tokens.has(token)).length;
			if (score > bestScore) {
				best = item;
				bestScore = score;
				tie = false;
			} else if (score && score === bestScore) tie = true;
		}
		if (best && !tie) return best.heading;
		const next = sequence.slice(index + 1).find((item) => item.heading);
		if (next) return next.heading;
		const previous = sequence
			.slice(0, index)
			.reverse()
			.find((item) => item.heading);
		return previous?.heading || list.title;
	};

	sequence.forEach((item, index) => {
		if (!item.img) return;
		const node = item.img;
		const current = attrOf(node, "alt");
		if (current && current.trim()) return;
		const alt = headingFor(index, node);
		if (!alt) return;
		const tag = node.sourceCodeLocation.startTag;
		if (current !== undefined) {
			const location = tag.attrs.alt;
			edits.push({
				start: location.startOffset,
				end: location.endOffset,
				text: `alt="${escapeAttr(alt)}"`,
			});
		} else {
			if (html.slice(tag.startOffset, tag.startOffset + 4).toLowerCase() !== "<img") {
				throw new Error("etiqueta <img> inesperada");
			}
			edits.push({
				start: tag.startOffset + 4,
				end: tag.startOffset + 4,
				text: ` alt="${escapeAttr(alt)}"`,
			});
		}
		notes.push(`alt «${alt}»`);
	});
	if (!edits.length) return html;
	const output = applyEdits(html, edits);
	let missing = 0;
	walk(parseFragment(output), (node) => {
		if (node.nodeName === "img" && !String(attrOf(node, "alt") || "").trim()) {
			missing++;
		}
	});
	if (visibleText(output) !== visibleText(html) || missing) {
		throw new Error("el resultat de posar els alt no quadra");
	}
	return output;
};

/* ------------------------------------------------------------------------ */
/* Pla                                                                      */
/* ------------------------------------------------------------------------ */

const sameValue = (a, b) =>
	EJSON.stringify(a ?? null, { relaxed: false }) ===
	EJSON.stringify(b ?? null, { relaxed: false });

/**
 * Estat en memòria dels documents tocats: cada operació treballa sobre el
 * resultat de l'anterior, i al final només queden els camps que canvien.
 */
const createState = (db) => {
	const docs = new Map();
	const entries = new Map();

	const findBySlug = async (collection, slug) => {
		const key = `${collection}:${slug}`;
		if (!docs.has(key)) {
			docs.set(
				key,
				await db
					.collection(collection)
					.find({ slug, isRemoved: { $ne: true } })
					.toArray(),
			);
		}
		return docs.get(key);
	};

	const entryFor = (collection, doc) => {
		const key = `${collection}:${doc._id}`;
		if (!entries.has(key)) {
			entries.set(key, {
				collection,
				_id: doc._id,
				label: doc.slug,
				fields: {},
				notes: [],
			});
		}
		return entries.get(key);
	};

	const current = (collection, doc, field) => {
		const entry = entries.get(`${collection}:${doc._id}`);
		return entry && field in entry.fields ? entry.fields[field].after : doc[field];
	};

	const set = (collection, doc, field, after) => {
		const entry = entryFor(collection, doc);
		if (!(field in entry.fields)) {
			entry.fields[field] = {
				before: doc[field] ?? null,
				beforeMissing: doc[field] === undefined,
				after,
			};
		} else {
			entry.fields[field].after = after;
		}
	};

	const note = (collection, doc, text) =>
		entryFor(collection, doc).notes.push(text);

	const changed = () =>
		[...entries.values()]
			.map((entry) => ({
				...entry,
				fields: Object.fromEntries(
					Object.entries(entry.fields).filter(
						([, value]) => !sameValue(value.before, value.after),
					),
				),
			}))
			.filter((entry) => Object.keys(entry.fields).length || entry.notes.length);

	return { findBySlug, current, set, note, changed };
};

const collectPlan = async (db, plan, only) => {
	const state = createState(db);
	const stats = {
		broken: 0,
		related: 0,
		linksAdded: 0,
		linksAlready: 0,
		linksMissing: [],
		alts: 0,
		destinations: 0,
		notFound: [],
		errors: [],
	};

	const forEachDoc = async (collection, slug, callback) => {
		const found = await state.findBySlug(collection, slug);
		if (!found.length) stats.notFound.push(`${collection} ${slug}`);
		for (const doc of found) {
			try {
				await callback(doc);
			} catch (err) {
				stats.errors.push(`${collection} ${slug}: ${err.message}`);
			}
		}
	};

	if (only.includes("broken")) {
		for (const item of plan.brokenLinks || []) {
			await forEachDoc(item.collection, item.slug, (doc) => {
				const notes = [];
				const before = state.current(item.collection, doc, "description");
				const after = fixBrokenLinks(before, item, notes);
				if (after !== before) {
					state.set(item.collection, doc, "description", after);
					stats.broken += notes.length;
				}
				notes.forEach((text) => state.note(item.collection, doc, `[broken] ${text}`));
			});
		}
	}

	if (only.includes("related")) {
		for (const item of plan.relatedStory || []) {
			const [story] = await state.findBySlug("stories", item.story);
			if (!story) {
				stats.notFound.push(`stories ${item.story}`);
				continue;
			}
			await forEachDoc(item.collection, item.slug, (doc) => {
				const existing = state.current(item.collection, doc, "relatedStory");
				if (existing) {
					if (String(existing) !== String(story._id)) {
						state.note(
							item.collection,
							doc,
							`[related] ja té una altra història relacionada (${existing}); no es toca`,
						);
					}
					return;
				}
				state.set(item.collection, doc, "relatedStory", story._id);
				state.note(item.collection, doc, `[related] relatedStory → ${item.story}`);
				stats.related++;
			});
		}
	}

	if (only.includes("links")) {
		for (const item of plan.textLinks || []) {
			await forEachDoc(item.collection, item.slug, (doc) => {
				const notes = [];
				const before = state.current(item.collection, doc, "description");
				if (typeof before !== "string") return;
				const result = addTextLink(before, item, notes);
				if (result.status === "added") {
					state.set(item.collection, doc, "description", result.html);
					stats.linksAdded++;
				} else if (result.status === "already") stats.linksAlready++;
				else stats.linksMissing.push(`${item.collection} ${item.slug}: ${notes[0]}`);
				notes.forEach((text) => state.note(item.collection, doc, `[links] ${text}`));
			});
		}
	}

	if (only.includes("alt")) {
		const collection = plan.listImageAlt?.collection || "lists";
		const lists = await db
			.collection(collection)
			.find({ isRemoved: { $ne: true } }, { projection: { slug: 1, title: 1 } })
			.toArray();
		for (const list of lists) {
			await forEachDoc(collection, list.slug, (doc) => {
				const notes = [];
				const before = state.current(collection, doc, "description");
				if (typeof before !== "string") return;
				const after = addImageAlts(before, doc, notes);
				if (after !== before) {
					state.set(collection, doc, "description", after);
					stats.alts += notes.length;
					state.note(collection, doc, `[alt] ${notes.length} imatges: ${notes.slice(0, 3).join(", ")}${notes.length > 3 ? "…" : ""}`);
				}
			});
		}
	}

	if (only.includes("destinations")) {
		const destinationIds = new Map();
		for (const item of plan.destinations || []) {
			if (!destinationIds.has(item.destination)) {
				const destination = await db
					.collection("destinations")
					.findOne({ slug: item.destination, isRemoved: { $ne: true } });
				destinationIds.set(item.destination, destination?._id || null);
			}
			const destinationId = destinationIds.get(item.destination);
			if (!destinationId) {
				stats.notFound.push(`destinations ${item.destination}`);
				continue;
			}
			await forEachDoc(item.collection, item.slug, (doc) => {
				const list = state.current(item.collection, doc, "destinations") || [];
				if (list.some((id) => String(id) === String(destinationId))) return;
				state.set(item.collection, doc, "destinations", [...list, destinationId]);
				state.note(item.collection, doc, `[destinations] + ${item.destination}`);
				stats.destinations++;
			});
		}
	}

	return { entries: state.changed(), stats };
};

const printPlan = ({ entries, stats }) => {
	for (const entry of entries) {
		const fields = Object.keys(entry.fields);
		console.log(
			`\n${entry.collection} ${entry.label}${fields.length ? `  (camps: ${fields.join(", ")})` : "  (sense canvis)"}`,
		);
		entry.notes.forEach((text) => console.log(`  ${text}`));
	}
	const writes = entries.filter((entry) => Object.keys(entry.fields).length);
	console.log("\nResum");
	console.log(`  Documents a escriure: ${writes.length}`);
	console.log(`  Enllaços trencats arreglats: ${stats.broken}`);
	console.log(`  relatedStory nous: ${stats.related}`);
	console.log(
		`  Enllaços al text: ${stats.linksAdded} nous · ${stats.linksAlready} ja hi eren · ${stats.linksMissing.length} no trobats`,
	);
	console.log(`  Imatges amb alt nou: ${stats.alts}`);
	console.log(`  Destinacions afegides: ${stats.destinations}`);
	if (stats.linksMissing.length) {
		console.log("\n  Enllaços no trobats (cal fer-los a mà):");
		stats.linksMissing.forEach((text) => console.log(`    ${text}`));
	}
	if (stats.notFound.length) {
		console.log("\n  Documents del pla que no hi són:");
		stats.notFound.forEach((text) => console.log(`    ${text}`));
	}
	if (stats.errors.length) {
		console.log("\n  Errors (aquests documents no es toquen):");
		stats.errors.forEach((text) => console.log(`    ${text}`));
	}
};

const writeBackup = async (backupDir, database, entries) => {
	await fs.mkdir(backupDir, { recursive: true });
	const stamp = new Date().toISOString().replace(/[:.]/g, "-");
	const file = path.join(backupDir, `editorial-plan-${database}-${stamp}.json`);
	const rows = entries.flatMap((entry) =>
		Object.entries(entry.fields).map(([field, value]) => ({
			collection: entry.collection,
			_id: entry._id,
			label: entry.label,
			field,
			...value,
		})),
	);
	await fs.writeFile(
		file,
		EJSON.stringify(
			{ database, createdAt: new Date().toISOString(), entries: rows },
			null,
			2,
			{ relaxed: false },
		),
		{ flag: "wx" },
	);
	return file;
};

const filterFor = (field, value, missing) =>
	missing ? { [field]: { $exists: false } } : { [field]: value };

const fix = async (db, args) => {
	const plan = JSON.parse(await fs.readFile(args.plan, "utf8"));
	const collected = await collectPlan(db, plan, args.only);
	printPlan(collected);
	const writes = collected.entries.filter(
		(entry) => Object.keys(entry.fields).length,
	);

	if (!args.apply) {
		console.log("\nDry-run: no s'ha escrit res. Per aplicar-ho, afegeix --apply.");
		return;
	}
	if (!writes.length) {
		console.log("\nNo hi ha res a escriure.");
		return;
	}

	const backupFile = await writeBackup(args.backupDir, db.databaseName, writes);
	console.log(`\nCòpia de seguretat: ${backupFile}`);

	let written = 0;
	const conflicts = [];
	for (const entry of writes) {
		const filter = { _id: entry._id };
		const $set = {};
		for (const [field, value] of Object.entries(entry.fields)) {
			Object.assign(filter, filterFor(field, value.before, value.beforeMissing));
			$set[field] = value.after;
		}
		const res = await db.collection(entry.collection).updateOne(filter, { $set });
		if (res.modifiedCount === 1) written++;
		else conflicts.push(entry);
	}
	console.log(`Escrits: ${written} de ${writes.length} documents.`);
	conflicts.forEach((entry) =>
		console.log(
			`  No escrit (ha canviat mentrestant): ${entry.collection} ${entry._id} · ${entry.label}`,
		),
	);
	if (conflicts.length) process.exitCode = 1;
};

const restore = async (db, args) => {
	const backup = EJSON.parse(await fs.readFile(args.restore, "utf8"), {
		relaxed: false,
	});
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
		const value = doc?.[entry.field];
		if (sameValue(value, entry.after)) pending.push(entry);
		else if (
			entry.beforeMissing ? value === undefined : sameValue(value, entry.before)
		) {
			alreadyRestored++;
		} else conflicts.push(entry);
	}

	console.log(`Entrades a la còpia: ${backup.entries.length}`);
	console.log(`  Per restaurar: ${pending.length}`);
	console.log(`  Ja restaurades: ${alreadyRestored}`);
	console.log(`  Editades després (no es toquen): ${conflicts.length}`);
	conflicts.forEach((entry) =>
		console.log(`    ${entry.collection} ${entry._id} · ${entry.label} · ${entry.field}`),
	);

	if (!args.apply) {
		console.log("\nDry-run: no s'ha escrit res. Per restaurar, afegeix --apply.");
		return;
	}
	let written = 0;
	for (const entry of pending) {
		const update = entry.beforeMissing
			? { $unset: { [entry.field]: "" } }
			: { $set: { [entry.field]: entry.before } };
		const res = await db
			.collection(entry.collection)
			.updateOne({ _id: entry._id, [entry.field]: entry.after }, update);
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
		else {
			console.log(`Operacions: ${args.only.join(", ")}`);
			await fix(db, args);
		}
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

export { addImageAlts, addTextLink, anchorPattern, fixBrokenLinks };
