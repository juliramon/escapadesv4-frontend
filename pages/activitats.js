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
		emptyBlocksPerRow: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
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

	const textareaFooter = `<h2>Activitats originals en parella a Catalunya</h2>
<p>Busques idees per sorprendre la teva parella amb plans diferents i emocionants? Catalunya és un lloc ple d'opcions per gaudir d'<strong>activitats originals en parella</strong>, des de rutes d'aventura fins a experiències úniques que no oblidareu mai. Si voleu trencar amb la rutina i crear moments especials junts, aquí trobaràs inspiració per al vostre pròxim cap de setmana.</p>

<h3>Experiències en parella per gaudir al màxim</h3>
<p>Si el que desitgeu són experiències memorables, Catalunya ofereix infinitat de possibilitats per a les millors <strong>experiències en parella</strong>. Des de volar en globus sobre paisatges espectaculars fins a fer una degustació de vins en una masia amb encant, cada proposta està pensada per sorprendre i enamorar. Descobreix activitats per fer en parella que us permetran connectar i viure emocions noves junts.</p>

<h3>Activitats en parella a Barcelona i més enllà</h3>
<p>Barcelona, amb la seva rica oferta cultural i d'oci, és l'escenari perfecte per a <strong>activitats en parella</strong>. Pugeu al Tibidabo per gaudir de vistes panoràmiques, exploreu museus interactius o feu un tour gastronòmic pel barri Gòtic. A més de Barcelona, Catalunya té molts altres indrets on viure aventures en parella, com rutes de senderisme per la Garrotxa o visites a coves i espais naturals.</p>

<h2>Activitats originals per a un cap de setmana únic</h2>
<p>Planificar <strong>caps de setmana originals</strong> a Catalunya és fàcil gràcies a la varietat d'opcions que aquesta regió ofereix. Des d'activitats aquàtiques com caiac o paddle surf fins a experiències culturals com visites a monestirs o espectacles de música en viu, podreu personalitzar el vostre cap de setmana segons els vostres interessos. Aquestes activitats a Catalunya faran que cada escapada sigui única i especial.</p>

<h3>Plans en parella per descobrir Catalunya</h3><p>Quan es tracta de <strong>plans en parella a Catalunya</strong>, les opcions són infinites. Gaudiu de passejades romàntiques per pobles amb encant com Besalú o Peratallada, passegeu pels camps de lavanda al Delta de l'Ebre o feu excursions per parcs naturals. Cada regió té llocs increïbles per visitar amb la teva parella, fent de cada escapada una aventura plena de descobriments.</p><p>Explorar <strong>llocs de Catalunya per anar amb la teva parella</strong> no només enfortirà el vostre vincle, sinó que també us permetrà viure moments plens de màgia i sorpresa. Així que prepareu-vos per descobrir junts el millor de Catalunya amb activitats inoblidables que us deixaran amb ganes de repetir.</p>`;

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
			{/* w-full lg:w-1/4 2xl:w-1/6 lg:pb-20 */}
			<div id="contentList" className="activity relative">
				<NavigationBar
					logo_url={
						"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
					}
				/>
				<main>
					{/* Top row - Filters 
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
							</div> */}

					{/* Main column - Listings */}
					<section className="lg:mt-6">
						<div className="container">
							<ul className="breadcrumb max-w-5xl">
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
								subtitle={`Descobreix ${state.numActivities} <strong>activitats en parella a Catalunya</strong>. Us recomanem activitats originals en parella, experiències en parella, excursions, restaurants i llocs de Catalunya per a una escapada en parella extraordinària!`}
							/>
						</div>
					</section>

					{/* Section activities */}
					<section className="pt-8">
						<div className="container">
							<div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5">
								{state.hasActivities
									? state.activities.map((el, idx) => {
											const priority =
												idx === 0 || idx === 1
													? "eager"
													: "lazy";
											return (
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
													categoria={el.categories}
													duration={el.duration}
													website={el.website}
													phone={el.phone}
													isVerified={el.isVerified}
													location={`${
														el.activity_locality ===
														undefined
															? el.activity_country
															: el.activity_locality
													}`}
													priority={priority}
												/>
											);
									  })
									: state.emptyBlocksPerRow.map((el, idx) => (
											<div
												key={idx}
												className="w-full"
												role="status"
											>
												<div className="flex justify-center items-center w-full aspect-[4/3] bg-gray-300 rounded-2xl animate-pulse dark:bg-gray-700">
													<div className="flex justify-center items-center w-full h-48 bg-gray-300 rounded-md sm:w-96 dark:bg-gray-700">
														<svg
															className="w-12 h-12 text-gray-200"
															xmlns="http://www.w3.org/2000/svg"
															aria-hidden="true"
															fill="currentColor"
															viewBox="0 0 640 512"
														>
															<path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
														</svg>
													</div>
													<span className="sr-only">
														Loading...
													</span>
												</div>
											</div>
									  ))}
							</div>
							{state.currentPage !== state.numPages &&
							checkAreFiltersActive() ? (
								<div className="col-span-1 md:col-span-3 2xl:col-span-4 w-full mt-10 flex justify-center">
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
						<section>
							<div className="container">
								<div className="border-t border-primary-100 py-8 mt-8 md:py-12 md:mt-12 lg:py-20 lg:mt-20">
									<div
										className="w-full max-w-prose mx-auto text-block"
										dangerouslySetInnerHTML={{
											__html: textareaFooter,
										}}
									></div>
								</div>
							</div>
						</section>
					) : null}
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
	const { totalItems, activities, allActivities, numPages } =
		await service.activities();

	return {
		props: {
			totalItems,
			activities,
			allActivities,
			numPages,
		},
	};
}

export default ActivityList;
