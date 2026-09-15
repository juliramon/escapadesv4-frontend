import {
	CATEGORY_ROUTES,
	FALLBACK_CATEGORY_PATH,
	listingPath,
} from "./listingRoutes";
import { isAffiliateUrl } from "./affiliate";

/**
 * Enllaços interns de l'editor: a quines entrades del web es pot enllaçar, com
 * es cerquen i quins atributs porta cada enllaç.
 *
 * Fins ara el botó d'enllaç de l'editor només obria un `window.prompt` i calia
 * anar a buscar la URL a una altra pestanya. A més, l'extensió Link posava
 * `rel="nofollow"` a tots els enllaços, també als interns, que és just el que
 * no es vol per repartir autoritat entre publicacions del mateix web.
 *
 * Aquí no hi ha cap crida a l'API: el que es carrega ho fa `useLinkTargets`, i
 * `utils/seo.js` fa servir `isInternalHref` per comptar els enllaços interns.
 */

const SITE_URL = "https://escapadesenparella.cat";
const SITE_HOSTS = ["escapadesenparella.cat", "www.escapadesenparella.cat"];

const TYPE_LABELS = {
	activity: "Experiència",
	place: "Allotjament",
	story: "Història",
	list: "Llista",
	tripEntry: "Entrada de viatge",
	tripCategory: "Viatge",
	destination: "Destinació",
	category: "Categoria",
	page: "Pàgina",
};

/**
 * Tipus la URL canònica dels quals depèn de la categoria de la fitxa. Els
 * llistats de l'API no la porten, i `useLinkTargets` la resol en triar-ne una.
 */
const LISTING_TYPES = ["activity", "place"];

/** Primers segments de camí sota els quals viu una fitxa. */
const LISTING_SEGMENTS = new Set([
	...CATEGORY_ROUTES.map((route) => route.path),
	FALLBACK_CATEGORY_PATH,
	"activitats",
	"allotjaments",
]);

/** Pàgines fixes que val la pena poder enllaçar des d'un text. */
const STATIC_TARGETS = [
	{ title: "Portada", path: "/" },
	{ title: "Activitats", path: "/activitats" },
	{ title: "Allotjaments", path: "/allotjaments" },
	{ title: "Destinacions", path: "/destinacions" },
	{ title: "Històries", path: "/histories" },
	{ title: "Llistes", path: "/llistes" },
	{ title: "Viatges", path: "/viatges" },
	{ title: "Descomptes per viatjar", path: "/descomptes-viatjar" },
];

/**
 * Text comparable: sense accents, sense punt volat i en minúscules, perquè
 * "historia" trobi "Història" i "colleccio" trobi "col·lecció". Després de
 * `NFD` els accents són marques combinades separades (`\p{M}`).
 */
