import ContentService from "../services/contentService";

const SITE = "https://escapadesenparella.cat";

/** Pàgines fixes que sempre hi han de constar. */
const STATIC_PATHS = [
	{path: "/", priority: "1.0", changefreq: "daily"},
	{path: "/activitats", priority: "0.9", changefreq: "daily"},
	{path: "/allotjaments", priority: "0.9", changefreq: "daily"},
	{path: "/destinacions", priority: "0.9", changefreq: "weekly"},
	{path: "/histories", priority: "0.8", changefreq: "weekly"},
	{path: "/llistes", priority: "0.8", changefreq: "weekly"},
	{path: "/viatges", priority: "0.8", changefreq: "weekly"},
	{path: "/empreses", priority: "0.5", changefreq: "monthly"},
	{path: "/sobre-nosaltres", priority: "0.4", changefreq: "yearly"},
	{path: "/contacte", priority: "0.4", changefreq: "yearly"},
	{path: "/premsa-i-mitjans", priority: "0.3", changefreq: "yearly"},
	{path: "/condicions-us", priority: "0.2", changefreq: "yearly"},
	{path: "/politica-privadesa", priority: "0.2", changefreq: "yearly"},
];

const escapeXml = (value) =>
	String(value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");

const urlEntry = ({path, lastmod, priority, changefreq}) => {
	const parts = [`    <loc>${escapeXml(SITE + path)}</loc>`];
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

	const push = (items, toPath) => {
		(items || []).forEach((item) => {
			if (!item || !item.slug) return;
			entries.push({
				path: toPath(item),
				lastmod: item.updatedAt || item.createdAt,
				changefreq: "weekly",
				priority: "0.7",
			});
		});
	};

	push(activities.allActivities, (el) => `/activitats/${el.slug}`);
	push(places.allPlaces, (el) => `/allotjaments/${el.slug}`);
	push(stories.allStories, (el) => `/histories/${el.slug}`);
	push(lists, (el) => `/llistes/${el.slug}`);
	push(destinations, (el) => `/destinacions/${el.slug}`);
	push(categories, (el) => `/${el.slug}`);
	push(tripCategories, (el) => `/viatges/${el.slug}`);

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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
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
