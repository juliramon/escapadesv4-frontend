import Link from "next/link";
import { cloudinaryImage, cloudinaryResponsive } from "../../utils/cloudinary";
import { withResponsiveImages } from "../../utils/contentImages";
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
import LoadMoreLink from "../../components/listings/LoadMoreLink";
import { pagePath, pageTitle } from "../../utils/pagination";

const DestinationPage = ({
	destinationDetails,
	allResults,
	paginatedResults,
	totalItems,
	numPages,
	currentPage = 1,
}) => {
	// L'estat surt de les props des del primer render. Abans `hasResults`
	// començava a false i el servidor pintava esquelets en lloc de fitxes: a
	// l'HTML que llegeix Google, la destinació no enllaçava cap escapada.
	const stateFromProps = () => ({
		results: paginatedResults || [],
		allResults: allResults || [],
		hasResults: true,
		isFetching: false,
		numResults: totalItems,
		numPages: numPages,
		currentPage: currentPage,
		isFilterModalOpen: false,
		isMapModalOpen: false,
		// Els handlers del modal de filtres hi escriuen: sense inicialitzar-les,
		// el primer clic feia .push() sobre undefined i petava la pàgina.
		queryActivityRegion: [],
		queryActivityCategory: [],
		queryActivitySeason: [],
		selectedCount: 0,
	});

	const [state, setState] = useState(stateFromProps);

	const service = new ContentService();

	const basePath = `/destinacions/${destinationDetails.slug}`;
	const pageUrl = `https://escapadesenparella.cat${pagePath(
		basePath,
		currentPage,
	)}`;

	// En passar d'una destinació a una altra, o d'una pàgina a una altra de la
	// mateixa destinació, Next reaprofita aquest mateix component i només en
	// canvia les props. Amb la llista de dependències buida, l'estat es
	// quedava amb els resultats anteriors: el títol i l'URL canviaven, però la
	// graella ensenyava les escapades que no tocaven. Per això es refà l'estat
	// sencer a cada canvi, que a més descarta els filtres i la paginació.
	useEffect(() => {
		if (!destinationDetails || !paginatedResults) return;
		setState(stateFromProps());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [destinationDetails?.slug, currentPage]);

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

	// La imatge de la destinació es penjava tal com sortia de la càmera i
	// s'enviava sencera a tothom, mòbils inclosos.
	const destinationImage = cloudinaryResponsive(destinationDetails.image, {
		widths: [480, 768, 1024],
		ratio: 3 / 4,
		sizes: "(min-width: 768px) 50vw, 100vw",
	});
	// Cinc de les sis destinacions no tenen imatge: val més no declarar
	// `og:image` que declarar-la buida.
	const shareImage = destinationDetails.image
		? cloudinaryImage(destinationDetails.image, 1200, 630).src
		: undefined;

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

	// Les activitats i allotjaments referencien la destinació per _id, igual
	// que a getStaticProps. L'API compta les pàgines des de 0: la tanda que ve
	// després de la `currentPage` (base 1) és justament `currentPage`.
	const loadMoreResults = async () => {
		setState((prev) => ({ ...prev, isFetching: true }));
		const { paginatedResults: nextResults } =
			await service.paginateDestination(
				destinationDetails._id,
				state.currentPage,
			);
		setState((prev) => ({
			...prev,
			results: [...prev.results, ...nextResults],
			isFetching: false,
			currentPage: prev.currentPage + 1,
		}));
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
				title={pageTitle(destinationDetails.title, currentPage)}
				description={destinationDetails.subtitle}
				url={pageUrl}
				image={shareImage}
				canonical={pageUrl}
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

										{state.currentPage <
										state.numPages ? (
											<LoadMoreLink
												href={pagePath(
													basePath,
													state.currentPage + 1,
												)}
												isFetching={state.isFetching}
												onLoadMore={loadMoreResults}
											/>
										) : null}
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

					{/* Els textos de la destinació només van a la primera
					    pàgina, perquè les altres no els repeteixin */}
					{currentPage === 1 ? (
					<>
					{/* Section review texto */}
					<section className="mt-8 md:mt-12 lg:mt-20">
						<div className="container">
							<div className="border-t border-primary-100 py-8 md:py-12 lg:py-20">
								<div className="flex flex-col items-center justify-center">
									<div
										className="w-full max-w-prose mx-auto text-block m-0 text-center"
										dangerouslySetInnerHTML={{
											__html: withResponsiveImages(
												destinationDetails.reviewText
											),
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
											__html: withResponsiveImages(
												destinationDetails.seoText
											),
										}}
									></div>
								</div>
								<div className="col-span-1 bg-slate-100 rounded-2xl overflow-hidden">
									<picture className="w-full h-full">
										<img
											src={destinationImage.src}
											srcSet={destinationImage.srcSet}
											sizes={destinationImage.sizes}
											width={destinationImage.width}
											height={destinationImage.height}
											alt={destinationDetails.title}
											loading={"lazy"}
											decoding="async"
											className="w-full h-full object-cover"
										/>
									</picture>
								</div>
							</div>
						</div>
					</section>
					</>
					) : null}
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

/**
 * Props d'una pàgina del llistat d'una destinació. També les fa servir
 * `pages/destinacions/[destination]/pagina/[pagina].js` per a la resta de
 * tandes.
 */
export const getDestinationPageProps = async (slug, page = 1) => {
	const service = new ContentService();
	const destinationDetails = await service.getDestinationDetails(slug);

	if (!destinationDetails) {
		return { notFound: true, revalidate: 120 };
	}

	const { allResults, paginatedResults, totalItems, numPages } =
		await service.paginateDestination(destinationDetails._id, page - 1);

	if (page > 1 && page > numPages) {
		return { notFound: true, revalidate: 120 };
	}

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
			currentPage: page,
		},
		revalidate: 120,
	};
};

export async function getStaticProps({ params }) {
	return getDestinationPageProps(params.destination);
}

export default DestinationPage;
