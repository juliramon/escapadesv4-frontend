import { segment } from "./i18n";

/**
 * Fitxes que canonicalitzen cap a la seva història.
 *
 * Quan hem visitat un lloc en tenim dues pàgines: la fitxa, amb el preu i com
 * arribar-hi, i la història, que explica com va anar. Totes dues surten per a
 * les mateixes cerques, Google en tria una —sovint la pitjor— i l'altra es
 * queda a mitja pàgina. Search Console en compta 32 parelles, amb 25.545
 * impressions repartides.
 *
 * La regla és que mana la història. La fitxa continua existint i s'hi arriba
 * des de la història i des dels llistats: el que canvia és que diu a Google
 * que la pàgina bona és l'altra, i els senyals de totes dues es concentren en
 * una sola.
 *
 * ## Com decidir-ho quan es publica una fitxa o una història nova
 *
 * 1. La fitxa i la història parlen del **mateix lloc**? Si la història és d'una
 *    ruta o d'un cap de setmana que passa per diversos llocs, no hi ha
 *    duplicat: cada pàgina respon una cerca diferent i no s'hi ha de tocar res.
 * 2. És una **experiència**, no un allotjament? Els allotjaments es reserven
 *    des de la fitxa: aquella pàgina ha de continuar sortint a Google encara
 *    que n'hi hagi una història.
 * 3. Mira qui guanya avui a Search Console. La regla val quan la història ja va
 *    al davant o van igualades. Quan és la fitxa la que porta la cerca, no
 *    l'apaguis: primer fes que la història s'ho mereixi.
 *
 * Si es compleixen les tres, afegeix-hi l'entrada aquí sota. El `relatedStory`
 * de la fitxa, per ell sol, no serveix per decidir-ho: n'hi ha que apunten a
 * una història que només passa pel lloc.
 *
 * ## Les que ara no hi són, i per què
 *
 * - `ruta-santuari-puig-agut` (1.166 impr. contra 187) i
 *   `fornells-de-la-muntanya` (1.405 contra 284): la fitxa porta la cerca, i la
 *   de Puig Agut, a més, apunta a una història sense text.
 * - `les-coves-meravelles-benifallet`, `llimiana-poble-encant-pallars-jussa`,
 *   `rukimon-rucs-del-corredor` i `castell-de-la-popa`: la fitxa va al davant.
 * - `visita-guiada-castell-de-mur` i `hotel-terradets-cellers-lleida`:
 *   comparteixen història amb una tercera fitxa, o sigui que no és una
 *   parella sinó un relat de viatge.
 * - `waterworld-lloret-de-mar`: totes dues per sota de la posició 50.
 */
const FITXES_CANONIQUES_A_HISTORIA = {
	"basses-de-coll-de-nargo": "basses-de-coll-de-nargo",
	"cala-estreta-palamos": "cala-estreta-costa-brava",
	"cala-sa-tuna-seixugador": "cala-sa-tuna-seixugador-begur-costa-brava",
	"cals-frares": "cals-frares-restaurant-santa-elena-agell",
	"el-taga-des-de-bruguera": "excursio-el-taga-des-de-bruguera",
	"esterragalls-all-olopte-cerdanya":
		"esterragalls-all-isovol-badlands-cerdanya-catalunya",
	"pedraforca-tartera-pollego-superior":
		"pedraforca-per-la-tartera-pollego-superior",
	"prats-de-cadi-des-d-estana": "prats-de-cadi-des-destana",
	"restaurant-maria-de-cadaques": "maria-de-cadaques-restaurant-palamos",
	"restaurant-pins-mar-sant-andreu-llavaneres":
		"restaurant-pins-mar-sant-andreu-llavaneres",
	"vilanova-de-banat": "vilanova-de-banat-serra-del-cadi",
};

/**
 * URL canònica d'una fitxa quan mana la seva història; si no, `null`.
 *
 * Es torna sense el prefix d'idioma: el posa `GlobalMetas`, i posar-l'hi aquí
 * donaria `/es/es/…`. El segment sí que va traduït, perquè la canònica d'una
 * pàgina castellana ha de ser una adreça castellana.
 *
 * Les històries encara no estan traduïdes, o sigui que el slug és el mateix
 * en tots dos idiomes; el dia que ho estiguin, aquí hi haurà d'entrar el seu
 * `translations.es.slug`.
 *
 * @param {{slug?: string}} listing
 * @param {string} [locale]
 * @returns {string|null}
 */
const storyCanonicalUrl = (listing, locale) => {
	const story = FITXES_CANONIQUES_A_HISTORIA[listing?.slug];
	if (!story) return null;
	return `https://escapadesenparella.cat/${segment("histories", locale)}/${story}`;
};

export { FITXES_CANONIQUES_A_HISTORIA, storyCanonicalUrl };
