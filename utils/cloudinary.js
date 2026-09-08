/**
 * Cloudinary URL helpers.
 *
 * Els components antics tallaven la URL per posició (`substring(0, 51)` +
 * `substring(63)`), cosa que es trenca si el segment de versió canvia de
 * llargada o si la imatge no ve de Cloudinary. Aquestes funcions fan el mateix
 * amb una expressió regular i tornen la URL original quan no és de Cloudinary.
 */

const UPLOAD_SEGMENT = /\/upload\/(?:v\d+\/)?/;

/**
 * Insereix una cadena de transformacions dins d'una URL de Cloudinary.
 *
 * @param {string} url
 * @param {string} transformation p.ex. "w_600,h_450,c_fill"
 * @returns {string}
 */
const cloudinaryUrl = (url, transformation) => {
	if (!url || typeof url !== "string") return "";
	if (!UPLOAD_SEGMENT.test(url)) return url;
	if (!transformation) return url;
	return url.replace(UPLOAD_SEGMENT, `/upload/${transformation}/`);
};

/**
 * Retorna la parella {src, webp} d'una imatge retallada a la mida demanada.
 *
 * @param {string} url
 * @param {number} width
 * @param {number} height
 * @param {string} [crop]
 * @returns {{src: string, webp: string}}
 */
const cloudinaryImage = (url, width, height, crop = "fill") => {
	const size = `w_${width},h_${height},c_${crop}`;
	return {
		src: cloudinaryUrl(url, size),
		webp: cloudinaryUrl(url, `f_webp,${size}`),
	};
};

export { cloudinaryUrl, cloudinaryImage };
