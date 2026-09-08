import { useEffect, useState, useContext, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import NavigationBar from "../components/global/NavigationBar";
import ContentService from "../services/contentService";
import UserContext from "../contexts/UserContext";
import FetchingSpinner from "../components/global/FetchingSpinner";
import ContentBox from "../components/dashboard/ContentBox";
import CategoryBox from "../components/dashboard/CategoryBox";
import CharacteristicBox from "../components/dashboard/CharacteristicBox";
import TripCategoryBox from "../components/dashboard/TripCategoryBox";
import DestinationBox from "../components/dashboard/DestinationBox";
import TaxonomyModal from "../components/modals/TaxonomyModal";
import TripCategoryModal from "../components/modals/TripCategoryModal";
import DestinationModal from "../components/modals/DestinationModal";

/**
 * Panell d'administració.
 *
 * Abans les nou pestanyes estaven escrites a mà tres vegades cadascuna —al
 * comptador de mètriques, al menú lateral i al bloc d'`if` que decidia què es
 * pintava—, i `fetchData` existia duplicat: un cop dins d'un `useEffect` i un
 * altre dins d'un `useCallback`, amb les mateixes nou peticions. Ara tot surt
 * d'una sola taula de configuració.
 */

/** Camps que comparteixen les fitxes de contingut publicable. */
const contentBoxProps = (item) => ({
	type: item.type,
	id: item._id,
	// Les llistes i les entrades de viatge guarden la portada a `cover`; les
	// activitats i els allotjaments, a `images[0]`.
	image: item.cover || (Array.isArray(item.images) ? item.images[0] : ""),
	title: item.title,
	subtitle: item.subtitle,
	publicationDate: item.createdAt,
	slug: item.slug,
});

const AdminPanel = () => {
	const { user } = useContext(UserContext);
	const router = useRouter();
	const service = new ContentService();

	const [loadPage, setLoadPage] = useState(false);
	const [toggleButton, setToggleButton] = useState(false);
	const [openCreateModal, setOpenCreateModal] = useState(null);

	const [state, setState] = useState({
		activities: [],
		places: [],
		stories: [],
		lists: [],
		categories: [],
		characteristics: [],
		tripCategories: [],
		tripEntries: [],
		destinations: [],
		isFetching: false,
		activeTab: "activities",
	});

	useEffect(() => {
		if (user && user.userType == "admin") {
			setLoadPage(true);
		}
		// Depèn de `user`: amb la llista buida només s'avaluava al primer
		// render, quan encara no s'ha resolt la sessió, i un administrador
		// legítim es quedava permanentment amb el spinner.
	}, [user]);

	useEffect(() => {
		if (!user || user === "null" || user === undefined) {
			router.push("/login");
		}
	}, [user]);

	/**
	 * Les nou crides eren seqüencials i es feien esperar entre elles: la
	 * càrrega del panell era la suma de totes. Ara van en paral·lel i, si una
	 * falla, la resta del panell segueix funcionant.
	 */
	const fetchData = useCallback(async () => {
		setState((previous) => ({ ...previous, isFetching: true }));

		const safe = (request, fallback) =>
			request().catch((error) => {
				console.error("[admin] error carregant dades:", error.message);
				return fallback;
			});

		const [
			activities,
			places,
			stories,
			lists,
			categories,
			characteristics,
			tripCategories,
			tripEntries,
			destinations,
		] = await Promise.all([
			safe(() => service.activities(), {}),
			safe(() => service.getAllPlaces(), {}),
			safe(() => service.getAllStories(), {}),
			safe(() => service.getAllLists(), []),
			safe(() => service.getCategories(), []),
			safe(() => service.getCharacteristics(), []),
			safe(() => service.getTripCategories(), []),
			safe(() => service.getAllTripEntries(), {}),
			safe(() => service.getDestinations(), []),
		]);

		setState((previous) => ({
			...previous,
			activities: activities.allActivities || [],
			places: places.allPlaces || [],
			stories: stories.allStories || [],
			lists: lists || [],
			categories: categories || [],
			characteristics: characteristics || [],
			tripCategories: tripCategories || [],
			tripEntries: tripEntries.allTrips || [],
			destinations: destinations || [],
			isFetching: false,
		}));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	/**
	 * Una entrada per pestanya: el comptador, el botó del menú i el llistat de
	 * resultats es generen tots a partir d'aquí.
	 */
	const TABS = [
		{
			key: "activities",
			title: "Activitats",
			render: (item) => <ContentBox {...contentBoxProps(item)} />,
		},
		{
			key: "places",
			title: "Allotjaments",
			render: (item) => <ContentBox {...contentBoxProps(item)} />,
		},
		{
			key: "stories",
			title: "Històries",
			render: (item) => <ContentBox {...contentBoxProps(item)} />,
		},
		{
			key: "lists",
			title: "Llistes",
			render: (item) => <ContentBox {...contentBoxProps(item)} />,
		},
		{
			key: "categories",
			title: "Categories",
			render: (item) => (
				<CategoryBox
					id={item._id}
					name={item.name}
					pluralName={item.pluralName}
					isPlace={item.isPlace}
					illustration={item.illustration}
					image={item.image}
					imageCaption={item.imageCaption}
					title={item.title}
					subtitle={item.subtitle}
					slug={item.slug}
					seoTextHeader={item.seoTextHeader}
					seoText={item.seoText}
					icon={item.icon}
					isSponsored={item.isSponsored}
					sponsorURL={item.sponsorURL}
					sponsorLogo={item.sponsorLogo}
					sponsorClaim={item.sponsorClaim}
					fetchData={fetchData}
				/>
			),
		},
		{
			key: "characteristics",
			title: "Característiques",
			render: (item) => (
				<CharacteristicBox
					id={item._id}
					name={item.name}
					pluralName={item.pluralName}
					isPlace={item.isPlace}
					illustration={item.illustration}
					image={item.image}
					imageCaption={item.imageCaption}
					title={item.title}
					subtitle={item.subtitle}
					slug={item.slug}
					seoTextHeader={item.seoTextHeader}
					seoText={item.seoText}
					icon={item.icon}
					isSponsored={item.isSponsored}
					sponsorURL={item.sponsorURL}
					sponsorLogo={item.sponsorLogo}
					sponsorClaim={item.sponsorClaim}
					fetchData={fetchData}
				/>
			),
		},
		{
			key: "tripCategories",
			title: "Categories de viatge",
			render: (item) => (
				<TripCategoryBox
					id={item._id}
					slug={item.slug}
					title={item.title}
					richTitle={item.richTitle}
					country={item.country}
					mapLocation={item.mapLocation}
					image={item.image}
					carouselImages={item.carouselImages}
					reviewText={item.reviewText}
					mostLikedText={item.mostLikedText}
					pointsOfInterestText={item.pointsOfInterestText}
					mustSeeText={item.mustSeeText}
					seoTextHeader={item.seoTextHeader}
					seoText={item.seoText}
					isSponsored={item.isSponsored}
					sponsorURL={item.sponsorURL}
					sponsorLogo={item.sponsorLogo}
					sponsorClaim={item.sponsorClaim}
					fetchData={fetchData}
				/>
			),
		},
		{
			key: "tripEntries",
			title: "Entrades de viatge",
			render: (item) => {
				// Una entrada sense categoria (o amb una de ja esborrada) feia
				// petar tota la pestanya en llegir el.trip._id / category.slug.
				const tripId = item.trip ? item.trip._id || item.trip : null;
				const category = tripId
					? state.tripCategories.find(
							(tripCategory) => tripCategory._id === tripId
					  )
					: null;
				return (
					<ContentBox
						{...contentBoxProps(item)}
						trip={category ? category.slug : ""}
					/>
				);
			},
		},
		{
			key: "destinations",
			title: "Destinacions",
			render: (item) => (
				<DestinationBox
					id={item._id}
					slug={item.slug}
					title={item.title}
					longTitle={item.longTitle}
					subtitle={item.subtitle}
					image={item.image}
					reviewText={item.reviewText}
					carouselImages={item.carouselImages}
					mapLocation={item.mapLocation}
					mostLikedText={item.mostLikedText}
					pointsOfInterestText={item.pointsOfInterestText}
					mustSeeText={item.mustSeeText}
					seoTextHeader={item.seoTextHeader}
					seoText={item.seoText}
					isSponsored={item.isSponsored}
					isFeatured={item.isFeatured}
					sponsorURL={item.sponsorURL}
					sponsorLogo={item.sponsorLogo}
					sponsorClaim={item.sponsorClaim}
					fetchData={fetchData}
				/>
			),
		},
	];

	/** Accions del panell flotant de publicació. */
	const CREATE_ACTIONS = [
		{ label: "Publicar nova activitat", href: "/nova-activitat" },
		{ label: "Publicar nou allotjament", href: "/nou-allotjament" },
		{ label: "Publicar nova història", href: "/nova-historia" },
		{ label: "Publicar nova llista", href: "/nova-llista" },
		{ label: "Publicar nova categoria", modal: "category" },
		{ label: "Publicar nova característica", modal: "characteristic" },
		{ label: "Publicar nova destinació", modal: "destination" },
		{ label: "Publicar nova categoria de viatge", modal: "tripCategory" },
		{ label: "Publicar nova entrada de viatge", href: "/nou-viatge" },
	];

	const activeTab = TABS.find((tab) => tab.key === state.activeTab);
	const activeItems = state[state.activeTab] || [];

	const listResults = state.isFetching ? (
		<FetchingSpinner />
	) : (
		activeItems.map((item, idx) => (
			<div key={item._id || idx} className="w-full">
				{activeTab.render(item)}
			</div>
		))
	);

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
			<main className="bg-primary-50 p-6 relative">
				<div className="bg-white rounded-md shadow p-5">
					<h1 className="text-2xl">Panell d'administració</h1>

					{/* Graella de mètriques */}
					<div className="mt-4 flex items-center -mx-2">
						{TABS.map((tab) => (
							<div
								key={tab.key}
								className="px-2 flex-1 min-w-[1/6]"
							>
								<div className="p-6 border border-primary-100 rounded-md text-center flex flex-col justify-center">
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
											// Si una crida falla i retorna un
											// objecte d'error, .length tombava
											// tot el panell.
											(state[tab.key] || []).length
										)}
									</div>
									<span className="text-sm">{tab.title}</span>
								</div>
							</div>
						))}
					</div>

					<div className="flex flex-wrap items-start -mx-3 mt-6">
						<div className="w-2/12 px-3">
							<div className="bg-white rounded-md shadow p-5">
								<h2 className="uppercase text-sm font-normal tracking-wider">
									Menú
								</h2>
								<ul className="list-none mt-3 mx-0 mb-0 p-0">
									{TABS.map((tab) => (
										<li key={tab.key}>
											<button
												type="button"
												className={`py-2.5 px-4 border transition-all duration-300 ease-in-out mb-2 rounded-md cursor-pointer w-full text-left text-sm ${
													state.activeTab === tab.key
														? isActive
														: "border-primary-100 bg-white hover:bg-primary-50"
												}`}
												onClick={() =>
													setState((previous) => ({
														...previous,
														activeTab: tab.key,
													}))
												}
											>
												{tab.title}
											</button>
										</li>
									))}
								</ul>
							</div>
						</div>
						<div className="w-10/12 px-3">
							<div className="bg-white rounded-md shadow p-5">
								<h2 className="uppercase text-sm font-normal tracking-wider">
									Llista de resultats
								</h2>
								<div className="w-full mt-3 flex flex-col items-center justify-center">
									{listResults}
								</div>
							</div>
						</div>
					</div>
				</div>

				<div
					id="floatingPublishPanel"
					className={`fixed bottom-5 right-4 flex flex-col items-end ${
						toggleButton ? "show" : ""
					}`}
				>
					<div
						id="floatingPublishButton"
						className="flex flex-col items-end"
					>
						{CREATE_ACTIONS.map((action) =>
							action.href ? (
								<a
									key={action.label}
									href={action.href}
									title={action.label}
									target="_blank"
									rel="noreferrer"
									className="bg-white hover:bg-primary-100 border-primary-200 rounded-md py-2.5 px-4 mb-1.5 shadow-lg text-sm"
								>
									{action.label}
								</a>
							) : (
								<button
									key={action.label}
									type="button"
									className="bg-white hover:bg-primary-100 border-primary-200 rounded-md py-2.5 px-4 mb-1.5 shadow-lg text-sm"
									onClick={() =>
										setOpenCreateModal(action.modal)
									}
								>
									{action.label}
								</button>
							)
						)}
					</div>
					<button
						type="button"
						className="button button__primary button__med shadow-xl"
						onClick={() => setToggleButton(!toggleButton)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="mr-2 icon"
							width={24}
							height={24}
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
						Nou post
					</button>
				</div>
			</main>

			{openCreateModal === "category" ? (
				<TaxonomyModal
					entity="category"
					mode="create"
					visibility={true}
					hideModal={() => setOpenCreateModal(null)}
					fetchData={fetchData}
				/>
			) : null}
			{openCreateModal === "characteristic" ? (
				<TaxonomyModal
					entity="characteristic"
					mode="create"
					visibility={true}
					hideModal={() => setOpenCreateModal(null)}
					fetchData={fetchData}
				/>
			) : null}
			{openCreateModal === "tripCategory" ? (
				<TripCategoryModal
					mode="create"
					visibility={true}
					hideModal={() => setOpenCreateModal(null)}
					fetchData={fetchData}
				/>
			) : null}
			{openCreateModal === "destination" ? (
				<DestinationModal
					mode="create"
					visibility={true}
					hideModal={() => setOpenCreateModal(null)}
					fetchData={fetchData}
				/>
			) : null}
		</>
	);
};

export default AdminPanel;
