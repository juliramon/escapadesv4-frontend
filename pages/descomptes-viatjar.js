import { useContext } from "react";
import Footer from "../components/global/Footer";
import NavigationBar from "../components/global/NavigationBar";
import GlobalMetas from "../components/head/GlobalMetas";
import BreadcrumbRichSnippet from "../components/richsnippets/BreadcrumbRichSnippet";
import UserContext from "../contexts/UserContext";

const PoliticaPrivadesa = () => {
	const { user } = useContext(UserContext);
	return (
		<>
			{/* Browser metas  */}
			<GlobalMetas
				title="Descomptes per viatjar"
				description="Descomptes per viatjar i escapar-vos. Codis de descompte i ofertes per viatjar. Fes clic per saber-ne més."
				url="https://escapadesenparella.cat/politica-privadesa"
				image="https://res.cloudinary.com/juligoodie/image/upload/v1632416196/getaways-guru/zpdiudqa0bk8sc3wfyue.jpg"
				canonical="https://escapadesenparella.cat/politica-privadesa"
			/>
			{/* Rich snippets */}
			<BreadcrumbRichSnippet
				page1Title="Inici"
				page1Url="https://escapadesenparella.cat"
				page2Title="Descomptes per viatjar"
				page2Url={`https://escapadesenparella.cat/politica-privadesa`}
			/>
			<NavigationBar
				logo_url={
					"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
				}
				user={user}
			/>
			<main className="legal-terms py-12 w-full xl:w-8/12 mx-auto">
				<div>
					<div className="container">
						<ul className="breadcrumb">
							<li className="breadcrumb__item">
								<a
									href="/"
									title="Inici"
									className="breadcrumb__link"
								>
									Inici
								</a>
							</li>
							<li className="breadcrumb__item">
								<span className="breadcrumb__link active">
									Descomptes per viatjar
								</span>
							</li>
						</ul>
					</div>
				</div>
				<div className="container">
					<div className="flex flex-wrap items-start">
						<aside className="w-full md:w-1/4 relative md:sticky md:top-36 pr-12 mt-8">
							<ul className="list-none m-0 p-0">
								<li className="pb-4 m-0 text-xs text-primary-300 uppercase tracking-wider">Dreceres</li>
								<li className="pb-2 m-0">
									<a
										href="#booking"
										title="Booking"
										rel="nofollow"
									>
										Booking
									</a>
								</li>
								<li className="pb-2 m-0">
									<a
										href="#centraldereservas"
										title="Centraldereservas"
										rel="nofollow"
									>
										Centraldereservas
									</a>
								</li>
								<li className="pb-2 m-0">
									<a
										href="#iatiseguros"
										title="IATI Seguros"
										rel="nofollow"
									>
										IATI Seguros
									</a>
								</li>
								<li className="pb-2 m-0">
									<a
										href="#civitatis"
										title="Civitatis"
										rel="nofollow"
									>
										Civitatis
									</a>
								</li>
								<li className="pb-2 m-0">
									<a
										href="#visitBarcelona"
										title="Visit Barcelona"
										rel="nofollow"
									>
										Visit Barcelona
									</a>
								</li>
							</ul>
						</aside>
						<article className="w-full md:w-3/4">
							<section className="legal-terms-title-area">
								<h1>Descomptes per viatjar</h1>
								<div className="legal-terms-sub-h1">
									<p className="mt-1 text-sm text-primary-300">
										Darrera actualització el 03/01/2024
									</p>
								</div>
							</section>
							<section className="legal-terms__block">
								<p>
									Abans de realitzar una escapada o viatge és indispensable organitzar tots els detalls d'aquest, ja sigui el transport, l'allotjament o les activitats que realitzarem al llarg de l'escapada, i això implica saber de quin pressupost disposem, el qual intentarem rebaixar al màxim possible per gaudir de tot el que volem fer. Per aquest motiu, sempre que planifiquem un viatge busquem la manera d'estalviar-nos uns diners utilitzant <strong>codis de descompte</strong> o <strong>ofertes per viatjar</strong>. En aquesta pàgina, us hem llistat els <strong>descomptes per viatjar</strong> que més utilitzem.
								</p>
								<p>Volem mencionar-vos que els enllaços a continuació formen part de programes d'afiliats, pels quals si feu uns reserva a través d'ells, rebrem una petita comissió, igual que vosaltres rebreu un descompte o benefici exclusiu. Això ens ajuda a cobrir els costos de manteniment del projecte Escapadesenparella.cat i a continuar generant contingut que creiem de valor. Per endavant, gràcies per utilitzar aquests enllaços!</p>
							</section>
							<section className="legal-terms__block">
								<h2 className="mb-4">Descomptes per reservar allotjament</h2>
								<span className="anchor" id="booking"></span>
								<h3 className="mb-3">Codi descompte Booking</h3>
								<p>El nostre preferit a l'hora de reservar allotjaments allà on anem, ja sigui a Catalunya o a l'estranger. Booking ens ofereix una de les ofertes d'allotjaments turístics, apartaments i hotels més extensa del mercat, on podrem filtrar per aquelles característiques d'allotjaments que desitgem, com és ara llar de foc, jacuzzi, jardí, etc.</p>
								<p>A més a més, si us registreu a la plataforma, gràcies al programa Genius de Booking, a mesura que aneu fent reserves el mateix Booking us obsequiarà amb beneficis extra, com és ara descomptes d'entre el 10% i el 15%, esmorzars gratuïts, o fins i tot la possibilitat de millorar la categoria d'habitació si us escapeu a un hotel.</p>
								<a href="https://www.booking.com/index.html?aid=1632622" title="Descomptes per viatjar amb Booking" target="_blank" rel="nofollow noreferrer" className="button button__lg button__primary">Reservar allotjaments amb Booking</a>

								<span className="anchor" id="centraldereservas"></span>
								<h3 className="mb-3 mt-7">Codi descompte Centraldereservas</h3>
								<p>Centraldereservas és l'altra portal de reserves que utilitzem a l'hora d'allotjar-nos. Centraldereservas porta més de 20 anys al mercat oferint els preus més competitius i milers d'opinions reals d'usuaris satisfets. Reservant el vostre allotjament amb Centraldereservas aconseguireu els millors preus, un servei d'atenció 24 hores multidioma, gestions automàtiques online, flexibilitat de cancel·lació i pagament, i el més destacat, acumular saldo a la vostra Cartera amb cada reserva que feu.</p>
								<a href="https://www.visitas.centraldereservas.com/colaboradores/click.php?i=8417&u=https%3A%2F%2Fwww.centraldereservas.com" title="Descomptes per viatjar amb Centraldereservas" target="_blank" rel="nofollow noreferrer" className="button button__lg button__primary">Reservar allotjaments amb Centraldereservas</a>
							</section>
							<section className="legal-terms__block mt-6">
								<h2 className="mb-4">Descomptes per assegurances de viatges</h2>
								<span className="anchor" id="iatiseguros"></span>
								<h3 className="mb-3">Codi descompte IATI Seguros</h3>
								<p>La nostra opció de confiança quan es tracta de viatjar. IATI Seguros compta amb més de 100 anys d'història oferint assegurances de viatge, i una gran oferta d'assegurances que de segur s'adaptarà a les vostres necessitats. Nosaltres vam confiar en ells per cobrir el nostre viatge de noces, i vam quedar encantats.</p>
								<p>Fent servir l'enllaç que trobareu a continuació us beneficiareu d'un <strong>descompte del 5%</strong> sobre l'import total de la vostra assegurança de viatge.</p>
								<a href="https://www.iatiseguros.com/?r=27071736087599" title="Descomptes per IATI Seguros" target="_blank" rel="nofollow noreferrer" className="button button__lg button__primary">Reservar assegurança amb IATI Seguros</a>
							</section>
							<section className="legal-terms__block mt-6">
								<h2 className="mb-4">Descomptes per reservar activitats</h2>
								<span className="anchor" id="civitatis"></span>
								<h3 className="mb-3">Els preus més econòmics amb Civitatis</h3>
								<p>Quan visitem per primer cop una ciutat, ja sigui a Catalunya o a l'estranger, normalment la descobrim per lliure, però també hi ha cops que tenim ganes de recorre-la acompanyats d'un guia o d'una persona amb coneixements sobre allò que estem veient. Per aquest motiu, Civitatis és la nostra millor opció a l'hora de servar activitats, visites guiades o free tours.</p>
								<a href="https://www.civitatis.com/es?aid=103875" title="Descomptes per Civitatis" target="_blank" rel="nofollow noreferrer" className="button button__lg button__primary">Reservar activitats amb Civitatis</a>
								<span className="anchor" id="visitBarcelona"></span>
								<h3 className="mb-3 mt-7">Descobrir Barcelona amb Visit Barcelona</h3>
								<p>Hi ha dies en què ens hem d'arribar fins a Barcelona per fer-hi alguna gestió, o simplement ens ve de gust anar-hi per fer-hi una volta. En aquests dies, confiem amb visit Barcelona per buscar fàcilment activitats i propostes per gaudir de la ciutat d'una manera diferent i a un <strong>preu econòmic</strong>. Podeu fer servir l'enllaç a continuació per navegar entre els centenars d'ofertes lúdiques que presenten.</p>
								<a href="https://bcnshop.barcelonaturisme.com/shopv3/ca/?o=h&w=20869-2016" title="Descomptes per viatjar amb Centraldereservas" target="_blank" rel="nofollow noreferrer" className="button button__lg button__primary">Reservar activitats amb visit Barcelona</a>
							</section>
						</article>
					</div>
				</div>
			</main>
			<Footer
				logo_url={
					"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
				}
			/>
		</>
	);
};

export default PoliticaPrivadesa;
