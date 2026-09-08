import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "../components/global/Footer";
import NavigationBar from "../components/global/NavigationBar";
import GlobalMetas from "../components/head/GlobalMetas";
import ListingHeader from "../components/headers/ListingHeader";
import ListingGrid from "../components/listings/ListingGrid";
import TaxonomyChips from "../components/listings/TaxonomyChips";
import MobileAnchorAd from "../components/ads/MobileAnchorAd";
import { categoryGroupFor } from "../utils/siteTaxonomy";
import BreadcrumbRichSnippet from "../components/richsnippets/BreadcrumbRichSnippet";
import ContentService from "../services/contentService";
import { toListingCard } from "../utils/listingProps";
import ListingsTextareaFooter from "../components/listings/ListingsTextareaFooter";

const CategoryPage = ({
	categoryDetails,
	paginatedResults,
	totalItems,
	numPages,
}) => {
	const initialState = {
		results: paginatedResults,
		queryPlaceType: [],
		queryPlaceRegion: [],
		queryPlaceCategory: [],
		queryPlaceSeason: [],
		updateSearch: false,
		hasResults: false,
		isFetching: false,
		numResults: 0,
		numPages: 0,
		currentPage: 1,
		hasPlaces: false,
		isFetching: false,
		numPlaces: 0,
		currentPage: 1,
		emptyBlocksPerRow: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
	};

	const [state, setState] = useState(initialState);

	const service = new ContentService();

	// Enllaços a les categories germanes: donen sortida a qui no troba res
	// aquí i connecten entre elles les 16 pàgines de categoria.
	const siblingCategories = categoryGroupFor(categoryDetails?.slug);

	useEffect(() => {
		if (categoryDetails && paginatedResults) {
			setState({
				...state,
				results: paginatedResults,
				hasResults: true,
				numResults: totalItems,
				numPages: numPages,
				queryPlaceType: categoryDetails?.isPlace
					? [`placeType=${categoryDetails.name}`]
					: [],
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
					setState({ ...state, results: res, updateSearch: false });
				});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.updateSearch]);

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
				title={categoryDetails.title}
				description={categoryDetails.subtitle}
				url={`https://escapadesenparella.cat/${categoryDetails.slug}`}
				image={categoryDetails.image}
				canonical={`https://escapadesenparella.cat/${categoryDetails.slug}`}
			/>
			{/* Rich snippets */}
			<BreadcrumbRichSnippet
				page1Title="Inici"
				page1Url="https://escapadesenparella.cat"
				page2Title={categoryDetails.title}
				page2Url={`https://escapadesenparella.cat/${categoryDetails.slug}`}
			/>
			<div id="contentList" className="category relative">
				<NavigationBar />
				<main>
					{/* Main column - Listings */}
					<ListingHeader
						title={categoryDetails.title}
						subtitle={`Us proposem <strong class="lowercase">${totalItems} ${
							categoryDetails.title
						}</strong> a Catalunya. ${
							categoryDetails.seoTextHeader || ""
						}`}
						sponsorData={sponsorBlock}
						breadcrumbLevel1={categoryDetails.title}
					/>

					{/* Section listings */}
					<section className="pt-6 md:pt-8">
						<div className="container">
							<TaxonomyChips
								heading={siblingCategories.heading}
								items={siblingCategories.items}
								activeSlug={categoryDetails.slug}
								className="mb-5 md:mb-7"
							/>
							<div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5">
								{state.results.length > 0 ? (
									<>
										<ListingGrid
											cellsOnly
											items={state.results}
											isLoading={!state.hasResults}
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
									<div className="col-span-full">
										<p className="text-center mx-auto text-lg">
											No s'han trobat escapades per
											aquesta categoria.
											<br /> Torna-ho a provar més
											endavant.
										</p>
									</div>
								)}
							</div>
						</div>
					</section>

					{/* Section text footer */}
					{categoryDetails.seoText !== "" ? (
						<ListingsTextareaFooter
							textareaFooter={categoryDetails.seoText}
							relatedLinks={siblingCategories.items}
							relatedLinksHeading={siblingCategories.heading}
							activeSlug={categoryDetails.slug}
						/>
					) : null}
				</main>
			</div>

			<Footer />
			<MobileAnchorAd />
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

	if (!categoryDetails) {
		return {
			notFound: true,
		};
	}

	let { paginatedResults, totalItems, numPages } =
		await service.getCategoryResults(categoryDetails.name);

	// `allResults` arribava fins al client sencer (descripcions incloses) i
	// aquesta pàgina no el feia servir enlloc: eren ~100 kB per pàgina.
	return {
		props: {
			categoryDetails,
			paginatedResults: (paginatedResults || []).map(toListingCard),
			totalItems,
			numPages,
		},
		revalidate: 120,
	};
}

export default CategoryPage;
