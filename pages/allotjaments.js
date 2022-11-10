import { useEffect, useState } from "react";
import ContentService from "../services/contentService";
import NavigationBar from "../components/global/NavigationBar";
import PublicSquareBox from "../components/listings/PublicSquareBox";
import { useRouter } from "next/router";
import Footer from "../components/global/Footer";
import MapModal from "../components/modals/MapModal";
import Fancybox from "../utils/FancyboxUtils";
import Breadcrumb from "../components/richsnippets/Breadcrumb";
import GlobalMetas from "../components/head/GlobalMetas";

const PlaceList = ({ user, totalItems, places, allPlaces, numPages }) => {
	const router = useRouter();
	useEffect(() => {
		if (
			router.pathname.includes("editar") ||
			router.pathname.includes("nova-activitat") ||
			router.pathname.includes("nou-allotjament") ||
			router.pathname.includes("nova-historia")
		) {
			document.querySelector("body").classList.add("composer");
		} else {
			document.querySelector("body").classList.remove("composer");
		}
	}, [router]);

	const initialState = {
		loggedUser: user,
		places: [],
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

	const [stateDropdownFilters, setStateDropdownFilters] = useState(false);
	const [stateModalMap, setStateModalMap] = useState(false);

	const service = new ContentService();

	useEffect(() => {
		if (places) {
			setState({
				...state,
				places: places,
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
          <picture>
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

	const textareaFooter = "";

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
			<Breadcrumb
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
					user={user}
				/>
				<main>
					<div className="pt-6">
						<div className="container">
							<ul className="breadcrumb">
								<li className="breadcrumb__item">
									<a href="/" title="Inici" className="breadcrumb__link">
										Inici
									</a>
								</li>
								<li className="breadcrumb__item">
									<span className="breadcrumb__link active">
										Allotjaments a Catalunya
									</span>
								</li>
							</ul>
						</div>
					</div>
					<section className="pt-8">
						<div className="container relative">
							<div className="flex flex-wrap items-start justify-start">
								<div className="w-full md:w-8/12 xl:w-5/12">
									<h1 className="my-0 font-display">
										<span className="text-secondary-500">Allotjaments</span> amb
										encant
									</h1>
								</div>
								<div className="w-full mt-6">
									<div className="grid grid-cols-2 md:grid-cols-4 grid-rows-3 md:grid-rows-2 gap-0.5 rounded-md overflow-hidden">
										<Fancybox
											options={{
												infinite: true,
											}}
										>
											<div
												className="row-start-1 col-start-1 row-span-1 col-span-2 md:row-span-2 rounded-t-md md:rounded-tr-none md:rounded-l-md overflow-hidden cursor-pointer"
												data-fancybox="gallery"
												data-src="https://res.cloudinary.com/juligoodie/image/upload/v1657047005/getaways-guru/static-activities-cover/photo_2022-07-05_20.49.44_czmgpl.jpg"
											>
												<div className="aspect-w-4 aspect-h-3 h-full w-full">
													<picture>
														<img
															src="https://res.cloudinary.com/juligoodie/image/upload/v1657047005/getaways-guru/static-activities-cover/photo_2022-07-05_20.49.44_czmgpl.jpg"
															alt=""
															className="w-full h-full object-cover object-center"
															width={400}
															height={300}
															loading="eager"
														/>
													</picture>
												</div>
											</div>
											<div
												className="row-start-2 md:row-start-1 col-start-1 md:col-start-3 row-span-1 col-span-1 md:rounded-none overflow-hidden cursor-pointer"
												data-fancybox="gallery"
												data-src="https://res.cloudinary.com/juligoodie/image/upload/v1657047005/getaways-guru/static-activities-cover/photo_2022-07-05_20.48.34_qprzdh.jpg"
											>
												<div className="aspect-w-4 aspect-h-3 h-full w-full">
													<picture>
														<img
															src="https://res.cloudinary.com/juligoodie/image/upload/v1657047005/getaways-guru/static-activities-cover/photo_2022-07-05_20.48.34_qprzdh.jpg"
															alt=""
															className="w-full h-full object-cover object-center"
															width={400}
															height={300}
															loading="eager"
														/>
													</picture>
												</div>
											</div>
											<div
												className="row-start-2 md:row-start-1 col-start-2 md:col-start-4 row-span-1 col-span-1 md:rounded-tr-md overflow-hidden cursor-pointer"
												data-fancybox="gallery"
												data-src="https://res.cloudinary.com/juligoodie/image/upload/v1657047005/getaways-guru/static-activities-cover/photo_2022-07-05_20.48.39_f6r96x.jpg"
											>
												<div className="aspect-w-4 aspect-h-3 h-full w-full">
													<picture>
														<img
															src="https://res.cloudinary.com/juligoodie/image/upload/v1657047005/getaways-guru/static-activities-cover/photo_2022-07-05_20.48.39_f6r96x.jpg"
															alt=""
															className="w-full h-full object-cover object-center"
															width={400}
															height={300}
															loading="eager"
														/>
													</picture>
												</div>
											</div>
											<div
												className="row-start-3 col-start-1 md:col-start-3 md:row-start-2 row-span-1 col-span-1 overflow-hidden cursor-pointer"
												data-fancybox="gallery"
												data-src="https://res.cloudinary.com/juligoodie/image/upload/v1657047005/getaways-guru/static-activities-cover/photo_2022-07-05_20.48.31_qxwmps.jpg"
											>
												<div className="aspect-w-4 aspect-h-3 h-full w-full">
													<picture>
														<img
															src="https://res.cloudinary.com/juligoodie/image/upload/v1657047005/getaways-guru/static-activities-cover/photo_2022-07-05_20.48.31_qxwmps.jpg"
															alt=""
															className="w-full h-full object-cover object-center"
															width={400}
															height={300}
															loading="eager"
														/>
													</picture>
												</div>
											</div>
											<div
												className="row-start-3 md:row-start-2 col-start-2 md:col-start-4 row-span-1 col-span-1 rounded-br-md overflow-hidden cursor-pointer"
												data-fancybox="gallery"
												data-src="https://res.cloudinary.com/juligoodie/image/upload/v1657047006/getaways-guru/static-activities-cover/photo_2022-07-05_20.48.38_zsnyc7.jpg"
											>
												<div className="aspect-w-4 aspect-h-3 h-full w-full">
													<picture>
														<img
															src="https://res.cloudinary.com/juligoodie/image/upload/v1657047006/getaways-guru/static-activities-cover/photo_2022-07-05_20.48.38_zsnyc7.jpg"
															alt=""
															className="w-full h-full object-cover object-bottom"
															width={400}
															height={300}
															loading="eager"
														/>
													</picture>
												</div>
											</div>
										</Fancybox>
									</div>
								</div>
								<div className="w-full mt-3">
									<figcaption className="text-xs text-primary-400 text-right">
										Allotjaments amb encant visitats per en Juli i l'Andrea
										arreu de Catalunya / © Escapadesenparella.cat
									</figcaption>
								</div>
							</div>
						</div>
					</section>

					<section className="pb-8 md:pb-16">
						<div className="container">
							<div className="w-full flex flex-wrap items-end justify-between pt-8 pb-2">
								<div className="w-full md:w-1/2">
									<div className="max-w-xl">
										<h2 className="my-0">
											Descobreix {state.numPlaces} allotjaments amb encant per a
											una escapada en parella increïble a Catalunya
										</h2>
										<p className="mt-4 text-xl leading-snug">
											Des d'<strong>hotels amb encant</strong> únics a
											Catalunya, a <strong>cabanes acollidaroes</strong> i{" "}
											<strong>cases-arbre</strong>, passant per{" "}
											<strong>apartaments de somni</strong> i carabanes per
											gaudir de l'escapada, aquí trobaràs els millors
											allotjaments a Catalunya per a una escapada perfecta!
										</p>
									</div>
								</div>
								<div className="relative flex flex-wrap items-center justify-between md:justify-end w-full md:w-1/2 mt-5 md:mb-0">
									<button
										className="text-sm inline-flex flex-nowrap items-center justify-center button button__ghost button__med w-full md:w-auto mb-3 md:mb-0 md:mr-3"
										onClick={() => setStateModalMap(!stateModalMap)}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="icon icon-tabler icon-tabler-map-2 mr-2"
											width="18"
											height="18"
											viewBox="0 0 24 24"
											strokeWidth="1.5"
											stroke="currentColor"
											fill="none"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path stroke="none" d="M0 0h24v24H0z" fill="none" />
											<line x1="18" y1="6" x2="18" y2="6.01" />
											<path d="M18 13l-3.5 -5a4 4 0 1 1 7 0l-3.5 5" />
											<polyline points="10.5 4.75 9 4 3 7 3 20 9 17 15 20 21 17 21 15" />
											<line x1="9" y1="4" x2="9" y2="17" />
											<line x1="15" y1="15" x2="15" y2="20" />
										</svg>
										Veure'ls al mapa
									</button>
									<button
										className={`bbutton button__ghost button__med justify-center w-full md:w-auto ${
											stateDropdownFilters == true ? "active" : null
										}`}
										onClick={() =>
											setStateDropdownFilters(!stateDropdownFilters)
										}
									>
										{stateDropdownFilters == true ? (
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="icon icon-tabler icon-tabler-x mr-2"
												width="18"
												height="18"
												viewBox="0 0 24 24"
												strokeWidth="1.5"
												stroke="currentColor"
												fill="none"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<path stroke="none" d="M0 0h24v24H0z" fill="none" />
												<line x1="18" y1="6" x2="6" y2="18" />
												<line x1="6" y1="6" x2="18" y2="18" />
											</svg>
										) : (
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="icon icon-tabler icon-tabler-adjustments mr-2"
												width="18"
												height="18"
												viewBox="0 0 24 24"
												strokeWidth="1.5"
												stroke="currentColor"
												fill="none"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<path stroke="none" d="M0 0h24v24H0z" fill="none" />
												<circle cx="6" cy="10" r="2" />
												<line x1="6" y1="4" x2="6" y2="8" />
												<line x1="6" y1="12" x2="6" y2="20" />
												<circle cx="12" cy="16" r="2" />
												<line x1="12" y1="4" x2="12" y2="14" />
												<line x1="12" y1="18" x2="12" y2="20" />
												<circle cx="18" cy="7" r="2" />
												<line x1="18" y1="4" x2="18" y2="5" />
												<line x1="18" y1="9" x2="18" y2="20" />
											</svg>
										)}
										<span>Filtrar allotjaments</span>
									</button>
									{stateDropdownFilters === true ? (
										<div className="absolute z-30 bg-white rounded-md shadow-lg top-14 overflow-hidden p-7">
											<div className="flex items-start -m-5">
												<div className="p-5">
													<span className="text-lg mb-2 block">Tipologia</span>
													<fieldset>
														<label className="cursor-pointer">
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
														<label className="cursor-pointer">
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
														<label className="cursor-pointer">
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
														<label className="cursor-pointer">
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
														<label className="cursor-pointer">
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
														<label className="cursor-pointer">
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
												<div className="p-5">
													<span className="text-lg mb-2 block">Regió</span>
													<fieldset>
														<label className="cursor-pointer">
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
														<label className="cursor-pointer">
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
														<label className="cursor-pointer">
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
														<label className="cursor-pointer">
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
														<label className="cursor-pointer">
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
														<label className="cursor-pointer">
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
														<label className="cursor-pointer">
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
												<div className="p-5">
													<span className="text-lg mb-2 block">Categoria</span>
													<fieldset>
														<label className="cursor-pointer">
															<input
																type="checkbox"
																name="placeCategory"
																id="romantica"
																onChange={handleCheckCategory}
																className="mr-2"
															/>
															Romàntiques
														</label>
													</fieldset>
													<fieldset>
														<label className="cursor-pointer">
															<input
																type="checkbox"
																name="placeCategory"
																id="aventura"
																onChange={handleCheckCategory}
																className="mr-2"
															/>
															Aventura
														</label>
													</fieldset>
													<fieldset>
														<label className="cursor-pointer">
															<input
																type="checkbox"
																name="placeCategory"
																id="gastronomica"
																onChange={handleCheckCategory}
																className="mr-2"
															/>
															Gastronòmiques
														</label>
													</fieldset>
													<fieldset>
														<label className="cursor-pointer">
															<input
																type="checkbox"
																name="placeCategory"
																id="cultural"
																onChange={handleCheckCategory}
																className="mr-2"
															/>
															Culturals
														</label>
													</fieldset>
													<fieldset>
														<label className="cursor-pointer">
															<input
																type="checkbox"
																name="placeCategory"
																id="relax"
																onChange={handleCheckCategory}
																className="mr-2"
															/>
															Relax
														</label>
													</fieldset>
												</div>
												<div className="p-5">
													<span className="text-lg mb-2 block">Temporada</span>
													<fieldset>
														<label className="cursor-pointer">
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
														<label className="cursor-pointer">
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
														<label className="cursor-pointer">
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
														<label className="cursor-pointer">
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
									) : null}
								</div>
							</div>
							<div className="flex flex-wrap items-start -mx-2">
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
												rating={el.activity_rating || el.place_rating}
												placeType={el.placeType}
												categoria={el.categories}
												duration={el.duration}
												website={el.website}
												phone={el.phone}
												location={`${
													el.place_locality === undefined
														? el.place_country
														: el.place_locality
												}`}
											/>
									  ))
									: null}
							</div>
							{state.currentPage !== state.numPages ? (
								<div className="w-full mt-10 flex justify-center">
									{!state.isFetching ? (
										<button
											className="button button__primary button__lg"
											onClick={() => loadMoreResults(state.currentPage)}
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
												<line x1={12} y1={5} x2={12} y2={19}></line>
												<line x1={5} y1={12} x2={19} y2={12}></line>
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
						<section className="pb-16">
							<div className="container">
								<div className="w-full md:w-2/4 md:mx-auto">
									{textareaFooter}
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
