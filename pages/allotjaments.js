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
import FilterPlacesModal from "../components/modals/FilterPlacesModal";

const PlaceList = ({
	totalItems,
	places,
	allPlaces,
	featuredPlaces,
	numPages,
}) => {
	const initialState = {
		places: [],
		featuredPlaces: [],
		allPlaces: [],
		queryPlaceRegion: [],
		queryPlaceCategory: [],
		queryPlaceSeason: [],
		updateSearch: false,
		hasPlaces: false,
		isFetching: false,
		numPlaces: 0,
		numPages: 0,
		currentPage: 1,
		isFilterModalOpen: false,
		selectedCount: 0,
		isMapModalOpen: false,
		emptyBlocksPerRow: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
	};

	const [state, setState] = useState(initialState);

	const service = new ContentService();

	useEffect(() => {
		if (places) {
			setState({
				...state,
				places: places,
				featuredPlaces: featuredPlaces,
				allPlaces: allPlaces,
				hasPlaces: true,
				numPlaces: totalItems,
				numPages: numPages,
			});
		}
	}, []);

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

	const loadMoreResults = async (page) => {
		setState({ ...state, isFetching: true });
		const { places } = await service.paginatePlaces(page);
		setState({
			...state,
			places: [...state.places, ...places],
			isFetching: false,
			currentPage: ++state.currentPage,
		});
	};

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
				title="Allotjaments amb encant"
				description="Allotjaments amb encant a Catalunya. Busques hotels amb encant o cases rurals a Catalunya? Aquí trobaràs els millors els millors."
				url="https://escapadesenparella.cat/allotjaments"
				image="https://escapadesenparella.cat/img/containers/main/img/og-histories.png/69081998ba0dfcb1465f7f878cbc7912.png"
				canonical="https://escapadesenparella.cat/allotjaments"
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
							{state.currentPage !== state.numPages &&
							checkAreFiltersActive() ? (
								<div className="col-span-full w-full mt-10 flex justify-center">
									{!state.isFetching ? (
										<button
											className="button button__primary button__lg"
											onClick={() =>
												loadMoreResults(
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
						</div>
					</section>

					{textareaFooter !== "" ? (
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

			<FilterPlacesModal
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

export async function getServerSideProps({ params }) {
	const service = new ContentService();
	const { totalItems, places, allPlaces, numPages } =
		await service.getAllPlaces();

	// `allPlaces` només alimenta els marcadors del mapa i `places` les fitxes.
	return {
		props: {
			totalItems,
			places: (places || []).map(toListingCard),
			allPlaces: (allPlaces || []).map(toMapMarker),
			numPages,
		},
	};
}

export default PlaceList;
