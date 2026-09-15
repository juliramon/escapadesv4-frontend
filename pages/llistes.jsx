import { useEffect, useState } from "react";
import ContentService from "../services/contentService";
import NavigationBar from "../components/global/NavigationBar";
import EditorialGrid from "../components/listings/EditorialGrid";
import LoadMoreLink from "../components/listings/LoadMoreLink";
import MobileAnchorAd from "../components/ads/MobileAnchorAd";
import Footer from "../components/global/Footer";
import GlobalMetas from "../components/head/GlobalMetas";
import BreadcrumbRichSnippet from "../components/richsnippets/BreadcrumbRichSnippet";
import ListingHeader from "../components/headers/ListingHeader";
import { toEditorialCard } from "../utils/listingProps";
import { pagePath, pageTitle } from "../utils/pagination";

const BASE_PATH = "/llistes";

const ListsList = ({ totalItems, lists, numPages, currentPage = 1 }) => {
	// L'estat surt de les props des del primer render. Abans començava buit i
	// s'omplia en un useEffect: el servidor pintava esquelets i l'HTML que
	// llegeix Google no enllaçava cap llista.
	const stateFromProps = () => ({
		lists: lists || [],
		isFetching: false,
		numPages: numPages,
		currentPage: currentPage,
	});
	const [state, setState] = useState(stateFromProps);

	// `/llistes` i `/llistes/pagina/{n}` comparteixen aquest component: en
	// passar de l'una a l'altra Next no el torna a muntar i l'estat s'ha de
	// refer amb les props noves.
	useEffect(() => {
		setState(stateFromProps());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage]);

	const service = new ContentService();

	// L'API compta les pàgines des de 0: la tanda que ve després de la
	// `currentPage` (base 1) és justament `currentPage`.
	const loadMoreResults = async () => {
		setState((prev) => ({ ...prev, isFetching: true }));
		const { lists: nextLists } = await service.paginateLists(
			state.currentPage,
		);
		setState((prev) => ({
			...prev,
			lists: [...prev.lists, ...nextLists],
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
				title={pageTitle("Llistes d'escapades", currentPage)}
				description="Llistes d'escapades per a inspirar, descobrir nous llocs i, en definitiva, fer-vos venir ganes d'una escapada en parella per recordar."
				url={pageUrl}
				image="https://res.cloudinary.com/juligoodie/image/upload/v1632416196/getaways-guru/zpdiudqa0bk8sc3wfyue.jpg"
				canonical={pageUrl}
			/>
			{/* Rich snippets */}
			<BreadcrumbRichSnippet
				page1Title="Inici"
				page1Url="https://escapadesenparella.cat"
				page2Title="Llistes d'escapades"
				page2Url={`https://escapadesenparella.cat/llistes`}
			/>
			<div className="lists">
				<NavigationBar />
				<main>
					{/* Main column - Listings */}
					<ListingHeader
						title={`Llistes d'escapades per gaudir en parella`}
						subtitle={`Descobreix llistes d'idees i consells per viure al màxim les vostres escapades en parella per Catalunya`}
						breadcrumbLevel1={"Llistes"}
					/>

					{/* Section lists */}
					<section className="pt-6 md:pt-8 pb-12 lg:pb-20">
						<div className="container">
							{/* Les targetes són h3: sense aquest h2 la jerarquia saltava
							    de l'h1 de la capçalera a l'h3 de cada llista. */}
							<h2 className="sr-only">Totes les llistes</h2>
							<EditorialGrid
								items={state.lists}
								basePath="/llistes"
								badge="Llista"
								skeletonCount={8}
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
						</div>
					</section>
				</main>
			</div>
			<Footer
				logo_url={
					"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
				}
			/>
			<MobileAnchorAd />
		</>
	);
};

/**
 * Props d'una pàgina del llistat de llistes. També les fa servir
 * `pages/llistes/pagina/[pagina].jsx` per a la resta de tandes.
 */
export const getListsPageProps = async (page = 1) => {
	const service = new ContentService();
	const { totalItems, lists, numPages } = await service.paginateLists(
		page - 1,
	);

	if (page > 1 && page > numPages) {
		return { notFound: true };
	}

	return {
		props: {
			totalItems,
			lists: (lists || []).map(toEditorialCard),
			numPages,
			currentPage: page,
		},
	};
};

export async function getServerSideProps() {
	return getListsPageProps();
}

export default ListsList;
