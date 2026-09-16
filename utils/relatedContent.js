/**
 * Contingut relacionat dels peus de fitxa, història i llista.
 *
 * Els blocs de relacionats triaven sempre el mateix: les quatre històries més
 * noves, les quatre primeres llistes o, a les fitxes sense destinació (143 de
 * 191), quatre fitxes de la mateixa categoria d'arreu de Catalunya. Unes
 * poques pàgines s'enduien tots els enllaços del peu i la resta cap: 74 de les
 * 77 històries no en rebien de cap altra pàgina.
 *
 * Aquí es tria per proximitat: la distància entre coordenades quan n'hi ha, el
 * tema compartit al slug després i, per acabar d'omplir, les entrades
 * publicades just abans i just després. És determinista —la mateixa pàgina
 * tria sempre el mateix—, perquè l'ISR no canviï els enllaços a cada
 * regeneració i cada entrada en rebi un nombre semblant.
 *
 * Les funcions de triar són pures; les de càrrega reben el `ContentService` i
 * guarden la resposta uns minuts, perquè en un build es generen centenars de
 * pàgines que demanen el mateix catàleg.
 */

/** Fins on una fitxa es considera «a prop» d'una altra, en línia recta. */
const NEARBY_MAX_KM = 50;

const EARTH_RADIUS_KM = 6371;

const CATALOG_TTL_MS = 5 * 60 * 1000;

/**
 * Paraules dels slugs que no diuen res del tema: surten a tot arreu i farien
 * semblar relacionades dues entrades que no ho són.
 */
const TOPIC_STOPWORDS = new Set([
	"amb",
	"per",
	"des",
	"del",
	"dels",
	"les",
	"els",
	"que",
	"fer",
	"una",
	"uns",
	"com",
	"nou",
	"escapada",
	"escapades",
	"parella",
	"parelles",
	"catalunya",
	"idees",
	"visita",
	"visitar",
	"ruta",
	"excursio",
	"hotel",
	"restaurant",
	"millor",
	"millors",
	"activitats",
	"descobrir",
	"anar",
	"llocs",
	"casa",
	"rural",
	"adults",
	"only",
	"boutique",
]);

/** Camps que fa servir la targeta editorial (`EditorialCard`). */
const EDITORIAL_CARD_FIELDS = [
	"_id",
	"slug",
	"title",
	"subtitle",
	"cover",
	"createdAt",
];

/** Camps que fa servir la targeta de fitxa (`ListingGrid`). */
const LISTING_CARD_FIELDS = [
	"_id",
	"type",
	"slug",
	"title",
	"cover",
	"categories",
	"activity_rating",
	"place_rating",
	"price",
	"placeType",
	"duration",
	"isVerified",
	"activity_locality",
	"activity_province",
	"activity_state",
	"activity_country",
	"place_locality",
	"place_province",
	"place_state",
	"place_country",
];

/**
 * Només els camps indicats i cap `undefined`, que Next no sap serialitzar a
 * les props de `getStaticProps`.
 */
const pick = (item, fields) =>
	Object.fromEntries(
		fields
			.filter((field) => item && item[field] !== undefined)
			.map((field) => [field, item[field]]),
	);

const toEditorialCard = (item) => pick(item, EDITORIAL_CARD_FIELDS);
const toListingCard = (item) => pick(item, LISTING_CARD_FIELDS);

/** Identificador d'una referència, estigui poblada o no. */
const idOf = (ref) => (ref ? String(ref._id || ref) : "");

const toNumber = (value) => {
	if (value === null || value === undefined || value === "") return null;
	const number = Number(value);
	return Number.isFinite(number) ? number : null;
};

/** Coordenades d'una fitxa; l'API les desa com a text. */
const coordsOf = (item) => {
	if (!item) return null;
	const lat = toNumber(item.activity_lat ?? item.place_lat);
	const lng = toNumber(item.activity_lng ?? item.place_lng);
	if (lat === null || lng === null || (lat === 0 && lng === 0)) return null;
	return { lat, lng };
};

/** Distància de gran cercle (haversine), en quilòmetres. */
const distanceKm = (a, b) => {
	const rad = (degrees) => (degrees * Math.PI) / 180;
	const dLat = rad(b.lat - a.lat);
	const dLng = rad(b.lng - a.lng);
	const h =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
	return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
};

/** El catàleg pot tenir slugs repetits mentre no hi hagi índex únic. */
const uniqueBySlug = (items) => {
	const seen = new Set();
	return (items || []).filter((item) => {
		if (!item || !item.slug || seen.has(item.slug)) return false;
		seen.add(item.slug);
		return true;
	});
};

const topicTokens = (slug) =>
	new Set(
		String(slug || "")
			.split("-")
			.filter(
				(token) =>
					token.length > 2 &&
					!/^\d+$/.test(token) &&
					!TOPIC_STOPWORDS.has(token),
			),
	);

const byNewest = (a, b) =>
	String(b.createdAt || "").localeCompare(String(a.createdAt || ""));

