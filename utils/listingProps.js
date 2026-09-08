/**
 * Retallat dels documents de l'API abans d'enviar-los al client.
 *
 * Les activitats i els allotjaments porten `description`, `reasons`, `review`,
 * `images`, `metaDescription`... que els llistats no pinten. Next incrusta
 * totes les props dins l'HTML com a JSON, o sigui que enviar-ho tot fa pàgines
 * de centenars de kB per res.
 */

/** Camps que fa servir `PublicSquareBox` / `ListingGrid`. */
const LISTING_CARD_FIELDS = [
	"_id",
	"type",
	"slug",
	"title",
	"cover",
	"categories",
	"placeType",
	"duration",
	"price",
	"isVerified",
	"activity_rating",
	"place_rating",
	"activity_locality",
	"activity_state",
	"activity_province",
	"activity_country",
	"place_locality",
	"place_province",
	"place_state",
	"place_country",
];

/** Camps que fan servir les targetes d'històries i llistes. */
const EDITORIAL_CARD_FIELDS = [
	"_id",
	"slug",
	"title",
	"subtitle",
	"cover",
	"createdAt",
];

/** Primer valor definit i no buit d'una llista. */
const firstDefined = (...values) =>
	values.find(
		(value) => value !== undefined && value !== null && value !== ""
	) || "";

const pickFields = (source, fields) => {
	if (!source || typeof source !== "object") return source;
	return fields.reduce((acc, field) => {
		if (source[field] !== undefined) acc[field] = source[field];
		return acc;
	}, {});
};

const toListingCard = (item) => pickFields(item, LISTING_CARD_FIELDS);

const toEditorialCard = (item) => pickFields(item, EDITORIAL_CARD_FIELDS);

/**
 * Dades mínimes per pintar un marcador al mapa: posició, enllaç i el que
 * ensenya la fitxa emergent (imatge, ubicació, valoració i preu).
 *
 * Les coordenades es normalitzen aquí: cada model les desa amb el seu prefix
 * (`activity_lat` / `place_lat`) i barrejar-ho al component del mapa era
 * l'origen de marcadors amb lat/lng NaN.
 */
const toMapMarker = (item) => {
	const lat = parseFloat(item.activity_lat ?? item.place_lat);
	const lng = parseFloat(item.activity_lng ?? item.place_lng);
	const isPlace =
		item.type === "place" ||
		(item.type === undefined && item.place_lat !== undefined);

	return {
		_id: item._id,
		slug: item.slug,
		title: item.title,
		// L'endpoint de llistat complet (`allPlaces` / `allActivities`) torna
		// una projecció curta: hi ha `subtitle` i `images`, però no `cover`,
		// preu ni valoració. La fitxa emergent ensenya el que hi hagi.
		subtitle: item.subtitle || "",
		type: isPlace ? "place" : "activity",
		// Necessari per enllaçar la fitxa emergent a la URL canònica
		// `/{categoria}/{slug}`. Ara com ara la projecció curta de l'API no el
		// torna: mentre no ho faci, l'enllaç cau a la ruta per tipus, que
		// redirigeix a la canònica.
		categories: item.categories || null,
		cover:
			item.cover ||
			(Array.isArray(item.images) && item.images.length
				? item.images[0]
				: ""),
		locality: firstDefined(
			item.place_locality,
			item.activity_locality,
			item.place_state,
			item.activity_state,
			item.place_country,
			item.activity_country
		),
		placeType: item.placeType || null,
		duration: item.duration ?? null,
		price: item.price ?? null,
		rating: item.place_rating ?? item.activity_rating ?? null,
		lat: Number.isFinite(lat) ? lat : null,
		lng: Number.isFinite(lng) ? lng : null,
	};
};

export {
	LISTING_CARD_FIELDS,
	EDITORIAL_CARD_FIELDS,
	firstDefined,
	pickFields,
	toListingCard,
	toEditorialCard,
	toMapMarker,
};
