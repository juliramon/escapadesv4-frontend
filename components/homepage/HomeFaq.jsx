import { useRouter } from "next/router";
import JsonLd from "../richsnippets/JsonLd";
import { useT } from "../../i18n/strings";

/**
 * Preguntes freqüents de la portada.
 *
 * Són les que ens fa tothom abans de decidir-se —quant costa, quan anar-hi,
 * si hi poden portar el gos— i es responen amb el que diu el catàleg, no amb
 * generalitats. Van visibles a la pàgina i, a més, amb marcatge `FAQPage`:
 * Google només ensenya aquest format quan la resposta també es pot llegir.
 *
 * El `FAQPage` es marca en l'idioma de la pàgina: enviar-li a Google unes
 * preguntes en català dins d'una pàgina castellana és demanar que no l'ensenyi.
 */
const FAQ = [
	{
		question: "Quant costa una escapada en parella a Catalunya?",
		answer:
			"Als allotjaments que recomanem, el preu mitjà ronda els 80 € per persona i nit, amb cases rurals que arrenquen als 15 € i hotels de luxe que passen dels 400. De les experiències, més de la meitat són gratuïtes —rutes, miradors, pobles— i la resta tenen un preu mitjà d'uns 20 €.",
	},
	{
		question: "Quina és la millor època per a una escapada en parella?",
		answer:
			"La primavera i la tardor: hi ha menys gent, els allotjaments són més barats i els camins es caminen bé. L'estiu és per a les cales i per als allotjaments amb piscina, i l'hivern, per a la neu i les cases amb llar de foc. Als caps de setmana llargs convé reservar amb setmanes d'antelació.",
	},
	{
		question: "Quantes nits fa falta?",
		answer:
			"Amb una nit ja en teniu prou si no voleu conduir més d'una hora i mitja: arribar a l'hora de dinar, una activitat a la tarda, sopar i tornar l'endemà després d'esmorzar. Per als Pirineus o les Terres de l'Ebre val més comptar-hi dues nits, perquè el viatge se'n menja una part.",
	},
	{
		question: "Hi ha allotjaments només per a adults o que admetin gossos?",
		answer:
			"Sí. Al web hi ha una vintena llarga d'allotjaments adults only, pensats per a una escapada tranquil·la, i una desena que admeten mascotes. A cada fitxa hi ha els serveis de l'establiment, i els filtres del llistat d'allotjaments permeten buscar-los.",
	},
	{
		question: "Com trieu els llocs que recomaneu?",
		answer:
			"Hi anem. Des del 2015 visitem els llocs que surten al web, i les fitxes marcades com a verificades són les que hem trepitjat nosaltres; a les històries expliquem com va anar cada escapada, amb les nostres fotos i el que no va sortir bé.",
	},
];

const FAQ_ES = [
	{
		question: "¿Cuánto cuesta una escapada en pareja en Cataluña?",
		answer:
			"En los alojamientos que recomendamos, el precio medio ronda los 80 € por persona y noche, con casas rurales que arrancan en los 15 € y hoteles de lujo que pasan de los 400. De las experiencias, más de la mitad son gratuitas —rutas, miradores, pueblos— y el resto tienen un precio medio de unos 20 €.",
	},
	{
		question: "¿Cuál es la mejor época para una escapada en pareja?",
		answer:
			"La primavera y el otoño: hay menos gente, los alojamientos son más baratos y los caminos se andan bien. El verano es para las calas y los alojamientos con piscina, y el invierno, para la nieve y las casas con chimenea. En los fines de semana largos conviene reservar con semanas de antelación.",
	},
	{
		question: "¿Cuántas noches hacen falta?",
		answer:
			"Con una noche basta si no queréis conducir más de hora y media: llegar a la hora de comer, una actividad por la tarde, cenar y volver al día siguiente después de desayunar. Para los Pirineos o las Tierras del Ebro vale más contar con dos noches, porque el viaje se come una parte.",
	},
	{
		question: "¿Hay alojamientos solo para adultos o que admitan perros?",
		answer:
			"Sí. En la web hay una veintena larga de alojamientos adults only, pensados para una escapada tranquila, y una decena que admiten mascotas. En cada ficha están los servicios del establecimiento, y los filtros del listado de alojamientos permiten buscarlos.",
	},
	{
		question: "¿Cómo elegís los sitios que recomendáis?",
		answer:
			"Vamos. Desde 2015 visitamos los sitios que salen en la web, y las fichas marcadas como verificadas son las que hemos pisado nosotros; en las historias contamos cómo fue cada escapada, con nuestras fotos y lo que no salió bien.",
	},
];

const HomeFaq = () => {
	const { locale } = useRouter();
	const t = useT();
	const items = locale === "es" ? FAQ_ES : FAQ;

	return (
		<>
			<JsonLd
				data={{
					"@context": "https://schema.org",
					"@type": "FAQPage",
					inLanguage: locale === "es" ? "es-ES" : "ca-ES",
					mainEntity: items.map(({ question, answer }) => ({
						"@type": "Question",
						name: question,
						acceptedAnswer: { "@type": "Answer", text: answer },
					})),
				}}
			/>
			<section className="home-faq">
				<div className="container">
					<div className="home-faq__inner">
						<h2 className="home-faq__title">{t("home.faqTitle")}</h2>
						<dl className="home-faq__list">
							{items.map(({ question, answer }) => (
								<div className="home-faq__item" key={question}>
									<dt className="home-faq__question">{question}</dt>
									<dd className="home-faq__answer">{answer}</dd>
								</div>
							))}
						</dl>
					</div>
				</div>
			</section>
		</>
	);
};

export { FAQ, FAQ_ES };
export default HomeFaq;
