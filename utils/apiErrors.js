/**
 * Lectura dels errors que retorna l'API.
 *
 * Els controladors de contingut fan `.catch((err) => res.json(err))`, o sigui
 * que un error de validació de Mongoose arriba amb estat **200** i el cos de
 * l'error. Pel codi HTTP no es pot saber si una operació ha anat bé, i per
 * això els formularis es tancaven com si haguessin desat.
 */

/** Etiquetes llegibles dels camps, per no ensenyar el nom intern del model. */
const FIELD_LABELS = {
	name: "el nom en singular",
	pluralName: "el nom en plural",
	slug: "la URL",
	title: "el títol",
	subtitle: "el subtítol",
	image: "la imatge",
	illustration: "la il·lustració",
	icon: "la icona",
	imageCaption: "el peu de la imatge",
	seoTextHeader: "el text SEO de capçalera",
	seoText: "el text SEO",
	reviewText: "el text de la ressenya",
	mostLikedText: "el text del que més agrada",
	pointsOfInterestText: "el text de punts d’interès",
	mustSeeText: "el text del que cal veure",
	mapLocation: "el mapa",
	country: "el país",
	longTitle: "el títol llarg",
	richTitle: "el títol enriquit",
};

/**
 * @param {object} response cos de la resposta de l'API
 * @returns {string|null} missatge per a l'usuari, o null si tot ha anat bé
 */
const readValidationError = (response) => {
	if (!response || typeof response !== "object") return null;

	// Uns mètodes del servei tornen `res.data` i d'altres la resposta d'axios
	// sencera; acceptem les dues formes.
	const body =
		response.data && typeof response.data === "object"
			? response.data
			: response;

	const isValidationError =
		body.name === "ValidationError" || Boolean(body.errors);
	if (!isValidationError) return null;

	const fields = Object.keys(body.errors || {});
	if (fields.length === 0) {
		return "No s'ha pogut desar: hi ha camps obligatoris sense omplir.";
	}

	const labels = fields.map((field) => FIELD_LABELS[field] || field);
	const list =
		labels.length === 1
			? labels[0]
			: `${labels.slice(0, -1).join(", ")} i ${labels[labels.length - 1]}`;

	return `Falten camps obligatoris: ${list}.`;
};

export { readValidationError, FIELD_LABELS };
