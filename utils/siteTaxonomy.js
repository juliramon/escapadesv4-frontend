/**
 * Taxonomia pública del site.
 *
 * Es fa servir per pintar la navegació per verticals (que apareix a totes les
 * pàgines) sense haver de fer cap crida a l'API des del client. Els slugs són
 * els mateixos que retorna `/categories` i `/destinations`, i canvien molt poc.
 *
 * IMPORTANT: si es crea una categoria o una destinació nova des del panell
 * d'administració, cal afegir-la aquí perquè aparegui al menú.
 */

/** Tipus d'escapada — categories amb `isPlace` fals a l'API. */
const GETAWAY_CATEGORIES = [
	{
		slug: "escapades-romantiques",
		es: {
			slug: "escapadas-romanticas",
			title: "Escapadas románticas",
			label: "Románticas",
			hint: "Para una noche especial",
		},
		title: "Escapades romàntiques",
		label: "Romàntiques",
		hint: "Per a una nit especial",
	},
	{
		slug: "escapades-gastronomiques",
		es: {
			slug: "escapadas-gastronomicas",
			title: "Escapadas gastronómicas",
			label: "Gastronómicas",
			hint: "Comer y beber bien",
		},
		title: "Escapades gastronòmiques",
		label: "Gastronòmiques",
		hint: "Menjar i beure bé",
	},
	{
		slug: "escapades-aventura",
		es: {
			slug: "escapadas-aventura",
			title: "Escapadas de aventura",
			label: "De aventura",
			hint: "Adrenalina al aire libre",
		},
		title: "Escapades d'aventura",
		label: "D'aventura",
		hint: "Adrenalina a fora",
	},
	{
		slug: "escapades-de-relax",
		es: {
			slug: "escapadas-relax",
			title: "Escapadas de relax",
			label: "De relax",
			hint: "Spa y desconexión",
		},
		title: "Escapades de relax",
		label: "De relax",
		hint: "Spa i desconnexió",
	},
	{
		slug: "escapades-culturals",
		es: {
			slug: "escapadas-culturales",
			title: "Escapadas culturales",
			label: "Culturales",
			hint: "Historia y patrimonio",
		},
		title: "Escapades culturals",
		label: "Culturals",
		hint: "Història i patrimoni",
	},
	{
		slug: "rutes-i-excursions",
		es: {
			slug: "rutas-y-excursiones",
			title: "Rutas y excursiones",
			label: "Rutas y excursiones",
			hint: "Caminar y descubrir",
		},
		title: "Rutes i excursions",
		label: "Rutes i excursions",
		hint: "Caminar i descobrir",
	},
	{
		slug: "escapades-de-cap-de-setmana",
		es: {
			slug: "escapadas-fin-de-semana",
			title: "Escapadas de fin de semana",
			label: "Fin de semana",
			hint: "Dos días y basta",
		},
		title: "Escapades de cap de setmana",
		label: "Cap de setmana",
		hint: "Dos dies i prou",
	},
	{
		slug: "escapades-hivern",
		es: {
			slug: "escapadas-invierno",
			title: "Escapadas de invierno",
			label: "Invierno",
			hint: "Nieve, fuego y montaña",
		},
		title: "Escapades d'hivern",
		label: "Hivern",
		hint: "Neu, foc i muntanya",
	},
	{
		slug: "escapades-estiu",
		es: {
			slug: "escapadas-verano",
			title: "Escapadas de verano",
			label: "Verano",
			hint: "Mar, piscina y noches",
		},
		title: "Escapades d'estiu",
		label: "Estiu",
		hint: "Mar, piscina i nits",
	},
];

