import { useEffect, useState } from "react";
import ContentService from "../services/contentService";
import { toListingCard, toMapMarker } from "../utils/listingProps";
import NavigationBar from "../components/global/NavigationBar";
import ListingGrid from "../components/listings/ListingGrid";
import TaxonomyChips from "../components/listings/TaxonomyChips";
import MobileAnchorAd from "../components/ads/MobileAnchorAd";
import {
	DESTINATIONS,
	STAY_CATEGORIES,
	taxonomyLinksHtml,
} from "../utils/siteTaxonomy";
import Footer from "../components/global/Footer";
import MapModal from "../components/modals/MapModal";
import BreadcrumbRichSnippet from "../components/richsnippets/BreadcrumbRichSnippet";
import GlobalMetas from "../components/head/GlobalMetas";
import ListingHeader from "../components/headers/ListingHeader";
import ListingsTextareaFooter from "../components/listings/ListingsTextareaFooter";
import FilterListingsModal from "../components/modals/FilterListingsModal";
import LoadMoreLink from "../components/listings/LoadMoreLink";
import { pagePath, pageTitle } from "../utils/pagination";

const BASE_PATH = "/allotjaments";

const PlaceList = ({
	totalItems,
	places,
	allPlaces,
	numPages,
	currentPage = 1,
}) => {
	// L'estat surt de les props des del primer render. Abans `hasPlaces`
	// començava a false i s'omplia en un useEffect: el servidor pintava
	// esquelets i l'HTML que llegeix Google no enllaçava cap allotjament.
	const stateFromProps = () => ({
		places: places || [],
		allPlaces: allPlaces || [],
		queryPlaceRegion: [],
		queryPlaceCategory: [],
		queryPlaceSeason: [],
		updateSearch: false,
		hasPlaces: true,
		isFetching: false,
		numPlaces: totalItems,
		numPages: numPages,
		currentPage: currentPage,
		isFilterModalOpen: false,
		selectedCount: 0,
		isMapModalOpen: false,
	});

	const [state, setState] = useState(stateFromProps);

	const service = new ContentService();

	// `/allotjaments` i `/allotjaments/pagina/{n}` comparteixen aquest
	// component: en passar de l'una a l'altra Next no el torna a muntar i
	// l'estat s'ha de refer amb les props noves.
	useEffect(() => {
		setState(stateFromProps());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage]);

	const handleCheckRegion = (e) => {
		let query = state.queryPlaceRegion;
		if (e.target.checked === true) {
			query.push(e.target.id);
		} else {
			let index = query.indexOf(e.target.id);
			query.splice(index, 1);
		}
		setState({
			...state,
			queryPlaceRegion: query,
		});
	};

	const handleCheckCategory = (e) => {
		let query = state.queryPlaceCategory;
		if (e.target.checked === true) {
			query.push(e.target.id);
		} else {
			let index = query.indexOf(e.target.id);
			query.splice(index, 1);
		}

		setState({
			...state,
			queryPlaceCategory: query,
		});
	};

	const handleCheckSeason = (e) => {
		let query = state.queryPlaceSeason;
		if (e.target.checked === true) {
			query.push(e.target.id);
		} else {
			let index = query.indexOf(e.target.id);
			query.splice(index, 1);
		}
		setState({
			...state,
			queryPlaceSeason: query,
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

	useEffect(() => {
		if (state.updateSearch === true) {
			service
				.searchPlaces(
					state.queryPlaceRegion,
					state.queryPlaceCategory,
					state.queryPlaceSeason
				)
				.then((res) => {
					setState({ ...state, places: res, updateSearch: false });
				});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.updateSearch]);

	// Bloc de text del peu del llistat. Es manté a la pàgina (i no a l'API)
	// perquè inclou el comptador real i els enllaços a la taxonomia.
	const textareaFooter = `<h2>Allotjaments amb encant a Catalunya per a una escapada en parella</h2>
<p>Hem reunit <strong>${state.numPlaces} allotjaments</strong> pensats per anar-hi a dos: hotels petits amb personalitat, masies i cases rurals per tenir la casa sencera, cabanes als arbres, refugis de muntanya i càmpings amb bungalows. Cap gran cadena ni hotels de pas: la idea és que l'allotjament sigui part de l'escapada, i no només un lloc on dormir.</p>

<h3>Quin tipus d'allotjament busqueu?</h3>
<p>Cada tipus té la seva pàgina, amb el llistat complet i el mapa:</p>
${taxonomyLinksHtml(STAY_CATEGORIES)}

<h3>Allotjaments per zones</h3>
<p>Si ja sabeu on voleu anar, entreu per la destinació i hi trobareu els allotjaments i les activitats de la zona:</p>
${taxonomyLinksHtml(DESTINATIONS, "/destinacions/")}

<h3>Quant costa dormir-hi?</h3>
<p>A cada fitxa hi ha el preu aproximat per persona i nit que hem calculat. Com a referència, les cases rurals i els càmpings solen ser l'opció més continguda, els hotels amb encant es mouen en una forquilla mitjana i les cabanes als arbres i els allotjaments més singulars són els que pugen més. Els preus varien segons la temporada i el dia de la setmana, així que el que veureu a la pàgina de reserva mana per sobre del nostre.</p>

<h3>Reservar i cancel·lar</h3>
<p>Des de cada fitxa podeu anar directament a la pàgina de reserva de l'allotjament per veure la disponibilitat i les condicions reals de les dates que us interessin. Les condicions de cancel·lació i el que inclou el preu depenen de cada establiment, i sempre les trobareu allà.</p>

<p>I un cop tingueu l'allotjament, us podeu muntar el cap de setmana amb les <a href="/activitats">experiències per fer en parella</a> que hi ha a prop, o agafar idees fetes a les nostres <a href="/llistes">llistes d'escapades</a>.</p>`;

	// L'API compta les pàgines des de 0: la tanda que ve després de la
	// `currentPage` (base 1) és justament `currentPage`.
	const loadMoreResults = async () => {
		setState((prev) => ({ ...prev, isFetching: true }));
		const { places: nextPlaces } = await service.paginatePlaces(
			state.currentPage,
		);
		setState((prev) => ({
			...prev,
			places: [...prev.places, ...nextPlaces],
			isFetching: false,
			currentPage: prev.currentPage + 1,
		}));
	};

	const pageUrl = `https://escapadesenparella.cat${pagePath(
		BASE_PATH,
		currentPage,
	)}`;

	const checkAreFiltersActive = () => {
		return (
			state.queryPlaceCategory.length == 0 &&
			state.queryPlaceRegion == 0 &&
			state.queryPlaceSeason == 0
		);
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
					<path
						stroke="none"
						d="M0 0h24v24H0z"
						fill="none"
					/>
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
				{state.selectedCount &&
				state.selectedCount > 0 ? (
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
					<path
						stroke="none"
						d="M0 0h24v24H0z"
						fill="none"
					/>
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
				title={pageTitle("Allotjaments amb encant", currentPage)}
				description="Allotjaments amb encant a Catalunya. Busques hotels amb encant o cases rurals a Catalunya? Aquí trobaràs els millors els millors."
				url={pageUrl}
				image="https://escapadesenparella.cat/img/containers/main/img/og-histories.png/69081998ba0dfcb1465f7f878cbc7912.png"
				canonical={pageUrl}
			/>
			{/* Rich snippets */}
			<BreadcrumbRichSnippet
				page1Title="Inici"
				page1Url="https://escapadesenparella.cat"
				page2Title="Allotjaments amb encant"
				page2Url={`https://escapadesenparella.cat/allotjaments`}
			/>
			<div id="contentList" className="place">
				<NavigationBar />
				<main>
					{/* Main column - Listings */}
					<ListingHeader
						title={`Allotjaments amb encant a Catalunya`}
						subtitle={`Descobreix una selecció de <strong>${state.numPlaces} allotjaments amb encant</strong>, des d'<strong>hotels boutique</strong>, <strong>apartaments</strong>, <strong>cabanyes als arbres</strong> i <strong>cases rurals de somni</strong> per fer que la vostra propera escapada en parella sigui inoblidable!`}
						breadcrumbLevel1={"Allotjaments amb encant"}
						actions={listingActions}
					/>


					{/* Section places */}
					<section className="pt-6 md:pt-8">
						<div className="container">
							<TaxonomyChips
								heading="Allotjaments per tipus"
								items={STAY_CATEGORIES}
								className="mb-5 md:mb-7"
							/>
							<ListingGrid
								items={state.places}
								isLoading={!state.hasPlaces}
								skeletonCount={12}
								eagerCount={2}
							/>
							{state.currentPage < state.numPages &&
							checkAreFiltersActive() ? (
								<LoadMoreLink
									href={pagePath(
										BASE_PATH,
										state.currentPage + 1,
									)}
									isFetching={state.isFetching}
									onLoadMore={loadMoreResults}
								/>
							) : null}
						</div>
					</section>

					{/* El text del peu només va a la primera pàgina, perquè
					    les altres no el repeteixin */}
					{currentPage === 1 && textareaFooter !== "" ? (
						<ListingsTextareaFooter
							textareaFooter={textareaFooter}
							relatedLinks={DESTINATIONS}
							relatedLinksHeading="Allotjaments per destinació"
							relatedLinksPrefix="/destinacions/"
						/>
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
					items={state.allPlaces}
				/>
			) : null}

			<FilterListingsModal
				variant="places"
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

/**
 * Props d'una pàgina del llistat d'allotjaments. També les fa servir
 * `pages/allotjaments/pagina/[pagina].js` per a la resta de tandes.
 */
export const getPlacesPageProps = async (page = 1) => {
	const service = new ContentService();
	const { totalItems, places, allPlaces, numPages } =
		await service.paginatePlaces(page - 1);

	if (page > 1 && page > numPages) {
		return { notFound: true };
	}

	// `allPlaces` només alimenta els marcadors del mapa i `places` les fitxes.
	return {
		props: {
			totalItems,
			places: (places || []).map(toListingCard),
			allPlaces: (allPlaces || []).map(toMapMarker),
			numPages,
			currentPage: page,
		},
	};
};

export async function getServerSideProps() {
	return getPlacesPageProps();
}

export default PlaceList;
