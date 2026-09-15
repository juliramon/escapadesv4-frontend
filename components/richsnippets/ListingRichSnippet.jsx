import JsonLd from "./JsonLd";
import { firstDefined } from "../../utils/listingProps";
import { normalizeWebsite } from "../../utils/websiteUrl";

/**
 * Dades estructurades d'una fitxa d'experiència o d'allotjament.
 *
 * Es declaraven com a `Article`, que és el que es fa servir per a una notícia
 * o un reportatge. Una fitxa no és un article: és un lloc que es pot visitar
 * o on es pot dormir, i a la base de dades ja hi ha l'adreça, les
 * coordenades, el telèfon, l'horari i el preu. Amb el tipus que toca, Google
 * pot situar-les al mapa i ensenyar-ne les dades al resultat.
 */

/** El `placeType` del catàleg, al tipus de schema.org que li correspon. */
const LODGING_TYPES = [
	{ match: "hotel", type: "Hotel" },
	{ match: "camping", type: "Campground" },
	{ match: "casarural", type: "LodgingBusiness" },
	{ match: "apartament", type: "LodgingBusiness" },
	{ match: "casaarbre", type: "LodgingBusiness" },
	{ match: "refugi", type: "LodgingBusiness" },
	{ match: "carabana", type: "LodgingBusiness" },
];

const schemaTypeFor = (listing) => {
	if (listing.type !== "place") return "TouristAttraction";
	const placeType = Array.isArray(listing.placeType)
		? String(listing.placeType[0] || "")
		: String(listing.placeType || "");
	const match = LODGING_TYPES.find((entry) => placeType.includes(entry.match));
	return match ? match.type : "LodgingBusiness";
};

/**
 * Els camps de lloc porten prefix segons el tipus de fitxa
 * (`activity_locality`, `place_locality`…). Es mira primer el del tipus que
 * toca; l'altre queda de reserva per a les fitxes que han canviat de tipus i
 * conserven els camps antics.
 */
const fieldOf = (listing, name) => {
	const own = listing.type === "place" ? "place" : "activity";
	const other = own === "place" ? "activity" : "place";
	return firstDefined(listing[`${own}_${name}`], listing[`${other}_${name}`]);
};

const addressOf = (listing) => {
	const address = {
		"@type": "PostalAddress",
		streetAddress: fieldOf(listing, "full_address") || undefined,
		addressLocality: fieldOf(listing, "locality") || undefined,
		addressRegion:
			firstDefined(
				fieldOf(listing, "province"),
				fieldOf(listing, "state"),
			) || undefined,
		addressCountry: fieldOf(listing, "country") || undefined,
	};
	const hasData = Object.keys(address).some(
		(key) => key !== "@type" && address[key],
	);
	return hasData ? address : undefined;
};

const geoOf = (listing) => {
	const latitude = Number(fieldOf(listing, "lat"));
	const longitude = Number(fieldOf(listing, "lng"));
	if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
		return undefined;
	}
	if (latitude === 0 && longitude === 0) return undefined;
	return { "@type": "GeoCoordinates", latitude, longitude };
};

/**
 * La valoració és nostra, d'haver-hi estat, no la mitjana de ningú més: va
 * com a `review` signada pel web i no com a `aggregateRating`, que donaria a
 * entendre que són vots de tercers.
 */
const reviewOf = (listing) => {
	const rating = Number(fieldOf(listing, "rating"));
	if (!Number.isFinite(rating) || rating <= 0) return undefined;
	return {
		"@type": "Review",
		reviewRating: {
			"@type": "Rating",
			ratingValue: rating,
			bestRating: 5,
		},
		author: { "@type": "Organization", name: "Escapadesenparella.cat" },
		datePublished: listing.updatedAt || listing.createdAt || undefined,
	};
};

/**
 * L'horari només val com a dada si està escrit com l'espera schema.org
 * ("Mo-Su 10:00-18:00"). Al catàleg gairebé sempre és text lliure ("de
 * dimarts a diumenge, de 10 a 18 h"), i posar-lo igualment només omple les
 * dades estructurades de soroll: quan no té la forma bona, no s'hi posa.
 */
const SCHEMA_HOURS =
	/^(Mo|Tu|We|Th|Fr|Sa|Su)(-(Mo|Tu|We|Th|Fr|Sa|Su))?([, ]+\d{2}:\d{2}-\d{2}:\d{2})/;

const openingHoursOf = (listing) => {
	const hours = String(fieldOf(listing, "opening_hours") || "").trim();
	return SCHEMA_HOURS.test(hours) ? hours : undefined;
};

const ListingRichSnippet = ({ listing, url, image }) => {
	if (!listing) return null;

	const website = normalizeWebsite(listing.website);

	return (
		<JsonLd
			data={{
				"@context": "https://schema.org",
				"@type": schemaTypeFor(listing),
				name: listing.title,
				description: listing.subtitle || listing.metaDescription,
				image: image || listing.cover,
				url,
				address: addressOf(listing),
				geo: geoOf(listing),
				telephone: listing.phone || undefined,
				// La web de l'establiment, no la nostra: `url` ja és la fitxa.
				sameAs: website || undefined,
				openingHours: openingHoursOf(listing),
				priceRange: listing.price ? `${listing.price} €` : undefined,
				review: reviewOf(listing),
			}}
		/>
	);
};

export default ListingRichSnippet;
