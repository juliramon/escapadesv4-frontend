import React, { useContext, useEffect, useState } from "react";
import { withResponsiveImages } from "../../utils/contentImages";
import { cloudinaryImage, cloudinaryResponsive } from "../../utils/cloudinary";
import ContentService from "../../services/contentService";
import GlobalMetas from "../../components/head/GlobalMetas";
import BreadcrumbRichSnippet from "../../components/richsnippets/BreadcrumbRichSnippet";
import NavigationBar from "../../components/global/NavigationBar";
import Footer from "../../components/global/Footer";
import EditorialGrid from "../../components/listings/EditorialGrid";
import SectionHeading from "../../components/homepage/SectionHeading";
import TripSectionNav from "../../components/listings/TripSectionNav";
import UserContext from "../../contexts/UserContext";
import { Splide, SplideTrack, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css/core";
import FancyboxUtil from "../../utils/FancyboxUtils";
import LoadMoreLink from "../../components/listings/LoadMoreLink";
import AdSlot from "../../components/ads/AdSlot";
import MobileAnchorAd from "../../components/ads/MobileAnchorAd";
import { toEditorialCard } from "../../utils/listingProps";
import { pagePath, pageTitle } from "../../utils/pagination";

const SECTIONS = [
	{ id: "viatge", label: "El nostre viatge" },
	{ id: "fotos", label: "Fotos" },
	{ id: "informacio", label: "Informació d'interès" },
	{ id: "publicacions", label: "Publicacions" },
];

const CategoryTrip = ({
	categoryDetails,
	totalItems,
	trips,
	numPages,
	currentPage = 1,
}) => {
	const { user } = useContext(UserContext);

	const initialResults = trips;
	const isFirstPage = currentPage === 1;
	const basePath = `/viatges/${categoryDetails.slug}`;
	const pageUrl = `https://escapadesenparella.cat${pagePath(
		basePath,
		currentPage,
	)}`;

	// `results` només guarda les tandes carregades amb «Veure'n més»: les de la
	// pàgina arriben per props i es pinten des del servidor.
	const stateFromProps = () => ({
		results: [],
		isFetching: false,
		numResults: totalItems,
		numPages: numPages,
		currentPage: currentPage,
	});

	const [state, setState] = useState(stateFromProps);
	const service = new ContentService();

	// En passar d'una categoria de viatge a una altra, o d'una pàgina a una
	// altra, Next reaprofita aquest mateix component. Amb la llista de
	// dependències buida, `state.results` —les pàgines que s'han carregat amb
	// "veure'n més"— es quedava amb les entrades anteriors i sortien
	// barrejades amb les noves.
	useEffect(() => {
		if (!categoryDetails || !initialResults) return;
		setState(stateFromProps());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [categoryDetails?.slug, currentPage]);

	// L'API filtra les entrades per l'_id de la categoria, com a
	// getServerSideProps, i les torna a `trips`. Abans aquí s'enviava el nom i
	// es llegia `paginatedResults`, que aquesta API no retorna: el botó no
	// afegia res. Les pàgines de l'API comencen per 0, o sigui que la tanda
	// que ve després de la `currentPage` (base 1) és justament `currentPage`.
	const loadMoreResults = async () => {
		setState((prev) => ({ ...prev, isFetching: true }));
		const { trips: nextTrips } = await service.paginateTripCategory(
			categoryDetails._id,
			state.currentPage,
		);
		setState((prev) => ({
			...prev,
			results: [...prev.results, ...nextTrips],
			isFetching: false,
			currentPage: prev.currentPage + 1,
		}));
	};

	const carouselImages = categoryDetails.carouselImages || [];
	const hasCarousel = carouselImages.length > 0;
	const sections = SECTIONS.filter(
		(section) => section.id !== "fotos" || hasCarousel,
	);

	// La portada de la fitxa és el LCP: va per amplades perquè el mòbil no es
	// baixi la mateixa imatge que un escriptori.
	const cover = cloudinaryResponsive(categoryDetails.image, {
		widths: [640, 768, 1024, 1400],
		ratio: 5 / 8,
		sizes: "(min-width: 1024px) 55vw, 100vw",
	});

	const publicationsLabel = `${totalItems} ${
		totalItems === 1 ? "publicació" : "publicacions"
	}`;

	return (
		<>
			{/* Browser metas  */}
			<GlobalMetas
				title={pageTitle(categoryDetails.title, currentPage)}
				description={categoryDetails.seoTextHeader}
				url={pageUrl}
				image={categoryDetails.image}
				canonical={pageUrl}
			/>
			{/* Rich snippets */}
			<BreadcrumbRichSnippet
				page1Title="Inici"
				page1Url="https://escapadesenparella.cat"
				page2Title="Viatges en parella"
				page2Url={`https://escapadesenparella.cat/viatges`}
				page3Title={categoryDetails.title}
				page3Url={`https://escapadesenparella.cat/viatges/${categoryDetails.slug}`}
			/>
			<div className="tripCategory">
				<NavigationBar user={user} />
				<main>
					{/* Capçalera. Abans el títol anava dins d'una targeta
					    blanca, centrada i amb dos coixins encadenats, dins
					    d'una columna que ja tenia 64 px de marge: la meitat de
					    la primera pantalla era espai buit i la foto, que és el
					    que fa venir ganes de llegir, quedava escapçada. */}
					<section className="pt-4 md:pt-6 lg:pt-8">
						<div className="container">
							<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
								<div className="lg:col-span-5">
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
											<a
												href="/viatges"
												className="breadcrumb__link"
											>
												Viatges en parella
											</a>
										</li>
										<li className="breadcrumb__item">
											<span className="breadcrumb__link active">
												{categoryDetails.title}
											</span>
										</li>
									</ul>

									{categoryDetails.richTitle ? (
										<h1
											className="mt-3.5 mb-0 text-balance"
											dangerouslySetInnerHTML={{
												__html: categoryDetails.richTitle,
											}}
										></h1>
									) : (
										<h1 className="mt-3.5 mb-0 text-balance">
											{categoryDetails.title}
										</h1>
									)}

									<div
										className="mt-3 text-block text-grey-400"
										dangerouslySetInnerHTML={{
											__html: categoryDetails.seoTextHeader,
										}}
									></div>

									{/* Què hi trobarà qui acaba d'arribar,
									    sense haver de fer scroll. */}
									<ul className="flex flex-wrap items-center gap-2 mt-5 mb-0 pl-0 list-none">
										{categoryDetails.country ? (
											<li className="inline-flex items-center gap-x-1.5 bg-gray-50 text-grey-500 text-15 leading-none rounded-full py-2 px-3">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width={16}
													height={16}
													viewBox="0 0 24 24"
													strokeWidth={1.5}
													stroke="currentColor"
													fill="none"
													strokeLinecap="round"
													strokeLinejoin="round"
													aria-hidden="true"
												>
													<path
														stroke="none"
														d="M0 0h24v24H0z"
														fill="none"
													/>
													<path d="M7 9a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
													<path d="M5.75 15a8.015 8.015 0 1 0 9.25 -13" />
													<path d="M11 17v4" />
													<path d="M7 21h8" />
												</svg>
												{categoryDetails.country}
											</li>
										) : null}
										{totalItems ? (
											<li className="inline-flex items-center gap-x-1.5 bg-gray-50 text-grey-500 text-15 leading-none rounded-full py-2 px-3">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width={16}
													height={16}
													viewBox="0 0 24 24"
													strokeWidth={1.5}
													stroke="currentColor"
													fill="none"
													strokeLinecap="round"
													strokeLinejoin="round"
													aria-hidden="true"
												>
													<path
														stroke="none"
														d="M0 0h24v24H0z"
														fill="none"
													/>
													<path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
													<path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
													<path d="M3 6l0 13" />
													<path d="M12 6l0 13" />
													<path d="M21 6l0 13" />
												</svg>
												{publicationsLabel}
											</li>
										) : null}
										{hasCarousel ? (
											<li className="inline-flex items-center gap-x-1.5 bg-gray-50 text-grey-500 text-15 leading-none rounded-full py-2 px-3">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width={16}
													height={16}
													viewBox="0 0 24 24"
													strokeWidth={1.5}
													stroke="currentColor"
													fill="none"
													strokeLinecap="round"
													strokeLinejoin="round"
													aria-hidden="true"
												>
													<path
														stroke="none"
														d="M0 0h24v24H0z"
														fill="none"
													/>
													<path d="M15 8h.01" />
													<path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12z" />
													<path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5" />
													<path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3" />
												</svg>
												{carouselImages.length} fotos
											</li>
										) : null}
									</ul>

									<div className="flex flex-wrap gap-2.5 mt-6">
										<a
											href="#publicacions"
											title="Veure les publicacions"
											className="button button__primary button__med"
										>
											Veure les publicacions
										</a>
									</div>
								</div>

								<div className="lg:col-span-7">
									<picture className="block w-full aspect-[4/3] md:aspect-[16/10] rounded-2xl overflow-hidden">
										<img
											{...cover}
											alt={categoryDetails.title}
											className="w-full h-full object-cover"
											loading="eager"
											fetchpriority="high"
											decoding="async"
										/>
									</picture>
								</div>
							</div>
						</div>
					</section>

					{/* El relat, el carrusel i la informació del viatge només
					    van a la primera pàgina: les altres són la continuació
					    de les publicacions i no els han de repetir */}
					{isFirstPage ? (
						<>
							<TripSectionNav sections={sections} />

							{/* El nostre viatge */}
							<section
								className="py-10 md:py-14 lg:py-20 tripCategory__intro"
								id="viatge"
							>
								<div className="container">
									<div className="max-w-[920px] mx-auto">
										<div className="flex items-center justify-center gap-x-2.5 mb-5">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width={22}
												height={22}
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth={1.5}
												strokeLinecap="round"
												strokeLinejoin="round"
												className="icon icon-tabler icons-tabler-outline icon-tabler-globe"
												aria-hidden="true"
											>
												<path
													stroke="none"
													d="M0 0h24v24H0z"
													fill="none"
												/>
												<path d="M7 9a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
												<path d="M5.75 15a8.015 8.015 0 1 0 9.25 -13" />
												<path d="M11 17v4" />
												<path d="M7 21h8" />
											</svg>
											<span className="text-block m-0">
												{categoryDetails.country}
											</span>
										</div>
										<div
											className="text-block--xl text-center"
											dangerouslySetInnerHTML={{
												__html: withResponsiveImages(
													categoryDetails.reviewText,
												),
											}}
										></div>
										<div className="mt-10 md:mt-12 flex justify-center">
											<img
												src="/signatura-andrea-juli.svg"
												alt="Andrea i Juli"
												width={144}
												height={32}
												className="object-contain"
												loading="lazy"
											/>
										</div>
									</div>
								</div>
							</section>

							{/* Fotos del viatge. Abans el carrusel arrencava
							    sense dir què era: ara la secció té títol
							    propi, entra a la sub-navegació i es pot
							    enllaçar. */}
							{hasCarousel ? (
								<section
									className="border-y border-gray-100 py-10 md:py-12"
									id="fotos"
								>
									<div className="container">
										<SectionHeading
											eyebrow="Àlbum"
											title={`${categoryDetails.title} en imatges`}
											description="Fotos nostres, fetes durant el viatge. Fes clic per veure-les a pantalla completa."
										/>
									</div>
									<div className="container pt-6 md:pt-8">
										<Splide
											options={{
												type: "slide",
												gap: "20px",
												perMove: 1,
												perPage: 3,
												breakpoints: {
													1024: { perPage: 2 },
													768: { perPage: 1 },
												},
												arrows: carouselImages.length > 3,
												pagination: false,
											}}
											hasTrack={false}
											aria-label={`Fotos de ${categoryDetails.title}`}
										>
											<SplideTrack>
												{carouselImages.map(
													(el, idx) => {
														const imageModSrc =
															cloudinaryImage(
																el,
																805,
																605,
															).src;
														const imageModSrcMob =
															cloudinaryImage(
																el,
																400,
																300,
															).src;

														return (
															<SplideSlide
																key={el || idx}
															>
																<FancyboxUtil
																	options={{
																		infinite: true,
																	}}
																>
																	<div
																		className="w-full aspect-[4/3] overflow-hidden cursor-pointer"
																		data-fancybox="gallery"
																		data-src={
																			el
																		}
																	>
																		<picture className="block w-full h-full rounded-2xl overflow-hidden">
																			<source
																				srcSet={
																					imageModSrcMob
																				}
																				media="(max-width: 768px)"
																			/>
																			<source
																				srcSet={
																					imageModSrc
																				}
																				media="(min-width: 768px)"
																			/>
																			<img
																				src={
																					imageModSrc
																				}
																				alt={`${
																					categoryDetails.title
																				} - foto ${
																					idx +
																					1
																				}`}
																				className="w-full h-full object-cover rounded-2xl overflow-hidden scale-100 hover:scale-105 transition-transform duration-700 ease-in-out"
																				width={
																					400
																				}
																				height={
																					300
																				}
																				loading={
																					idx <
																					3
																						? "eager"
																						: "lazy"
																				}
																				decoding="async"
																			/>
																		</picture>
																	</div>
																</FancyboxUtil>
															</SplideSlide>
														);
													},
												)}
											</SplideTrack>
											<div className="splide__arrows">
												<button
													className="splide__arrow splide__arrow--prev w-12 h-12 bg-white rounded-full shadow flex items-center justify-center absolute top-1/2 -translate-y-1/2 left-7 md:left-9 lg:left-16 2xl:left-20"
													aria-label="Foto anterior"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="icon icon-tabler icon-tabler-chevron-left"
														width={24}
														height={24}
														viewBox="0 0 24 24"
														strokeWidth={1.5}
														stroke="currentColor"
														fill="none"
														strokeLinecap="round"
														strokeLinejoin="round"
													>
														<path
															stroke="none"
															d="M0 0h24v24H0z"
															fill="none"
														/>
														<path d="M15 6l-6 6l6 6" />
													</svg>
												</button>
												<button
													className="splide__arrow splide__arrow--next w-12 h-12 bg-white rounded-full shadow flex items-center justify-center absolute top-1/2 -translate-y-1/2 right-7 md:right-9 lg:right-16 2xl:right-20"
													aria-label="Foto següent"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="icon icon-tabler icon-tabler-chevron-right"
														width={24}
														height={24}
														viewBox="0 0 24 24"
														strokeWidth={1.5}
														stroke="currentColor"
														fill="none"
														strokeLinecap="round"
														strokeLinejoin="round"
													>
														<path
															stroke="none"
															d="M0 0h24v24H0z"
															fill="none"
														/>
														<path d="M9 6l6 6l-6 6" />
													</svg>
												</button>
											</div>
										</Splide>
									</div>
								</section>
							) : null}

							{/* Informació d'interès. La graella anterior
							    ocupava les columnes 3-7 i 8-10 de dotze: el
							    text quedava en una columna estreta i les
							    columnes dels extrems, buides. */}
							<section
								className="py-10 md:py-14 lg:py-20 tripCategory__info"
								id="informacio"
							>
								<div className="container">
									<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
										<div className="lg:col-span-7 xl:col-start-2">
											<div
												className="text-block tripCategory__info-text"
												dangerouslySetInnerHTML={{
													__html: withResponsiveImages(
														categoryDetails.seoText,
													),
												}}
											></div>

											<div className="mt-10 md:mt-14">
												<h2 className="h3 font-display">
													Informació d'interès
												</h2>

												{/* El que ens ha agradat més */}
												<div className="mt-7 border-b border-gray-100 pb-10 mb-10">
													<div className="flex items-center gap-x-2.5">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width={24}
															height={24}
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															strokeWidth={2}
															strokeLinecap="round"
															strokeLinejoin="round"
															className="icon icon-tabler icons-tabler-outline icon-tabler-flame shrink-0 text-tertiary-800"
															aria-hidden="true"
														>
															<path
																stroke="none"
																d="M0 0h24v24H0z"
																fill="none"
															/>
															<path d="M12 12c2 -2.96 0 -7 -1 -8c0 3.038 -1.773 4.741 -3 6c-1.226 1.26 -2 3.24 -2 5a6 6 0 1 0 12 0c0 -1.532 -1.056 -3.94 -2 -5c-1.786 3 -2.791 3 -4 2z" />
														</svg>
														<h3 className="my-0">
															El que ens ha
															agradat més
														</h3>
													</div>
													<div
														className="text-block tripCategory__info-text mt-3 mb-0"
														dangerouslySetInnerHTML={{
															__html: withResponsiveImages(
																categoryDetails.mostLikedText,
															),
														}}
													></div>
												</div>

												{/* Punts d'interès */}
												<div className="border-b border-gray-100 pb-10 mb-10">
													<div className="flex items-center gap-x-2.5">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width={24}
															height={24}
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															strokeWidth={2}
															strokeLinecap="round"
															strokeLinejoin="round"
															className="icon icon-tabler icons-tabler-outline icon-tabler-pennant shrink-0 text-tertiary-800"
															aria-hidden="true"
														>
															<path
																stroke="none"
																d="M0 0h24v24H0z"
																fill="none"
															/>
															<path d="M8 21l4 0" />
															<path d="M10 21l0 -18" />
															<path d="M10 4l9 4l-9 4" />
														</svg>
														<h3 className="my-0">
															Punts d'interès que
															heu de visitar
														</h3>
													</div>
													<div
														className="text-block tripCategory__info-text mt-3 mb-0"
														dangerouslySetInnerHTML={{
															__html: withResponsiveImages(
																categoryDetails.pointsOfInterestText,
															),
														}}
													></div>
												</div>

												{/* Què no us podeu perdre */}
												<div>
													<div className="flex items-center gap-x-2.5">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width={24}
															height={24}
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															strokeWidth={2}
															strokeLinecap="round"
															strokeLinejoin="round"
															className="icon icon-tabler icons-tabler-outline icon-tabler-rosette-discount-check shrink-0 text-tertiary-800"
															aria-hidden="true"
														>
															<path
																stroke="none"
																d="M0 0h24v24H0z"
																fill="none"
															/>
															<path d="M5 7.2a2.2 2.2 0 0 1 2.2 -2.2h1a2.2 2.2 0 0 0 1.55 -.64l.7 -.7a2.2 2.2 0 0 1 3.12 0l.7 .7c.412 .41 .97 .64 1.55 .64h1a2.2 2.2 0 0 1 2.2 2.2v1c0 .58 .23 1.138 .64 1.55l.7 .7a2.2 2.2 0 0 1 0 3.12l-.7 .7a2.2 2.2 0 0 0 -.64 1.55v1a2.2 2.2 0 0 1 -2.2 2.2h-1a2.2 2.2 0 0 0 -1.55 .64l-.7 .7a2.2 2.2 0 0 1 -3.12 0l-.7 -.7a2.2 2.2 0 0 0 -1.55 -.64h-1a2.2 2.2 0 0 1 -2.2 -2.2v-1a2.2 2.2 0 0 0 -.64 -1.55l-.7 -.7a2.2 2.2 0 0 1 0 -3.12l.7 -.7a2.2 2.2 0 0 0 .64 -1.55v-1" />
															<path d="M9 12l2 2l4 -4" />
														</svg>
														<h3 className="my-0">
															Què no us podeu
															perdre
														</h3>
													</div>
													<div
														className="text-block tripCategory__info-text mt-3 mb-0"
														dangerouslySetInnerHTML={{
															__html: withResponsiveImages(
																categoryDetails.mustSeeText,
															),
														}}
													></div>
												</div>
											</div>
										</div>

										<aside className="lg:col-span-5 xl:col-span-3">
											<div className="lg:sticky lg:top-[150px]">
												{categoryDetails.mapLocation ? (
													<>
														<h2 className="h3 font-display mt-0 mb-3">
															On és{" "}
															{
																categoryDetails.country
															}
														</h2>
														<div
															className="tripCategory__iframe"
															dangerouslySetInnerHTML={{
																__html: categoryDetails.mapLocation,
															}}
														></div>
													</>
												) : null}
												<AdSlot
													placement="sidebar"
													containerClassName="mt-7 rounded-2xl bg-gray-50 p-4"
												/>
											</div>
										</aside>
									</div>
								</div>
							</section>
						</>
					) : null}

					{/* Publicacions del viatge */}
					<section
						className="py-10 md:py-16 bg-gray-50"
						id="publicacions"
					>
						<div className="container">
							<SectionHeading
								eyebrow="Dia a dia"
								title="Publicacions del viatge"
								description={
									totalItems
										? `${publicationsLabel} amb el que vam veure, on vam dormir i què us recomanem de cada dia.`
										: undefined
								}
							/>
							{initialResults.length > 0 ? (
								<div className="mt-6 md:mt-8">
									<EditorialGrid
										items={[
											...initialResults,
											...state.results,
										]}
										basePath={basePath}
										badge={categoryDetails.country}
										eagerCount={4}
									/>
									{state.currentPage < state.numPages ? (
										<LoadMoreLink
											href={pagePath(
												basePath,
												state.currentPage + 1,
											)}
											isFetching={state.isFetching}
											onLoadMore={loadMoreResults}
										/>
									) : null}
								</div>
							) : (
								<p className="mt-4 text-block">
									Encara no hi ha publicacions disponibles.
									Sisplau, torna-ho a provar més endavant.
								</p>
							)}
						</div>
					</section>

					<section className="py-8 md:py-12">
						<div className="container">
							<AdSlot placement="leaderboard" />
						</div>
					</section>
				</main>
			</div>
			<Footer />
			<MobileAnchorAd />
		</>
	);
};

/**
 * Props d'una pàgina d'una categoria de viatge. També les fa servir
 * `pages/viatges/[categoria]/pagina/[pagina].jsx` per a la resta de tandes.
 */
export const getTripCategoryPageProps = async (slug, page = 1) => {
	const service = new ContentService();
	const categoryDetails = await service.getTripCategoryDetails(slug);

	if (categoryDetails == null) {
		return {
			notFound: true,
		};
	}

	const { totalItems, trips, numPages } = await service.paginateTripCategory(
		categoryDetails._id,
		page - 1,
	);

	if (page > 1 && page > numPages) {
		return { notFound: true };
	}

	return {
		props: {
			categoryDetails,
			totalItems,
			// L'API torna cada entrada sencera, amb el cos de l'article i
			// totes les imatges: set entrades eren més de 100 kB de JSON
			// incrustat a l'HTML per pintar-ne set targetes. `allTrips`, que
			// arribava en paral·lel amb les mateixes entrades, no es feia
			// servir enlloc.
			trips: (trips || []).map(toEditorialCard),
			numPages,
			currentPage: page,
		},
	};
};

export async function getServerSideProps({ params }) {
	return getTripCategoryPageProps(params.categoria);
}

export default CategoryTrip;
