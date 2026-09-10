import { useEffect, useState, useContext, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import NavigationBar from "../components/global/NavigationBar";
import ContentService from "../services/contentService";
import { analyzeListingSeo } from "../utils/seo";
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
const contentBoxProps = (item) => {
	// Les llistes i les entrades de viatge guarden la portada a `cover`; les
	// activitats i els allotjaments, a `images[0]`.
	const image = item.cover || (Array.isArray(item.images) ? item.images[0] : "");

	// Els llistats d'activitats i allotjaments arriben retallats des de l'API i
	// no porten les metadades. Es distingeix "no ve al llistat" (undefined) de
	// "està buit" (""): en el primer cas no es pot puntuar res i val més dir-ho
	// que ensenyar un zero que no vol dir el que sembla.
	const hasSeoFields =
		item.metaTitle !== undefined || item.metaDescription !== undefined;

	return {
		type: item.type,
		id: item._id,
		image,
		title: item.title,
		subtitle: item.subtitle,
		publicationDate: item.createdAt,
		slug: item.slug,
		seo: hasSeoFields
			? analyzeListingSeo({
					title: item.title,
					subtitle: item.subtitle,
					metaTitle: item.metaTitle,
					metaDescription: item.metaDescription,
					slug: item.slug,
					hasCover: Boolean(image),
				})
			: null,
	};
};

const AdminPanel = () => {
	const { user } = useContext(UserContext);
	const router = useRouter();
	const service = new ContentService();

	const [loadPage, setLoadPage] = useState(false);
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
			group: "Contingut",
			create: { href: "/nova-activitat", label: "Nova activitat" },
			render: (item) => <ContentBox {...contentBoxProps(item)} />,
		},
		{
			key: "places",
			title: "Allotjaments",
			group: "Contingut",
			create: { href: "/nou-allotjament", label: "Nou allotjament" },
			render: (item) => <ContentBox {...contentBoxProps(item)} />,
		},
		{
			key: "stories",
			title: "Històries",
			group: "Contingut",
			create: { href: "/nova-historia", label: "Nova història" },
			render: (item) => <ContentBox {...contentBoxProps(item)} />,
		},
		{
			key: "lists",
			title: "Llistes",
			group: "Contingut",
			create: { href: "/nova-llista", label: "Nova llista" },
			render: (item) => <ContentBox {...contentBoxProps(item)} />,
		},
		{
			key: "categories",
			title: "Categories",
			group: "Taxonomies",
			create: { modal: "category", label: "Nova categoria" },
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
			group: "Taxonomies",
			create: { modal: "characteristic", label: "Nova característica" },
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
			group: "Taxonomies",
			create: { modal: "tripCategory", label: "Nova categoria de viatge" },
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
			group: "Contingut",
			create: { href: "/nou-viatge", label: "Nova entrada de viatge" },
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
			group: "Taxonomies",
			create: { modal: "destination", label: "Nova destinació" },
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

	const activeTab = TABS.find((tab) => tab.key === state.activeTab);
	const countOf = (key) => (state[key] || []).length;

	/**
	 * Cerca dins de la secció.
	 *
	 * Amb un centenar de fitxes, l'única manera de trobar-ne una era baixar
	 * amb la roda fins a topar-hi. Les taxonomies desen el nom a `name` i les
	 * publicacions a `title`; es miren els dos, més el subtítol i el slug.
	 */
	const [query, setQuery] = useState("");

	useEffect(() => setQuery(""), [state.activeTab]);

	const normalize = (value) =>
		String(value || "")
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "");

	const activeItems = state[state.activeTab] || [];
	const needle = normalize(query.trim());
	const visibleItems = needle
		? activeItems.filter((item) =>
				[item.title, item.name, item.subtitle, item.slug].some((field) =>
					normalize(field).includes(needle),
				),
			)
		: activeItems;

	const GROUPS = ["Contingut", "Taxonomies"];

	/**
	 * Indicadors del contingut publicat.
	 *
	 * Surten del que ja s'ha demanat per pintar el panell: no hi ha cap crida
	 * nova. Els llistats venen retallats des de l'API —les activitats i els
	 * allotjaments només porten `images`, i les històries, llistes i entrades
	 * porten `cover`—, o sigui que la portada es mira igual que a les files.
	 */
	const contentKeys = TABS.filter((tab) => tab.group === "Contingut").map(
		(tab) => tab.key,
	);
	const taxonomyKeys = TABS.filter((tab) => tab.group === "Taxonomies").map(
		(tab) => tab.key,
	);

	const contentItems = contentKeys.flatMap((key) => state[key] || []);
	const coverOf = (item) =>
		item.cover || (Array.isArray(item.images) ? item.images[0] : "");

	const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
	const now = Date.now();
	const publishedLast30 = contentItems.filter(
		(item) =>
			item.createdAt && now - new Date(item.createdAt).getTime() <= THIRTY_DAYS,
	).length;
	const withoutCover = contentItems.filter((item) => !coverOf(item)).length;
	const taxonomyTotal = taxonomyKeys.reduce(
		(total, key) => total + countOf(key),
		0,
	);

	const KPIS = [
		{
			label: "Contingut publicat",
			value: contentItems.length,
			caption: `${contentKeys.length} seccions de contingut`,
		},
		{
			label: "Publicat els últims 30 dies",
			value: publishedLast30,
			caption: publishedLast30 ? "Ritme de publicació recent" : "Cap novetat aquest mes",
		},
		{
			label: "Sense imatge de portada",
			value: withoutCover,
			caption: withoutCover
				? "Es comparteixen sense imatge"
				: "Totes tenen portada",
			tone: withoutCover ? "warn" : "ok",
		},
		{
			label: "Taxonomies",
			value: taxonomyTotal,
			caption: "Categories, característiques i destinacions",
		},
	];

	if (!loadPage) {
		return <FetchingSpinner />;
	}

	const createAction = activeTab.create;

	return (
		<>
			<Head>
				<title>Panell d&apos;administració - Escapadesenparella.cat</title>
				<link rel="icon" href="/favicon.ico" />
				<meta name="robots" content="noindex, nofollow" />
			</Head>
			<NavigationBar
				logo_url={
					"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
				}
				user={user}
			/>

			<main className="bg-gray-50 min-h-screen">
				<div className="container py-8 lg:py-10">
					<header className="mb-6">
						<h1 className="font-headings text-3xl lg:text-4xl leading-tight m-0">
							Panell d&apos;administració
						</h1>
						<p className="text-base text-primary-400 mt-2 mb-0">
							{state.isFetching
								? "Carregant el contingut del web…"
								: "Tot el que hi ha publicat al web, en un cop d'ull."}
						</p>
					</header>

					<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
						{KPIS.map((kpi) => (
							<div
								key={kpi.label}
								className="bg-white rounded-2xl border border-primary-50 p-4 lg:p-5"
							>
								<p
									className={`font-headings text-3xl lg:text-4xl leading-none m-0 ${
										kpi.tone === "warn"
											? "text-amber-600"
											: "text-primary-500"
									}`}
								>
									{state.isFetching ? "—" : kpi.value}
								</p>
								<p className="m-0 mt-2 text-sm font-medium text-primary-500">
									{kpi.label}
								</p>
								<p className="m-0 mt-0.5 text-xs text-primary-400">
									{kpi.caption}
								</p>
							</div>
						))}
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
						{/*
						 * La navegació porta els comptadors a dins. Abans hi
						 * havia una filera de nou caixes de mètriques a dalt i
						 * un menú de nou botons a sota: les mateixes nou xifres
						 * dues vegades, i cap de les dues deia on eres.
						 */}
						<aside className="lg:col-span-3 lg:sticky lg:top-24">
							<nav className="bg-white rounded-2xl border border-primary-50 p-2 lg:p-3">
								{GROUPS.map((group) => (
									<div key={group} className="mb-2 last:mb-0">
										<p className="px-2 pt-2 pb-1 m-0 text-[11px] font-medium uppercase tracking-wider text-primary-300">
											{group}
										</p>
										<ul className="list-none m-0 p-0 flex lg:block overflow-x-auto lg:overflow-visible gap-1 lg:gap-0">
											{TABS.filter(
												(tab) => tab.group === group,
											).map((tab) => {
												const isCurrent =
													state.activeTab === tab.key;
												return (
													<li
														key={tab.key}
														className="lg:mb-0.5 shrink-0 lg:shrink"
													>
														<button
															type="button"
															aria-current={
																isCurrent
																	? "page"
																	: undefined
															}
															onClick={() =>
																setState(
																	(previous) => ({
																		...previous,
																		activeTab:
																			tab.key,
																	}),
																)
															}
															className={`w-full flex items-center justify-between gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm transition-colors ${
																isCurrent
																	? "bg-primary-500 text-white"
																	: "text-primary-500 hover:bg-gray-50"
															}`}
														>
															{tab.title}
															<span
																className={`inline-flex items-center justify-center min-w-[1.5rem] rounded-full px-1.5 py-0.5 text-[11px] ${
																	isCurrent
																		? "bg-white/20 text-white"
																		: "bg-gray-100 text-primary-400"
																}`}
															>
																{state.isFetching
																	? "·"
																	: countOf(
																			tab.key,
																		)}
															</span>
														</button>
													</li>
												);
											})}
										</ul>
									</div>
								))}
							</nav>
						</aside>

						<section className="lg:col-span-9">
							<div className="bg-white rounded-2xl border border-primary-50 overflow-hidden">
								<div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary-50 p-4 lg:p-5">
									<div className="min-w-0">
										<h2 className="m-0 text-lg font-medium text-primary-500">
											{activeTab.title}
										</h2>
										<p className="m-0 text-xs text-primary-400">
											{needle
												? `${visibleItems.length} de ${activeItems.length} elements`
												: `${activeItems.length} elements`}
										</p>
									</div>

									<div className="flex items-center gap-2 flex-1 lg:flex-none justify-end">
										<div className="relative w-full max-w-xs">
											<input
												type="search"
												value={query}
												onChange={(e) =>
													setQuery(e.target.value)
												}
												placeholder={`Cercar a ${activeTab.title.toLowerCase()}…`}
												aria-label={`Cercar a ${activeTab.title}`}
												className="form__control py-2 pl-9 text-sm"
											/>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width={16}
												height={16}
												viewBox="0 0 24 24"
												strokeWidth="2"
												stroke="currentColor"
												fill="none"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-300 pointer-events-none"
												aria-hidden="true"
											>
												<path
													stroke="none"
													d="M0 0h24v24H0z"
													fill="none"
												/>
												<circle cx="10" cy="10" r="7" />
												<line
													x1="21"
													y1="21"
													x2="15"
													y2="15"
												/>
											</svg>
										</div>

										{createAction.href ? (
											<Link href={createAction.href}>
												<a className="button button__primary button__xs md:py-2.5 md:px-4 w-auto whitespace-nowrap">
													{createAction.label}
												</a>
											</Link>
										) : (
											<button
												type="button"
												onClick={() =>
													setOpenCreateModal(
														createAction.modal,
													)
												}
												className="button button__primary button__xs md:py-2.5 md:px-4 w-auto whitespace-nowrap"
											>
												{createAction.label}
											</button>
										)}
									</div>
								</div>

								<div className="p-4 lg:p-5">
									{state.isFetching ? (
										<FetchingSpinner />
									) : visibleItems.length === 0 ? (
										<div className="py-12 text-center">
											<p className="m-0 text-sm text-primary-400">
												{needle
													? `Cap resultat per a «${query}».`
													: `Encara no hi ha res a ${activeTab.title.toLowerCase()}.`}
											</p>
											{needle ? (
												<button
													type="button"
													className="mt-2 text-sm text-blue-600 underline"
													onClick={() => setQuery("")}
												>
													Esborrar la cerca
												</button>
											) : null}
										</div>
									) : (
										visibleItems.map((item, idx) => (
											<div
												key={item._id || idx}
												className="w-full"
											>
												{activeTab.render(item)}
											</div>
										))
									)}
								</div>
							</div>
						</section>
					</div>
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
