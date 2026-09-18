/**
 * Idiomes del web.
 *
 * El català és l'idioma per defecte i conserva les URL de sempre
 * (`/hotels-amb-encant`); el castellà viu sota `/es` (`/es/hotels-amb-encant`).
 * Es fa així i no al revés perquè les pàgines en català ja estan indexades i
 * canviar-los la URL seria començar de zero.
 *
 * Search Console diu per què val la pena: 8.113 impressions en tres mesos de
 * consultes clarament en castellà, amb una posició mitjana de 49,7, contra la
 * 11,4 de les consultes en català. I «cabañas cataluña», l'única on hi arribem,
 * fa un 6,3% de clics: el millor número del web.
 */
const LOCALES = ["ca", "es"];
const DEFAULT_LOCALE = "ca";

/** Etiquetes de l'idioma, per al selector i per a `hreflang`. */
const LOCALE_LABELS = {
	ca: { name: "Català", short: "CA", htmlLang: "ca-ES" },
	es: { name: "Español", short: "ES", htmlLang: "es-ES" },
};

const isLocale = (locale) => LOCALES.includes(locale);

/**
 * Prefix d'URL d'un idioma: cadena buida per al català, `/es` per al castellà.
 * Serveix per construir enllaços absoluts (canòniques, `hreflang`, sitemap),
 * on `next/link` no hi arriba.
 */
const localePrefix = (locale) =>
	!locale || locale === DEFAULT_LOCALE ? "" : `/${locale}`;

/** URL absoluta d'un camí en un idioma. */
const localeUrl = (path, locale) =>
	`https://escapadesenparella.cat${localePrefix(locale)}${
		path === "/" ? "" : path
	}` || "https://escapadesenparella.cat";

/**
 * Text d'un camp en l'idioma demanat, amb el català de reserva.
 *
 * Tornar al català quan falta la traducció és deliberat: el contingut es
 * tradueix a poc a poc i val més una pàgina sencera en l'altra llengua que una
 * de mig buida. `translations` és un camp lliure a la base de dades, o sigui
 * que aquí s'hi entra amb peus de plom.
 *
 * @param {object} doc document de l'API
 * @param {string} field nom del camp
 * @param {string} locale codi d'idioma
 */
const t = (doc, field, locale) => {
	const original = doc?.[field];
	if (!locale || locale === DEFAULT_LOCALE) return original;
	const traduit = doc?.translations?.[locale]?.[field];
	return typeof traduit === "string" && traduit.trim() ? traduit : original;
};

/**
 * Còpia del document amb els camps demanats ja traduïts.
 *
 * Els components de targeta i les pàgines llegeixen `doc.title` sense saber
 * res d'idiomes: així només cal traduir a l'entrada, un sol cop, i no anar
 * escampant `t(...)` per tot el JSX.
 *
 * @param {object} doc
 * @param {string} locale
 * @param {string[]} fields camps a traduir
 */
const localized = (doc, locale, fields) => {
	if (!doc || !locale || locale === DEFAULT_LOCALE) return doc;
	const out = { ...doc };
	for (const field of fields) out[field] = t(doc, field, locale);
	// El slug hi va sempre: un document traduït ha de portar la seva adreça,
	// si no les targetes dels llistats enllaçarien la versió catalana. Es fa
	// després de les crides a l'API, que sempre van amb el slug original.
	out.slug = slugFor(doc, locale);
	return out;
};

/**
 * Els segments fixos de les rutes, traduïts.
 *
 * `/es/destinos/...` i no `/es/destinacions/...`: si la URL ha de ser en
 * castellà, ho ha de ser sencera. Els fitxers de `pages/` continuen dient-se
 * en català —són codi, no URL— i `next.config.js` hi fa arribar les
 * castellanes amb un rewrite.
 */
const SEGMENTS = {
	destinacions: { ca: "destinacions", es: "destinos" },
	histories: { ca: "histories", es: "historias" },
	llistes: { ca: "llistes", es: "listas" },
	allotjaments: { ca: "allotjaments", es: "alojamientos" },
	activitats: { ca: "activitats", es: "actividades" },
	viatges: { ca: "viatges", es: "viajes" },
};

/** El segment d'una secció en un idioma. */
const segment = (name, locale) =>
	SEGMENTS[name]?.[locale] || SEGMENTS[name]?.[DEFAULT_LOCALE] || name;

/** El segment en català a partir del d'un altre idioma, per desfer el camí. */
const segmentToCatalan = (value) => {
	const hit = Object.entries(SEGMENTS).find(([, noms]) =>
		Object.values(noms).includes(value),
	);
	return hit ? hit[0] : value;
};

/**
 * Slug d'un document en un idioma.
 *
 * Quan encara no n'hi ha de traduït es fa servir el català: l'adreça queda a
 * mitges, però existeix i funciona, que és millor que un 404 mentre es va
 * traduint el catàleg.
 */
const slugFor = (doc, locale) => {
	if (!locale || locale === DEFAULT_LOCALE) return doc?.slug;
	const traduit = doc?.translations?.[locale]?.slug;
	return typeof traduit === "string" && traduit.trim() ? traduit : doc?.slug;
};

/**
 * El document d'una llista que respon a un slug, sigui en l'idioma que sigui.
 *
 * Accepta també el slug català dins de l'idioma traduït: les adreces velles
 * que algú hagi desat o enllaçat continuen portant a algun lloc, i la
 * canònica ja s'encarrega de dir quina és la bona.
 */
const findBySlug = (docs, slug, locale) =>
	(docs || []).find((doc) => slugFor(doc, locale) === slug) ||
	(docs || []).find((doc) => doc?.slug === slug) ||
	null;

/** Camps que tradueix cada tipus de document. */
const FIELDS = {
	listing: [
		"title",
		"subtitle",
		"description",
		"metaTitle",
		"metaDescription",
	],
	story: ["title", "subtitle", "description", "metaTitle", "metaDescription"],
	list: ["title", "subtitle", "description", "metaTitle", "metaDescription"],
	category: ["title", "subtitle", "seoText", "seoTextHeader"],
	destination: ["title", "subtitle", "seoText", "seoTextHeader"],
	/** Les targetes dels llistats: només el que es veu a la targeta. */
	card: ["title", "subtitle"],
};

export {
	LOCALES,
	DEFAULT_LOCALE,
	LOCALE_LABELS,
	FIELDS,
	SEGMENTS,
	findBySlug,
	isLocale,
	localePrefix,
	localeUrl,
	localized,
	segment,
	segmentToCatalan,
	slugFor,
	t,
};
