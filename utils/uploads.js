/**
 * Destí de les imatges a Cloudinary.
 *
 * El backend (configs/cloudinary.config.js) desa cada fitxer a
 * `getaways-guru/{model}/{fitxa}` a partir de dos camps del formulari:
 * `uploadModel` i `uploadFolder`. Si no arriba el model, ho posa tot a
 * `getaways-guru/`; si arriba només la carpeta, ho dona per destinació.
 *
 * Fins ara només les fitxes d'experiència i d'allotjament els enviaven tots
 * dos. Històries, llistes, entrades de viatge, categories, característiques,
 * usuaris i organitzacions no enviaven res i les seves imatges queien totes a
 * l'arrel; les categories de viatge enviaven només la carpeta i acabaven dins
 * de `destinations/`. Aquí queda un sol lloc que ho decideix.
 */

/** Claus que accepta el backend. Han de coincidir amb UPLOAD_MODEL_FOLDERS. */
const UPLOAD_MODELS = {
	destinations: "destinations",
	activities: "activities",
	places: "places",
	stories: "stories",
	lists: "lists",
	categories: "categories",
	tripCategories: "trip-categories",
	characteristics: "characteristics",
	users: "users",
	organizations: "organizations",
	tripEntries: "trip-entries",
};

/**
 * Nom de la carpeta de la fitxa: l'slug si n'hi ha, i si no el títol convertit
 * a slug. Alguns formularis deixen el text literal "slug" al camp buit.
 */
const uploadFolderKey = (slug, title) => {
	let key = (slug || "").trim();
	if (key === "slug") key = "";
	if (key) return key;

	if (title && typeof title === "string") {
		key = title
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "")
			.slice(0, 80);
	}
	return key || "sense-slug";
};

/**
 * Funció de pujada lligada a una fitxa concreta.
 *
 * @param {object} service Instància de ContentService.
 * @param {string} model Una de les claus de UPLOAD_MODELS.
 * @param {{slug?: string, title?: string}} listing Fitxa a la qual pertany.
 * @returns {(formData: FormData) => Promise<{path: string}>}
 */
const createUploader = (service, model, listing = {}) => {
	const folder = uploadFolderKey(listing.slug, listing.title);
	return (formData) => service.uploadFile(formData, folder, model);
};

/**
 * Puja un fitxer i en retorna la ruta de Cloudinary.
 *
 * @param {Function} upload El resultat de `createUploader`.
 * @param {File} file
 * @param {string} fallback Valor a conservar si no hi ha fitxer nou.
 */
const uploadSingleFile = async (upload, file, fallback = "") => {
	if (!file) return fallback;
	const uploadData = new FormData();
	uploadData.append("imageUrl", file);
	const uploaded = await upload(uploadData);
	return uploaded?.path || fallback;
};

/**
 * Formats que accepta Cloudinary (`allowed_formats` a la configuració del
 * backend). Amb qualsevol altre —un webp o un heic del mòbil, per exemple—
 * l'API respon amb un error 500 en HTML, i el formulari només pot dir que no
 * s'ha pogut desar. Per això es comprova abans de pujar res.
 */
const ACCEPTED_IMAGE_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/gif",
];

/** Valor per a l'atribut `accept` de l'input, perquè el navegador ja filtri. */
const ACCEPTED_IMAGE_ACCEPT = ACCEPTED_IMAGE_TYPES.join(",");

const isAcceptedImage = (file) =>
	Boolean(file) && ACCEPTED_IMAGE_TYPES.includes(file.type);

/** Missatge per als fitxers que s'han descartat en triar-los. */
const rejectedImageMessage = (files) => {
	const names = files.map((file) => file.name).join(", ");
	return `Format no admès (${names}). Fes servir JPG, PNG o GIF.`;
};

export {
	UPLOAD_MODELS,
	uploadFolderKey,
	createUploader,
	uploadSingleFile,
	ACCEPTED_IMAGE_TYPES,
	ACCEPTED_IMAGE_ACCEPT,
	isAcceptedImage,
	rejectedImageMessage,
};
