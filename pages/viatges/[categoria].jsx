import React, { useContext, useEffect, useState } from "react";
import ContentService from "../../services/contentService";
import GlobalMetas from "../../components/head/GlobalMetas";
import BreadcrumbRichSnippet from "../../components/richsnippets/BreadcrumbRichSnippet";
import NavigationBar from "../../components/global/NavigationBar";
import Footer from "../../components/global/Footer";
import RegularTripEntryBox from "../../components/listings/RegularTripEntryBox";
import UserContext from "../../contexts/UserContext";
import { useRouter } from "next/router";
import { Splide, SplideTrack, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css/core";
import FancyboxUtil from "../../utils/FancyboxUtils";

const CategoryTrip = ({
	categoryDetails,
	allTrips,
	totalItems,
	trips,
	numPages,
}) => {
	// Validate if user is allowed to access this view
	const { user } = useContext(UserContext);
	const router = useRouter();
	const [loadPage, setLoadPage] = useState(false);
	useEffect(() => {
		if (user) {
			setLoadPage(true);
		}
	}, []);
	// End validation

	const initialResults = trips;

	const initialState = {
		results: [],
		allResults: [],
		hasResults: false,
		isFetching: false,
		numResults: 0,
		numPages: 0,
		currentPage: 1,
	};

	const [state, setState] = useState(initialState);
	const service = new ContentService();

	useEffect(() => {
		if (categoryDetails && initialResults) {
			setState({
				...state,
				allResults: allTrips,
				hasResults: initialResults.length > 0 ? true : false,
				numResults: totalItems,
				numPages: numPages,
			});
		}
	}, []);

	const loadMoreResults = async (categoryName, page) => {
		setState({ ...state, isFetching: true });
		const { paginatedResults } = await service.paginateTripCategory(
			categoryName,
			page
		);
		setState({
			...state,
			results: [...state.results, ...paginatedResults],
			isFetching: false,
			currentPage: ++state.currentPage,
		});
	};

	useEffect(() => {
		const underlinedElement = document.querySelector(".underlined-element");
		if (!underlinedElement) return;

		underlinedElement.classList.add("active");
	});

	return (
		<>
			{/* Browser metas  */}
			<GlobalMetas
				title={categoryDetails.title}
				description={categoryDetails.seoTextHeader}
				url={`https://escapadesenparella.cat/viatges/${categoryDetails.slug}`}
				image={categoryDetails.image}
				canonical={`https://escapadesenparella.cat/viatges/${categoryDetails.slug}`}
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
					{/* Section cover */}
					<section className="flex items-stretch pt-6">
						<div className="container">
							<div className="overflow-hidden rounded-2xl">
								<div className="flex flex-wrap items-stretch overflow-hidden">
									<div className="w-full lg:w-1/2 relative z-10">
										<div className="relative h-full md:px-16 2xl:px-20 overflow-hidden flex items-center justify-center lg:justify-start">
											<div className="relative z-10 md:min-h-[150px] lg:min-h-[300px] flex flex-col justify-center rounded-2xl bg-white md:p-10">
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
															{
																categoryDetails.title
															}
														</span>
													</li>
												</ul>
												<div class="max-w-[32rem]">
													{categoryDetails.richTitle ? (
														<h1
															className="mt-4 md:mt-7 mb-0"
															dangerouslySetInnerHTML={{
																__html: categoryDetails.richTitle,
															}}
														></h1>
													) : (
														<h1 className="mt-4 md:mt-7 mb-0">
															{
																categoryDetails.title
															}
														</h1>
													)}

													<div
														className="mt-4 text-block font-light leading-normal"
														dangerouslySetInnerHTML={{
															__html: categoryDetails.seoTextHeader,
														}}
													></div>
													<div className="flex gap-2.5 lg:mt-2.5">
														<a
															href="#viatge"
															title="Seguir llegint"
															className="button button__primary button__med"
														>
															Seguir llegint
														</a>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="relative w-full h-full lg:h-auto lg:w-1/2 inset-0 mt-6 lg:mt-0">
										<picture className="block w-full h-full aspect-[4/3] md:aspect-[16/9]">
											<img
												src={categoryDetails.image}
												alt={categoryDetails.title}
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

					{/* Section tabs */}
					<div className="border-y border-gray-100 bg-white mt-10 md:sticky md:top-[130px] z-40">
						<nav className="flex flex-wrap items-center justify-center py-5 gap-2.5 md:gap-5">
							<a
								href="#viatge"
								title="El nostre viatge"
								className="button py-2 px-4 md:py-3 md:px-6 text-sm button__primary rounded-full"
							>
								El nostre viatge
							</a>
							<a
								href="#informacio"
								title="Informació d'interès"
								className="button py-2 px-4 md:py-3 md:px-6 text-sm button__secondary rounded-full"
							>
								Informació d'interès
							</a>
							<a
								href="#publicacions"
								title="Publicacions"
								className="button py-2 px-4 md:py-3 md:px-6 text-sm button__secondary rounded-full"
							>
								Publicacions
							</a>
						</nav>
					</div>

					{/* Section intro */}
					<section
						className="py-8 md:py-12 lg:py-24 tripCategory__intro"
						id="viatge"
					>
						<div className="container">
							<div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-5">
								<div className="col-span-4 md:col-span-6 lg:col-start-4">
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
										className="text-block--xl text-center max-w-[920px] mx-auto"
										dangerouslySetInnerHTML={{
											__html: categoryDetails.reviewText,
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
						</div>
					</section>

					{/* Section images carousel */}
					<section className="border-y border-gray-100">
						<div className="container py-10">
							<Splide
								options={{
									type: "slide",
									gap: "20px",
									perMove: 1,
									perPage: 3,
									breakpoints: {
										1024: {
											perPage: 2,
										},
										768: {
											perPage: 1,
										},
									},
									arrows: true,
									pagination: false,
								}}
								hasTrack={false}
								aria-label="Carousel d'imatges"
							>
								<SplideTrack>
									{categoryDetails.carouselImages
										? categoryDetails.carouselImages.map(
												(el, idx) => {
													const imageSrc =
														el?.substring(0, 51);
													const imageId =
														el?.substring(63);
													const imageModSrc = `${imageSrc}w_805,h_605,c_fill/${imageId}`;
													const imageModSrcMob = `${imageSrc}w_400,h_300,c_fill/${imageId}`;

													const priority =
														idx === 1 || idx === 2
															? "eager"
															: "lazy";
													return (
														<SplideSlide key={idx}>
															<FancyboxUtil
																options={{
																	infinite: true,
																}}
															>
																<div
																	className="w-full aspect-[4/3] overflow-hidden"
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
																			alt={`${categoryDetails.title} - ${idx}`}
																			className={
																				"w-full h-full object-cover rounded-2xl overflow-hidden"
																			}
																			width={
																				400
																			}
																			height={
																				300
																			}
																			loading={
																				priority
																			}
																		/>
																	</picture>
																</div>
															</FancyboxUtil>
														</SplideSlide>
													);
												}
										  )
										: null}
								</SplideTrack>
								<div className="splide__arrows">
									<button className="splide__arrow splide__arrow--prev w-12 h-12 bg-white rounded-full shadow flex items-center justify-center absolute top-1/2 -translate-y-1/2 left-7 md:left-9 lg:left-16 2xl:left-20">
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
									<button className="splide__arrow splide__arrow--next w-12 h-12 bg-white rounded-full shadow flex items-center justify-center absolute top-1/2 -translate-y-1/2 right-7 md:right-9 lg:right-16 2xl:right-20">
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

					{/* Section information of interest */}
					<section
						className="py-8 md:py-12 lg:pt-24 lg:pb-20 tripCategory__info"
						id="informacio"
					>
						<div className="container">
							<div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-5">
								<div className="col-span-4 md:col-span-6 lg:col-span-5 lg:col-start-3 lg:pr-12">
									<div
										className="text-block tripCategory__info-text"
										dangerouslySetInnerHTML={{
											__html: categoryDetails.seoText,
										}}
									></div>

									<div className="mt-10 md:mt-14">
										<h2 className="h3 font-display">
											Informació d'interès
										</h2>

										{/* Most liked places */}
										<div className="mt-7 border-b border-gray-100 pb-10 mb-10">
											<div className="flex items-center gap-x-2.5 mt-7">
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
													className="icon icon-tabler icons-tabler-outline icon-tabler-flame"
												>
													<path
														stroke="none"
														d="M0 0h24v24H0z"
														fill="none"
													/>
													<path d="M12 12c2 -2.96 0 -7 -1 -8c0 3.038 -1.773 4.741 -3 6c-1.226 1.26 -2 3.24 -2 5a6 6 0 1 0 12 0c0 -1.532 -1.056 -3.94 -2 -5c-1.786 3 -2.791 3 -4 2z" />
												</svg>
												<h3>
													El que ens ha agradat més
												</h3>
											</div>
											<div
												className="text-block tripCategory__info-text mt-3 mb-0"
												dangerouslySetInnerHTML={{
													__html: categoryDetails.mostLikedText,
												}}
											></div>
										</div>

										{/* Points of interest */}
										<div className="mt-7 border-b border-gray-100 pb-10 mb-10">
											<div className="flex items-center gap-x-2.5 mt-7">
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
													className="icon icon-tabler icons-tabler-outline icon-tabler-pennant"
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
												<h3>
													Punts d'interès que heu de
													visitar
												</h3>
											</div>
											<div
												className="text-block tripCategory__info-text mt-3 mb-0"
												dangerouslySetInnerHTML={{
													__html: categoryDetails.pointsOfInterestText,
												}}
											></div>
										</div>

										{/* Must see places */}
										<div className="mt-7 border-b border-gray-100 pb-10 mb-10">
											<div className="flex items-center gap-x-2.5 mt-7">
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
													className="icon icon-tabler icons-tabler-outline icon-tabler-rosette-discount-check"
												>
													<path
														stroke="none"
														d="M0 0h24v24H0z"
														fill="none"
													/>
													<path d="M5 7.2a2.2 2.2 0 0 1 2.2 -2.2h1a2.2 2.2 0 0 0 1.55 -.64l.7 -.7a2.2 2.2 0 0 1 3.12 0l.7 .7c.412 .41 .97 .64 1.55 .64h1a2.2 2.2 0 0 1 2.2 2.2v1c0 .58 .23 1.138 .64 1.55l.7 .7a2.2 2.2 0 0 1 0 3.12l-.7 .7a2.2 2.2 0 0 0 -.64 1.55v1a2.2 2.2 0 0 1 -2.2 2.2h-1a2.2 2.2 0 0 0 -1.55 .64l-.7 .7a2.2 2.2 0 0 1 -3.12 0l-.7 -.7a2.2 2.2 0 0 0 -1.55 -.64h-1a2.2 2.2 0 0 1 -2.2 -2.2v-1a2.2 2.2 0 0 0 -.64 -1.55l-.7 -.7a2.2 2.2 0 0 1 0 -3.12l.7 -.7a2.2 2.2 0 0 0 .64 -1.55v-1" />
													<path d="M9 12l2 2l4 -4" />
												</svg>
												<h3>Què no us podeu perdre</h3>
											</div>
											<div
												className="text-block tripCategory__info-text mt-3 mb-0"
												dangerouslySetInnerHTML={{
													__html: categoryDetails.mustSeeText,
												}}
											></div>
										</div>
									</div>
								</div>
								<div className="col-span-4 md:col-span-6 lg:col-span-3 lg:col-start-8">
									<div
										className="tripCategory__iframe"
										dangerouslySetInnerHTML={{
											__html: categoryDetails.mapLocation,
										}}
									></div>
								</div>
							</div>
						</div>
					</section>

					{/* Section results list */}
					<section className="py-10 md:py-16" id="publicacions">
						<div className="container">
							<h2>Publicacions del viatge</h2>
							{initialResults.length > 0 ? (
								<>
									<div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5 mt-4">
										{initialResults.map((el, idx) => (
											<article className="w-full group">
												<RegularTripEntryBox
													key={el._id}
													slug={el.slug}
													trip={categoryDetails.slug}
													cover={el.cover}
													title={el.title}
													subtitle={el.subtitle}
													avatar={el.owner.avatar}
													owner={el.owner.fullName}
													date={el.createdAt}
												/>
											</article>
										))}
										{state.results.map((el) => (
											<article className="w-full group">
												<RegularTripEntryBox
													key={el._id}
													slug={el.slug}
													trip={categoryDetails.slug}
													cover={el.cover}
													title={el.title}
													subtitle={el.subtitle}
													avatar={el.owner.avatar}
													owner={el.owner.fullName}
													date={el.createdAt}
												/>
											</article>
										))}
									</div>
									{state.currentPage !== state.numPages ? (
										<div className="w-full mt-10 flex justify-center">
											{!state.isFetching ? (
												<button
													className="button button__primary button__lg"
													onClick={() =>
														loadMoreResults(
															categoryDetails.name,
															state.currentPage
														)
													}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="icon icon-tabler icon-tabler-plus mr-2"
														width={20}
														height={20}
														viewBox="0 0 24 24"
														strokeWidth="2"
														stroke="currentColor"
														fill="none"
														strokeLinecap="round"
														strokeLinejoin="round"
													>
														<path
															stroke="none"
															d="M0 0h24v24H0z"
															fill="none"
														></path>
														<line
															x1={12}
															y1={5}
															x2={12}
															y2={19}
														></line>
														<line
															x1={5}
															y1={12}
															x2={19}
															y2={12}
														></line>
													</svg>
													Veure'n més
												</button>
											) : (
												<button className="button button__primary button__lg">
													<svg
														role="status"
														className="w-5 h-5 mr-2.5 text-primary-400 animate-spin dark:text-gray-600 fill-white"
														viewBox="0 0 100 101"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
															fill="currentColor"
														/>
														<path
															d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
															fill="currentFill"
														/>
													</svg>
													Carregant
												</button>
											)}
										</div>
									) : (
										""
									)}
								</>
							) : (
								<p className="mt-4 text-block">
									Encara no hi ha publicacions disponibles.
									Sisplau, torna-ho a provar més endavant.
								</p>
							)}
						</div>
					</section>
				</main>
			</div>
			<Footer />
		</>
	);
};

export async function getServerSideProps({ params }) {
	const service = new ContentService();
	const categoryDetails = await service.getTripCategoryDetails(
		params.categoria
	);

	if (categoryDetails == null) {
		return {
			notFound: true,
		};
	}

	let { allTrips, totalItems, trips, numPages } =
		await service.getTripCategoryResults(categoryDetails._id);

	return {
		props: {
			categoryDetails,
			allTrips,
			totalItems,
			trips,
			numPages,
		},
	};
}

export default CategoryTrip;
