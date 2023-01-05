import { useEffect, useState, useContext, useCallback } from "react";
import NavigationBar from "../components/global/NavigationBar";
import ContentService from "../services/contentService";
import ContentBox from "../components/dashboard/ContentBox";
import Head from "next/head";
import UserContext from "../contexts/UserContext";
import FetchingSpinner from "../components/global/FetchingSpinner";
import { useRouter } from "next/router";
import CategoryBox from "../components/dashboard/CategoryBox";

const AdminPanel = () => {
	// Validate if user is allowed to access this view
	const { user } = useContext(UserContext);
	const [loadPage, setLoadPage] = useState(false);
	useEffect(() => {
		if (user && user.userType == "admin") {
			setLoadPage(true);
		}
	}, []);
	// End validation

	const router = useRouter();

	useEffect(() => {
		if (!user || user === "null" || user === undefined) {
			router.push("/login");
		}
	}, [user]);

	const service = new ContentService();

	const initialState = {
		activities: [],
		places: [],
		stories: [],
		lists: [],
		isFetching: false,
		activeTab: "activities",
	};

	const [state, setState] = useState(initialState);
	const [categoryModalVisibility, setCategoryModalVisibility] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			setState({ ...state, isFetching: true });
			const activities = await service.activities();
			const places = await service.getAllPlaces();
			const stories = await service.getAllStories();
			const lists = await service.getAllLists();
			const categories = await service.getCategories();

			setState({
				...state,
				activities: activities.allActivities,
				places: places.allPlaces,
				stories: stories.allStories,
				lists: lists,
				categories: categories,
				isFetching: false,
			});
		};
		fetchData();
	}, []);

	const fetchData = useCallback(async () => {
		setState({ ...state, isFetching: true });
		const activities = await service.activities();
		const places = await service.getAllPlaces();
		const stories = await service.getAllStories();
		const lists = await service.getAllLists();
		const categories = await service.getCategories();

		setState({
			...state,
			activities: activities.allActivities,
			places: places.allPlaces,
			stories: stories.allStories,
			lists: lists,
			categories: categories,
			isFetching: false,
		});
	});

	let listResults;

	if (state.isFetching) {
		listResults = <FetchingSpinner />;
	} else {
		if (state.activeTab === "activities") {
			listResults = state.activities.map((el, idx) => (
				<ContentBox
					key={idx}
					type={el.type}
					id={el._id}
					image={el.images[0]}
					title={el.title}
					subtitle={el.subtitle}
					publicationDate={el.createdAt}
					slug={el.slug}
				/>
			));
		}
		if (state.activeTab === "places") {
			listResults = state.places.map((el, idx) => (
				<ContentBox
					key={idx}
					type={el.type}
					id={el._id}
					image={el.images[0]}
					title={el.title}
					subtitle={el.subtitle}
					publicationDate={el.createdAt}
					slug={el.slug}
				/>
			));
		}
		if (state.activeTab === "stories") {
			listResults = state.stories.map((el, idx) => (
				<ContentBox
					key={idx}
					type={el.type}
					id={el._id}
					image={el.images[0]}
					title={el.title}
					subtitle={el.subtitle}
					publicationDate={el.createdAt}
					slug={el.slug}
				/>
			));
		}

		if (state.activeTab === "lists") {
			listResults = state.lists.map((el, idx) => (
				<ContentBox
					key={idx}
					type={el.type}
					id={el._id}
					image={el.cover}
					title={el.title}
					subtitle={el.subtitle}
					publicationDate={el.createdAt}
					slug={el.slug}
				/>
			));
		}

		if (state.activeTab === "categories") {
			listResults = state.categories.map((el, idx) => (
				<CategoryBox
					key={idx}
					type={"category"}
					id={el._id}
					name={el.name}
					pluralName={el.pluralName}
					isPlace={el.isPlace}
					illustration={el.illustration}
					image={el.image}
					imageCaption={el.imageCaption}
					title={el.title}
					subtitle={el.subtitle}
					slug={el.slug}
					seoTextHeader={el.seoTextHeader}
					seoText={el.seoText}
					icon={el.icon}
					isSponsored={el.isSponsored}
					sponsorURL={el.sponsorURL}
					sponsorLogo={el.sponsorLogo}
					sponsorClaim={el.sponsorClaim}
					fetchData={fetchData}
				/>
			));
		}
	}

	const isActive =
		"bg-primary-500 border-primary-500 text-white hover:bg-primary-700";

	if (!loadPage) {
		return <FetchingSpinner />;
	}

	return (
		<>
			<Head>
				<title>Panell d'administració - Escapadesenparella.cat</title>
				<link rel="icon" href="/favicon.ico" />
				<link meta="robots" rel="noindex,nofollow" />
			</Head>
			<NavigationBar
				logo_url={
					"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
				}
				user={user}
			/>
			<main className="bg-primary-100 p-6">
				<div className="bg-white rounded border border-primary-300 p-5">
					<h1 className="text-2xl">Panell d'administració</h1>
					<div className="mt-4 flex items-center -mx-2">
						<div className="px-2 w-1/6">
							<div className="p-6 border border-primary-300 rounded text-center flex flex-col justify-center">
								<div className="text-2xl">
									{state.isFetching ? (
										<div className="flex items-center justify-center mb-1">
											<svg
												role="status"
												className="w-6 h-6 text-blue-600 animate-spin dark:text-gray-600 fill-white"
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
										</div>
									) : (
										state.activities.length
									)}
								</div>
								<span className="uppercase text-xs inline-block mt-1">
									activitats
								</span>
							</div>
						</div>
						<div className="px-2 w-1/6">
							<div className="p-6 border border-primary-300 rounded text-center flex flex-col justify-center">
								<span className="text-2xl">
									{state.isFetching ? (
										<div className="flex items-center justify-center mb-1">
											<svg
												role="status"
												className="w-6 h-6 text-blue-600 animate-spin dark:text-gray-600 fill-white"
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
										</div>
									) : (
										state.places.length
									)}
								</span>
								<span className="uppercase text-xs inline-block mt-1">
									allotjaments
								</span>
							</div>
						</div>
						<div className="px-2 w-1/6">
							<div className="p-6 border border-primary-300 rounded text-center flex flex-col justify-center">
								<span className="text-2xl">
									{state.isFetching ? (
										<div className="flex items-center justify-center mb-1">
											<svg
												role="status"
												className="w-6 h-6 text-blue-600 animate-spin dark:text-gray-600 fill-white"
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
										</div>
									) : (
										state.stories.length
									)}
								</span>
								<span className="uppercase text-xs inline-block mt-1">
									històries
								</span>
							</div>
						</div>
						<div className="px-2 w-1/6">
							<div className="p-6 border border-primary-300 rounded text-center flex flex-col justify-center">
								<span className="text-2xl">
									{state.isFetching ? (
										<div className="flex items-center justify-center mb-1">
											<svg
												role="status"
												className="w-6 h-6 text-blue-600 animate-spin dark:text-gray-600 fill-white"
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
										</div>
									) : (
										state.lists.length
									)}
								</span>
								<span className="uppercase text-xs inline-block mt-1">
									llistes
								</span>
							</div>
						</div>
						<div className="px-2 w-1/6">
							<div className="p-6 border border-primary-300 rounded text-center flex flex-col justify-center">
								<span className="text-2xl">
									{state.isFetching ? (
										<div className="flex items-center justify-center mb-1">
											<svg
												role="status"
												className="w-6 h-6 text-blue-600 animate-spin dark:text-gray-600 fill-white"
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
										</div>
									) : (
										state.categories.length
									)}
								</span>
								<span className="uppercase text-xs inline-block mt-1">
									categories
								</span>
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-wrap items-stretch mt-6 -mx-3">
					<div className="w-2/12 px-3">
						<div className="bg-white rounded border border-primary-300 p-5">
							<h2 className="uppercase text-sm font-normal tracking-wider">
								Menú
							</h2>
							<ul className="list-none mt-3 mx-0 mb-0 p-0">
								<li>
									<button
										className={`py-2.5 px-4 border  transition-all duration-300 ease-in-out mb-2 rounded cursor-pointer w-full text-left text-sm ${
											state.activeTab == "activities"
												? isActive
												: "border-primary-300 bg-white hover:bg-primary-100"
										}`}
										onClick={() =>
											setState({ ...state, activeTab: "activities" })
										}
									>
										Activitats
									</button>
								</li>
								<li>
									<button
										className={`py-2.5 px-4 border transition-all duration-300 ease-in-out mb-2 rounded cursor-pointer w-full text-left text-sm ${
											state.activeTab == "places"
												? isActive
												: "border-primary-300 bg-white hover:bg-primary-100"
										}`}
										onClick={() => setState({ ...state, activeTab: "places" })}
									>
										Allotjaments
									</button>
								</li>
								<li>
									<button
										className={`py-2.5 px-4 border transition-all duration-300 ease-in-out mb-2 rounded cursor-pointer w-full text-left text-sm ${
											state.activeTab == "stories"
												? isActive
												: "border-primary-300 bg-white hover:bg-primary-100"
										}`}
										onClick={() => setState({ ...state, activeTab: "stories" })}
									>
										Històries
									</button>
								</li>
								<li>
									<button
										className={`py-2.5 px-4 border transition-all duration-300 ease-in-out mb-2 rounded cursor-pointer w-full text-left text-sm ${
											state.activeTab == "lists"
												? isActive
												: "border-primary-300 bg-white hover:bg-primary-100"
										}`}
										onClick={() => setState({ ...state, activeTab: "lists" })}
									>
										Llistes
									</button>
								</li>
								<li>
									<button
										className={`py-2.5 px-4 border transition-all duration-300 ease-in-out mb-2 rounded cursor-pointer w-full text-left text-sm ${
											state.activeTab == "categories"
												? isActive
												: "border-primary-300 bg-white hover:bg-primary-100"
										}`}
										onClick={() =>
											setState({ ...state, activeTab: "categories" })
										}
									>
										Categories
									</button>
								</li>
							</ul>
						</div>
					</div>
					<div className="w-10/12 px-3">
						<div className="bg-white rounded border border-primary-300 p-5">
							<h2 className="uppercase text-sm font-normal tracking-wider">
								Llista de resultats
							</h2>
							<div className="w-full mt-3 flex flex-col items-center justify-center">
								{listResults}
							</div>
						</div>
					</div>
				</div>
			</main>
		</>
	);
};

export default AdminPanel;
