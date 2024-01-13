import { useEffect, useState } from "react";
import ContentService from "../services/contentService";
import NavigationBar from "../components/global/NavigationBar";
import PublicSquareBox from "../components/listings/PublicSquareBox";
import Footer from "../components/global/Footer";
import MapModal from "../components/modals/MapModal";
import BreadcrumbRichSnippet from "../components/richsnippets/BreadcrumbRichSnippet";
import GlobalMetas from "../components/head/GlobalMetas";
import ListingHeader from "../components/headers/ListingHeader";

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
		queryPlaceType: [],
		queryPlaceRegion: [],
		queryPlaceCategory: [],
		queryPlaceSeason: [],
		updateSearch: false,
		hasPlaces: false,
		isFetching: false,
		numPlaces: 0,
		currentPage: 1,
	};

	const [state, setState] = useState(initialState);
	const [stateModalMap, setStateModalMap] = useState(false);

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

	const handleCheckType = (e) => {
		let query = state.queryPlaceType;
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
		setState({ ...state, queryPlaceType: query, updateSearch: true });
	};

	const handleCheckRegion = (e) => {
		let query = state.queryPlaceRegion;
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
		setState({ ...state, queryPlaceRegion: query, updateSearch: true });
	};

	const handleCheckCategory = (e) => {
		let query = state.queryPlaceCategory;
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
		setState({ ...state, queryPlaceCategory: query, updateSearch: true });
	};

	const handleCheckSeason = (e) => {
		let query = state.queryPlaceSeason;
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
		setState({ ...state, queryPlaceSeason: query, updateSearch: true });
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

	let renderMarker = (map, maps) => {
		state.allPlaces.forEach((place) => {
			const position = {
				lat: parseFloat(place.place_lat),
				lng: parseFloat(place.place_lng),
			};
			const contentString = `<a href="/allotjaments/${place.slug}" title="${place.title}" class="gmaps-infobox" target="_blank">
        <div class="gmaps-infobox__picture">
          <picture class="block rounded-md overflow-hidden aspect-w-1 aspect-h-1">
            <img src="${place.images[0]}" alt="${place.title}" class="object-cover w-full h-full" width="80" height="80">
          </picture>
        </div>
        <div class="gmaps-infobox__text">
          <span class="gmaps-infobox__title">${place.title}</span>
          <span class="gmaps-infobox__intro">${place.subtitle}</span>
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
			marker.addListener("click", () => infowindow.open(map, marker));
		});
	};

	useEffect(() => {
		if (state.updateSearch === true) {
			service
				.searchPlaces(
					state.queryPlaceType,
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

	const textareaFooter = `<p>Des d'<strong>hotels amb encant</strong> únics a Catalunya, a <strong>cabanes acollidaroes</strong> i <strong>cases-arbre</strong>, passant per <strong>apartaments de somni</strong> i carabanes per gaudir de l'escapada, aquí trobaràs els millors allotjaments a Catalunya per a una escapada perfecta!</p>
	<p>Catalunya és una destinació perfecta per a gaudir d'allotjaments amb encant, com ara hotels boutique, apartaments de disseny, cases rurals de somni, cabanes als arbres, etc.</p>
	<p>No importa el que estiguis buscant per a una escapada a un allotjament a Catalunya; aquí trobaràs la millor selecció d'allotjaments per gaudir de la vostra propera escapada.</p>`;

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
			state.queryPlaceSeason == 0 &&
			state.queryPlaceType == 0
		);
	};

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
											Tipologia
										</span>
										<fieldset>
											<label className="cursor-pointer text-sm">
												<input
													type="checkbox"
													name="placeType"
													id="hotel"
													onChange={handleCheckType}
													className="mr-2"
												/>
												Hotels
											</label>
										</fieldset>
										<fieldset>
											<label className="cursor-pointer text-sm">
												<input
													type="checkbox"
													name="placeType"
													id="apartament"
													onChange={handleCheckType}
													className="mr-2"
												/>
												Apartaments
											</label>
										</fieldset>
										<fieldset>
											<label className="cursor-pointer text-sm">
												<input
													type="checkbox"
													name="placeType"
													id="refugi"
													onChange={handleCheckType}
													className="mr-2"
												/>
												Refugis
											</label>
										</fieldset>
										<fieldset>
											<label className="cursor-pointer text-sm">
												<input
													type="checkbox"
													name="placeType"
													id="casaarbre"
													onChange={handleCheckType}
													className="mr-2"
												/>
												Cases-arbre
											</label>
										</fieldset>
										<fieldset>
											<label className="cursor-pointer text-sm">
												<input
													type="checkbox"
													name="placeType"
													id="casarural"
													onChange={handleCheckType}
													className="mr-2"
												/>
												Cases rurals
											</label>
										</fieldset>
										<fieldset>
											<label className="cursor-pointer text-sm">
												<input
													type="checkbox"
													name="placeType"
													id="carabana"
													onChange={handleCheckType}
													className="mr-2"
												/>
												Carabanes
											</label>
										</fieldset>
									</div>
									<div className="pb-5">
										<span className="text-xs uppercase text-primary-400 tracking-wider mb-2 block">
											Regió
										</span>
										<fieldset>
											<label className="cursor-pointer text-sm">
												<input
													type="checkbox"
													name="placeRegion"
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
													name="placeRegion"
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
													name="placeRegion"
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
													name="placeRegion"
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
													name="placeRegion"
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
													name="placeRegion"
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
													name="placeRegion"
													id="pirineus"
													onChange={handleCheckRegion}
													className="mr-2"
												/>
												Pirineus
											</label>
										</fieldset>
									</div>
									<div className="pb-5">
										<span className="text-xs uppercase text-primary-400 tracking-wider mb-2 block">
											Categoria
										</span>
										<fieldset>
											<label className="cursor-pointer text-sm">
												<input
													type="checkbox"
													name="placeCategory"
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
													name="placeCategory"
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
													name="placeCategory"
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
													name="placeCategory"
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
													name="placeCategory"
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
									<div className="pb-5">
										<span className="text-xs uppercase text-primary-400 tracking-wider mb-2 block">
											Temporada
										</span>
										<fieldset>
											<label className="cursor-pointer text-sm">
												<input
													type="checkbox"
													name="placeSeason"
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
													name="placeSeason"
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
													name="placeSeason"
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
											Allotjaments a Catalunya
										</span>
									</li>
								</ul>
								<ListingHeader
									title={`<span class="text-secondary-500">Allotjaments</span> amb encant a Catalunya`}
									subtitle={`Descobreix <span class="inline-block relative after:absolute after:inset-x-0 after:bottom-px after:w-full after:h-0.5 after:bg-secondary-500">${state.numPlaces} allotjaments amb encant</span>, hotels boutique, apartaments, cabanyes als arbres i cases rurals de somni per a una escapada en parella increïble a Catalunya`}
								/>

								<section>
									<h2 className="mt-0 mb-1.5">
										Allotjaments més ben valorats
									</h2>
									<div className="text-primary-400 text-[15px] font-light">
										Quatre allotjaments per a una escapada
										en parella de somni
									</div>
									<div className="flex flex-wrap items-start mt-3 -mx-1.5">
										{state.hasPlaces
											? state.featuredPlaces.map((el) => (
												<PublicSquareBox
													key={el._id}
													type={el.type}
													slug={el.slug}
													id={el._id}
													cover={el.cover}
													title={el.title}
													subtitle={el.subtitle}
													rating={el.place_rating}
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
													location={`${el.place_locality ===
															undefined
															? el.place_country
															: el.place_locality
														}`}
												/>
											))
											: null}
									</div>
								</section>

								<section className="pt-3 md:pt-4">
									<div className="flex flex-wrap items-stretch -mx-1.5">
										<div className="w-full lg:w-8/12 px-1.5">
											<div className="p-10 rounded-md shadow-md h-full relative overflow-hidden">
												<picture className="absolute w-full h-full inset-0 before:content before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary-600 before:to-transparent before:bg-opacity-50">
													<source
														srcSet="/allotjaments-encant-catalunya-banner.webp"
														type="image/webp"
													/>
													<img
														src="/allotjaments-encant-catalunya-banner.jpg"
														alt=""
														className="w-full h-full object-cover"
														loading="lazy"
													/>
												</picture>
												<div className="relative z-10">
													<h3 className="mb-6 max-w-xs text-white">
														T'agradaria que el teu
														allotjament sortís en
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
														d'allotjaments amb
														encant a Catalunya
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
										Allotjaments amb encant afegits
										recentment
									</h2>
									<div className="text-primary-400 text-[15px] font-light">
										Aquestes són els allotjaments ideals per
										a parelles publicats darrerament
									</div>
									<div className="flex flex-wrap items-start mt-3 -mx-1.5">
										{state.hasPlaces
											? state.places.map((el) => (
												<PublicSquareBox
													key={el._id}
													type={el.type}
													slug={el.slug}
													id={el._id}
													cover={el.cover}
													title={el.title}
													subtitle={el.subtitle}
													rating={el.place_rating}
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
													location={`${el.place_locality ===
															undefined
															? el.place_country
															: el.place_locality
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
		</>
	);
};

export async function getServerSideProps({ params }) {
	const service = new ContentService();
	const featuredPlaces = await service.getMostRatedPlaces();
	const { totalItems, places, allPlaces, numPages } =
		await service.getAllPlaces();
	return {
		props: {
			totalItems,
			places,
			allPlaces,
			featuredPlaces,
			numPages,
		},
	};
}

export default PlaceList;
