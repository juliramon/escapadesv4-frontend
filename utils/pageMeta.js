/**
 * Títol i descripció de cada pàgina.
 *
 * Viu a part de `utils/seo.js` perquè d'aquí n'estira `GlobalMetas`, que és a
 * totes les pàgines del web: `utils/seo.js` arrossega slugify i l'índex
 * d'enllaços interns, que només fan falta a l'àrea d'administració.
 *
 * L'indicador SEO de l'admin fa servir aquestes mateixes funcions, de manera
 * que la previsualització del resultat de Google i el que es publica són el
 * mateix text.
 */

const SITE_NAME = "Escapadesenparella.cat";

/** Marca al final del `<title>`, amb el separador inclòs (25 caràcters). */
const TITLE_SUFFIX = ` | ${SITE_NAME}`;

/** Google talla el títol pels 600 px, que són uns 60 caràcters. */
const TITLE_MAX = 60;

/** Text pla d'un HTML de l'editor. */
const stripHtml = (html) =>
	String(html || "")
		.replace(/<[^>]*>/g, " ")
		.replace(/&nbsp;/g, " ")
		.replace(/&[a-z]+;/g, " ")
		.replace(/\s+/g, " ")
		.trim();

/**
 * Títol de la pàgina, tal com surt a la pestanya del navegador i a Google.
 *
 * Dues coses que abans no feia:
 *  - Si el meta títol és buit, fa servir el títol de l'entrada. Sense això hi
 *    havia dues fitxes publicades amb "| Escapadesenparella.cat" per tot
 *    títol.
 *  - La marca només s'hi posa si hi cap: 46 pàgines passaven dels 60
 *    caràcters només pels 25 del sufix i Google les tallava. Val més un
 *    títol sencer sense marca que un de tallat amb mitja marca.
 */
const serpTitle = ({ metaTitle, title }) => {
	const base = String(metaTitle || "").trim() || String(title || "").trim();
	if (!base) return SITE_NAME;
	return base.length + TITLE_SUFFIX.length <= TITLE_MAX
		? `${base}${TITLE_SUFFIX}`
		: base;
};

/**
 * Meta descripció, amb el subtítol de reserva quan no se n'ha escrit cap.
 *
 * Passa pel filtre d'HTML encara que vingui del camp de metes: les vuit
 * pàgines de viatge hi enviaven el `seoTextHeader`, que és HTML de l'editor, i
 * Google n'ensenyava el resultat amb un «&lt;p&gt;» al davant.
 */
const serpDescription = ({ metaDescription, subtitle }) =>
	stripHtml(metaDescription) || stripHtml(subtitle) || "";

export {
	SITE_NAME,
	TITLE_SUFFIX,
	TITLE_MAX,
	stripHtml,
	serpTitle,
	serpDescription,
};
