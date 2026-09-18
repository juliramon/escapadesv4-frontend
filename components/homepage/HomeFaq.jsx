import JsonLd from "../richsnippets/JsonLd";

/**
 * Preguntes freqüents de la portada.
 *
 * Són les que ens fa tothom abans de decidir-se —quant costa, quan anar-hi,
 * si hi poden portar el gos— i es responen amb el que diu el catàleg, no amb
 * generalitats. Es plegen en un acordió de `<details>`, o sigui que les
 * respostes són al DOM encara que no es vegin; el marcatge `FAQPage` que
 * les acompanya segueix sent vàlid i la portada no s'allarga cinc pantalles.
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

const HomeFaq = () => (
	<>
		<JsonLd
			data={{
				"@context": "https://schema.org",
				"@type": "FAQPage",
				mainEntity: FAQ.map(({ question, answer }) => ({
					"@type": "Question",
					name: question,
					acceptedAnswer: { "@type": "Answer", text: answer },
				})),
			}}
		/>
		<section className="home-faq">
			<div className="container">
				<div className="home-faq__inner">
					<h2 className="home-faq__title">Preguntes freqüents</h2>
					<div className="home-faq__list">
						{FAQ.map(({ question, answer }) => (
							<details className="home-faq__item" key={question}>
								<summary className="home-faq__question">
									<span>{question}</span>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width={20}
										height={20}
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth={2}
										strokeLinecap="round"
										strokeLinejoin="round"
										className="home-faq__icon"
										aria-hidden="true"
									>
										<path
											stroke="none"
											d="M0 0h24v24H0z"
											fill="none"
										/>
										<path d="M6 9l6 6l6 -6" />
									</svg>
								</summary>
								<p className="home-faq__answer">{answer}</p>
							</details>
						))}
					</div>
				</div>
			</div>
		</section>
	</>
);

export { FAQ };
export default HomeFaq;
