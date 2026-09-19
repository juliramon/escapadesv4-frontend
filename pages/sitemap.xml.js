import ContentService from "../services/contentService";
import { listingPath } from "../utils/listingRoutes";
import { segment, slugFor } from "../utils/i18n";

const SITE = "https://escapadesenparella.cat";

/** Pàgines fixes que sempre hi han de constar. */
const STATIC_PATHS = [
	{path: "/", es: "/es", priority: "1.0", changefreq: "daily"},
	{path: "/activitats", es: "/es/actividades", priority: "0.9", changefreq: "daily"},
	{path: "/allotjaments", es: "/es/alojamientos", priority: "0.9", changefreq: "daily"},
	{path: "/destinacions", es: "/es/destinos", priority: "0.9", changefreq: "weekly"},
	{path: "/histories", es: "/es/historias", priority: "0.8", changefreq: "weekly"},
	{path: "/llistes", es: "/es/listas", priority: "0.8", changefreq: "weekly"},
	{path: "/viatges", es: "/es/viajes", priority: "0.8", changefreq: "weekly"},
	{path: "/empreses", priority: "0.5", changefreq: "monthly"},
	{path: "/sobre-nosaltres", priority: "0.4", changefreq: "yearly"},
	{path: "/contacte", priority: "0.4", changefreq: "yearly"},
	{path: "/premsa-i-mitjans", priority: "0.3", changefreq: "yearly"},
	{path: "/condicions-us", priority: "0.2", changefreq: "yearly"},
	{path: "/politica-privadesa", priority: "0.2", changefreq: "yearly"},
];

/**
 * Paraules visibles d'un camp HTML.
 *
 * Hi ha històries publicades sense text —`escapada-santuari-puig-agut-manlleu-osona`
 * no en té ni una paraula— que no aporten res a qui hi arriba des de cerca. Al
 * sitemap s'hi diu a Google què val la pena rastrejar, i una pàgina buida no
 * hi pinta res: queda fora fins que s'escrigui.
 */
const wordCount = (html) => {
	const text = String(html || "")
		.replace(/<[^>]+>/g, " ")
		.replace(/&nbsp;/g, " ")
		.replace(/s+/g, " ")
		.trim();
	return text ? text.split(" ").length : 0;
};

/** Per sota d'això, la pàgina no té contingut propi. */
const MIN_WORDS = 50;

/** Salt de línia del XML. */
const SALT = String.fromCharCode(10);

