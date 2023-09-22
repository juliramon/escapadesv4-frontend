import React, { useContext, useEffect, useState } from "react";
import ContentService from "../../services/contentService";
import GlobalMetas from "../../components/head/GlobalMetas";
import BreadcrumbRichSnippet from "../../components/richsnippets/BreadcrumbRichSnippet";
import NavigationBar from "../../components/global/NavigationBar";
import Footer from "../../components/global/Footer";
import RegularTripEntryBox from "../../components/listings/RegularTripEntryBox";
import UserContext from "../../contexts/UserContext";
import { useRouter } from "next/router";

const CategoryTrip = ({
	categoryDetails,
	allTrips,
	totalItems,
	trips,
	numPages,
}) => {
	// Validate if user is allowed to access this view
	const { user } = useContext(UserContext);
	const router = useRouter();
	const [loadPage, setLoadPage] = useState(false);
	useEffect(() => {
		if (user) {
			setLoadPage(true);
		}
	}, []);
	// End validation

	const initialResults = trips;

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
	const service = new ContentService();

	useEffect(() => {
		if (categoryDetails && initialResults) {
			setState({
				...state,
				allResults: allTrips,
				hasResults: initialResults.length > 0 ? true : false,
				numResults: totalItems,
				numPages: numPages,
			});
		}
	}, []);

	const loadMoreResults = async (categoryName, page) => {
		setState({ ...state, isFetching: true });
		const { paginatedResults } = await service.paginateTripCategory(
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

	useEffect(() => {
		const underlinedElement = document.querySelector(".underlined-element");
		if (!underlinedElement) return;

		underlinedElement.classList.add("active");
	});

	return (
		<>
			{/* Browser metas  */}
			<GlobalMetas
				title={categoryDetails.title}
				description={categoryDetails.seoTextHeader}
				url={`https://escapadesenparella.cat/viatges/${categoryDetails.slug}`}
				image={categoryDetails.image}
				canonical={`https://escapadesenparella.cat/viatges/${categoryDetails.slug}`}
			/>
			{/* Rich snippets */}
			<BreadcrumbRichSnippet
				page1Title="Inici"
				page1Url="https://escapadesenparella.cat"
				page2Title="Viatges en parella"
				page2Url={`https://escapadesenparella.cat/viatges`}
				page3Title={categoryDetails.title}
				page3Url={`https://escapadesenparella.cat/viatges/${categoryDetails.slug}`}
			/>
			<div className="tripCategory">
				<NavigationBar user={user} />
				<main>
					{/* Section cover */}
					<section className="px-6 pt-1">
						<div className="rounded-lg lg:rounded-2xl overflow-hidden">
							<div className="flex flex-wrap items-stretch justify-end rounded-lg lg:rounded-2xl overflow-hidden bg-primary-400 relative md:min-h-[65vh]">
								<div className="w-full absolute h-full inset-0">
									<picture className="block w-full h-full relative after:absolute after:inset-0 after:bg-primary-900 after:bg-opacity-50 after:mix-blend-multiply">
										<img
											src={categoryDetails.image}
											alt={categoryDetails.title}
											className="w-full h-full object-cover object-[100%_95%]"
											loading="eager"
											fetchpriority="high"
										/>
									</picture>
								</div>
								<div className="w-full relative z-10">
									<div className="flex justify-center items-center pt-20 px-12 pb-12 h-full">
										<div className="w-full max-w-xl">
											<ul className="breadcrumb text-white justify-center mb-12">
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
													<a
														href="/viatges"
														className="breadcrumb__link"
													>
														Viatges en parella
													</a>
												</li>
												<li className="breadcrumb__item">
													<span className="breadcrumb__link active">
														{categoryDetails.title}
													</span>
												</li>
											</ul>
											<div class="mb-4 flex items-center justify-center">
												<div class="flex items-center justify-center leading-tight text-white text-center">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="icon icon-tabler icon-tabler-globe mr-1.5"
														width={20}
														height={20}
														viewBox="0 0 24 24"
														strokeWidth={1.5}
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
														<path d="M7 9a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
														<path d="M5.75 15a8.015 8.015 0 1 0 9.25 -13"></path>
														<path d="M11 17v4"></path>
														<path d="M7 21h8"></path>
													</svg>
													{categoryDetails.country}
												</div>
											</div>
											<div class="flex justify-center">
												<h1 className="my-0 font-medium text-center text-white underlined-element">
													{categoryDetails.title}
												</h1>
											</div>
											<div
												className="text-block--xl mt-6 text-white text-center"
												dangerouslySetInnerHTML={{
													__html: categoryDetails.seoTextHeader,
												}}
											></div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>

					{/* Section intro */}
					<section className="py-10 md:py-16">
						<div className="container">
							<div className="w-full max-w-6xl mx-auto">
								<div className="flex flex-wrap items-center -mx-4">
									<div className="w-full lg:w-1/2 px-4 mb-8">
										<div
											className="text-block pr-12"
											dangerouslySetInnerHTML={{
												__html: categoryDetails.seoText,
											}}
										></div>
									</div>
									{categoryDetails.mapLocation ? (
										<div className="w-full lg:w-1/2 px-4">
											<div
												className="aspect-w-16 aspect-h-9 rounded-lg md:rounded-2xl overflow-hidden"
												dangerouslySetInnerHTML={{
													__html: categoryDetails.mapLocation,
												}}
											></div>
										</div>
									) : null}
								</div>
							</div>
						</div>
					</section>

					{/* Section results list */}
					<section className="py-10 md:py-16">
						<div className="container">
							<h2>Publicacions del viatge</h2>
							{initialResults.length > 0 ? (
								<>
									<div className="flex flex-wrap items-start mt-4">
										{initialResults.map((el, idx) => (
											<div className="mb-8 shadow-md rounded-md overflow-hidden w-full md:w-2/3">
												<RegularTripEntryBox
													key={el._id}
													slug={el.slug}
													trip={categoryDetails.slug}
													cover={el.cover}
													title={el.title}
													subtitle={el.subtitle}
													avatar={el.owner.avatar}
													owner={el.owner.fullName}
													date={el.createdAt}
												/>
											</div>
										))}
										{state.results.map((el) => (
											<div className="mb-8 shadow-md rounded-md overflow-hidden w-full md:w-2/3">
												<RegularTripEntryBox
													key={el._id}
													slug={el.slug}
													trip={categoryDetails.slug}
													cover={el.cover}
													title={el.title}
													subtitle={el.subtitle}
													avatar={el.owner.avatar}
													owner={el.owner.fullName}
													date={el.createdAt}
												/>
											</div>
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
								</>
							) : (
								<p className="mt-4">
									Encara no hi ha publicacions disponibles.
									Sisplau, torna-ho a provar més endavant.
								</p>
							)}
						</div>
					</section>
				</main>
			</div>
			<Footer />
		</>
	);
};

export async function getStaticPaths() {
	const service = new ContentService();
	const tripCategories = await service.getTripCategories();
	const paths = tripCategories.map((categoria) => ({
		params: { categoria: categoria.slug },
	}));
	return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
	const service = new ContentService();
	const categoryDetails = await service.getTripCategoryDetails(
		params.categoria
	);
	let { allTrips, totalItems, trips, numPages } =
		await service.getTripCategoryResults(categoryDetails._id);

	if (!categoryDetails) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			categoryDetails,
			allTrips,
			totalItems,
			trips,
			numPages,
		},
		revalidate: 120,
	};
}

export default CategoryTrip;
