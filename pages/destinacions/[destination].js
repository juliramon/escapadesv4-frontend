import Link from "next/link";
import React, { useEffect, useState } from "react";
import Footer from "../../components/global/Footer";
import NavigationBar from "../../components/global/NavigationBar";
import GlobalMetas from "../../components/head/GlobalMetas";
import ListingGrid from "../../components/listings/ListingGrid";
import TaxonomyChips from "../../components/listings/TaxonomyChips";
import MobileAnchorAd from "../../components/ads/MobileAnchorAd";
import { DESTINATIONS } from "../../utils/siteTaxonomy";
import BreadcrumbRichSnippet from "../../components/richsnippets/BreadcrumbRichSnippet";
import ContentService from "../../services/contentService";
import { toListingCard, toMapMarker } from "../../utils/listingProps";
import ListingHeader from "../../components/headers/ListingHeader";
import MapModal from "../../components/modals/MapModal";
import FilterListingsModal from "../../components/modals/FilterListingsModal";

const DestinationPage = ({
	destinationDetails,
	allResults,
	paginatedResults,
	totalItems,
	numPages,
}) => {
	const initialState = {
		results: paginatedResults,
		allResults: [],
		hasResults: false,
		isFetching: false,
		numResults: 0,
		numPages: 0,
		currentPage: 1,
		isFilterModalOpen: false,
		isMapModalOpen: false,
		// Els handlers del modal de filtres hi escriuen: sense inicialitzar-les,
		// el primer clic feia .push() sobre undefined i petava la pàgina.
		queryActivityRegion: [],
		queryActivityCategory: [],
		queryActivitySeason: [],
		selectedCount: 0,
		emptyBlocksPerRow: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
	};

	const [state, setState] = useState(initialState);

	const service = new ContentService();

	// En passar d'una destinació a una altra, Next reaprofita aquest mateix
	// component i només en canvia les props. Amb la llista de dependències
	// buida, l'estat es quedava amb els resultats de la destinació anterior:
	// el títol i l'URL canviaven, però la graella ensenyava les escapades que
	// no tocaven. Per això es refà l'estat sencer a cada canvi de destinació,
	// que a més descarta els filtres i la paginació de l'anterior.
	useEffect(() => {
		if (!destinationDetails || !paginatedResults) return;
		setState({
			...initialState,
			results: paginatedResults,
			allResults: allResults,
			hasResults: paginatedResults.length > 0,
			numResults: totalItems,
			numPages: numPages,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [destinationDetails?.slug]);

	const handleCheckRegion = (e) => {
		let query = state.queryActivityRegion;
		if (e.target.checked === true) {
			query.push(e.target.id);
		} else {
			let index = query.indexOf(e.target.id);
			query.splice(index, 1);
		}
		setState({
			...state,
			queryActivityRegion: query,
		});
	};

	const handleCheckCategory = (e) => {
		let query = state.queryActivityCategory;
		if (e.target.checked === true) {
			query.push(e.target.id);
		} else {
			let index = query.indexOf(e.target.id);
			query.splice(index, 1);
		}

		setState({
			...state,
			queryActivityCategory: query,
		});
	};

	const handleCheckSeason = (e) => {
		let query = state.queryActivitySeason;
		if (e.target.checked === true) {
			query.push(e.target.id);
		} else {
			let index = query.indexOf(e.target.id);
			query.splice(index, 1);
		}
		setState({
			...state,
			queryActivitySeason: query,
		});
	};

	const handleFilterSubmit = (e, selectedCount) => {
		e.preventDefault();
		setState({
			...state,
			updateSearch: true,
			isFilterModalOpen: false,
			selectedCount: selectedCount,
		});
	};

	const sponsorBlock = destinationDetails.isSponsored ? (
		<div className="sponsor-block">
			<Link href={`${destinationDetails.sponsorURL}`} target="_blank">
				<a>
					<div className="sponsor-block-top">
						<div className="sponsor-block-left">
							<span>Patrocinat per</span>
						</div>
						<div className="sponsor-block-right">
							<div className="sponsor-logo">
								<img src={destinationDetails.sponsorLogo} />
							</div>
							<div className="sponsor-block-claim">
								<span>{destinationDetails.sponsorClaim}</span>
							</div>
						</div>
					</div>
				</a>
			</Link>
		</div>
	) : null;

	const loadMoreResults = async (destinationId, page) => {
		setState({ ...state, isFetching: true });
		const { paginatedResults } = await service.paginateDestination(
			destinationId,
			page,
		);
		setState({
			...state,
			results: [...state.results, ...paginatedResults],
			isFetching: false,
			currentPage: ++state.currentPage,
		});
	};

	// Els filtres viuen a la capçalera: comparteixen fila amb el títol i
	// deixen la primera fila de fitxes per sobre del plec.
	const listingActions = (
		<div className="flex flex-wrap items-center gap-2">
			<button
				className="button button__ghost button__med px-6 w-fit gap-x-1.5 group"
				onClick={() =>
					setState({
						...state,
						isFilterModalOpen: true,
					})
				}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width={20}
					height={20}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth={1.5}
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<path d="M4 10a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
					<path d="M6 4v4" />
					<path d="M6 12v8" />
					<path d="M10 16a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
					<path d="M12 4v10" />
					<path d="M12 18v2" />
					<path d="M16 7a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
					<path d="M18 4v1" />
					<path d="M18 9v11" />
				</svg>
				Filtrar
				{state.selectedCount && state.selectedCount > 0 ? (
					<span className="rounded-full bg-primary-500 p-2 w-5 h-5 flex items-center justify-center group-hover:bg-white transition-colors duration-300 ease-in-out">
						<span className="text-white text-xs group-hover:text-primary-500 transition-colors duration-300 ease-in-out">
							{state.selectedCount}
						</span>
					</span>
				) : null}
			</button>
			<button
				className="button button__ghost button__med px-6 w-fit gap-x-1.5 ml-3"
				onClick={() =>
					setState({
						...state,
						isMapModalOpen: true,
					})
				}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width={20}
					height={20}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth={1.5}
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
					<path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
				</svg>
				Veure mapa
			</button>
		</div>
	);

	return (
		<>
			{/* Browser metas  */}
			<GlobalMetas
				title={destinationDetails.title}
				description={destinationDetails.subtitle}
				url={`https://escapadesenparella.cat/destinacions/${destinationDetails.slug}`}
				image={destinationDetails.image}
				canonical={`https://escapadesenparella.cat/destinacions/${destinationDetails.slug}`}
			/>
			{/* Rich snippets */}
			<BreadcrumbRichSnippet
				page1Title="Inici"
				page1Url="https://escapadesenparella.cat"
				page2Title="Destinacions"
				page2Url="https://escapadesenparella.cat/destinacions"
				page3Title={destinationDetails.title}
				page3Url={`https://escapadesenparella.cat/destinacions/${destinationDetails.slug}`}
			/>
			<div id="contentList" className="category relative">
				<NavigationBar />
				<main>
					{/* Header */}
					<ListingHeader
						title={
							destinationDetails.longTitle
								? destinationDetails.longTitle
								: destinationDetails.title
						}
						subtitle={
							destinationDetails.subtitle
								? destinationDetails.subtitle
								: ""
						}
						textHeader={destinationDetails.seoTextHeader}
						sponsorData={sponsorBlock}
						breadcrumbLevel1={"Destinacions"}
						breadcrumbLevel2={destinationDetails.title}
						actions={listingActions}
					/>

					{/* Listings */}
					<section className="pt-6 md:pt-8">
						<div className="container">
							<TaxonomyChips
								heading="Altres destinacions"
								items={DESTINATIONS}
								prefix="/destinacions/"
								activeSlug={destinationDetails?.slug}
								className="mb-5 md:mb-7"
							/>
							<div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5">
								{state.results.length > 0 ? (
									<>
										<ListingGrid
											cellsOnly
											items={state.results}
											isLoading={!state.hasResults}
											skeletonCount={12}
											eagerCount={2}
										/>

										{state.currentPage !==
										state.numPages ? (
											<div className="col-span-full w-full mt-10 flex justify-center">
												{!state.isFetching ? (
													<button
														className="button button__primary button__lg"
														onClick={() =>
															loadMoreResults(
																// Les activitats i allotjaments
																// referencien la destinació per
																// _id, igual que a getStaticProps.
																destinationDetails._id,
																state.currentPage,
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
									<div className="col-span-full">
										<p className="text-center mx-auto text-lg">
											No s'han trobat escapades per
											aquesta categoria.
											<br /> Torna-ho a provar més
											endavant.
										</p>
									</div>
								)}
							</div>
						</div>
					</section>

					{/* Section review texto */}
					<section className="mt-8 md:mt-12 lg:mt-20">
						<div className="container">
							<div className="border-t border-primary-100 py-8 md:py-12 lg:py-20">
								<div className="flex flex-col items-center justify-center">
									<div
										className="w-full max-w-prose mx-auto text-block m-0 text-center"
										dangerouslySetInnerHTML={{
											__html: destinationDetails.reviewText,
										}}
									></div>
								</div>
							</div>
						</div>
					</section>

					{/* Section text footer */}
					<section className="mt-8 mb-8 md:mb-12 lg:mb-20">
						<div className="container">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
								<div className="col-span-1 bg-slate-100 rounded-2xl py-8 md:py-12 lg:py-20">
									<div
										className="w-full max-w-prose mx-auto text-block px-6"
										dangerouslySetInnerHTML={{
											__html: destinationDetails.seoText,
										}}
									></div>
								</div>
								<div className="col-span-1 bg-slate-100 rounded-2xl overflow-hidden">
									<picture className="w-full h-full">
										<source
											srcSet={destinationDetails.image}
											type="image/webp"
										/>
										<img
											src={destinationDetails.image}
											alt={destinationDetails.title}
											loading={"lazy"}
											className="w-full h-full object-cover"
										/>
									</picture>
								</div>
							</div>
						</div>
					</section>
				</main>
			</div>

			<Footer />
			<MobileAnchorAd />

			{state.isMapModalOpen == true ? (
				<MapModal
					visibility={state.isMapModalOpen}
					hideModal={() =>
						setState({ ...state, isMapModalOpen: false })
					}
					items={state.allResults}
				/>
			) : null}

			<FilterListingsModal
				variant="destinations"
				isFilterModalOpen={state.isFilterModalOpen}
				hideModal={() =>
					setState({ ...state, isFilterModalOpen: false })
				}
				handleCheckRegion={handleCheckRegion}
				handleCheckCategory={handleCheckCategory}
				handleCheckSeason={handleCheckSeason}
				handleSubmit={handleFilterSubmit}
			/>
		</>
	);
};

export async function getStaticPaths() {
	const service = new ContentService();

	// Si l'API no respon en temps de build (per exemple, un desplegament del
	// backend encara en curs), no s'ha de tombar tot el build: amb fallback
	// "blocking" les pagines es generen a la primera visita.
	let destinations = [];
	try {
		destinations = (await service.getDestinations()) || [];
	} catch (err) {
		console.warn(
			"getStaticPaths: no s'han pogut llistar les destinacions, es generaran sota demanda.",
		);
		destinations = [];
	}

	const paths = destinations.map((destination) => ({
		params: { destination: destination.slug },
	}));
	// "blocking" en lloc de false: amb false, una destinació creada des del
	// panell d'administració donava 404 fins al següent desplegament.
	return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
	const service = new ContentService();
	const destinationDetails = await service.getDestinationDetails(
		params.destination,
	);

	if (!destinationDetails) {
		return {
			notFound: true,
		};
	}

	const { allResults, paginatedResults, totalItems, numPages } =
		await service.getDestinationResults(destinationDetails._id);

	// `allResults` només alimenta els marcadors del mapa i `paginatedResults`
	// les fitxes: enviar els documents sencers multiplicava per deu el pes de
	// la pàgina sense pintar-ne res més.
	return {
		props: {
			destinationDetails,
			allResults: (allResults || []).map(toMapMarker),
			paginatedResults: (paginatedResults || []).map(toListingCard),
			totalItems,
			numPages,
		},
		revalidate: 120,
	};
}

export default DestinationPage;
