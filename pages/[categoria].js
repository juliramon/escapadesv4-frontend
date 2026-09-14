import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "../components/global/Footer";
import NavigationBar from "../components/global/NavigationBar";
import GlobalMetas from "../components/head/GlobalMetas";
import ListingHeader from "../components/headers/ListingHeader";
import ListingGrid from "../components/listings/ListingGrid";
import LoadMoreLink from "../components/listings/LoadMoreLink";
import TaxonomyChips from "../components/listings/TaxonomyChips";
import MobileAnchorAd from "../components/ads/MobileAnchorAd";
import { categoryGroupFor } from "../utils/siteTaxonomy";
import BreadcrumbRichSnippet from "../components/richsnippets/BreadcrumbRichSnippet";
import ContentService from "../services/contentService";
import { toListingCard } from "../utils/listingProps";
import { pagePath, pageTitle } from "../utils/pagination";
import ListingsTextareaFooter from "../components/listings/ListingsTextareaFooter";

const CategoryPage = ({
	categoryDetails,
	paginatedResults,
	totalItems,
	numPages,
	currentPage = 1,
}) => {
	// L'estat surt de les props des del primer render. Abans `hasResults`
	// començava a false i el servidor pintava esquelets en lloc de fitxes: a
	// l'HTML que llegeix Google, les categories no enllaçaven cap escapada.
	const stateFromProps = () => ({
		results: paginatedResults || [],
		queryPlaceType: categoryDetails?.isPlace
			? [`placeType=${categoryDetails.name}`]
			: [],
		queryPlaceRegion: [],
		queryPlaceCategory: [],
		queryPlaceSeason: [],
		updateSearch: false,
		hasResults: true,
		isFetching: false,
		numResults: totalItems,
		numPages: numPages,
		currentPage: currentPage,
	});

	const [state, setState] = useState(stateFromProps);

	const service = new ContentService();

	// Enllaços a les categories germanes: donen sortida a qui no troba res
	// aquí i connecten entre elles les 16 pàgines de categoria.
	const siblingCategories = categoryGroupFor(categoryDetails?.slug);

	const basePath = `/${categoryDetails.slug}`;
	const pageUrl = `https://escapadesenparella.cat${pagePath(
		basePath,
		currentPage,
	)}`;

	// En passar d'una categoria a una altra, o d'una pàgina a una altra de la
	// mateixa categoria, Next reaprofita aquest mateix component i només en
	// canvia les props. Amb la llista de dependències buida, l'estat es quedava
	// amb els resultats anteriors: el títol i l'URL canviaven, però la graella
	// ensenyava les escapades que no tocaven. Per això es refà l'estat sencer a
	// cada canvi, que a més descarta els filtres i la paginació carregada.
	useEffect(() => {
		if (!categoryDetails || !paginatedResults) return;
		setState(stateFromProps());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [categoryDetails?.slug, currentPage]);

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

	// L'API compta les pàgines des de 0: la tanda que ve després de la
	// `currentPage` (base 1) és justament `currentPage`.
	const loadMoreResults = async () => {
		setState((prev) => ({ ...prev, isFetching: true }));
		const { paginatedResults: nextResults } =
			await service.paginateCategory(
				categoryDetails.name,
				state.currentPage,
			);
		setState((prev) => ({
			...prev,
			results: [...prev.results, ...nextResults],
			isFetching: false,
			currentPage: prev.currentPage + 1,
		}));
	};

	useEffect(() => {
		if (state.updateSearch === true) {
			service
				.searchPlaces(
					state.queryPlaceType,
					state.queryPlaceRegion,
					state.queryPlaceCategory,
					state.queryPlaceSeason,
				)
				.then((res) => {
					setState({ ...state, results: res, updateSearch: false });
				});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.updateSearch]);

	// `queryPlaceType` és el tipus de la mateixa categoria, no un filtre de
	// l'usuari. Quan comptava, a les categories d'allotjament el botó de
	// «Veure'n més» no sortia mai.
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
				title={pageTitle(categoryDetails.title, currentPage)}
				description={categoryDetails.subtitle}
				url={pageUrl}
				image={categoryDetails.image}
				canonical={pageUrl}
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

										{state.currentPage < state.numPages &&
										checkAreFiltersActive() ? (
											<LoadMoreLink
												href={pagePath(
													basePath,
													state.currentPage + 1,
												)}
												isFetching={state.isFetching}
												onLoadMore={loadMoreResults}
											/>
										) : null}
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

					{/* Section text footer: només a la primera pàgina, perquè
					    les altres no el repeteixin */}
					{currentPage === 1 && categoryDetails.seoText !== "" ? (
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

/**
 * Props d'una pàgina del llistat d'una categoria. També les fa servir
 * `pages/[categoria]/pagina/[pagina].js` per a la resta de tandes.
 */
export const getCategoryPageProps = async (slug, page = 1) => {
	const service = new ContentService();
	const categoryDetails = await service.getCategoryDetails(slug);

	if (!categoryDetails) {
		return { notFound: true, revalidate: 120 };
	}

	const { paginatedResults, totalItems, numPages } =
		await service.paginateCategory(categoryDetails.name, page - 1);

	if (page > 1 && page > numPages) {
		return { notFound: true, revalidate: 120 };
	}

	// `allResults` arribava fins al client sencer (descripcions incloses) i
	// aquesta pàgina no el feia servir enlloc: eren ~100 kB per pàgina.
	return {
		props: {
			categoryDetails,
			paginatedResults: (paginatedResults || []).map(toListingCard),
			totalItems,
			numPages,
			currentPage: page,
		},
		revalidate: 120,
	};
};

export async function getStaticProps({ params }) {
	return getCategoryPageProps(params.categoria);
}

export default CategoryPage;
