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
	"nav.searchPlaceholder": {
		ca: "On voleu anar? Cerca una experiència, un allotjament o una zona",
		es: "¿Adónde queréis ir? Busca una experiencia, un alojamiento o una zona",
	},
	"nav.discountsShort": { ca: "Descomptes", es: "Descuentos" },
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

	// Pàgina no trobada
	"404.title": { ca: "Pàgina no trobada", es: "Página no encontrada" },
	"404.metaDescription": {
		ca: "Ho sentim, la pàgina que busques no s'ha trobat. Torna-ho a intentar de nou.",
		es: "Lo sentimos, la página que buscas no se ha encontrado. Vuelve a intentarlo.",
	},
	"404.text1": {
		ca: "La pàgina sol·licitada no està disponible, o potser ha canviat de direcció, disculpa les molèsties.",
		es: "La página solicitada no está disponible, o quizá ha cambiado de dirección. Disculpa las molestias.",
	},
	"404.text2": {
		ca: "Amb freqüència és degut a un error a l'escriure la direcció de la pàgina que estàs intentant accedir. Comprova-ho de nou a veure si és correcte.",
		es: "A menudo se debe a un error al escribir la dirección de la página a la que intentas acceder. Compruébalo de nuevo, por si acaso.",
	},

	// Cercador
	"search.results": { ca: "Resultats de cerca", es: "Resultados de búsqueda" },
	"search.tryAnother": {
		ca: "Proveu amb un altre terme, o entreu per aquí:",
		es: "Probad con otro término, o entrad por aquí:",
	},
	"search.byGetawayType": {
		ca: "Per tipus d'escapada",
		es: "Por tipo de escapada",
	},
	"search.byStayType": {
		ca: "Per tipus d'allotjament",
		es: "Por tipo de alojamiento",
	},
	"search.label": {
		ca: "Cerca experiències i allotjaments",
		es: "Busca experiencias y alojamientos",
	},
	"nav.byCategories": {
		ca: "Escapades per categories",
		es: "Escapadas por categorías",
	},
	"nav.manageMenu": { ca: "Gestionar menú", es: "Gestionar menú" },

	// Targeta de reserva
	"booking.disclaimer": {
		ca: "Preu orientatiu calculat per nosaltres. Pot variar segons les dates i no sempre està actualitzat.",
		es: "Precio orientativo calculado por nosotros. Puede variar según las fechas y no siempre está actualizado.",
	},
	// Peu de pàgina
	"footer.claim": {
		ca: "Escapadesenparella.cat és el recomanador especialista d'escapades en parella a Catalunya.",
		es: "Escapadesenparella.cat es el recomendador especialista en escapadas en pareja en Cataluña.",
	},
	"footer.stays": { ca: "Allotjaments amb encant", es: "Alojamientos con encanto" },
	"footer.experiences": { ca: "Experiències", es: "Experiencias" },
	"footer.stories": { ca: "Històries en parella", es: "Historias en pareja" },
	"footer.lists": { ca: "Llistes d'escapades", es: "Listas de escapadas" },
	"footer.trips": { ca: "Viatges en parella", es: "Viajes en pareja" },
	"footer.destinations": { ca: "Destinacions", es: "Destinos" },
	"footer.byGetawayType": {
		ca: "Per tipus d'escapada",
		es: "Por tipo de escapada",
	},
	"footer.newsletterTitle": {
		ca: "No et perdis cap escapada en parella",
		es: "No te pierdas ninguna escapada en pareja",
	},
	"footer.newsletterText": {
		ca: "A les xarxes hi publiquem les escapades noves, els allotjaments amb encant que trobem i els descomptes per viatjar.",
		es: "En las redes publicamos las escapadas nuevas, los alojamientos con encanto que encontramos y los descuentos para viajar.",
	},

	// Pàgina d'una història
	"story.breadcrumb": { ca: "Històries en parella", es: "Historias en pareja" },
	"story.placesTitle": {
		ca: "Els llocs d'aquesta història",
		es: "Los lugares de esta historia",
	},
	"story.placesText": {
		ca: "Les fitxes amb l'adreça, com arribar-hi i on reservar.",
		es: "Las fichas con la dirección, cómo llegar y dónde reservar.",
	},
	"story.keepReading": { ca: "Segueix llegint", es: "Sigue leyendo" },
	"story.otherStories": {
		ca: "Altres històries en parella",
		es: "Otras historias en pareja",
	},
	"story.otherStoriesText": {
		ca: "Més escapades explicades de primera mà.",
		es: "Más escapadas contadas de primera mano.",
	},
	"story.allStories": {
		ca: "Veure totes les històries",
		es: "Ver todas las historias",
	},

	// Pàgina d'una llista
	"list.breadcrumb": { ca: "Llistes", es: "Listas" },
	"list.moreIdeas": { ca: "Més idees", es: "Más ideas" },
	"list.otherLists": {
		ca: "Altres llistes d'escapades",
		es: "Otras listas de escapadas",
	},
	"list.otherListsText": {
		ca: "Seleccions temàtiques per decidir on anar.",
		es: "Selecciones temáticas para decidir adónde ir.",
	},
	"list.allLists": {
		ca: "Veure totes les llistes",
		es: "Ver todas las listas",
	},

	// Mapa i llistats
	"map.see": { ca: "Veure mapa", es: "Ver mapa" },
	"map.close": { ca: "Tancar mapa", es: "Cerrar mapa" },

	// Fitxa
	"listing.whyTitle": {
		ca: "Per què realitzar aquesta activitat?",
		es: "¿Por qué hacer esta actividad?",
	},
	"listing.whyText": {
		ca: "Us compartim 5 raons per les quals hauríeu de fer aquesta escapada:",
		es: "Os compartimos 5 razones por las que deberíais hacer esta escapada:",
	},
	"listing.experiences": { ca: "Experiències", es: "Experiencias" },
	"listing.stays": { ca: "Allotjaments", es: "Alojamientos" },
	// Capçalera de la portada
	"hero.discountsRibbon": {
		ca: "Estalvia amb els descomptes per viatjar",
		es: "Ahorra con los descuentos para viajar",
	},
	"hero.title": {
		ca: "La vostra propera escapada en parella comença aquí",
		es: "Vuestra próxima escapada en pareja empieza aquí",
	},
	"hero.subtitle": {
		ca: "Experiències i allotjaments amb encant a Catalunya, visitats i verificats per nosaltres.",
		es: "Experiencias y alojamientos con encanto en Cataluña, visitados y verificados por nosotros.",
	},
	"hero.searchLabel": {
		ca: "Cerca experiències, allotjaments o destinacions",
		es: "Busca experiencias, alojamientos o destinos",
	},
	"hero.searchPlaceholder": {
		ca: "On voleu anar?",
		es: "¿Adónde queréis ir?",
	},
	"hero.searchButton": { ca: "Cercar", es: "Buscar" },
	"hero.experiences": { ca: "experiències", es: "experiencias" },
	"hero.stays": {
		ca: "allotjaments amb encant",
		es: "alojamientos con encanto",
	},
	"hero.verified": {
		ca: "Visitats i verificats per nosaltres",
		es: "Visitados y verificados por nosotros",
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
		ca: "Preguntes freqüents",
		es: "Preguntas frecuentes",
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
