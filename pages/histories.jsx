import { useEffect, useState } from "react";
import ContentService from "../services/contentService";
import NavigationBar from "../components/global/NavigationBar";
import Footer from "../components/global/Footer";
import GlobalMetas from "../components/head/GlobalMetas";
import BreadcrumbRichSnippet from "../components/richsnippets/BreadcrumbRichSnippet";
import EditorialGrid from "../components/listings/EditorialGrid";
import LoadMoreLink from "../components/listings/LoadMoreLink";
import MobileAnchorAd from "../components/ads/MobileAnchorAd";
import ListingHeader from "../components/headers/ListingHeader";
import { toEditorialCard } from "../utils/listingProps";
import { pagePath, pageTitle } from "../utils/pagination";

const BASE_PATH = "/histories";

const StoriesList = ({ stories, totalItems, numPages, currentPage = 1 }) => {
	// `results` només guarda les tandes carregades amb «Veure'n més»: les de la
	// pàgina arriben per props i es pinten des del servidor.
	const stateFromProps = () => ({
		results: [],
		isFetching: false,
		numResults: totalItems,
		numPages: numPages,
		currentPage: currentPage,
	});

	const [state, setState] = useState(stateFromProps);
	const service = new ContentService();

	// `/histories` i `/histories/pagina/{n}` comparteixen aquest component: en
	// passar de l'una a l'altra Next no el torna a muntar i l'estat s'ha de
	// refer amb les props noves.
	useEffect(() => {
		setState(stateFromProps());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage]);

	// L'API compta les pàgines des de 0: la tanda que ve després de la
	// `currentPage` (base 1) és justament `currentPage`.
	const loadMoreResults = async () => {
		setState((prev) => ({ ...prev, isFetching: true }));
		const { stories: nextStories } = await service.paginateStories(
			state.currentPage,
		);
		setState((prev) => ({
			...prev,
			results: [...prev.results, ...nextStories],
			isFetching: false,
			currentPage: prev.currentPage + 1,
		}));
	};

	const pageUrl = `https://escapadesenparella.cat${pagePath(
		BASE_PATH,
		currentPage,
	)}`;

	return (
		<>
			{/* Browser metas  */}
			<GlobalMetas
				title={pageTitle("Històries en parella", currentPage)}
				description="Històries en parella per a inspirar, descobrir nous llocs i, en definitiva, fer-vos venir ganes d'una escapada en parella per recordar."
				url={pageUrl}
				image="https://escapadesenparella.cat/img/containers/main/img/og-histories.png/69081998ba0dfcb1465f7f878cbc7912.png"
				canonical={pageUrl}
			/>
			{/* Rich snippets */}
			<BreadcrumbRichSnippet
				page1Title="Inici"
				page1Url="https://escapadesenparella.cat"
				page2Title="Històries en parella"
				page2Url={`https://escapadesenparella.cat/histories`}
			/>
			<div className="stories">
				<NavigationBar />
				<main>
					{/* Main column - Listings */}
					<ListingHeader
						title={`Històries en parella`}
						subtitle={`Les històries en parella de l'Andrea i en Juli. Aquí trobareu les nostres escapades viscudes de primera mà, històries per inspirar, descobrir llocs nous i fer-vos venir ganes d'una escapada en parella per recordar!`}
						breadcrumbLevel1={"Històries en parella"}
					/>

					{/* Section stories */}
					<section className="pt-6 md:pt-8 pb-12 lg:pb-20">
						<div className="container">
							{/* Les targetes són h3: sense aquest h2 la jerarquia saltava
							    de l'h1 de la capçalera a l'h3 de cada història. */}
							<h2 className="sr-only">Totes les històries</h2>
							{stories.length > 0 ? (
								<>
									<EditorialGrid
										items={[...stories, ...state.results]}
										basePath="/histories"
										badge="Història"
										eagerCount={4}
									/>
									{state.currentPage < state.numPages ? (
										<LoadMoreLink
											href={pagePath(
												BASE_PATH,
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
										Encara no hi ha publicacions
										disponibles. Sisplau, torna-ho a provar
										més endavant.
									</p>
								</div>
							)}
						</div>
					</section>
				</main>
			</div>
			<Footer />
			<MobileAnchorAd />
		</>
	);
};

/**
 * Props d'una pàgina del llistat d'històries. També les fa servir
 * `pages/histories/pagina/[pagina].jsx` per a la resta de tandes.
 *
 * `featuredStories` ja no s'envia: la pàgina no el pintava i l'API el demana
 * amb `.limit(0)`, que a Mongoose vol dir «sense límit». Incrustava totes les
 * històries, amb l'autor, a l'HTML de `/histories`, que feia 1 MB.
 */
export const getStoriesPageProps = async (page = 1) => {
	const service = new ContentService();
	const { totalItems, stories, numPages } = await service.paginateStories(
		page - 1,
	);

	if (page > 1 && page > numPages) {
		return { notFound: true };
	}

	return {
		props: {
			totalItems,
			stories: (stories || []).map(toEditorialCard),
			numPages,
			currentPage: page,
		},
	};
};

export async function getServerSideProps() {
	return getStoriesPageProps();
}

export default StoriesList;
