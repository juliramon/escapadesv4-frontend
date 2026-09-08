import { UPLOAD_MODELS } from "../../utils/uploads";

/**
 * Diferències entre la fitxa d'activitat i la d'allotjament.
 *
 * Les quatre pàgines (crear i editar, per als dos tipus) sumaven 6.721 línies
 * que només es distingien pel prefix dels camps de localització, per un grapat
 * de camps propis i pels textos. Tot això queda aquí; la resta la comparteixen
 * a `ListingForm`.
 */

const CATEGORIES = [
	{ value: "romantica", label: "Romàntica" },
	{ value: "aventura", label: "Aventura" },
	{ value: "gastronomica", label: "Gastronòmica" },
	{ value: "cultural", label: "Cultural" },
	{ value: "relax", label: "Relax" },
];

const SEASONS = [
	{ value: "hivern", label: "Hivern" },
	{ value: "primavera", label: "Primavera" },
	{ value: "estiu", label: "Estiu" },
	{ value: "tardor", label: "Tardor" },
];

const PLACE_TYPES = [
	{ value: "hotel", label: "Hotel" },
	{ value: "apartament", label: "Apartament" },
	{ value: "refugi", label: "Refugi" },
	{ value: "casaarbre", label: "Casa-arbre" },
	{ value: "casarural", label: "Casa rural" },
	{ value: "carabana", label: "Carabana" },
	{ value: "camping", label: "Càmping" },
];

/**
 * Els camps de Google Places es diuen `activity_place_id` a les activitats i
 * `place_id` als allotjaments; la resta només canvia de prefix.
 */
const locationFields = (prefix, placeIdField) => ({
	full_address: `${prefix}_full_address`,
	locality: `${prefix}_locality`,
	province: `${prefix}_province`,
	state: `${prefix}_state`,
	country: `${prefix}_country`,
	lat: `${prefix}_lat`,
	lng: `${prefix}_lng`,
	rating: `${prefix}_rating`,
	place_id: placeIdField,
	opening_hours: `${prefix}_opening_hours`,
});

const LISTING_VARIANTS = {
	activity: {
		type: "activity",
		uploadModel: UPLOAD_MODELS.activities,
		location: locationFields("activity", "activity_place_id"),
		hasDuration: true,
		hasPlaceType: false,
		hasCharacteristics: false,
		detailsMethod: "activityDetails",
		createMethod: "activity",
		updateMethod: "editActivity",
		categories: CATEGORIES,
		seasons: SEASONS,
		copy: {
			documentTitleCreate:
				"Publicar una nova experiència - Escapadesenparella.cat",
			documentTitleEdit: "Edita l'experiència - Escapadesenparella.cat",
			titleCreate: "Publica una experiència",
			titleEdit: "Edita l'experiència",
			descriptionCreate:
				"Afegeix una experiència per fer en parella al catàleg",
			descriptionEdit: "Modifica les dades de l'experiència",
			titlePlaceholder: "Títol de l'experiència",
			subtitlePlaceholder: "Subtítol de l'experiència",
			addressPlaceholder: "Escriu la direcció de l'activitat",
			descriptionLabel: "Descripció",
			reasonsLabel: "Raons per realitzar l'escapada",
			descriptionPlaceholder: "Comença a descriure l'activitat...",
			reasonsPlaceholder:
				"Comença a escriure raons per realitzar l'activitat...",
			verifiedLabel: "Experiència verificada?",
			reviewLabel: "Review de l'experiència",
			saveError: "No s'ha pogut desar l'experiència. Torna-ho a provar.",
		},
	},
	place: {
		type: "place",
		uploadModel: UPLOAD_MODELS.places,
		location: locationFields("place", "place_id"),
		hasDuration: false,
		hasPlaceType: true,
		hasCharacteristics: true,
		detailsMethod: "getPlaceDetails",
		createMethod: "place",
		updateMethod: "editPlace",
		categories: CATEGORIES,
		seasons: SEASONS,
		placeTypes: PLACE_TYPES,
		copy: {
			documentTitleCreate:
				"Publicar un nou allotjament - Escapadesenparella.cat",
			documentTitleEdit: "Edita l'allotjament - Escapadesenparella.cat",
			titleCreate: "Publica un allotjament",
			titleEdit: "Edita l'allotjament",
			descriptionCreate: "Afegeix un allotjament amb encant al catàleg",
			descriptionEdit: "Modifica les dades de l'allotjament",
			titlePlaceholder: "Títol de l'allotjament",
			subtitlePlaceholder: "Subtítol de l'allotjament",
			addressPlaceholder: "Escriu la direcció de l'allotjament",
			descriptionLabel: "Descripció",
			reasonsLabel: "Raons per allotjar-s'hi",
			descriptionPlaceholder: "Comença a descriure l'allotjament...",
			reasonsPlaceholder: "Comença a escriure raons per allotjar-s'hi...",
			verifiedLabel: "Allotjament verificat?",
			reviewLabel: "Review de l'allotjament",
			saveError: "No s'ha pogut desar l'allotjament. Torna-ho a provar.",
		},
	},
};

export { LISTING_VARIANTS, CATEGORIES, SEASONS, PLACE_TYPES };