const escapeXml = (value) =>
	String(value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");

/**
 * Una entrada del sitemap.
 *
 * Quan la pàgina existeix en castellà, totes dues versions es llisten i
 * cadascuna porta els `xhtml:link` de les dues: és la condició perquè
 * Google les llegeixi com la mateixa pàgina en dos idiomes i no com a
 * contingut duplicat. Les pàgines que encara no estan traduïdes només hi
 * surten en català; val més que no hi siguin que no pas convidar Google a
 * indexar una còpia en la llengua que no toca.
 */
const urlEntry = ({path, es, lastmod, priority, changefreq}) => {
	const alternates = es
		? [
				`    <xhtml:link rel="alternate" hreflang="ca-ES" href="${escapeXml(
					SITE + path,
				)}"/>`,
				`    <xhtml:link rel="alternate" hreflang="es-ES" href="${escapeXml(
					SITE + es,
				)}"/>`,
				`    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(
					SITE + path,
				)}"/>`,
			]
		: [];
	return [path, ...(es ? [es] : [])]
		.map((loc) => entryXml({loc, alternates, lastmod, priority, changefreq}))
		.join(SALT);
};

const entryXml = ({loc, alternates, lastmod, priority, changefreq}) => {
	const parts = [`    <loc>${escapeXml(SITE + loc)}</loc>`, ...alternates];
	if (lastmod) {
		parts.push(`    <lastmod>${new Date(lastmod).toISOString()}</lastmod>`);
	}
	if (changefreq) {
		parts.push(`    <changefreq>${changefreq}</changefreq>`);
	}
	if (priority) {
		parts.push(`    <priority>${priority}</priority>`);
	}
	return `  <url>\n${parts.join("\n")}\n  </url>`;
};

const SiteMap = () => null;

export async function getServerSideProps({res}) {
	const service = new ContentService();

	// Si una crida falla, el sitemap s'ha de servir igualment amb la resta.
	const safe = async (fn, fallback) => {
		try {
			const value = await fn();
			return value || fallback;
		} catch (err) {
			return fallback;
		}
	};

	const [
		activities,
		places,
		stories,
		lists,
		destinations,
		categories,
		tripCategories,
		tripEntries,
	] = await Promise.all([
		safe(() => service.activities(), {}),
		safe(() => service.getAllPlaces(), {}),
		safe(() => service.getAllStories(), {}),
		safe(() => service.getAllLists(), []),
		safe(() => service.getDestinations(), []),
		safe(() => service.getCategories(), []),
		safe(() => service.getTripCategories(), []),
		safe(() => service.getAllTripEntries(), {}),
	]);

	const entries = [...STATIC_PATHS];

	// El camí castellà només hi va quan el document està traduït de debò:
	// `slugFor` cau al slug català quan no n'hi ha, i llistar la versió
	// castellana d'una pàgina que encara surt en català és convidar Google a
	// indexar una còpia.
	const push = (items, toPath) => {
		(items || []).forEach((item) => {
			if (!item || !item.slug) return;
			const traduit = Boolean(item.translations?.es);
			entries.push({
				path: toPath(item, "ca"),
				es: traduit ? `/es${toPath(item, "es")}` : null,
				lastmod: item.updatedAt || item.createdAt,
				changefreq: "weekly",
				priority: "0.7",
			});
		});
	};

	// Les fitxes van amb la seva URL canònica, `/{categoria}/{slug}`: les rutes
	// `/activitats/{slug}` i `/allotjaments/{slug}` redirigeixen amb un 308, i
	// Google vol al sitemap les URLs finals. Si el llistat no portés les
	// categories, `listingPath` tornaria la ruta de reserva, com fins ara.
	push(activities.allActivities, listingPath);
	push(places.allPlaces, listingPath);
	push(
		(stories.allStories || []).filter(
			(story) => wordCount(story.description) >= MIN_WORDS,
		),
		(el, locale) => `/${segment("histories", locale)}/${slugFor(el, locale)}`,
	);
	push(
		lists,
		(el, locale) => `/${segment("llistes", locale)}/${slugFor(el, locale)}`,
	);
	push(
		destinations,
		(el, locale) =>
			`/${segment("destinacions", locale)}/${slugFor(el, locale)}`,
	);
	push(categories, (el, locale) => `/${slugFor(el, locale)}`);
	push(
		tripCategories,
		(el, locale) => `/${segment("viatges", locale)}/${slugFor(el, locale)}`,
	);

	// Les entrades de viatge pengen del slug de la seva categoria.
	(tripEntries.allTrips || []).forEach((el) => {
		if (!el || !el.slug) return;
		const tripSlug = el.trip && el.trip.slug ? el.trip.slug : null;
		if (!tripSlug) return;
		entries.push({
			path: `/viatges/${tripSlug}/${el.slug}`,
			lastmod: el.updatedAt || el.createdAt,
			changefreq: "weekly",
			priority: "0.7",
		});
	});

	// Un sitemap no ha de repetir URLs, i el catàleg pot tenir slugs duplicats
	// mentre no hi hagi índex únic a la base de dades.
	const seen = new Set();
	const uniqueEntries = entries.filter((entry) => {
		if (seen.has(entry.path)) {
			return false;
		}
		seen.add(entry.path);
		return true;
	});

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${uniqueEntries.map(urlEntry).join("\n")}
</urlset>`;

	res.setHeader("Content-Type", "application/xml; charset=utf-8");
	res.setHeader(
		"Cache-Control",
		"public, s-maxage=3600, stale-while-revalidate=86400"
	);
	res.write(xml);
	res.end();

	return {props: {}};
}

export default SiteMap;
