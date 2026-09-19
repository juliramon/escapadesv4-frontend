import { useRouter } from "next/router";
import ListingsTextareaFooter from "../listings/ListingsTextareaFooter";

/**
 * El text de la portada.
 *
 * La portada era un directori de targetes: 1.400 paraules comptades, però de
 * prosa només quatre frases. Per a la cerca que ens interessa —«escapades en
 * parella»— això és poc: les pàgines que hi surten al davant són articles amb
 * text. Aquí s'explica què és una escapada en parella i com triar-la, i de
 * pas s'enllacen les categories i les destinacions que responen cada intenció.
 *
 * Viu al codi i no a la base de dades perquè la portada no té cap camp de
 * text propi al panell; el dia que en tingui, això es podrà moure allà.
 *
 * La versió castellana no és una traducció literal: els enllaços apunten als
 * slugs castellans i el text fa servir els termes que la gent busca de debò
 * en castellà, que és tot el sentit de tenir-la.
 */
const HOME_SEO_TEXT = `
<h2>Escapades en parella a Catalunya: com triar la vostra</h2>
<p>Una escapada en parella és un parèntesi curt —una nit, dues— en un lloc on el temps passi d'una altra manera. A Catalunya en podeu fer durant tot l'any sense conduir gaire: en dues hores es passa de les cales de la <a href="/destinacions/escapades-costa-brava">Costa Brava</a> als cims dels <a href="/destinacions/escapades-pirineus">Pirineus</a>, i pel mig hi ha pobles de pedra, masies reconvertides i taules on val la pena seure sense mirar el rellotge.</p>
<h3>Segons el pla que tingueu al cap</h3>
<p>Si el que voleu és no fer res, mireu les <a href="/escapades-de-relax">escapades de relax</a> i els <a href="/hotels-amb-encant">hotels amb encant</a>. Si sou de caminar, les <a href="/escapades-aventura">escapades d'aventura</a> i les <a href="/rutes-i-excursions">rutes i excursions</a>. Si el viatge gira al voltant de la taula, les <a href="/escapades-gastronomiques">gastronòmiques</a>. I si busqueu la nit especial, un aniversari o una sorpresa, les <a href="/escapades-romantiques">escapades romàntiques</a>, amb <a href="/cabanyes-als-arbres">cabanes als arbres</a>, <a href="/apartaments-per-a-parelles">apartaments per a dos</a> i <a href="/cases-rurals">cases rurals</a>.</p>
<h3>Segons on vulgueu anar</h3>
<p>Tenim el país repartit en catorze <a href="/destinacions">destinacions</a>, amb les fitxes de cada zona: del <a href="/destinacions/escapades-montseny">Montseny</a> i <a href="/destinacions/escapades-osona">Osona</a>, a tocar de casa, a les <a href="/destinacions/escapades-delta-de-lebre">Terres de l'Ebre</a>, la <a href="/destinacions/escapades-garrotxa">Garrotxa</a> o el <a href="/destinacions/escapades-bergueda">Berguedà</a>. Si sortiu de Barcelona i teniu poques hores, el <a href="/destinacions/escapades-maresme">Maresme</a> i el <a href="/destinacions/escapades-penedes">Penedès</a> es fan en un matí.</p>
<h3>Segons l'època</h3>
<p>La primavera i la tardor són les millors èpoques per a gairebé tot: hi ha menys gent, els preus baixen i els camins es caminen bé. L'estiu és per a les cales i per als allotjaments amb piscina; l'hivern, per a la neu, les <a href="/escapades-hivern">escapades d'hivern</a> i les cases amb llar de foc. I els caps de setmana llargs són la temporada alta de veritat: reserveu amb temps.</p>
<h3>Què hi trobareu aquí</h3>
<p>Des del 2015 recorrem Catalunya buscant llocs per a dos. Cada fitxa d'<a href="/allotjaments">allotjament</a> i d'<a href="/activitats">experiència</a> porta el preu, com arribar-hi i què hi ha a prop, i les <a href="/histories">històries</a> expliquen com va anar cada escapada, amb les nostres fotos. Si voleu anar directament al gra, a les <a href="/llistes">llistes</a> hi ha les idees ja triades per temporada i per tema.</p>
`;

