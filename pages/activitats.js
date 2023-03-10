import { useEffect, useState } from "react";
import ContentService from "../services/contentService";
import NavigationBar from "../components/global/NavigationBar";
import Head from "next/head";
import PublicSquareBox from "../components/listings/PublicSquareBox";
import { useRouter } from "next/router";
import Footer from "../components/global/Footer";
import MapModal from "../components/modals/MapModal";
import Breadcrumb from "../components/richsnippets/Breadcrumb";
import GlobalMetas from "../components/head/GlobalMetas";
import ListingHeader from "../components/headers/ListingHeader";

const ActivityList = ({ totalItems, activities, allActivities, numPages }) => {
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
		activities: [],
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
	};

	const [state, setState] = useState(initialState);

	const [stateDropdownFilters, setStateDropdownFilters] = useState(false);
	const [stateModalMap, setStateModalMap] = useState(false);

	const service = new ContentService();

	useEffect(() => {
		if (activities) {
			setState({
				...state,
				activities: activities,
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
		setState({ ...state, queryActivityRegion: query, updateSearch: true });
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
		setState({ ...state, queryActivityCategory: query, updateSearch: true });
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
		setState({ ...state, queryActivitySeason: query, updateSearch: true });
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
          <picture>
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
					setState({ ...state, activities: res, updateSearch: false });
				});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.updateSearch]);

	const textareaFooter = `<p>Calceu-vos les botes, poseu-vos el banyador, prepareu-vos la motxilla o despengeu l'anorac; aquí trobareu les millors <strong>activitats en parella</strong> a Catalunya!</p>
	<p>Catalunya és un destí ideal per a realitzar activitats en parella. Amb la seva meravellosa costa mediterrània, pobles encantadors i rica història cultural, ens ofereix un vetall de possibilitats infinits per a realitzar activitats en parella de tots tipus.</p>
	<p>Un dels llocs imperdibles per a fer activitats en parella és Barcelona. Amb la seva arquitectura icònica, museus de classe mundial i vida nocturna vibrant; sempre hi trobareu alguna cosa a fer a la ciutat.</p>
	<p>Per a activitats en parella d'aventura, als Pirineus hi trobareu mil i una opcions, ja sigui realitzant sortides de senderisme o esquí, entre d'altres activitats. Sabíes que la regió és seu d'alguns dels millors resorts d'esquí d'Espanya? El paisatge és espectacular!</p>
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
			<Breadcrumb
				page1Title="Inici"
				page1Url="https://escapadesenparella.cat"
				page2Title="Activitats en parella"
				page2Url={`https://escapadesenparella.cat/activitats`}
			/>
			<Head>
				<title>Activitats en parella - Escapadesenparella.cat</title>
				<meta name="robots" content="index, follow" />
				<meta name="googlebot" content="index, follow" />
				<Breadcrumb
					page1Title="Inici"
					page1Url="https://escapadesenparella.cat"
					page2Title="Activitats en parella"
					page2Url={`https://escapadesenparella.cat/activitats`}
				/>
			</Head>
			<div id="contentList" className="activity relative">
				<NavigationBar
					logo_url={
						"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
					}
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
										Activitats a Catalunya
									</span>
								</li>
							</ul>
						</div>
					</div>

					<ListingHeader
						title={`<span class="text-secondary-500">Activitats</span> per fer en parella a Catalunya`}
						subtitle={`Descobreix <span class="inline-block bg-tertiary-100 px-2">${state.numActivities} activitats en parella</span>, excursions, restaurants i paratges extraordinaris per a una escapada en parella de somni a Catalunya`}
						figCaption={`Escapada a les Basses de Coll de Nargó (Alt Urgell)`}
						image={
							"https://res.cloudinary.com/juligoodie/image/upload/v1657047006/getaways-guru/static-activities-cover/photo_2022-07-05_20.48.38_zsnyc7.jpg"
						}
					/>

					<section className="pb-8 md:pb-16">
						<div className="container">
							<div className="flex flex-wrap items-start -mx-2">
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
												rating={el.activity_rating || el.place_rating}
												placeType={el.placeType}
												categoria={el.categories}
												duration={el.duration}
												website={el.website}
												phone={el.phone}
												location={`${
													el.activity_locality === undefined
														? el.activity_country
														: el.activity_locality
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
							{textareaFooter !== "" ? (
								<div className="border-t border-primary-100 pt-10 mt-10">
									<div
										className="w-full md:w-8/12 xl:w-5/12 md:mx-auto"
										dangerouslySetInnerHTML={{ __html: textareaFooter }}
									></div>
								</div>
							) : null}
						</div>
					</section>
				</main>
			</div>
			<div className="fixed bottom-5 left-1/2 -translate-x-1/2 flex items-center justify-center space-x-4">
				<button
					className="text-sm inline-flex flex-nowrap items-center bg-white shadow-xl px-4 py-3 !rounded-full z-10"
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
					Veure-les al mapa
				</button>
				<button
					className={`text-sm inline-flex flex-nowrap items-center bg-white shadow-xl px-4 py-3 !rounded-full z-10 ${
						stateDropdownFilters == true ? "active" : null
					}`}
					onClick={() => setStateDropdownFilters(!stateDropdownFilters)}
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
					<span>Filtrar activitats</span>
				</button>
				{stateDropdownFilters === true ? (
					<div className="absolute z-30 bg-white rounded-md shadow-lg top-14 overflow-hidden p-7">
						<div className="flex items-start -m-5">
							<div className="p-5">
								<span className="text-lg mb-2 block">Regió</span>
								<fieldset>
									<label className="cursor-pointer">
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
									<label className="cursor-pointer">
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
									<label className="cursor-pointer">
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
									<label className="cursor-pointer">
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
									<label className="cursor-pointer">
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
									<label className="cursor-pointer">
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
									<label className="cursor-pointer">
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
							<div className="p-5">
								<span className="text-lg mb-2 block">Categoria</span>
								<fieldset>
									<label className="cursor-pointer">
										<input
											type="checkbox"
											name="activityCategory"
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
											name="activityCategory"
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
											name="activityCategory"
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
											name="activityCategory"
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
											name="activityCategory"
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
											name="activitySeason"
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
											name="activitySeason"
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
											name="activitySeason"
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
