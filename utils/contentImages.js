import { cloudinaryResponsive, isCloudinaryUrl } from "./cloudinary";

/**
 * Imatges del cos de les publicacions.
 *
 * L'editor desa les imatges amb la URL que torna Cloudinary en pujar-les, o
 * sigui l'original: a les llistes, cada element s'il·lustra amb una foto de
 * dos o tres mega que es descarrega sencera també al mòbil. Aquí s'hi afegeix
 * la mateixa transformació que fan servir les portades —format i qualitat
 * automàtics i una URL per amplada de pantalla— sense tocar el que hi ha desat
 * a la base de dades, que continua sent l'original.
 *
 * Les imatges que no són de Cloudinary (enllaços a webs de tercers) es deixen
 * tal com estan.
 */

const IMG_TAG = /<img\b[^>]*>/gi;
const SRC_ATTRIBUTE = /\ssrc=["']([^"']+)["']/i;

/** El text de les publicacions es llegeix en una columna d'uns 768 px. */
const BODY_WIDTHS = [480, 768, 1024, 1400];
const BODY_SIZES = "(min-width: 768px) 768px, 100vw";

const hasAttribute = (tag, name) => new RegExp(`\\s${name}=`, "i").test(tag);

const withResponsiveImages = (html) => {
	if (!html || typeof html !== "string") return html;

	return html.replace(IMG_TAG, (tag) => {
		const src = tag.match(SRC_ATTRIBUTE);
		if (!src || !isCloudinaryUrl(src[1])) return tag;

		// Sense `ratio` es respecta la proporció original de la foto: al cos
		// de l'article no hi ha cap caixa que en demani una de concreta.
		const image = cloudinaryResponsive(src[1], {
			widths: BODY_WIDTHS,
			sizes: BODY_SIZES,
		});

		let out = tag.replace(SRC_ATTRIBUTE, ` src="${image.src}"`);
		const attributes = [];
		if (!hasAttribute(out, "srcset"))
			attributes.push(`srcset="${image.srcSet}" sizes="${image.sizes}"`);
		if (!hasAttribute(out, "loading")) attributes.push('loading="lazy"');
		if (!hasAttribute(out, "decoding")) attributes.push('decoding="async"');

		return attributes.length
			? out.replace(/<img\b/i, `<img ${attributes.join(" ")}`)
			: out;
	});
};

export { withResponsiveImages };