const HOME_SEO_TEXT_ES = `
<h2>Escapadas en pareja por Cataluña: cómo elegir la vuestra</h2>
<p>Una escapada en pareja es un paréntesis corto —una noche, dos— en un sitio donde el tiempo pase de otra manera. En Cataluña se pueden hacer todo el año sin conducir mucho: en dos horas se pasa de las calas de la <a href="/es/destinos/escapadas-costa-brava">Costa Brava</a> a las cimas de los <a href="/es/destinos/escapadas-pirineos">Pirineos</a>, y por el medio hay pueblos de piedra, masías reconvertidas y mesas donde vale la pena sentarse sin mirar el reloj.</p>
<h3>Según el plan que tengáis en la cabeza</h3>
<p>Si lo que queréis es no hacer nada, mirad las <a href="/es/escapadas-relax">escapadas de relax</a> y los <a href="/es/hoteles-con-encanto">hoteles con encanto</a>. Si sois de caminar, las <a href="/es/escapadas-aventura">escapadas de aventura</a> y las <a href="/es/rutas-y-excursiones">rutas y excursiones</a>. Si el viaje gira alrededor de la mesa, las <a href="/es/escapadas-gastronomicas">gastronómicas</a>. Y si buscáis la noche especial, un aniversario o una sorpresa, las <a href="/es/escapadas-romanticas">escapadas románticas</a>, con <a href="/es/cabanas-cataluna">cabañas en los árboles</a>, <a href="/es/apartamentos-para-parejas">apartamentos para dos</a> y <a href="/es/casas-rurales">casas rurales</a>.</p>
<h3>Según adónde queráis ir</h3>
<p>Tenemos el país repartido en catorce <a href="/es/destinos">destinos</a>, con las fichas de cada zona: del <a href="/es/destinos/escapadas-montseny">Montseny</a> y <a href="/es/destinos/escapadas-osona">Osona</a>, a un paso de casa, a las <a href="/es/destinos/escapadas-tierras-del-ebro">Tierras del Ebro</a>, la <a href="/es/destinos/escapadas-garrotxa">Garrotxa</a> o el <a href="/es/destinos/escapadas-bergueda">Berguedà</a>. Si salís de Barcelona y tenéis pocas horas, el <a href="/es/destinos/escapadas-maresme">Maresme</a> y el <a href="/es/destinos/escapadas-penedes">Penedès</a> se hacen en una mañana.</p>
<h3>Según la época</h3>
<p>La primavera y el otoño son las mejores épocas para casi todo: hay menos gente, los precios bajan y los caminos se andan bien. El verano es para las calas y para los alojamientos con piscina; el invierno, para la nieve, las <a href="/es/escapadas-invierno">escapadas de invierno</a> y las casas con chimenea. Y los fines de semana largos son la temporada alta de verdad: reservad con tiempo.</p>
<h3>Qué encontraréis aquí</h3>
<p>Desde 2015 recorremos Cataluña buscando sitios para dos. Cada ficha de <a href="/es/alojamientos">alojamiento</a> y de <a href="/es/actividades">experiencia</a> lleva el precio, cómo llegar y qué hay cerca, y las <a href="/es/historias">historias</a> cuentan cómo fue cada escapada, con nuestras fotos. Si queréis ir directamente al grano, en las <a href="/es/listas">listas</a> están las ideas ya elegidas por temporada y por tema.</p>
`;

const HomeSeoText = () => {
	const { locale } = useRouter();
	return (
		<ListingsTextareaFooter
			textareaFooter={locale === "es" ? HOME_SEO_TEXT_ES : HOME_SEO_TEXT}
			collapsible
		/>
	);
};

export { HOME_SEO_TEXT, HOME_SEO_TEXT_ES };
export default HomeSeoText;