/**
 * Les fitxes més properes a una altra, fins a `maxKm`. Barreja experiències i
 * allotjaments, que és com es planifica una escapada: què fem i on dormim.
 */
const nearestListings = (
	current,
	pool,
	{ limit = 4, maxKm = NEARBY_MAX_KM } = {},
) => {
	const origin = coordsOf(current);
	if (!origin) return [];
	return uniqueBySlug(pool)
		.filter((item) => item.slug !== current.slug)
		.map((item) => {
			const point = coordsOf(item);
			return { item, km: point ? distanceKm(origin, point) : Infinity };
		})
		.filter(({ km }) => km <= maxKm)
		.sort((a, b) => a.km - b.km || a.item.slug.localeCompare(b.item.slug))
		.slice(0, limit)
		.map(({ item }) => item);
};

/**
 * Històries o llistes relacionades amb una altra.
 *
 * Ordre: primer les que són a menys de `maxKm` (si `coordsFor` en sap les
 * coordenades), després les que comparteixen més paraules del slug («nadal»,
 * «pallars», «pedraforca») i, per acabar, les publicades més a prop en el
 * temps. Aquest últim criteri és el que garanteix que cada entrada rebi
 * enllaços de les seves veïnes encara que no tingui res en comú amb cap altra.
 */
const relatedEditorial = (
	current,
	pool,
	{ limit = 4, coordsFor = () => null, maxKm = NEARBY_MAX_KM } = {},
) => {
	const items = uniqueBySlug(pool).sort(byNewest);
	const index = items.findIndex((item) => item.slug === current.slug);
	const origin = coordsFor(current);
	const topic = topicTokens(current.slug);

	return items
		.map((item, position) => {
			if (item.slug === current.slug) return null;
			const point = origin ? coordsFor(item) : null;
			const km = point ? distanceKm(origin, point) : Infinity;
			let shared = 0;
			topicTokens(item.slug).forEach((token) => {
				if (topic.has(token)) shared += 1;
			});
			return {
				item,
				near: km <= maxKm ? km : Infinity,
				shared,
				// Una entrada acabada de publicar pot no ser encara al catàleg
				// de la cache: llavors les veïnes són les més noves.
				gap: index === -1 ? position : Math.abs(position - index),
			};
		})
		.filter(Boolean)
		.sort(
			(a, b) =>
				// Infinity - Infinity és NaN, que és fals i passa al criteri següent.
				a.near - b.near ||
				b.shared - a.shared ||
				a.gap - b.gap ||
				a.item.slug.localeCompare(b.item.slug),
		)
		.slice(0, limit)
		.map(({ item }) => item);
};

/** Fitxes que tenen una història com a `relatedStory`. */
const listingsForStory = (storyId, listings) =>
	uniqueBySlug(listings).filter(
		(item) => storyId && idOf(item.relatedStory) === String(storyId),
	);

/**
 * Coordenades de cada història, preses de la primera fitxa que la té com a
 * relacionada. Les històries no en porten, però expliquen un lloc que sí.
 */
const storyCoordinates = (listings) => {
	const coords = new Map();
	(listings || []).forEach((item) => {
		const storyId = idOf(item.relatedStory);
		const point = coordsOf(item);
		if (storyId && point && !coords.has(storyId)) coords.set(storyId, point);
	});
	return coords;
};

const catalogCache = new Map();

const cached = (key, load) => {
	const hit = catalogCache.get(key);
	if (hit && Date.now() - hit.at < CATALOG_TTL_MS) return hit.promise;
	const promise = Promise.resolve()
		.then(load)
		.catch((error) => {
			catalogCache.delete(key);
			throw error;
		});
	catalogCache.set(key, { at: Date.now(), promise });
	return promise;
};

/** Totes les fitxes, amb la projecció curta del llistat de l'API. */
const loadListingCatalog = (service) =>
	cached("listings", async () => {
		const [activities, places] = await Promise.all([
			service.activities(),
			service.getAllPlaces(),
		]);
		return [
			...(activities?.allActivities || []),
			...(places?.allPlaces || []),
		];
	});

/**
 * Totes les històries. L'API només les dona senceres (text inclòs), així que
 * es redueixen de seguida als camps de la targeta.
 */
const loadStoryCatalog = (service) =>
	cached("stories", async () =>
		((await service.getAllStories())?.allStories || []).map(toEditorialCard),
	);

/** Totes les llistes, amb la projecció curta del llistat paginat. */
const loadListCatalog = (service) =>
	cached("lists", async () =>
		((await service.paginateLists(0))?.allLists || []).map(toEditorialCard),
	);

export {
	NEARBY_MAX_KM,
	coordsOf,
	distanceKm,
	idOf,
	listingsForStory,
	loadListCatalog,
	loadListingCatalog,
	loadStoryCatalog,
	nearestListings,
	relatedEditorial,
	storyCoordinates,
	toEditorialCard,
	toListingCard,
	topicTokens,
};
