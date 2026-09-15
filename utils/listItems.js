/**
 * Els elements d'una llista, llegits del seu propi text.
 *
 * Les llistes no desen els elements per separat: es redacten com un text amb
 * un `<h2>` per element ("1. Cadaqués", "2. Besalú"…). Per dir-li a Google
 * què hi ha a dins fa falta la llista com a dades (`ItemList`), i l'únic lloc
 * d'on es pot treure és el mateix contingut publicat.
 */

const HEADING = /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi;
const LINK = /<a\b[^>]*\shref=["']([^"']+)["'][^>]*>/i;

/**
 * Entitats HTML que surten al contingut. Les vocals accentuades i la ce
 * trencada es generen de la combinació lletra + accent (`&eacute;`,
 * `&ccedil;`…): escriure-les totes a mà serien seixanta línies.
 */
const ACCENTS = [
	["grave", "\u0300"],
	["acute", "\u0301"],
	["circ", "\u0302"],
	["tilde", "\u0303"],
	["uml", "\u0308"],
	["ring", "\u030a"],
	["cedil", "\u0327"],
];

const ENTITIES = {
	amp: "&",
	lt: "<",
	gt: ">",
	quot: '"',
	apos: "'",
	nbsp: " ",
	middot: "·",
	hellip: "…",
	mdash: "—",
	ndash: "–",
	laquo: "«",
	raquo: "»",
	lsquo: "'",
	rsquo: "'",
	ldquo: '"',
	rdquo: '"',
	euro: "€",
	deg: "°",
};

for (const letter of "aeiouyncAEIOUYNC") {
	for (const [name, mark] of ACCENTS) {
		ENTITIES[`${letter}${name}`] = `${letter}${mark}`.normalize("NFC");
	}
}

const decodeEntity = (entity) => {
	const body = entity.slice(1, -1);
	if (body.startsWith("#")) {
		const code = body.startsWith("#x") || body.startsWith("#X")
			? parseInt(body.slice(2), 16)
			: parseInt(body.slice(1), 10);
		return Number.isFinite(code) && code > 0
			? String.fromCodePoint(code)
			: entity;
	}
	return ENTITIES[body] ?? ENTITIES[body.toLowerCase()] ?? entity;
};

const toPlainText = (html) =>
	html
		.replace(/<[^>]+>/g, " ")
		.replace(/&#?[a-z0-9]+;/gi, decodeEntity)
		.replace(/\s+/g, " ")
		.trim();

/**
 * @param {string} html contingut de la llista
 * @param {number} [limit] com a màxim, per no inflar el JSON-LD
 * @returns {{name: string, url: string|undefined}[]}
 */
const listItemsFrom = (html, limit = 30) => {
	if (!html || typeof html !== "string") return [];

	const items = [];
	for (const match of html.matchAll(HEADING)) {
		const name = toPlainText(match[1]);
		if (!name) continue;
		const link = match[1].match(LINK);
		items.push({ name, url: link ? link[1] : undefined });
		if (items.length >= limit) break;
	}
	return items;
};

export { listItemsFrom, toPlainText };
