/**
 * El camp «Pàgina web» de les fitxes.
 *
 * S'hi escriu el que sigui: la majoria de vegades una adreça sencera, però
 * també `www.bramaaltpallars.cat`, `apartamentparellada.cat` o un guió quan
 * l'establiment no en té. Els dos primers casos, posats tal qual a un `href`,
 * el navegador els llegeix com a camí relatiu i porten a
 * `/escapades-aventura/www.bramaaltpallars.cat`, que és un 404 del nostre
 * domini: cinc fitxes publicades hi anaven a parar. El tercer generava un
 * enllaç a enlloc.
 *
 * Aquí es normalitza en un sol lloc, tant per pintar la fitxa com per desar el
 * formulari, de manera que el que hi ha a la base de dades es va netejant sol
 * a mesura que s'editen les fitxes.
 */

/** Maneres d'escriure "no en té" que s'han trobat al catàleg. */
const PLACEHOLDERS = new Set(["-", "--", "–", "—", "n/a", "na", "no", "cap"]);

/** Un domini: com a mínim una etiqueta, un punt i una extensió de dues lletres. */
const DOMAIN = /^[\p{L}\d][\p{L}\d-]*(\.[\p{L}\d][\p{L}\d-]*)*\.\p{L}{2,}$/u;

/**
 * Adreça utilitzable a partir del que hi ha desat, o cadena buida si no n'hi
 * ha cap. No inventa res: si el valor no s'assembla a una adreça, no en surt
 * cap enllaç.
 *
 * @param {string} value
 * @returns {string}
 */
const normalizeWebsite = (value) => {
	const text = String(value ?? "").trim();
	if (!text || PLACEHOLDERS.has(text.toLowerCase())) return "";

	// `//exemple.cat` hereta el protocol de la pàgina; amb https hi ha prou.
	const candidate = text.startsWith("//") ? `https:${text}` : text;
	const hasScheme = /^[a-z][a-z\d+.-]*:/i.test(candidate);

	if (hasScheme) {
		if (!/^https?:/i.test(candidate)) return "";
		try {
			const url = new URL(candidate);
			return url.hostname ? url.href : "";
		} catch (error) {
			return "";
		}
	}

	// Sense esquema: ha de començar per un domini perquè valgui la pena.
	const [host] = candidate.split(/[/?#]/);
	if (!DOMAIN.test(host)) return "";
	try {
		return new URL(`https://${candidate}`).href;
	} catch (error) {
		return "";
	}
};

/** `true` si del valor en surt un enllaç. */
const isWebsite = (value) => normalizeWebsite(value) !== "";

/** `true` si el que hi ha escrit vol dir "no en té". */
const isPlaceholderWebsite = (value) =>
	PLACEHOLDERS.has(
		String(value ?? "")
			.trim()
			.toLowerCase(),
	);

export { normalizeWebsite, isWebsite, isPlaceholderWebsite };
