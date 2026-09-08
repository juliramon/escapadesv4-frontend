import { useEffect, useState } from "react";
import ContentService from "../services/contentService";
import { toListingCard, toMapMarker } from "../utils/listingProps";
import NavigationBar from "../components/global/NavigationBar";
import ListingGrid from "../components/listings/ListingGrid";
import TaxonomyChips from "../components/listings/TaxonomyChips";
import MobileAnchorAd from "../components/ads/MobileAnchorAd";
import {
	DESTINATIONS,
	GETAWAY_CATEGORIES,
	taxonomyLinksHtml,
} from "../utils/siteTaxonomy";
import Footer from "../components/global/Footer";
import MapModal from "../components/modals/MapModal";
import BreadcrumbRichSnippet from "../components/richsnippets/BreadcrumbRichSnippet";
import GlobalMetas from "../components/head/GlobalMetas";
import ListingHeader from "../components/headers/ListingHeader";
import ListingsTextareaFooter from "../components/listings/ListingsTextareaFooter";
import FilterActivitiesModal from "../components/modals/FilterActivitiesModal";

const ActivityList = ({
	totalItems,
	activities,
	allActivities,
	featuredActivities,
	numPages,
}) => {
	const initialState = {
		activities: [],
		featuredActivities: [],
		allActivities: [],
		queryActivityRegion: [],
		queryActivityCategory: [],
		queryActivitySeason: [],
		updateSearch: false,
		hasActivities: false,
		isFetching: false,
		numActivities: 0,
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
		if (activities) {
			setState({
				...state,
				activities: activities,
				featuredActivities: featuredActivities,
				allActivities: allActivities,
				hasActivities: true,
				numActivities: totalItems,
				numPages: numPages,
			});
		}
	}, []);

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

	useEffect(() => {
		if (state.updateSearch === true) {
			service
				.searchActivities(
					state.queryActivityRegion,
					state.queryActivityCategory,
					state.queryActivitySeason
				)
				.then((res) => {
					setState({
						...state,
						activities: res,
						updateSearch: false,
					});
				});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.updateSearch]);

	// Bloc de text del peu del llistat. Es manté a la pàgina (i no a l'API)
	// perquè inclou el comptador real i els enllaços a la taxonomia.
	const textareaFooter = `<h2>Activitats originals per fer en parella a Catalunya</h2>
<p>Aquí hi ha <strong>${state.numActivities} activitats per fer en parella</strong> arreu de Catalunya, de la Costa Brava als Pirineus. N'hi ha per a tots els ritmes: rutes a peu i vies ferrades, tastos de vi i visites a cellers, museus i pobles amb encant, o un dia de neu. Cada fitxa porta la ubicació, la durada aproximada i el preu orientatiu per persona, perquè pugueu decidir sense haver de buscar-ho a deu llocs.</p>

<h3>Escolliu per tipus d'escapada</h3>
<p>Totes les activitats estan classificades pel pla que us ve de gust. Si ja sabeu què busqueu, aneu directament a la categoria:</p>
${taxonomyLinksHtml(GETAWAY_CATEGORIES)}

<h3>Activitats per zones de Catalunya</h3>
<p>Si el que teniu decidit és la zona i no el pla, cada destinació té la seva pàgina amb les activitats i els allotjaments que hi ha a prop:</p>
${taxonomyLinksHtml(DESTINATIONS, "/destinacions/")}

<h3>Quant costa una activitat en parella?</h3>
<p>Depèn molt del pla. Les rutes i excursions acostumen a ser gratuïtes i només cal comptar-hi el desplaçament; les visites guiades i els tastos solen moure's en un rang assequible per persona, i les experiències més especials —globus, activitats d'aventura amb guia— pugen força. A cada fitxa hi trobareu el preu aproximat que hem calculat, tenint en compte que pot variar segons la temporada i que no sempre està actualitzat al minut.</p>

<h3>Quan hi anem?</h3>
<p>Catalunya dona joc tot l'any i el pla canvia molt segons el mes. A la primavera i la tardor és quan més bé es camina; a l'estiu guanyen les activitats d'aigua i les nits a fora; a l'hivern, la neu i els plans de recer. Ho tenim ordenat a <a href="/escapades-estiu">escapades d'estiu</a> i <a href="/escapades-hivern">escapades d'hivern</a>, i si només teniu dos dies, a <a href="/escapades-de-cap-de-setmana">escapades de cap de setmana</a>.</p>

<p>I si voleu allargar el pla i quedar-vos a dormir, mireu els <a href="/allotjaments">allotjaments amb encant</a> que hem anat trobant: hotels petits, cases rurals, cabanes i refugis.</p>`;

	const loadMoreResults = async (page) => {
		setState({ ...state, isFetching: true });
		const { activities } = await service.paginateActivities(page);
		setState({
			...state,
			activities: [...state.activities, ...activities],
			isFetching: false,
			currentPage: ++state.currentPage,
		});
	};

	const checkAreFiltersActive = () => {
		return (
			state.queryActivityCategory.length == 0 &&
			state.queryActivityRegion == 0 &&
			state.queryActivitySeason == 0
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
				title="Activitats originals a Catalunya en parella"
				description="Activitats a Catalunya per a gaudir d'experiències originals en parella. Troba les millors activitats en parella, excursions i activitats originals en parella."
				url="https://escapadesenparella.cat/activitats"
				image="https://res.cloudinary.com/juligoodie/image/upload/v1657047006/getaways-guru/static-activities-cover/photo_2022-07-05_20.48.38_zsnyc7.jpg"
				canonical="https://escapadesenparella.cat/activitats"
			/>
			{/* Rich snippets */}
			<BreadcrumbRichSnippet
				page1Title="Inici"
				page1Url="https://escapadesenparella.cat"
				page2Title="Activitats en parella"
				page2Url={`https://escapadesenparella.cat/activitats`}
			/>
			<div id="contentList" className="activity relative">
				<NavigationBar />
				<main>
					{/* Header */}
					<ListingHeader
						title={`Activitats originals en parella a Catalunya`}
						subtitle={`Us proposem ${state.numActivities} <strong>activitats per fer en parella a Catalunya</strong>. Descobriu <strong>activitats originals</strong> i <strong>experiències per fer en parella</strong>, des de rutes i excursions, a restaurants i paisatges increïbles per a una escapada en parella extraordinària!`}
						breadcrumbLevel1={"Activitats en parella"}
						actions={listingActions}
					/>


					{/* Section listings */}
					<section className="pt-6 md:pt-8">
						<div className="container">
							<TaxonomyChips
								heading="Experiències per tipus d'escapada"
								items={GETAWAY_CATEGORIES}
								className="mb-5 md:mb-7"
							/>
							<ListingGrid
								items={state.activities}
								isLoading={!state.hasActivities}
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
							relatedLinksHeading="Experiències per destinació"
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
					items={state.allActivities}
				/>
			) : null}

			<FilterActivitiesModal
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
	const { totalItems, activities, allActivities, numPages } =
		await service.activities();

	// `allActivities` només alimenta els marcadors del mapa i `activities` les
	// fitxes; la resta de camps del document no es pinten en aquesta pàgina.
	return {
		props: {
			totalItems,
			activities: (activities || []).map(toListingCard),
			allActivities: (allActivities || []).map(toMapMarker),
			numPages,
		},
	};
}

export default ActivityList;
