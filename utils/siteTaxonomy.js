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
		title: "Escapades romàntiques",
		label: "Romàntiques",
		hint: "Per a una nit especial",
	},
	{
		slug: "escapades-gastronomiques",
		title: "Escapades gastronòmiques",
		label: "Gastronòmiques",
		hint: "Menjar i beure bé",
	},
	{
		slug: "escapades-aventura",
		title: "Escapades d'aventura",
		label: "D'aventura",
		hint: "Adrenalina a fora",
	},
	{
		slug: "escapades-de-relax",
		title: "Escapades de relax",
		label: "De relax",
		hint: "Spa i desconnexió",
	},
	{
		slug: "escapades-culturals",
		title: "Escapades culturals",
		label: "Culturals",
		hint: "Història i patrimoni",
	},
	{
		slug: "rutes-i-excursions",
		title: "Rutes i excursions",
		label: "Rutes i excursions",
		hint: "Caminar i descobrir",
	},
	{
		slug: "escapades-de-cap-de-setmana",
		title: "Escapades de cap de setmana",
		label: "Cap de setmana",
		hint: "Dos dies i prou",
	},
	{
		slug: "escapades-hivern",
		title: "Escapades d'hivern",
		label: "Hivern",
		hint: "Neu, foc i muntanya",
	},
	{
		slug: "escapades-estiu",
		title: "Escapades d'estiu",
		label: "Estiu",
		hint: "Mar, piscina i nits",
	},
];

/** Tipus d'allotjament — categories amb `isPlace` cert a l'API. */
const STAY_CATEGORIES = [
	{
		slug: "hotels-amb-encant",
		title: "Hotels amb encant a Catalunya",
		label: "Hotels amb encant",
		hint: "Boutique i petits",
	},
	{
		slug: "cases-rurals",
		title: "Cases rurals",
		label: "Cases rurals",
		hint: "Casa sencera",
	},
	{
		slug: "apartaments-per-a-parelles",
		title: "Apartaments per a parelles",
		label: "Apartaments",
		hint: "A la vostra",
	},
	{
		slug: "cabanyes-als-arbres",
		title: "Cabanes als arbres",
		label: "Cabanyes als arbres",
		hint: "Dormir dalt d'un arbre",
	},
	{
		slug: "refugis",
		title: "Refugis de muntanya",
		label: "Refugis",
		hint: "Muntanya de veritat",
	},
	{
		slug: "caravanes",
		title: "Caravanes i furgonetes",
		label: "Caravanes",
		hint: "Sobre rodes",
	},
	{
		slug: "campings",
		title: "Càmpings",
		label: "Càmpings",
		hint: "Glàmping i bungalows",
	},
];

/** Destinacions publicades a `/destinacions/[slug]`. */
const DESTINATIONS = [
	{
		slug: "escapades-pirineus",
		title: "Escapades als Pirineus",
		label: "Pirineus",
	},
	{
		slug: "escapades-costa-brava",
		title: "Escapades a la Costa Brava",
		label: "Costa Brava",
	},
	{
		slug: "escapades-costa-daurada",
		title: "Escapades a la Costa Daurada",
		label: "Costa Daurada",
	},
	{
		slug: "escapades-delta-de-lebre",
		title: "Escapades al Delta de l'Ebre",
		label: "Delta de l'Ebre",
	},
	{
		slug: "escapades-maresme",
		title: "Escapades al Maresme",
		label: "Maresme",
	},
	{
		slug: "escapades-andorra",
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
		label: "Experiències",
		title: "Experiències originals per fer en parella a Catalunya",
	},
	{
		href: "/allotjaments",
		label: "Allotjaments",
		title: "Allotjaments amb encant a Catalunya",
	},
	{
		href: "/destinacions",
		label: "Destinacions",
		title: "Destinacions per a escapades en parella",
	},
	{
		href: "/llistes",
		label: "Llistes",
		title: "Llistes d'idees per a escapades en parella",
	},
	{
		href: "/histories",
		label: "Històries",
		title: "Històries d'escapades viscudes en parella",
	},
	{
		href: "/viatges",
		label: "Viatges",
		title: "Viatges en parella arreu del món",
	},
	{
		href: "/descomptes-viatjar",
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
const categoryGroupFor = (slug) => {
	if (STAY_CATEGORIES.some((category) => category.slug === slug)) {
		return {
			heading: "Altres tipus d'allotjament",
			items: STAY_CATEGORIES,
		};
	}
	return { heading: "Altres tipus d'escapada", items: GETAWAY_CATEGORIES };
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
	taxonomyLinksHtml,
};
