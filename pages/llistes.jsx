import { useEffect, useState } from "react";
import ContentService from "../services/contentService";
import NavigationBar from "../components/global/NavigationBar";
import RegularListBox from "../components/listings/RegularListBox";
import Footer from "../components/global/Footer";
import GlobalMetas from "../components/head/GlobalMetas";
import BreadcrumbRichSnippet from "../components/richsnippets/BreadcrumbRichSnippet";
import ShareBarModal from "../components/social/ShareBarModal";
import ListingHeader from "../components/headers/ListingHeader";

const ListsList = ({ user, totalItems, lists, numPages }) => {
	const initialState = {
		loggedUser: user,
		lists: [],
		hasLists: false,
		isFetching: false,
		numActivities: 0,
		numPages: 0,
		currentPage: 1,
		emptyBlocksPerRow: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
	};
	const [state, setState] = useState(initialState);

	const service = new ContentService();

	useEffect(() => {
		if (lists) {
			setState({
				...state,
				lists: lists,
				hasLists: true,
				numLists: totalItems,
				numPages: numPages,
			});
		}
	}, []);

	const loadMoreResults = async (page) => {
		setState({ ...state, isFetching: true });
		const { lists } = await service.paginateLists(page);
		setState({
			...state,
			lists: [...state.lists, ...lists],
			isFetching: false,
			currentPage: ++state.currentPage,
		});
	};

	return (
		<>
			{/* Browser metas  */}
			<GlobalMetas
				title="Llistes d'escapades"
				description="Llistes d'escapades per a inspirar, descobrir nous llocs i, en definitiva, fer-vos venir ganes d'una escapada en parella per recordar."
				url="https://escapadesenparella.cat/llistes"
				image="https://res.cloudinary.com/juligoodie/image/upload/v1632416196/getaways-guru/zpdiudqa0bk8sc3wfyue.jpg"
				canonical="https://escapadesenparella.cat/llistes"
			/>
			{/* Rich snippets */}
			<BreadcrumbRichSnippet
				page1Title="Inici"
				page1Url="https://escapadesenparella.cat"
				page2Title="Llistes d'escapades"
				page2Url={`https://escapadesenparella.cat/llistes`}
			/>
			<div className="lists">
				<NavigationBar
					logo_url={
						"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
					}
					user={user}
				/>
				<main>
					{/* Main column - Listings */}
					<div className="lg:mt-6">
						<div className="container">
							<ul className="breadcrumb max-w-5xl">
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
										Llistes
									</span>
								</li>
							</ul>
							<ListingHeader
								title={`<span class="text-secondary-500">Llistes</span> d'escapades per gaudir en parella`}
								subtitle={`Descobreix llistes d'idees i consells per viure al màxim les vostres escapades en parella per Catalunya`}
							/>
						</div>
					</div>

					{/* Section lists' list */}
					<section className="py-8 md:pb-12 lg:pb-20">
						<div className="container">
							<div className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 gap-x-5">
								{state.hasLists
									? state.lists.map((el, idx) => (
											<article className="mb-8">
												<RegularListBox
													index={idx}
													key={el._id}
													slug={el.slug}
													cover={el.cover}
													title={el.title}
													subtitle={el.subtitle}
													avatar={el.owner.avatar}
													owner={el.owner.fullName}
													date={el.createdAt}
												/>
											</article>
									  ))
									: ""}
							</div>
							{state.currentPage !== state.numPages ? (
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
				</main>
			</div>
			<Footer
				logo_url={
					"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
				}
			/>
		</>
	);
};

export async function getServerSideProps() {
	const service = new ContentService();
	const { totalItems, lists, numPages } = await service.getLists();

	return {
		props: {
			totalItems,
			lists,
			numPages,
		},
	};
}

export default ListsList;