/** Tipus d'allotjament — categories amb `isPlace` cert a l'API. */
const STAY_CATEGORIES = [
	{
		slug: "hotels-amb-encant",
		es: {
			slug: "hoteles-con-encanto",
			title: "Hoteles con encanto en Cataluña",
			label: "Hoteles con encanto",
			hint: "Boutique y pequeños",
		},
		title: "Hotels amb encant a Catalunya",
		label: "Hotels amb encant",
		hint: "Boutique i petits",
	},
	{
		slug: "cases-rurals",
		es: {
			slug: "casas-rurales",
			title: "Casas rurales",
			label: "Casas rurales",
			hint: "Casa entera",
		},
		title: "Cases rurals",
		label: "Cases rurals",
		hint: "Casa sencera",
	},
	{
		slug: "apartaments-per-a-parelles",
		es: {
			slug: "apartamentos-para-parejas",
			title: "Apartamentos para parejas",
			label: "Apartamentos",
			hint: "A vuestro aire",
		},
		title: "Apartaments per a parelles",
		label: "Apartaments",
		hint: "A la vostra",
	},
	{
		slug: "cabanyes-als-arbres",
		es: {
			slug: "cabanas-cataluna",
			title: "Cabañas en los árboles",
			label: "Cabañas en los árboles",
			hint: "Dormir en un árbol",
		},
		title: "Cabanes als arbres",
		label: "Cabanyes als arbres",
		hint: "Dormir dalt d'un arbre",
	},
	{
		slug: "refugis",
		es: {
			slug: "refugios",
			title: "Refugios de montaña",
			label: "Refugios",
			hint: "Montaña de verdad",
		},
		title: "Refugis de muntanya",
		label: "Refugis",
		hint: "Muntanya de veritat",
	},
	{
		slug: "caravanes",
		es: {
			slug: "caravanas",
			title: "Caravanas y furgonetas",
			label: "Caravanas",
			hint: "Sobre ruedas",
		},
		title: "Caravanes i furgonetes",
		label: "Caravanes",
		hint: "Sobre rodes",
	},
	{
		slug: "campings",
		es: {
			slug: "campings",
			title: "Campings",
			label: "Campings",
			hint: "Glamping y bungalós",
		},
		title: "Càmpings",
		label: "Càmpings",
		hint: "Glàmping i bungalows",
	},
];

/** Destinacions publicades a `/destinacions/[slug]`. */
const DESTINATIONS = [
	{
		slug: "escapades-pirineus",
		es: {
			slug: "escapadas-pirineos",
			title: "Escapadas a los Pirineos",
			label: "Pirineos",
		},
		title: "Escapades als Pirineus",
		label: "Pirineus",
	},
	{
		slug: "escapades-costa-brava",
		es: {
			slug: "escapadas-costa-brava",
			title: "Escapadas a la Costa Brava",
			label: "Costa Brava",
		},
		title: "Escapades a la Costa Brava",
		label: "Costa Brava",
	},
	{
		slug: "escapades-costa-daurada",
		es: {
			slug: "escapadas-costa-dorada",
			title: "Escapadas a la Costa Dorada",
			label: "Costa Dorada",
		},
		title: "Escapades a la Costa Daurada",
		label: "Costa Daurada",
	},
	{
		slug: "escapades-delta-de-lebre",
		es: {
			slug: "escapadas-tierras-del-ebro",
			title: "Escapadas a las Tierras del Ebro",
			label: "Tierras del Ebro",
		},
		title: "Escapades al Delta de l'Ebre",
		label: "Delta de l'Ebre",
	},
	{
		slug: "escapades-maresme",
		es: {
			slug: "escapadas-maresme",
			title: "Escapadas al Maresme",
			label: "Maresme",
		},
		title: "Escapades al Maresme",
		label: "Maresme",
	},
	{
		slug: "escapades-andorra",
		es: {
			slug: "escapadas-andorra",
			title: "Escapadas a Andorra",
			label: "Andorra",
		},
		title: "Escapades a Andorra",
		label: "Andorra",
	},
];

/**
 * Verticals principals. `highlight` marca l'entrada d'afiliació, que va
 * destacada visualment perquè és la que monetitza millor.
 */
