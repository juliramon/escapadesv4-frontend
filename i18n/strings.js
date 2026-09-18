import { useRouter } from "next/router";
import { DEFAULT_LOCALE } from "../utils/i18n";

/**
 * Els textos del web que no venen de la base de dades.
 *
 * El contingut —fitxes, històries, categories— es tradueix al seu document,
 * al camp `translations`. Aquí només hi ha el que està escrit al codi: els
 * botons, els encapçalaments dels blocs i les quatre frases de la portada.
 *
 * Una sola clau per frase i totes les llengües juntes: així es veu d'un cop
 * d'ull què falta per traduir, que és el que passa de seguida quan cada idioma
 * viu en un fitxer separat.
 */
const STRINGS = {
	// Navegació i peu
	"nav.search": { ca: "Buscar", es: "Buscar" },
	"nav.searchOpen": {
		ca: "Obrir panell de cerca",
		es: "Abrir panel de búsqueda",
	},
	"nav.menuOpen": { ca: "Botó obrir menú", es: "Botón abrir menú" },
	"nav.menuClose": { ca: "Botó tancar menu", es: "Botón cerrar menú" },
	"nav.home": { ca: "Inici", es: "Inicio" },
	"nav.discounts": {
		ca: "Descomptes per viatjar",
		es: "Descuentos para viajar",
	},
	"nav.language": { ca: "Idioma", es: "Idioma" },
	"nav.byGetawayType": {
		ca: "Per tipus d'escapada",
		es: "Por tipo de escapada",
	},
	"nav.byStayType": {
		ca: "Per tipus d'allotjament",
		es: "Por tipo de alojamiento",
	},
	"nav.zones": { ca: "Zones per descobrir", es: "Zonas por descubrir" },
	"nav.allExperiences": {
		ca: "Veure totes les experiències",
		es: "Ver todas las experiencias",
	},
	"nav.allStays": {
		ca: "Veure tots els allotjaments",
		es: "Ver todos los alojamientos",
	},
	"nav.allDestinations": {
		ca: "Veure totes les destinacions",
		es: "Ver todos los destinos",
	},
	"footer.terms": { ca: "Condicions d'ús", es: "Condiciones de uso" },
	"footer.privacy": {
		ca: "Política de privadesa",
		es: "Política de privacidad",
	},
	"footer.cookies": { ca: "Política de cookies", es: "Política de cookies" },
	"footer.contact": { ca: "Contacte", es: "Contacto" },

	// Blocs de contingut relacionat
	"related.nearby": { ca: "A prop d'aquí", es: "Cerca de aquí" },
	"related.destination": {
		ca: "Més coses per fer-hi",
		es: "Más cosas que hacer",
	},
	"related.category": { ca: "Del mateix estil", es: "Del mismo estilo" },
	"related.placesInStory": {
		ca: "Els llocs d'aquesta història",
		es: "Los lugares de esta historia",
	},
	"related.readMore": { ca: "Seguir llegint", es: "Seguir leyendo" },

	// Fitxa
	"listing.priceFrom": { ca: "Des de", es: "Desde" },
	"listing.perPersonNight": {
		ca: "per persona i nit",
		es: "por persona y noche",
	},
	"listing.perPerson": { ca: "per persona", es: "por persona" },
	"listing.verified": { ca: "Verificada", es: "Verificada" },
	"listing.howToGet": { ca: "Com arribar-hi", es: "Cómo llegar" },
	"listing.ourStory": {
		ca: "La nostra escapada",
		es: "Nuestra escapada",
	},

	// Llistats
	"listings.noResults": {
		ca: "No hi ha res que hi encaixi.",
		es: "No hay nada que encaje.",
	},
	"listings.loadMore": { ca: "Veure'n més", es: "Ver más" },

	// Llistat d'una categoria
	"category.weSuggest": {
		ca: "Us proposem",
		es: "Te proponemos",
	},
	"category.inCatalonia": { ca: "a Catalunya", es: "en Cataluña" },
	"category.empty": {
		ca: "No s'han trobat escapades per aquesta categoria.",
		es: "No hemos encontrado escapadas en esta categoría.",
	},
	"category.tryLater": {
		ca: "Torna-ho a provar més endavant.",
		es: "Vuelve a probarlo más adelante.",
	},

	// Portada
	"home.faqTitle": {
		ca: "Dubtes abans de decidir-vos",
		es: "Dudas antes de decidiros",
	},
};

/**
 * Text d'una clau en l'idioma demanat.
 *
 * Si falta la traducció torna el català, igual que fa el contingut: val més
 * una paraula en l'altra llengua que un buit o el nom de la clau.
 */
const text = (key, locale) => {
	const entry = STRINGS[key];
	if (!entry) return key;
	return entry[locale] || entry[DEFAULT_LOCALE] || key;
};

/**
 * Dins d'un component: `const t = useT();` i després `t("nav.search")`.
 * L'idioma surt de la ruta, que és qui mana (`/es/...`).
 */
const useT = () => {
	const { locale } = useRouter();
	return (key) => text(key, locale);
};

export { STRINGS, text, useT };
