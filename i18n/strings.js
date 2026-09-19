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

	// Llistat d'una destinació
	"destination.breadcrumb": { ca: "Destinacions", es: "Destinos" },
	"destination.others": {
		ca: "Altres destinacions",
		es: "Otros destinos",
	},

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
	"home.start": { ca: "Per on comencem?", es: "¿Por dónde empezamos?" },
	"home.byPlan": {
		ca: "Escapades per tipus de pla",
		es: "Escapadas por tipo de plan",
	},
	"home.byPlanText": {
		ca: "Trieu el pla i us ensenyem les experiències i els allotjaments que hi encaixen.",
		es: "Elegid el plan y os enseñamos las experiencias y los alojamientos que encajan.",
	},
	"home.whereSleep": { ca: "On voleu dormir?", es: "¿Dónde queréis dormir?" },
	"home.allStays": {
		ca: "Veure tots els allotjaments",
		es: "Ver todos los alojamientos",
	},
	"home.staysTitle": {
		ca: "Allotjaments amb encant per a dos",
		es: "Alojamientos con encanto para dos",
	},
	"home.experiencesTitle": {
		ca: "Experiències per fer en parella",
		es: "Experiencias para hacer en pareja",
	},
	"home.destinations": { ca: "Destinacions", es: "Destinos" },
	"home.byZone": {
		ca: "Escapades per Catalunya, zona a zona",
		es: "Escapadas por Cataluña, zona a zona",
	},
	"home.byZoneText": {
		ca: "Trieu una zona i us hi ensenyem on dormir, què fer i què val la pena veure.",
		es: "Elegid una zona y os enseñamos dónde dormir, qué hacer y qué vale la pena ver.",
	},
	"home.allDestinations": {
		ca: "Veure totes les destinacions",
		es: "Ver todos los destinos",
	},
	"home.everything": {
		ca: "Tot el que hi trobareu",
		es: "Todo lo que encontraréis",
	},
	"home.sixWays": {
		ca: "Sis maneres de preparar la propera escapada",
		es: "Seis maneras de preparar la próxima escapada",
	},
	"home.stories": { ca: "Històries", es: "Historias" },
	"home.storiesTitle": {
		ca: "Escapades que hem fet nosaltres",
		es: "Escapadas que hemos hecho nosotros",
	},
	"home.storiesText": {
		ca: "Les explicem de primera mà, amb el que va funcionar i el que no.",
		es: "Las contamos de primera mano, con lo que funcionó y lo que no.",
	},
	"home.allStories": {
		ca: "Veure totes les històries",
		es: "Ver todas las historias",
	},
	"home.lists": { ca: "Llistes", es: "Listas" },
	"home.listsTitle": {
		ca: "Idees ja triades, per decidir ràpid",
		es: "Ideas ya elegidas, para decidir rápido",
	},
	"home.listsText": {
		ca: "Seleccions temàtiques per quan sabeu que voleu sortir però no on.",
		es: "Selecciones temáticas para cuando sabéis que queréis salir pero no adónde.",
	},
	"home.allLists": {
		ca: "Veure totes les llistes",
		es: "Ver todas las listas",
	},
	"home.experiences": { ca: "Experiències", es: "Experiencias" },
	"home.stays": { ca: "Allotjaments", es: "Alojamientos" },
	"home.allExperiences": {
		ca: "Veure totes les experiències",
		es: "Ver todas las experiencias",
	},
	"home.metaTitle": {
		ca: "Escapades en parella: experiències i allotjaments memorables",
		es: "Escapadas en pareja: experiencias y alojamientos memorables",
	},
	"home.metaDescription": {
		ca: "Descobreix centenars d’escapades en parella verificades: cabanes als arbres, hotels amb encant i experiències. Amb preus i fotos nostres.",
		es: "Cientos de escapadas en pareja por Cataluña: cabañas en los árboles, hoteles con encanto y experiencias. Con precios y fotos nuestras.",
	},
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
