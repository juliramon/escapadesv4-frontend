import { useEffect, useState } from "react";
import ContentService from "../services/contentService";
import NavigationBar from "../components/global/NavigationBar";
import FetchingSpinner from "../components/global/FetchingSpinner";
import { useRouter } from "next/router";
import Footer from "../components/global/Footer";
import GlobalMetas from "../components/head/GlobalMetas";
import Breadcrumb from "../components/richsnippets/Breadcrumb";
import StoriesHeader from "../components/headers/StoriesHeader";
import StoryListing from "../components/listings/StoryListing";

const StoriesList = ({
	user,
	mostRecentStories,
	totalItems,
	stories,
	featuredStories,
	numPages,
}) => {
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
		mostRecentStories: [],
		stories: [],
		featuredStories: [],
		hasStories: false,
		isFetching: false,
		numActivities: 0,
		numPages: 0,
		currentPage: 1,
	};

	const [state, setState] = useState(initialState);
	const service = new ContentService();

	useEffect(() => {
		if (stories) {
			setState({
				...state,
				mostRecentStories: mostRecentStories,
				stories: stories,
				featuredStories: featuredStories,
				hasStories: true,
				numStories: totalItems,
				numPages: numPages,
			});
		}
	}, []);

	const loadMoreResults = async (page) => {
		setState({ ...state, isFetching: true });
		const { stories } = await service.paginateStories(page);
		setState({
			...state,
			stories: [...state.stories, ...stories],
			isFetching: false,
			currentPage: ++state.currentPage,
		});
	};

	return (
		<>
			{/* Browser metas  */}
			<GlobalMetas
				title="Històries en parella"
				description="Històries en parella per a inspirar, descobrir nous llocs i, en definitiva, fer-vos venir ganes d'una escapada en parella per recordar."
				url="https://escapadesenparella.cat/histories"
				image="https://escapadesenparella.cat/img/containers/main/img/og-histories.png/69081998ba0dfcb1465f7f878cbc7912.png"
				canonical="https://escapadesenparella.cat/histories"
			/>
			{/* Rich snippets */}
			<Breadcrumb
				page1Title="Inici"
				page1Url="https://escapadesenparella.cat"
				page2Title="Històries en parella"
				page2Url={`https://escapadesenparella.cat/histories`}
			/>
			<div className="stories">
				<NavigationBar />
				<StoriesHeader mostRecentStories={mostRecentStories} />
				<main>
					<section className="pt-6 md:pt-16">
						<div className="container">
							<h2>Històries destacades</h2>
							<div className="flex flex-wrap items-center mt-6 -mx-2">
								{state.hasStories
									? state.featuredStories.map((el, idx) => (
											<article
												key={idx}
												className="w-full md:w-1/2 lg:w-1/4 px-2 mb-8"
											>
												<StoryListing
													story={el}
													index={idx}
												/>
											</article>
									  ))
									: null}
							</div>
						</div>
					</section>
					<section className="py-6 md:py-16">
						<div className="container">
							<div className="w-full">
								<h2 className="mt-0 mb-1.5">
									Més històries per a inspirar-vos
								</h2>
								<div className="text-primary-400 text-[15px] font-light">
									Des del Delta de l'Ebre fins al Cap de
									Creus, passant pels cims més alts dels
									Pirineus.
									<br /> Aquí t'expliquem les nostres
									aventures en parella a Catalunya.
								</div>
							</div>
							<div className="flex flex-wrap items-start mt-6 -mx-2">
								{state.stories.map((el, idx) => (
									<article
										key={idx}
										className="w-full md:w-1/2 lg:w-1/4 px-2 mb-8"
									>
										<StoryListing story={el} index={idx} />
									</article>
								))}
								<div className="flex justify-center w-full mt-2 md:mt-10">
									{state.currentPage !== state.numPages ? (
										<div className="w-full flex justify-center">
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
							</div>
						</div>
					</section>
				</main>
			</div>
			<Footer />
		</>
	);
};

export async function getServerSideProps() {
	const service = new ContentService();
	const { totalItems, stories, featuredStories, numPages } =
		await service.getStories();
	const mostRecentStories = await service.getMostRecentStories();
	return {
		props: {
			mostRecentStories,
			totalItems,
			stories,
			featuredStories,
			numPages,
		},
	};
}

export default StoriesList;
