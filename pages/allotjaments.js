import { useEffect, useState } from "react";
import ContentService from "../services/contentService";
import NavigationBar from "../components/global/NavigationBar";
import PublicSquareBox from "../components/listings/PublicSquareBox";
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
			bounds.extend(marker.position);
			marker.addListener("click", () => infowindow.open(map, marker));
		});
		map.fitBounds(bounds);
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
			state.queryPlaceSeason == 0
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
				<NavigationBar />
				<main>
					{/* Main column - Listings */}
					<ListingHeader
						title={`Allotjaments amb encant a Catalunya`}
						subtitle={`Descobreix una selecció de <strong>${state.numPlaces} allotjaments amb encant</strong>, des d'<strong>hotels boutique</strong>, <strong>apartaments</strong>, <strong>cabanyes als arbres</strong> i <strong>cases rurals de somni</strong> per fer que la vostra propera escapada en parella sigui inoblidable!`}
						breadcrumbLevel1={"Allotjaments amb encant"}
					/>

					{/* Left column - Filters */}
					<div className="pt-8">
						<nav className="container flex justify-center">
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
						</nav>
					</div>

					{/* Section places */}
					<section className="pt-8 md:pt-12">
						<div className="container">
							<div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5">
								{state.hasPlaces
									? state.places.map((el, idx) => {
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
													rating={el.place_rating}
													placeType={el.placeType}
													categoria={el.categories}
													duration={el.duration}
													website={el.website}
													phone={el.phone}
													isVerified={el.isVerified}
													location={`${
														el.place_locality ===
														undefined
															? el.place_country
															: el.place_locality
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
						<ListingsTextareaFooter
							textareaFooter={textareaFooter}
						/>
					) : null}
				</main>
			</div>

			<Footer />

			{state.isMapModalOpen == true ? (
				<MapModal
					visibility={state.isMapModalOpen}
					hideModal={() =>
						setState({ ...state, isMapModalOpen: false })
					}
					center={center}
					getMapOptions={getMapOptions}
					renderMarker={renderMarker}
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
	return {
		props: {
			totalItems,
			places,
			allPlaces,
			numPages,
		},
	};
}

export default PlaceList;
