import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Footer from "../components/global/Footer";
import NavigationBar from "../components/global/NavigationBar";
import GlobalMetas from "../components/head/GlobalMetas";
import ListingHeader from "../components/headers/ListingHeader";
import PublicSquareBox from "../components/listings/PublicSquareBox";
import MapModal from "../components/modals/MapModal";
import Breadcrumb from "../components/richsnippets/Breadcrumb";
import UserContext from "../contexts/UserContext";
import ContentService from "../services/contentService";
import FetchingSpinner from "../components/global/FetchingSpinner";

const CategoryPage = ({
	categoryDetails,
	allResults,
	paginatedResults,
	totalItems,
	numPages,
}) => {
	// Validate if user is allowed to access this view
	const { user } = useContext(UserContext);
	const [loadPage, setLoadPage] = useState(false);
	const initialResults = paginatedResults;
	useEffect(() => {
		if (user) {
			setLoadPage(true);
		}
	}, []);
	// End validation

	const router = useRouter();

	useEffect(() => {
		if (
			router.pathname.includes("editar") ||
			router.pathname.includes("nova-activitat") ||
			router.pathname.includes("nou-allotjament") ||
			router.pathname.includes("nova-historia")
		) {
			document.querySelector("body").classList.add("bg-primary-100");
		} else {
			document.querySelector("body").classList.remove("bg-primary-100");
		}
	}, [router]);

	const initialState = {
		results: [],
		allResults: [],
		hasResults: false,
		isFetching: false,
		numResults: 0,
		numPages: 0,
		currentPage: 1,
	};

	const [state, setState] = useState(initialState);
	const [stateModalMap, setStateModalMap] = useState(false);

	const service = new ContentService();

	useEffect(() => {
		if (categoryDetails && initialResults) {
			setState({
				...state,
				allResults: allResults,
				hasResults: initialResults.length > 0 ? true : false,
				numResults: totalItems,
				numPages: numPages,
			});
		}
	}, []);

	const sponsorBlock = categoryDetails.isSponsored ? (
		<div className="sponsor-block">
			<Link href={`${categoryDetails.sponsorURL}`} target="_blank">
				<a>
					<div className="sponsor-block-top">
						<div className="sponsor-block-left">
							<span>Patrocinat per</span>
						</div>
						<div className="sponsor-block-right">
							<div className="sponsor-logo">
								<img src={categoryDetails.sponsorLogo} />
							</div>
							<div className="sponsor-block-claim">
								<span>{categoryDetails.sponsorClaim}</span>
							</div>
						</div>
					</div>
				</a>
			</Link>
		</div>
	) : null;

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
		state.allResults.forEach((result) => {
			let position, path;
			if (result.type === "activity") {
				position = {
					lat: parseFloat(result.activity_lat),
					lng: parseFloat(result.activity_lng),
				};
				path = "/activitats";
			}
			if (result.type === "place") {
				position = {
					lat: parseFloat(result.place_lat),
					lng: parseFloat(result.place_lng),
				};
				path = "/allotjaments";
			}
			const contentString = `<a href="${path}/${result.slug}" title="${result.title}" class="gmaps-infobox" target="_blank">
        <div class="gmaps-infobox__picture">
          <picture>
            <img src="${result.images[0]}" alt="${result.title}" class="object-cover w-full h-full" width="80" height="80">
          </picture>
        </div>
        <div class="gmaps-infobox__text">
          <span class="gmaps-infobox__title">${result.title}</span>
          <span class="gmaps-infobox__intro">${result.subtitle}</span>
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

	const loadMoreResults = async (categoryName, page) => {
		setState({ ...state, isFetching: true });
		const { paginatedResults } = await service.paginateCategory(
			categoryName,
			page
		);
		setState({
			...state,
			results: [...state.results, ...paginatedResults],
			isFetching: false,
			currentPage: ++state.currentPage,
		});
	};

	return (
		<>
			{/* Browser metas  */}
			<GlobalMetas
				title={categoryDetails.title}
				description={categoryDetails.subtitle}
				url={`https://escapadesenparella.cat/${categoryDetails.slug}`}
				image={categoryDetails.image}
				canonical={`https://escapadesenparella.cat/${categoryDetails.slug}`}
			/>
			{/* Rich snippets */}
			<Breadcrumb
				page1Title="Inici"
				page1Url="https://escapadesenparella.cat"
				page2Title={categoryDetails.title}
				page2Url={`https://escapadesenparella.cat/${categoryDetails.slug}`}
			/>
			<div id="contentList" className="category relative">
				<NavigationBar />
				<main>
					<div className="pt-6">
						<div className="container">
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
										{categoryDetails.title}
									</span>
								</li>
							</ul>
							<ListingHeader
								title={`<span class="capitalize">${
									!categoryDetails.isPlace
										? "Escapades"
										: categoryDetails.pluralName
								}</span> <span class="text-secondary-500 lowercase">${
									categoryDetails.isPlace
										? "amb encant"
										: categoryDetails.pluralName
								}</span>`}
								subtitle={`Descobreix <span class="inline-block relative after:absolute after:inset-x-0 after:bottom-px after:w-full after:h-0.5 after:bg-secondary-500">${
									allResults.length
								} ${
									!categoryDetails.isPlace ? "escapades" : ""
								} ${categoryDetails.pluralName} ${
									categoryDetails.isPlace ? "amb encant" : ""
								}</span> a Catalunya. ${
									categoryDetails.seoTextHeader
										? categoryDetails.seoTextHeader
										: ""
								}`}
								sponsorData={sponsorBlock}
							/>
						</div>
					</div>

					<section className="pb-8 md:pb-16">
						<div className="container">
							{initialResults.length > 0 ? (
								<>
									<div className="flex flex-wrap items-start -mx-2">
										{initialResults.map((el, idx) => (
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
												location={
													el.activity_locality ||
													el.place_locality
												}
												index={idx}
											/>
										))}
										{state.results.map((el) => (
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
												location={
													el.activity_locality ||
													el.place_locality
												}
											/>
										))}
									</div>
									{state.currentPage !== state.numPages ? (
										<div className="w-full mt-10 flex justify-center">
											{!state.isFetching ? (
												<button
													className="button button__primary button__lg"
													onClick={() =>
														loadMoreResults(
															categoryDetails.name,
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
									<div className="border-t border-primary-100 pt-10 mt-10">
										<div
											className="w-full max-w-prose mx-auto text-block text-primary-400"
											dangerouslySetInnerHTML={{
												__html: categoryDetails.seoText,
											}}
										></div>
									</div>
								</>
							) : (
								<p className="text-center mx-auto text-lg">
									No s'han trobat escapades per aquesta
									categoria.
									<br /> Torna-ho a provar més endavant.
								</p>
							)}
						</div>
					</section>
				</main>
			</div>
			<div className="fixed bottom-5 left-1/2 -translate-x-1/2">
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

export async function getStaticPaths() {
	const service = new ContentService();
	const categories = await service.getCategories();
	const paths = categories.map((categoria) => ({
		params: { categoria: categoria.slug },
	}));
	return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
	const service = new ContentService();
	const categoryDetails = await service.getCategoryDetails(params.categoria);
	let { allResults, paginatedResults, totalItems, numPages } =
		await service.getCategoryResults(categoryDetails.name);

	if (!categoryDetails) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			categoryDetails,
			allResults,
			paginatedResults,
			totalItems,
			numPages,
		},
		revalidate: 120,
	};
}

export default CategoryPage;