const VERTICALS = [
	{
		href: "/activitats",
		es: {
			href: "/actividades",
			label: "Experiencias",
			title: "Experiencias originales para hacer en pareja en Cataluña",
		},
		label: "Experiències",
		title: "Experiències originals per fer en parella a Catalunya",
	},
	{
		href: "/allotjaments",
		es: {
			href: "/alojamientos",
			label: "Alojamientos",
			title: "Alojamientos con encanto en Cataluña",
		},
		label: "Allotjaments",
		title: "Allotjaments amb encant a Catalunya",
	},
	{
		href: "/destinacions",
		es: {
			href: "/destinos",
			label: "Destinos",
			title: "Destinos para escapadas en pareja",
		},
		label: "Destinacions",
		title: "Destinacions per a escapades en parella",
	},
	{
		href: "/llistes",
		es: {
			href: "/listas",
			label: "Listas",
			title: "Listas de ideas para escapadas en pareja",
		},
		label: "Llistes",
		title: "Llistes d'idees per a escapades en parella",
	},
	{
		href: "/histories",
		es: {
			href: "/historias",
			label: "Historias",
			title: "Historias de escapadas vividas en pareja",
		},
		label: "Històries",
		title: "Històries d'escapades viscudes en parella",
	},
	{
		href: "/viatges",
		es: {
			href: "/viajes",
			label: "Viajes",
			title: "Viajes en pareja por el mundo",
		},
		label: "Viatges",
		title: "Viatges en parella arreu del món",
	},
	{
		href: "/descomptes-viatjar",
		es: {
			href: "/descomptes-viatjar",
			label: "Descuentos",
			title: "Descuentos para viajar",
		},
		label: "Descomptes",
		title: "Descomptes per viatjar",
		highlight: true,
	},
];

/**
 * Grup al qual pertany una categoria, per poder enllaçar-hi les germanes des
 * de la seva pàgina de llistat.
 *
 * @param {string} slug
 * @returns {{heading: string, items: Array}}
 */
/**
 * L'entrada en l'idioma demanat: el bloc `es` tapa el català, camp a camp.
 *
 * Cada entrada porta el seu castellà al costat i no en un fitxer a part
 * perquè el slug, el títol i l'etiqueta van junts: separar-los és com es
 * queden desaparellats.
 */
const localizedEntry = (entry, locale) =>
	!entry || !locale || locale === "ca"
		? entry
		: { ...entry, ...(entry.es || {}) };

const localizedEntries = (entries, locale) =>
	(entries || []).map((entry) => localizedEntry(entry, locale));

const HEADINGS = {
	stay: {
		ca: "Altres tipus d'allotjament",
		es: "Otros tipos de alojamiento",
	},
	getaway: { ca: "Altres tipus d'escapada", es: "Otros tipos de escapada" },
};

/**
 * @param {string} slug slug de la categoria, en l'idioma que sigui
 * @param {string} [locale]
 */
const categoryGroupFor = (slug, locale) => {
	const esAllotjament = STAY_CATEGORIES.some(
		(category) => category.slug === slug || category.es?.slug === slug,
	);
	const grup = esAllotjament ? "stay" : "getaway";
	return {
		heading: HEADINGS[grup][locale === "es" ? "es" : "ca"],
		items: localizedEntries(
			esAllotjament ? STAY_CATEGORIES : GETAWAY_CATEGORIES,
			locale,
		),
	};
};

/**
 * Llista d'enllaços interns en HTML, per incrustar dins dels blocs de text
 * SEO del peu dels llistats. El text de l'enllaç és el títol llarg de la
 * categoria, que és el que interessa com a àncora.
 *
 * @param {Array} items
 * @param {string} [prefix]
 * @returns {string}
 */
const taxonomyLinksHtml = (items, prefix = "/") =>
	`<ul>${items
		.map((item) => {
			const label = item.title || item.label;
			const hint = item.hint ? ` — ${item.hint.toLowerCase()}` : "";
			return `<li><a href="${prefix}${item.slug}">${label}</a>${hint}</li>`;
		})
		.join("")}</ul>`;

export {
	GETAWAY_CATEGORIES,
	STAY_CATEGORIES,
	DESTINATIONS,
	VERTICALS,
	categoryGroupFor,
	localizedEntry,
	localizedEntries,
	taxonomyLinksHtml,
};