const normalizeText = (value) =>
	String(value || "")
		.normalize("NFD")
		.replace(/\p{M}/gu, "")
		.replace(/·/g, "")
		.replace(/[’`]/g, "'")
		.toLowerCase()
		.trim();

const isInternalHref = (href) => {
	if (!href) return false;
	const value = String(href).trim();
	if (value.startsWith("#")) return true;
	if (value.startsWith("/") && !value.startsWith("//")) return true;
	try {
		return SITE_HOSTS.includes(new URL(value).hostname.toLowerCase());
	} catch (err) {
		return false;
	}
};

/** El que s'escriu al cercador és una adreça i no un text a buscar. */
const looksLikeUrl = (value) => {
	const text = String(value || "").trim();
	if (!text || /\s/.test(text)) return false;
	return (
		/^(https?:\/\/|mailto:|tel:|\/|#|www\.)/i.test(text) ||
		/^[a-z0-9-]+(\.[a-z0-9-]+)+(\/\S*)?$/i.test(text)
	);
};

/**
 * Adreça final a partir del que s'ha escrit. Els camins relatius passen a
 * absoluts perquè és com estan escrits tots els enllaços interns publicats.
 */
const toHref = (value) => {
	const text = String(value || "").trim();
	if (/^(https?:|mailto:|tel:)/i.test(text) || text.startsWith("#")) {
		return text;
	}
	if (text.startsWith("/")) return `${SITE_URL}${text}`;
	return `https://${text}`;
};

/**
 * Atributs de la marca d'enllaç.
 *
 * Els interns no porten `nofollow` i s'obren a la mateixa pestanya si no es
 * demana el contrari. Els externs el mantenen i, quan són d'afiliació, hi
 * afegeixen `sponsored`, que és el valor que Google demana per als enllaços
 * pagats o que deixen comissió.
 */
const linkAttributesFor = (href, newTab) => {
	if (isInternalHref(href)) {
		return {
			href,
			target: newTab ? "_blank" : null,
			rel: newTab ? "noopener" : null,
		};
	}
	const follow = isAffiliateUrl(href) ? "sponsored nofollow" : "nofollow";
	return {
		href,
		target: newTab ? "_blank" : null,
		rel: newTab ? `noopener noreferrer ${follow}` : follow,
	};
};

const pathOf = (href) => {
	if (!isInternalHref(href)) return null;
	try {
		const { pathname } = new URL(href, SITE_URL);
		return pathname.replace(/\/+$/, "") || "/";
	} catch (err) {
		return null;
	}
};

/**
 * Índex d'entrades enllaçables a partir de les respostes de l'API.
 *
 * Segueix les mateixes rutes que el sitemap. Les fitxes queden amb la ruta de
 * reserva (`/activitats/{slug}`), que és la que es pot saber sense categoria.
 */
const buildLinkTargets = ({
	activities,
	places,
	stories,
	lists,
	tripEntries,
	tripCategories,
	destinations,
	categories,
} = {}) => {
	const targets = [];

	const push = (items, type, toPath) => {
		(items || []).forEach((item) => {
			if (!item || !item.slug || item.isRemoved) return;
			const path = toPath(item);
			if (!path) return;
			targets.push({
				key: `${type}:${item._id || path}`,
				type,
				slug: item.slug,
				title: String(item.title || item.name || item.slug).trim(),
				path,
				updatedAt: item.updatedAt || item.createdAt || null,
			});
		});
	};

	push(activities?.allActivities, "activity", listingPath);
	push(places?.allPlaces, "place", listingPath);
	push(stories?.allStories, "story", (el) => `/histories/${el.slug}`);
	push(lists, "list", (el) => `/llistes/${el.slug}`);
	// Les entrades de viatge pengen del slug de la seva categoria.
	push(tripEntries?.allTrips, "tripEntry", (el) =>
		el.trip && el.trip.slug ? `/viatges/${el.trip.slug}/${el.slug}` : null,
	);
	push(tripCategories, "tripCategory", (el) => `/viatges/${el.slug}`);
	push(destinations, "destination", (el) => `/destinacions/${el.slug}`);
	push(categories, "category", (el) => `/${el.slug}`);
	STATIC_TARGETS.forEach(({ title, path }) =>
		targets.push({ key: `page:${path}`, type: "page", title, path }),
	);

	// El catàleg pot tenir slugs repetits mentre no hi hagi índex únic.
	const seen = new Set();
	return targets
		.filter((target) => {
			if (seen.has(target.path)) return false;
			seen.add(target.path);
			return true;
		})
		.map((target) => {
			const normalizedTitle = normalizeText(target.title);
			const isListing = LISTING_TYPES.includes(target.type);
			return {
				...target,
				isListing,
				typeLabel: TYPE_LABELS[target.type],
				url: `${SITE_URL}${target.path}`,
				// Per a les fitxes no es mostra la ruta de reserva, que no és
				// la que acabarà a l'enllaç.
				displayPath: isListing ? `/…/${target.slug}` : target.path,
				normalizedTitle,
				// El tipus també compta, perquè "historia pedraforca" trobi
				// la història i no l'experiència.
				haystack: `${normalizedTitle} ${target.path.toLowerCase()} ${normalizeText(
					TYPE_LABELS[target.type],
				)}`,
			};
		});
};

const byRecency = (a, b) =>
	(Date.parse(b.updatedAt) || 0) - (Date.parse(a.updatedAt) || 0);

const WORD_BOUNDARY = /[\s\-/'(]/;

/**
 * Entrades que coincideixen amb la cerca, les millors primer.
 *
 * Totes les paraules han d'aparèixer al títol, al camí o al tipus. Puntua més
 * una coincidència a l'inici d'una paraula, i molt més si el títol comença per
 * la frase sencera. Sense text, torna el més recent, com fa WordPress.
 */
const searchLinkTargets = (targets, query, limit = 8) => {
	const tokens = normalizeText(query).split(/\s+/).filter(Boolean);
	if (!tokens.length) {
		return targets
			.filter((target) => target.type !== "page")
			.sort(byRecency)
			.slice(0, limit);
	}

	const phrase = tokens.join(" ");
	const scored = [];
	targets.forEach((target) => {
		let score = 0;
		for (const token of tokens) {
			const at = target.haystack.indexOf(token);
			if (at === -1) return;
			score +=
				at === 0 || WORD_BOUNDARY.test(target.haystack[at - 1]) ? 2 : 1;
		}
		if (target.normalizedTitle === phrase) score += 10;
		else if (target.normalizedTitle.startsWith(phrase)) score += 5;
		scored.push({ target, score });
	});

	return scored
		.sort((a, b) => b.score - a.score || byRecency(a.target, b.target))
		.slice(0, limit)
		.map((entry) => entry.target);
};

/**
 * Entrada a la qual apunta una URL interna, si és a l'índex.
 *
 * Les fitxes s'enllacen amb la ruta de la seva categoria
 * (`/escapades-aventura/{slug}`), que no és la de l'índex: es reconeixen pel
 * slug.
 */
const findLinkTarget = (targets, href) => {
	const path = pathOf(href);
	if (!path) return null;
	const exact = targets.find((target) => target.path === path);
	if (exact) return exact;

	const [, segment, slug, extra] = path.split("/");
	if (!slug || extra !== undefined || !LISTING_SEGMENTS.has(segment)) {
		return null;
	}
	return (
		targets.find((target) => target.isListing && target.slug === slug) ||
		null
	);
};

export {
	SITE_URL,
	TYPE_LABELS,
	normalizeText,
	isInternalHref,
	looksLikeUrl,
	toHref,
	linkAttributesFor,
	buildLinkTargets,
	searchLinkTargets,
	findLinkTarget,
};
