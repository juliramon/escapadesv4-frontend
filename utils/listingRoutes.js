/**
 * Rutes de les fitxes d'experiències i allotjaments.
 *
 * La URL que mana és `/{categoria}/{slug}`. `/allotjaments/{slug}` i
 * `/activitats/{slug}` existeixen com a rutes de reserva —i redirigeixen a la
 * canònica— però no s'han d'enllaçar des d'enlloc.
 *
 * Aquest fitxer és l'únic lloc on viu la correspondència entre el valor que
 * desa el model a `categories` i el segment d'URL; abans estava duplicada
 * dins de la targeta de llistat.
 */

import { GETAWAY_CATEGORIES, STAY_CATEGORIES } from "./siteTaxonomy";

const CATEGORY_ROUTES = [
	{ match: "romantica", label: "Romàntica", path: "escapades-romantiques" },
	{
		match: "gastronomica",
		label: "Gastronòmica",
		path: "escapades-gastronomiques",
	},
	{ match: "aventura", label: "Aventura", path: "escapades-aventura" },
	{ match: "relax", label: "Relax", path: "escapades-de-relax" },
	// El slug `escapades-a-la-neu` no existeix a l'API: qualsevol fitxa amb
	// categoria "neu" generava un enllaç a una pàgina 404. La categoria
	// publicada equivalent és `escapades-hivern`.
	{ match: "neu", label: "Neu", path: "escapades-hivern" },
	{ match: "cultural", label: "Cultural", path: "escapades-culturals" },
];

/** Ruta per defecte quan la categoria no es reconeix, com abans. */
const FALLBACK_CATEGORY_PATH = "escapades-culturals";

/**
 * @param {string[]} categories valor del camp `categories` del document
 * @returns {{match: string, label: string, path: string}|null}
 */
const resolveCategoryRoute = (categories) => {
	if (!Array.isArray(categories) || categories.length === 0) return null;
	const value = String(categories[0]);
	return CATEGORY_ROUTES.find((entry) => value.includes(entry.match)) || null;
};

/**
 * Camí canònic d'una fitxa.
 *
 * Quan el document porta categories sempre torna `/{categoria}/{slug}`. Si no
 * en porta —passa amb les projeccions curtes que fa servir el mapa— cau a la
 * ruta pròpia del tipus, que redirigeix a la canònica.
 *
 * @param {{slug: string, type?: string, categories?: string[]}} item
 * @returns {string}
 */
const listingPath = (item) => {
	if (!item || !item.slug) return "/";
	const route = resolveCategoryRoute(item.categories);
	if (route) return `/${route.path}/${item.slug}`;
	if (Array.isArray(item.categories) && item.categories.length) {
		return `/${FALLBACK_CATEGORY_PATH}/${item.slug}`;
	}
	return `/${item.type === "place" ? "allotjaments" : "activitats"}/${
		item.slug
	}`;
};

/** URL absoluta, per a `canonical` i `og:url`. */
const listingUrl = (item) =>
	`https://escapadesenparella.cat${listingPath(item)}`;

/**
 * Títol llarg de la categoria principal d'una fitxa ("Escapades romàntiques"),
 * per encapçalar els blocs de contingut relacionat.
 *
 * @param {string[]} categories
 * @returns {{slug: string, title: string}|null}
 */
const categoryHeadingFor = (categories) => {
	const route = resolveCategoryRoute(categories);
	if (!route) return null;
	const entry = [...GETAWAY_CATEGORIES, ...STAY_CATEGORIES].find(
		(category) => category.slug === route.path
	);
	return { slug: route.path, title: entry?.title || route.label };
};

export {
	CATEGORY_ROUTES,
	FALLBACK_CATEGORY_PATH,
	resolveCategoryRoute,
	categoryHeadingFor,
	listingPath,
	listingUrl,
};
