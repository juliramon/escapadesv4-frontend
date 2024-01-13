import { useEffect, useState } from "react";
import ContentService from "../services/contentService";
import NavigationBar from "../components/global/NavigationBar";
import PublicSquareBox from "../components/listings/PublicSquareBox";
import Footer from "../components/global/Footer";
import MapModal from "../components/modals/MapModal";
import BreadcrumbRichSnippet from "../components/richsnippets/BreadcrumbRichSnippet";
import GlobalMetas from "../components/head/GlobalMetas";
import ListingHeader from "../components/headers/ListingHeader";

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
		isFilterActive: false,
		isMobileFilterPanelDisplated: false,
	};

	const [state, setState] = useState(initialState);
	const [stateModalMap, setStateModalMap] = useState(false);

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
			if (query.length < 1) {
				query.push(`${e.target.name}=${e.target.id}`);
			} else {
				query.push(e.target.id);
			}
		} else {
			let index = query.indexOf(e.target.id);
			query.splice(index, 1);
		}
		setState({
			...state,
			queryActivityRegion: query,
			updateSearch: true,
		});
	};

	const handleCheckCategory = (e) => {
		let query = state.queryActivityCategory;
		if (e.target.checked === true) {
			if (query.length < 1) {
				query.push(`${e.target.name}=${e.target.id}`);
			} else {
				query.push(e.target.id);
			}
		} else {
			let index = query.indexOf(e.target.id);
			query.splice(index, 1);
		}

		setState({
			...state,
			queryActivityCategory: query,
			updateSearch: true,
		});
	};

	const handleCheckSeason = (e) => {
		let query = state.queryActivitySeason;
		if (e.target.checked === true) {
			if (query.length < 1) {
				query.push(`${e.target.name}=${e.target.id}`);
			} else {
				query.push(e.target.id);
			}
		} else {
			let index = query.indexOf(e.target.id);
			query.splice(index, 1);
		}
		setState({
			...state,
			queryActivitySeason: query,
			updateSearch: true,
		});
	};

	const center = {
		lat: 41.3948976,
		lng: 2.0787283,
	};

	const getMapOptions = (maps) => {
		return {
			disableDefaultUI: true,
			styles: [
				{
					featureType: "poi",
					elementType: "labels",
					styles: [{ visibility: "on" }],
				},
			],
		};
	};

	const renderMarker = (map, maps) => {
		const bounds = new maps.LatLngBounds();
		state.allActivities.forEach((activity) => {
			const position = {
				lat: parseFloat(activity.activity_lat),
				lng: parseFloat(activity.activity_lng),
			};
			const contentString = `<a href="/activitats/${activity.slug}" title="${activity.title}" class="gmaps-infobox" target="_blank">
        <div class="gmaps-infobox__picture">
          <picture class="block rounded-md overflow-hidden aspect-w-1 aspect-h-1">
            <img src="${activity.images[0]}" alt="${activity.title}" class="object-cover w-full h-full" width="80" height="80">
          </picture>
        </div>
        <div class="gmaps-infobox__text">
          <span class="gmaps-infobox__title">${activity.title}</span>
          <span class="gmaps-infobox__intro">${activity.subtitle}</span>
        </div>
        </a>`;
			const infowindow = new maps.InfoWindow({
				content: contentString,
			});
			const marker = new maps.Marker({
				position: position,
				map,
				icon: "../../map-marker.svg",
			});
			bounds.extend(marker.position);
			marker.addListener("click", () => infowindow.open(map, marker));
		});
		map.fitBounds(bounds);
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

	const textareaFooter = `<p>Calceu-vos les botes, poseu-vos el banyador, prepareu-vos la motxilla o despengeu l'anorac; aquí trobareu les millors <strong>activitats a Catalunya</strong> per a una escapada en parella que no oblidareu.</p>
	<p>Catalunya és un destí ideal per a realitzar activitats originals en parella. Amb la seva meravellosa costa mediterrània, pobles encantadors i rica història cultural, ens ofereix un vetall de possibilitats infinit per viure <strong>experiències en parella</strong> de tot tipus.</p>
	<p>Un dels llocs imperdibles per a fer <strong>activitats en parella</strong> és Barcelona. Amb la seva arquitectura icònica, museus de classe mundial i vida nocturna vibrant; sempre hi trobareu alguna cosa a fer a la ciutat.</p>
	<p>Per a <strong>activitats d'aventura</strong>, als Pirineus hi trobareu mil i una opcions, ja sigui realitzant sortides de senderisme o esquí, entre d'altres activitats. Sabíes que la regió és seu d'alguns dels millors resorts d'esquí d'Espanya? El paisatge és espectacular!</p>
	<p>Per últim, per a activitats de relax, activitats en parella culturals, o activitats en parella gastronòmiques, no dubtis en visitar la Costa Brava, la Costa Daurada, el Camp de Tarragona o el Delta de l'Ebre. Aquestes regions ofereixen propostes que s'adapten a cada parella.</p>`;

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

	return (
		<>
			{/* Browser metas  */}
			<GlobalMetas
				title="Activitats en parella"
				description="Activitats en parella a Catalunya. Troba les millors excursions, activitats d'aventura i plans per fer en parella a Catalunya."
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
			{/* w-full lg:w-1/4 2xl:w-1/6 lg:pb-20 */}
			<div id="contentList" className="activity relative">
				<NavigationBar
					logo_url={
						"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
					}
				/>
				<main>
					<div className="container">
						<div className="flex flex-wrap pt-6">
							{/* Left column - Filters */}
							<div
								className={`fixed lg:static w-full lg:w-1/5 2xl:w-1/6 lg:pb-20 p-5 lg:p-0 z-50 lg:z-0 inset-0 h-screen lg:h-auto overflow-y-auto lg:overflow-visible bg-white lg:bg-transparent transition-all duration-300 ease-in-out ${state.isMobileFilterPanelDisplated
									? "translate-x-0"
									: "-translate-x-full lg:translate-x-0"
									}`}
							>
								<button
									className="absolute z-50 right-3 top-3 lg:hidden"
									onClick={() =>
										setState({
											...state,
											isMobileFilterPanelDisplated: false,
										})
									}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="text-primary-500"
										width="30"
										height="30"
										viewBox="0 0 24 24"
										strokeWidth="3"
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
										<line x1="18" y1="6" x2="6" y2="18" />
										<line x1="6" y1="6" x2="18" y2="18" />
									</svg>
								</button>
								<div className="flex flex-col lg:sticky lg:top-[95px]">
									<div className="pb-5">
										<span className="text-xs uppercase text-primary-400 tracking-wider mb-2 block">
											Regió
										</span>
										<fieldset>
											<label className="cursor-pointer text-sm">
												<input
													type="checkbox"
													name="activityRegion"
													id="barcelona"
													onChange={handleCheckRegion}
													className="mr-2"
												/>
												Barcelona
											</label>
										</fieldset>
										<fieldset>
											<label className="cursor-pointer text-sm">
												<input
													type="checkbox"
													name="activityRegion"
													id="girona"
													onChange={handleCheckRegion}
													className="mr-2"
												/>
												Girona
											</label>
										</fieldset>
										<fieldset>
											<label className="cursor-pointer text-sm">
												<input
													type="checkbox"
													name="activityRegion"
													id="lleida"
													onChange={handleCheckRegion}
													className="mr-2"
												/>
												Lleida
											</label>
										</fieldset>
										<fieldset>
											<label className="cursor-pointer text-sm">
												<input
													type="checkbox"
													name="activityRegion"
													id="tarragona"
													onChange={handleCheckRegion}
													className="mr-2"
												/>
												Tarragona
											</label>
										</fieldset>
										<fieldset>
											<label className="cursor-pointer text-sm">
												<input
													type="checkbox"
													name="activityRegion"
													id="costaBrava"
													onChange={handleCheckRegion}
													className="mr-2"
												/>
												Costa Brava
											</label>
										</fieldset>
										<fieldset>
											<label className="cursor-pointer text-sm">
												<input
													type="checkbox"
													name="activityRegion"
													id="costaDaurada"
													onChange={handleCheckRegion}
													className="mr-2"
												/>
												Costa Daurada
											</label>
										</fieldset>
										<fieldset>
											<label className="cursor-pointer text-sm">
												<input
													type="checkbox"
													name="activityRegion"
													id="pirineus"
													onChange={handleCheckRegion}
													className="mr-2"
												/>
												Pirineus
											</label>
										</fieldset>
									</div>
									<div className="py-5">
										<span className="text-xs uppercase text-primary-400 tracking-wider mb-2 block">
											Categoria
										</span>
										<fieldset>
											<label className="cursor-pointer text-sm">
												<input
													type="checkbox"
													name="activityCategory"
													id="romantica"
													onChange={
														handleCheckCategory
													}
													className="mr-2"
												/>
												Romàntiques
											</label>
										</fieldset>
										<fieldset>
											<label className="cursor-pointer text-sm">
												<input
													type="checkbox"
													name="activityCategory"
													id="aventura"
													onChange={
														handleCheckCategory
													}
													className="mr-2"
												/>
												Aventura
											</label>
										</fieldset>
										<fieldset>
											<label className="cursor-pointer text-sm">
												<input
													type="checkbox"
													name="activityCategory"
													id="gastronomica"
													onChange={
														handleCheckCategory
													}
													className="mr-2"
												/>
												Gastronòmiques
											</label>
										</fieldset>
										<fieldset>
											<label className="cursor-pointer text-sm">
												<input
													type="checkbox"
													name="activityCategory"
													id="cultural"
													onChange={
														handleCheckCategory
													}
													className="mr-2"
												/>
												Culturals
											</label>
										</fieldset>
										<fieldset>
											<label className="cursor-pointer text-sm">
												<input
													type="checkbox"
													name="activityCategory"
													id="relax"
													onChange={
														handleCheckCategory
													}
													className="mr-2"
												/>
												Relax
											</label>
										</fieldset>
									</div>
									<div className="py-5">
										<span className="text-xs uppercase text-primary-400 tracking-wider mb-2 block">
											Temporada
										</span>
										<fieldset>
											<label className="cursor-pointer text-sm">
												<input
													type="checkbox"
													name="activitySeason"
													id="hivern"
													onChange={handleCheckSeason}
													className="mr-2"
												/>
												Hivern
											</label>
										</fieldset>
										<fieldset>
											<label className="cursor-pointer text-sm">
												<input
													type="checkbox"
													name="activitySeason"
													id="primavera"
													onChange={handleCheckSeason}
													className="mr-2"
												/>
												Primavera
											</label>
										</fieldset>
										<fieldset>
											<label className="cursor-pointer text-sm">
												<input
													type="checkbox"
													name="activitySeason"
													id="estiu"
													onChange={handleCheckSeason}
													className="mr-2"
												/>
												Estiu
											</label>
										</fieldset>
										<fieldset>
											<label className="cursor-pointer text-sm">
												<input
													type="checkbox"
													name="placeSeason"
													id="tardor"
													onChange={handleCheckSeason}
													className="mr-2"
												/>
												Tardor
											</label>
										</fieldset>
									</div>
								</div>
							</div>
							{/* Main column - Listings */}
							<div className="w-full lg:w-4/5 2xl:w-5/6">
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
											Experiències en parella
										</span>
									</li>
								</ul>

								<ListingHeader
									title={`<span class="text-secondary-500">Activitats</span> originals en parella a Catalunya`}
									subtitle={`Descobreix <span class="inline-block relative after:absolute after:inset-x-0 after:bottom-px after:w-full after:h-0.5 after:bg-secondary-500">${state.numActivities} activitats en parella a Catalunya</span>. Us recomanem activitats originals en parella, experiències en parella, excursions, restaurants i llocs de Catalunya per a una escapada en parella extraordinària!`}
								/>

								<section>
									<h2 className="mt-0 mb-1.5">
										Experiències més ben valorades
									</h2>
									<div className="text-primary-400 text-[15px] font-light">
										Vuit activitats originals en parella a
										Catalunya totalment recomanables
									</div>
									<div className="flex flex-wrap items-start mt-3 -mx-1.5">
										{state.hasActivities
											? state.featuredActivities.map(
												(el) => (
													<PublicSquareBox
														key={el._id}
														type={el.type}
														slug={el.slug}
														id={el._id}
														cover={el.cover}
														title={el.title}
														subtitle={
															el.subtitle
														}
														rating={
															el.activity_rating ||
															el.place_rating
														}
														placeType={
															el.placeType
														}
														categoria={
															el.categories
														}
														duration={
															el.duration
														}
														website={el.website}
														phone={el.phone}
														isVerified={
															el.isVerified
														}
														location={`${el.activity_locality ===
															undefined
															? el.activity_country
															: el.activity_locality
															}`}
													/>
												)
											)
											: null}
									</div>
								</section>

								<section className="pt-3 md:pt-4">
									<div className="flex flex-wrap items-stretch -mx-1.5">
										<div className="w-full lg:w-8/12 px-1.5">
											<div className="p-10 rounded-md shadow-md h-full relative overflow-hidden">
												<picture className="absolute w-full h-full inset-0 before:content before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary-600 before:to-transparent before:bg-opacity-50">
													<source
														srcSet="/activitats-banner.webp"
														type="image/webp"
													/>
													<img
														src="/activitats-banner.jpg"
														alt=""
														className="w-full h-full object-cover"
														loading="lazy"
													/>
												</picture>
												<div className="relative z-10">
													<h3 className="mb-6 max-w-xs text-white">
														T'agradaria que la teva
														activitat sortís en
														aquesta llista? Busques
														idees per una escapada
														en parella de única?
													</h3>
													<a
														href="/contacte"
														title="Contacta'ns"
														className="button button__secondary button__med"
														target="_blank"
													>
														Contacta'ns
													</a>
												</div>
											</div>
										</div>
										<div className="w-full lg:w-4/12 px-1.5 mt-4 lg:mt-0">
											<div className="bg-green-100 rounded-md overflow-hidden shadow-md h-full p-10 flex flex-col items-center justify-center relative">
												<picture className="absolute w-full h-full inset-0 before:content before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary-600 before:to-transparent before:bg-opacity-50">
													<source
														srcSet="/banner-map.webp"
														type="image/webp"
													/>
													<img
														src="/banner-map.jpg"
														alt=""
														className="w-full h-full object-cover"
														loading="lazy"
													/>
												</picture>
												<div className="relative z-10 flex flex-col items-center justify-center">
													<h3 className="text-center mt-0 mb-4 max-w-xs px-6 text-white">
														Veure el mapa
														d'activitats a Catalunya
													</h3>
													<button
														className="button button__secondary button__med"
														onClick={() =>
															setStateModalMap(
																!stateModalMap
															)
														}
													>
														Obrir mapa
													</button>
												</div>
											</div>
										</div>
									</div>
								</section>

								<section className="py-8 md:py-10">
									<h2 className="mt-0 mb-1.5">
										Activitats afegides recentment
									</h2>
									<div className="text-primary-400 text-[15px] font-light">
										Aquestes són les activitats per fer en
										parella publicades darrerament
									</div>
									<div className="flex flex-wrap items-start mt-3 -mx-1.5">
										{state.hasActivities
											? state.activities.map((el) => (
												<PublicSquareBox
													key={el._id}
													type={el.type}
													slug={el.slug}
													id={el._id}
													cover={el.cover}
													title={el.title}
													subtitle={el.subtitle}
													rating={
														el.activity_rating ||
														el.place_rating
													}
													placeType={el.placeType}
													categoria={
														el.categories
													}
													duration={el.duration}
													website={el.website}
													phone={el.phone}
													isVerified={
														el.isVerified
													}
													location={`${el.activity_locality ===
														undefined
														? el.activity_country
														: el.activity_locality
														}`}
												/>
											))
											: null}
									</div>
									{state.currentPage !== state.numPages &&
										checkAreFiltersActive() ? (
										<div className="w-full mt-6 flex justify-center">
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
									{textareaFooter !== "" ? (
										<div className="border-t border-primary-100 pt-10 mt-10">
											<div
												className="w-full max-w-prose mx-auto text-block text-primary-400"
												dangerouslySetInnerHTML={{
													__html: textareaFooter,
												}}
											></div>
										</div>
									) : null}
								</section>
							</div>
						</div>
					</div>
				</main>
			</div>

			<Footer />
			{stateModalMap == true ? (
				<MapModal
					visibility={stateModalMap}
					hideModal={setStateModalMap}
					center={center}
					getMapOptions={getMapOptions}
					renderMarker={renderMarker}
				/>
			) : null}
			<button
				className="fixed left-1/2 -translate-x-1/2 bottom-4 lg:hidden button button__primary button__med px-6"
				onClick={() =>
					setState({ ...state, isMobileFilterPanelDisplated: true })
				}
			>
				Filtrar activitats
			</button>
		</>
	);
};

export async function getServerSideProps({ params }) {
	const service = new ContentService();
	const featuredActivities = await service.getFeaturedActivities();
	const { totalItems, activities, allActivities, numPages } =
		await service.activities();

	return {
		props: {
			totalItems,
			activities,
			allActivities,
			featuredActivities,
			numPages,
		},
	};
}

export default ActivityList;
