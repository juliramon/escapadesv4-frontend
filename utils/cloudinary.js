/**
 * Cloudinary URL helpers.
 *
 * Els components antics tallaven la URL per posició (`substring(0, 51)` +
 * `substring(63)`), cosa que es trenca si el segment de versió canvia de
 * llargada o si la imatge no ve de Cloudinary. Aquestes funcions fan el mateix
 * amb una expressió regular i tornen la URL original quan no és de Cloudinary.
 *
 * Totes les transformacions que es generen aquí porten `f_auto,q_auto`:
 * Cloudinary tria el format (AVIF o WebP si el navegador els accepta, JPEG si
 * no) i la qualitat segons la imatge. Serveix el mateix retall amb menys de la
 * meitat de pes i estalvia haver de demanar `f_webp` a part amb un
 * `<source type="image/webp">`, que només cobria un format i un sol dispositiu.
 */

const UPLOAD_SEGMENT = /\/upload\/(?:v\d+\/)?/;

/** Format i qualitat automàtics, davant de qualsevol altra transformació. */
const AUTO = "f_auto,q_auto";

const withAuto = (transformation) =>
	transformation ? `${AUTO},${transformation}` : AUTO;

/** Una URL és de Cloudinary si té el segment /upload/ que fa de frontissa. */
const isCloudinaryUrl = (url) =>
	Boolean(url) && typeof url === "string" && UPLOAD_SEGMENT.test(url);

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
 * Retorna {src, width, height} d'una imatge retallada a la mida demanada, amb
 * format i qualitat automàtics. Per a targetes i miniatures, que sempre es
 * veuen a la mateixa mida.
 *
 * @param {string} url
 * @param {number} width
 * @param {number} height
 * @param {string} [crop]
 * @returns {{src: string, width: number, height: number}}
 */
const cloudinaryImage = (url, width, height, crop = "fill") => ({
	src: cloudinaryUrl(url, withAuto(`w_${width},h_${height},c_${crop}`)),
	width,
	height,
});

/** Amplades per defecte d'una imatge que ocupa tot l'ample disponible. */
const DEFAULT_WIDTHS = [480, 768, 1024, 1400, 1920];

/** Amplada que fa de `src` quan el navegador no entén `srcset`. */
const FALLBACK_WIDTH = 1024;

/**
 * Imatge responsiva: una URL per amplada i el `sizes` que diu al navegador
 * quant ocuparà. Un mòbil es baixa la de 480 px en comptes de la de 1.920.
 *
 * `ratio` és alçada/amplada: amb ratio es retalla (`c_fill`) i es poden donar
 * `width` i `height` a l'`<img>` perquè el navegador reservi l'espai i el text
 * de sota no salti; sense ratio es limita l'amplada (`c_limit`) i es respecta
 * la proporció original.
 *
 * @param {string} url
 * @param {{widths?: number[], ratio?: number, crop?: string, sizes?: string}} [options]
 * @returns {{src: string, srcSet: string, sizes: string, width: number, height: number|undefined}}
 */
const cloudinaryResponsive = (url, options = {}) => {
	const {
		widths = DEFAULT_WIDTHS,
		ratio,
		crop = "fill",
		sizes = "100vw",
	} = options;

	const transformationFor = (width) =>
		ratio
			? `w_${width},h_${Math.round(width * ratio)},c_${crop}`
			: `w_${width},c_limit`;

	const sorted = [...widths].sort((a, b) => a - b);
	const fallbackWidth =
		sorted.find((width) => width >= FALLBACK_WIDTH) ||
		sorted[sorted.length - 1];

	return {
		src: cloudinaryUrl(url, withAuto(transformationFor(fallbackWidth))),
		srcSet: sorted
			.map(
				(width) =>
					`${cloudinaryUrl(
						url,
						withAuto(transformationFor(width)),
					)} ${width}w`,
			)
			.join(", "),
		sizes,
		width: fallbackWidth,
		height: ratio ? Math.round(fallbackWidth * ratio) : undefined,
	};
};

export {
	cloudinaryUrl,
	cloudinaryImage,
	cloudinaryResponsive,
	isCloudinaryUrl,
};
