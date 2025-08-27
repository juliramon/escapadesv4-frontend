import NavigationBar from "../components/global/NavigationBar";
import GlobalMetas from "../components/head/GlobalMetas";
import BreadcrumbRichSnippet from "../components/richsnippets/BreadcrumbRichSnippet";
import Footer from "../components/global/Footer";
import { useEffect, useState } from "react";
import ContentService from "../services/contentService";
import FetchingSpinnerInline from "../components/global/FetchingSpinnerInline";

const AboutUs = () => {
	const initialState = {
		totalActivities: 0,
		totalPlaces: 0,
		totalStories: 0,
		isFetching: true,
	};

	const [state, setState] = useState(initialState);
	const service = new ContentService();

	useEffect(() => {
		const fetchData = async () => {
			setState({ ...state, isFetching: true });
			const activities = await service.activities();
			const places = await service.getAllPlaces();
			const stories = await service.getStories();

			setState({
				...state,
				totalActivities: activities.totalItems,
				totalPlaces: places.totalItems,
				totalStories: stories.totalItems,
				isFetching: false,
			});
		};
		fetchData();
	}, []);

	const date = new Date();
	const foundationYears = date.getFullYear() - 2015;

	const brandsPartners = [
		{
			title: "Càmping del Mar",
			img: "../../logos-partners/logo-camping-mar.jpg",
		},
		{
			title: "Brollats",
			img: "../../logos-partners/logo-brollats.jpg",
		},
		{
			title: "Llet Nostra",
			img: "../../logos-partners/logo-llet-nostra.jpg",
		},
		{
			title: "LOHODI",
			img: "../../logos-partners/logo-lohodi.jpg",
		},
		{
			title: "Càmping Pedraforca",
			img: "../../logos-partners/logo-camping-pedraforca.jpg",
		},
		{
			title: "L'Azure Hotel",
			img: "../../logos-partners/logo-azure.jpg",
		},
		{
			title: "Hotel Terradets",
			img: "../../logos-partners/logo-hotel-terradets.jpg",
		},
		{
			title: "Càmpings.cat",
			img: "../../logos-partners/logo-campingscat.jpg",
		},
		{
			title: "Hostal Montserrat",
			img: "../../logos-partners/logo-hostal-montserrat.jpg",
		},
		{
			title: "Hotel Somlom",
			img: "../../logos-partners/logo-somlom.jpg",
		},
		{
			title: "Eco Rail del Cardener",
			img: "../../logos-partners/logo-ecorail.jpg",
		},
		{
			title: "Ajuntament de Llinars",
			img: "../../logos-partners/logo-ajuntament-llinars.jpg",
		},
		{
			title: "Cases Singulars",
			img: "../../logos-partners/logo-cases-singulars.jpg",
		},
		{
			title: "Mas El Brugué",
			img: "../../logos-partners/logo-mas-brugue.jpg",
		},
		{
			title: "El Molí de Siurana",
			img: "../../logos-partners/logo-moli-siurana.jpg",
		},
		{
			title: "Comarca Aventura",
			img: "../../logos-partners/logo-comarca-aventura.jpg",
		},
		{
			title: "Apartament Spa Parellada",
			img: "../../logos-partners/logo-apartament-spa-parellada.jpg",
		},
		{
			title: "Sunrise Homes",
			img: "../../logos-partners/logo-sunrise-homes.jpg",
		},
	];
	return (
		<>
			<GlobalMetas
				title={"Sobre nosaltres | Escapadesenparella.cat"}
				description={
					"Som el portal d'escapades en parella de referència en català; un equip amant de descobrir i compartir noves experiències originals i allotjaments amb encant a Catalunya"
				}
				url={"https://escapadesenparella.cat/sobre-nosaltres"}
				canonical={"https://escapadesenparella.cat/sobre-nosaltres"}
			/>
			{/* Rich snippets */}
			<BreadcrumbRichSnippet
				page1Title="Inici"
				page1Url="https://escapadesenparella.cat"
				page2Title={`Sobre nosaltres`}
				page2Url={`https://escapadesenparella.cat/sobre-nosaltres`}
			/>
			<div id="aboutUs">
				<NavigationBar />
				<main>
					{/* Section header */}
					<section className="flex items-stretch pt-6">
						<div className="container">
							<div className="overflow-hidden rounded-2xl">
								<div className="flex flex-wrap items-stretch overflow-hidden">
									<div className="w-full lg:w-1/2 relative z-10">
										<div className="relative h-full md:px-16 2xl:px-20 overflow-hidden flex items-center justify-center lg:justify-start">
											<div className="relative z-10 md:min-h-[150px] lg:min-h-[300px] flex flex-col justify-center rounded-2xl bg-white md:p-10 mt-6 md:mt-0">
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
															Sobre nosaltres
														</span>
													</li>
												</ul>
												<div className="max-w-[28rem]">
													<h1 className="mt-4 md:mt-7 mb-0">
														Sobre nosaltres
													</h1>
													<p className="mt-4 text-block font-light leading-normal">
														Fa {foundationYears}{" "}
														anys que recorrem
														Catalunya descobrint les
														experiències més
														originals i els
														allotjaments amb més
														encant, perquè ens
														apassiona inspirar i
														compartir noves
														propostes per a una
														escapada en parella per
														recordar.
													</p>
													<div className="flex gap-2.5 lg:mt-2.5">
														<a
															href="#equip"
															title="Conèix-nos"
															className="button button__primary button__med"
														>
															Conèix-nos
														</a>
														<a
															href="/premsa-i-mitjans"
															title="Premsa i mitjans"
															className="button button__ghost button__med"
														>
															Mencions als mitjans
														</a>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="relative w-full h-full lg:h-auto lg:w-1/2 inset-0 mt-6 lg:mt-0">
										<picture className="block w-full h-full aspect-[4/3] md:aspect-[16/9]">
											<source
												srcSet="../../sobre-nosaltres/sobre-nosaltres-portada-m.webp"
												media="(max-width: 768px)"
												type="image/webp"
											/>
											<source
												srcSet="../../sobre-nosaltres/sobre-nosaltres-portada-m.jpg"
												media="(max-width: 768px)"
											/>
											<source
												srcSet="../../sobre-nosaltres/sobre-nosaltres-portada-s.webp"
												media="(min-width: 768px)"
												type="image/webp"
											/>
											<source
												srcSet="../../sobre-nosaltres/sobre-nosaltres-portada-s.jpg"
												media="(max-width: 768px)"
											/>
											<img
												src="../../sobre-nosaltres/sobre-nosaltres-portada-s.jpg"
												alt="Escapades en parella, i molt més"
												width="400"
												height="300"
												className="w-full h-full object-cover rounded-2xl"
												loading="eager"
												fetchpriority="high"
											/>
										</picture>
									</div>
								</div>
							</div>
						</div>
					</section>

					{/* Section textblock 1 */}
					<section className="flex items-stretch pt-8 md:pt-12 lg:pt-20">
						<div className="container">
							<div className="overflow-hidden rounded-2xl">
								<div className="flex flex-wrap items-stretch overflow-hidden">
									<div className="relative w-full h-full lg:h-auto lg:w-1/2 inset-0 grid grid-cols-1 lg:grid-cols-2 gap-5 order-2 lg:order-1 mt-6 lg:mt-0">
										<picture className="block w-full h-full aspect-[3/4]">
											<source
												srcSet="../../sobre-nosaltres/sobre-nosaltres-1-m.webp"
												media="(max-width: 768px)"
												type="image/webp"
											/>
											<source
												srcSet="../../sobre-nosaltres/sobre-nosaltres-1-m.JPG"
												media="(max-width: 768px)"
											/>
											<source
												srcSet="../../sobre-nosaltres/sobre-nosaltres-1.webp"
												media="(min-width: 768px)"
												type="image/webp"
											/>
											<source
												srcSet="../../sobre-nosaltres/sobre-nosaltres-1.JPG"
												media="(max-width: 768px)"
											/>
											<img
												src="../../sobre-nosaltres/sobre-nosaltres-1.JPG"
												alt="Turisme sostenible, de quilòmetre zero i en català"
												width="400"
												height="300"
												className="w-full h-full object-cover rounded-2xl"
												loading="lazy"
											/>
										</picture>
										<picture className="block w-full h-full aspect-[3/4]">
											<source
												srcSet="../../sobre-nosaltres/sobre-nosaltres-2-m.webp"
												media="(max-width: 768px)"
												type="image/webp"
											/>
											<source
												srcSet="../../sobre-nosaltres/sobre-nosaltres-2-m.jpg"
												media="(max-width: 768px)"
											/>
											<source
												srcSet="../../sobre-nosaltres/sobre-nosaltres-2.webp"
												media="(min-width: 768px)"
												type="image/webp"
											/>
											<source
												srcSet="../../sobre-nosaltres/sobre-nosaltres-2.jpg"
												media="(max-width: 768px)"
											/>
											<img
												src="../../sobre-nosaltres/sobre-nosaltres-2.jpg"
												alt="Turisme sostenible, de quilòmetre zero i en català"
												width="400"
												height="300"
												className="w-full h-full object-cover rounded-2xl"
												loading="lazy"
											/>
										</picture>
									</div>
									<div className="w-full lg:w-1/2 relative z-10 order-1 lg:order-2">
										<div className="relative h-full md:px-16 2xl:px-20 overflow-hidden flex items-center justify-center lg:justify-start">
											<div className="relative z-10 md:min-h-[150px] lg:min-h-[300px] flex flex-col justify-center rounded-2xl bg-white md:p-10 mt-6 md:mt-0">
												<div className="max-w-[33rem]">
													<h2 className="md:mt-7 mb-0 max-w-[22rem]">
														Turisme sostenible, de
														quilòmetre zero i en
														català
													</h2>
													<p className="mt-4 text-block font-light leading-normal">
														Descobreix Catalunya
														d'una manera autèntica i
														responsable. Et convidem
														a gaudir del{" "}
														<strong>
															turisme sostenible
														</strong>
														, apostant pel
														quilòmetre zero i
														promovent la nostra
														llengua. Amb propostes
														que respecten el medi
														ambient i{" "}
														<strong>
															potencien les
															economies locals
														</strong>
														, aquí trobaràs
														experiències úniques per
														compartir en parella,
														tot preservant la
														riquesa cultural i
														natural del nostre
														territori. Viatja amb
														consciència, viatja en
														català.
													</p>
												</div>

												<div className="flex flex-wrap items-center gap-6 mt-2.5">
													<div className="flex flex-col">
														<span className="text-2xl">
															{state.isFetching ? (
																<FetchingSpinnerInline />
															) : (
																state.totalActivities
															)}
														</span>
														<p className="max-w-[100px] leading-snug mt-2 text-15 font-light">
															Experiències
															originals
														</p>
													</div>
													<div className="flex flex-col">
														<span className="text-2xl">
															<span className="text-2xl">
																{state.isFetching ? (
																	<FetchingSpinnerInline />
																) : (
																	state.totalPlaces
																)}
															</span>
														</span>
														<p className="max-w-[100px] leading-snug mt-2 text-15 font-light">
															Allotjaments amb
															encant
														</p>
													</div>
													<div className="flex flex-col">
														<span className="text-2xl">
															{state.isFetching ? (
																<FetchingSpinnerInline />
															) : (
																state.totalStories
															)}
														</span>
														<p className="max-w-[100px] leading-snug mt-2 text-15 font-light">
															Històries en parella
														</p>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>

					{/* Section team */}
					<section
						className="flex items-stretch pt-8 md:pt-12 lg:pt-20"
						id="equip"
					>
						<div className="container">
							<div className="max-w-[32rem] mx-auto text-center">
								<h2 className="mt-4 md:mt-7 mb-0">Equip</h2>
								<p className="mt-4 text-block font-light leading-normal">
									Treballem dia a dia per crear propostes
									úniques i responsables. Coneix l'equip
									darrere del projecte, que amb il·lusió i
									compromís, fan possible que puguis viure
									escapades inoblidables.
								</p>
							</div>

							<div className="relative w-full grid grid-cols-1 lg:grid-cols-3 gap-5 mt-10">
								<article>
									<picture className="block w-full aspect-[4/3]">
										<source
											srcSet="../../sobre-nosaltres/andrea-prat-escapadesenparella.webp"
											media="(max-width: 768px)"
											type="image/webp"
										/>
										<source
											srcSet="../../sobre-nosaltres/andrea-prat-escapadesenparella.jpg"
											media="(max-width: 768px)"
										/>
										<source
											srcSet="../../sobre-nosaltres/andrea-prat-escapadesenparella.webp"
											media="(min-width: 768px)"
											type="image/webp"
										/>
										<source
											srcSet="../../sobre-nosaltres/andrea-prat-escapadesenparella.jpg"
											media="(max-width: 768px)"
										/>
										<img
											src="../../sobre-nosaltres/andrea-prat-escapadesenparella.jpg"
											alt="Andrea Prat"
											width="400"
											height="300"
											className="w-full h-full object-cover rounded-2xl"
											loading="lazy"
										/>
									</picture>
									<div className="mt-6 max-w-[85%]">
										<h3>Andrea Prat</h3>
										<p className="mt-2.5 text-block font-light leading-normal">
											Creativa i inquieta. Amant de les
											escapades d'aventura i dels
											macarrons de casa. Dissenyadora i
											il·lustradora treballant al món de
											la programació de dia, i mestre de
											taitxí de nit. Sempre amb un
											ventolín a mà. Un superpoder: no
											dormir mai.
										</p>
										<a
											href="https://www.linkedin.com/in/andreaprat/"
											title="Troba'm a LinkedIn"
											className="button button__primary button__med mt-2.5"
											target="_blank"
											rel="nofollow noreferrer"
										>
											Troba'm a LinkedIn
										</a>
									</div>
								</article>
								<article>
									<picture className="block w-full aspect-[4/3]">
										<source
											srcSet="../../sobre-nosaltres/juli-ramon-escapadesenparella.webp"
											media="(max-width: 768px)"
											type="image/webp"
										/>
										<source
											srcSet="../../sobre-nosaltres/juli-ramon-escapadesenparella.jpg"
											media="(max-width: 768px)"
										/>
										<source
											srcSet="../../sobre-nosaltres/juli-ramon-escapadesenparella.webp"
											media="(min-width: 768px)"
											type="image/webp"
										/>
										<source
											srcSet="../../sobre-nosaltres/juli-ramon-escapadesenparella.jpg"
											media="(max-width: 768px)"
										/>
										<img
											src="../../sobre-nosaltres/juli-ramon-escapadesenparella.jpg"
											alt="Juli Ramon"
											width="400"
											height="300"
											className="w-full h-full object-cover rounded-2xl"
											loading="lazy"
										/>
									</picture>
									<div className="mt-6 max-w-[85%]">
										<h3>Juli Ramon</h3>
										<p className="mt-2.5 text-block font-light leading-normal">
											Metòdic i disposat a tot. Amant de
											les escapades d'aventura, les
											escapades culturals i de la
											caldereta de llagosta. Programador
											web apassionat pel disseny
											d'interfícies. Sempre amb la càmera
											a punt. Un superpoder: poder volar.
										</p>
										<a
											href="https://www.linkedin.com/in/juliramon/"
											title="Troba'm a LinkedIn"
											className="button button__primary button__med mt-2.5"
											target="_blank"
											rel="nofollow noreferrer"
										>
											Troba'm a LinkedIn
										</a>
									</div>
								</article>
								<article>
									<picture className="block w-full aspect-[4/3]">
										<source
											srcSet="../../sobre-nosaltres/bru-escapadesenparella.webp"
											media="(max-width: 768px)"
											type="image/webp"
										/>
										<source
											srcSet="../../sobre-nosaltres/bru-escapadesenparella.jpg"
											media="(max-width: 768px)"
										/>
										<source
											srcSet="../../sobre-nosaltres/bru-escapadesenparella.webp"
											media="(min-width: 768px)"
											type="image/webp"
										/>
										<source
											srcSet="../../sobre-nosaltres/bru-escapadesenparella.jpg"
											media="(max-width: 768px)"
										/>
										<img
											src="../../sobre-nosaltres/bru-escapadesenparella.jpg"
											alt="Escapades en parella, i molt més"
											width="400"
											height="300"
											className="w-full h-full object-cover rounded-2xl"
											loading="eager"
											fetchpriority="high"
										/>
									</picture>
									<div className="mt-6 max-w-[85%]">
										<h3>Bru</h3>
										<p className="mt-2.5 text-block font-light leading-normal">
											Incansable i valent. Amant de totes
											les escapades on pugui anar i del
											iogurt. Treballant intensament per
											ser el millor secretari. Rastrejador
											per naturalesa. Sempre amb la pilota
											a la boca. Un superpoder: tenir les
											potes llargues.
										</p>
										<a
											href="https://www.instagram.com/bruthewiener/"
											title="Troba'm a LinkedIn"
											className="button button__primary button__med mt-2.5"
											target="_blank"
											rel="nofollow noreferrer"
										>
											Troba'm a Instagram
										</a>
									</div>
								</article>
							</div>
						</div>
					</section>

					{/* Section services */}
					<section className="flex items-stretch pt-8 md:pt-12 lg:pt-20">
						<div className="container">
							<div className="overflow-hidden rounded-2xl">
								<div className="flex flex-wrap items-stretch overflow-hidden">
									<div className="w-full lg:w-1/2 relative z-10">
										<div className="relative h-full md:px-16 2xl:px-20 overflow-hidden flex items-center justify-center lg:justify-start">
											<div className="relative z-10 md:min-h-[150px] lg:min-h-[300px] flex flex-col justify-center rounded-2xl bg-white md:p-10 mt-6 md:mt-0">
												<div className="max-w-[33rem]">
													<h2 className="mt-4 md:mt-7 mb-0 max-w-[30rem] text-pretty">
														Ens encanta treballar en
														campanyes que posin en
														valor productes i
														marques de casa nostra
													</h2>
													<p className="mt-4 text-block font-light leading-normal">
														Des de la creació de
														continguts, fins a la
														promoció a les xarxes
														socials, passant pel
														procés d'investigació,
														de disseny gràfic i de
														programació, dediquem el
														temps que faci falta per
														posar en valor els
														productes i marques que
														confien en nosaltres.
													</p>
													<a
														href="/contacte"
														title="Contacta'ns"
														className="button button__primary button__med mt-2.5"
													>
														Contacta'ns
													</a>
												</div>
											</div>
										</div>
									</div>
									<div className="relative w-full h-full lg:h-auto lg:w-1/2 inset-0 grid grid-cols-1 gap-5 mt-6 lg:mt-0">
										<picture className="block w-full h-full aspect-[4/3] lg:aspect-[16/9]">
											<source
												srcSet="../../sobre-nosaltres/sobre-nosaltres-que-fem-m.webp"
												media="(max-width: 768px)"
												type="image/webp"
											/>
											<source
												srcSet="../../sobre-nosaltres/sobre-nosaltres-que-fem-m.JPG"
												media="(max-width: 768px)"
											/>
											<source
												srcSet="../../sobre-nosaltres/sobre-nosaltres-que-fem.webp"
												media="(min-width: 768px)"
												type="image/webp"
											/>
											<source
												srcSet="../../sobre-nosaltres/sobre-nosaltres-que-fem.JPG"
												media="(max-width: 768px)"
											/>
											<img
												src="../../sobre-nosaltres/sobre-nosaltres-que-fem.JPG"
												alt="Turisme sostenible, de quilòmetre zero i en català"
												width="400"
												height="300"
												className="w-full h-full object-cover rounded-2xl"
												loading="lazy"
											/>
										</picture>
									</div>
								</div>
							</div>
						</div>
					</section>

					{/* Section brands */}
					<section className="flex items-stretch py-8 md:py-12 lg:py-20">
						<div className="container">
							<div className="max-w-[32rem] mx-auto text-center">
								<h3 className="mt-4 md:mt-7 mb-0 font-display">
									Confien en nosaltres
								</h3>
							</div>
							<div className="container mt-10">
								<div className="w-full lg:w-10/12 lg:mx-auto">
									<div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-6 lg:gap-10">
										{brandsPartners.map((logo) => (
											<picture className="block w-full h-full aspect-[16/9]">
												<img
													src={logo.img}
													alt={logo.title}
													className="w-full h-full object-contain"
													width={160}
													height={90}
													loading="lazy"
												/>
											</picture>
										))}
									</div>
								</div>
							</div>
						</div>
					</section>
				</main>
				<Footer />
			</div>
		</>
	);
};

export default AboutUs;
