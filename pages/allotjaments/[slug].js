import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import NavigationBar from "../../components/global/NavigationBar";
import ContentService from "../../services/contentService";
import { Toast } from "react-bootstrap";
import Link from "next/link";
import GoogleMapReact from "google-map-react";
import SignUpModal from "../../components/modals/SignUpModal";
import UserContext from "../../contexts/UserContext";
import Footer from "../../components/global/Footer";
import FetchingSpinner from "../../components/global/FetchingSpinner";
import FancyboxUtil from "../../utils/FancyboxUtils";
import FooterLinksInterest from "../../components/ads/FooterLinksInterest";
import Breadcrumb from "../../components/richsnippets/Breadcrumb";
import GlobalMetas from "../../components/head/GlobalMetas";

const PlaceListing = ({ placeDetails }) => {
	const { user } = useContext(UserContext);
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

	const urlToShare = `https://escapadesenparella.cat/allotjaments/${router.query.slug}`;

	const initialState = {
		place: {},
		placeLoaded: false,
		owner: {},
		organization: {},
		bookmarkDetails: {},
		isBookmarked: false,
		showBookmarkToast: false,
		toastMessage: "",
	};
	const [state, setState] = useState(initialState);
	const [queryId, setQueryId] = useState(null);
	useEffect(() => {
		if (router && router.query) {
			setQueryId(router.query.slug);
		}
	}, [router]);

	const service = new ContentService();

	const [modalVisibility, setModalVisibility] = useState(false);
	const handleModalVisibility = () => setModalVisibility(true);
	const hideModalVisibility = () => setModalVisibility(false);

	useEffect(() => {
		if (router.query.slug !== undefined) {
			const fetchData = async () => {
				let userBookmarks;
				if (user && user !== "null") {
					userBookmarks = await service.getUserAllBookmarks();
				}
				let bookmarkDetails, isBookmarked;

				if (userBookmarks) {
					userBookmarks.forEach((el) => {
						if (
							el.bookmarkPlaceRef &&
							el.bookmarkPlaceRef._id === placeDetails._id
						) {
							return (bookmarkDetails = el);
						}
					});
				}
				if (bookmarkDetails) {
					isBookmarked = !bookmarkDetails.isRemoved;
				} else {
					isBookmarked = false;
				}
				setState({
					...state,
					place: placeDetails,
					placeLoaded: placeDetails.type ? true : false,
					owner: placeDetails.owner,
					organization: placeDetails.organization,
					bookmarkDetails: userBookmarks,
					isBookmarked: isBookmarked,
				});
			};
			fetchData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryId]);

	if (state.placeLoaded === false) {
		return <FetchingSpinner />;
	}

	let { title, subtitle, description } = state.place;

	const bookmarkListing = () => {
		const listingId = state.place._id;
		const listingType = state.place.type;
		service.bookmark(listingId, listingType).then((res) => {
			setState({
				...state,
				isBookmarked: !state.isBookmarked,
				showBookmarkToast: true,
				toastMessage: res.message || "Allotjament desat!",
			});
		});
	};

	let bookmarkButton;

	if (user && user !== "null") {
		if (state.isBookmarked === false) {
			bookmarkButton = (
				<div className="px-4" onClick={() => bookmarkListing()}>
					<button className="flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="icon icon-tabler icon-tabler-bookmark mr-1"
							width="30"
							height="30"
							viewBox="0 0 24 24"
							strokeWidth="1.5"
							stroke="#0d1f44"
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path stroke="none" d="M0 0h24v24H0z" />
							<path d="M9 4h6a2 2 0 0 1 2 2v14l-5-3l-5 3v-14a2 2 0 0 1 2 -2" />
						</svg>
						<span>Desar</span>
					</button>
				</div>
			);
		} else {
			bookmarkButton = (
				<div className="px-4" onClick={() => bookmarkListing()}>
					<button className="flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="icon icon-tabler icon-tabler-bookmark mr-1"
							width="30"
							height="30"
							viewBox="0 0 24 24"
							strokeWidth="1.5"
							stroke="#0d1f44"
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path stroke="none" d="M0 0h24v24H0z" />
							<path
								fill="#0d1f44"
								d="M9 4h6a2 2 0 0 1 2 2v14l-5-3l-5 3v-14a2 2 0 0 1 2 -2"
							/>
						</svg>
						<span>Esborrar</span>
					</button>
				</div>
			);
		}
	} else {
		bookmarkButton = (
			<div className="px-4" onClick={() => handleModalVisibility()}>
				<button className="flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="icon icon-tabler icon-tabler-bookmark mr-1"
						width="30"
						height="30"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path stroke="none" d="M0 0h24v24H0z" />
						<path d="M9 4h6a2 2 0 0 1 2 2v14l-5-3l-5 3v-14a2 2 0 0 1 2 -2" />
					</svg>
					<span>Desar</span>
				</button>
			</div>
		);
	}

	bookmarkButton = null; //Temporarily disable bookmark button

	const toast = (
		<Toast
			onClose={() =>
				setState({ ...state, showBookmarkToast: false, toastMessage: "" })
			}
			show={state.showBookmarkToast}
			delay={5000}
			autohide
		>
			<Toast.Header>
				<img src="../../logo-xs.svg" className="rounded mr-2" alt="" />
				<strong className="mr-auto">Getaways.guru</strong>
			</Toast.Header>
			<Toast.Body>
				{state.toastMessage} <br />{" "}
				<Link href={"/bookmarks"}>See all bookmarks</Link>{" "}
			</Toast.Body>
		</Toast>
	);

	const center = {
		lat: parseFloat(state.place.place_lat),
		lng: parseFloat(state.place.place_lng),
	};

	const getMapOptions = (maps) => {
		return {
			disableDefaultUI: true,
			styles: [
				{
					featureType: "poi",
					elementType: "labels",
					styles: [{ visibility: "on" }],
				},
			],
		};
	};

	const renderMarker = (map, maps) => {
		const position = {
			lat: parseFloat(state.place.place_lat),
			lng: parseFloat(state.place.place_lng),
		};
		new maps.Marker({ position: position, map, title: "Hello" });
	};

	let coversList;
	if (state.placeLoaded === true) {
		coversList = state.place.images.map((cover, idx) => (
			<picture key={idx}>
				<img src={cover} className="w-full h-fullobject-cover" />
			</picture>
		));
	}

	let placeHours, hasOpeningHours;
	if (state.place.place_opening_hours.length > 0) {
		placeHours = state.place.place_opening_hours.map((hour, idx) => (
			<li key={idx} className="capitalize text-15 opacity-80">
				{hour}
			</li>
		));
		hasOpeningHours = (
			<div className="mt-7">
				<ul className="list-none p-0 m-0">
					<li className="flex flex-wrap items-center mb-3">
						<span className="block w-full">Horari d'atenció al públic </span>
						<span className="block w-full text-xs opacity-80 -mt-0.5">
							Font: Google
						</span>
					</li>
					{placeHours}
				</ul>
			</div>
		);
	}

	const placeCategories = state.place.categories.map((category, idx) => (
		<li key={idx} className="flex flex-wrap items-center px-1">
			<span className="bg-primary-200 text-primary-400 rounded-md px-2 py-1 mr-1 capitalize text-sm">
				Escapada {category}
			</span>
		</li>
	));

	const placeSeasons = state.place.seasons.map((season, idx) => (
		<li key={idx} className="flex flex-wrap items-center px-1">
			<span className="bg-primary-200 text-primary-400 rounded-md px-2 py-1 mr-1 capitalize text-sm">
				{season}
			</span>
		</li>
	));

	const placeRegion = state.place.region.map((region, idx) => (
		<span key={idx}>{region}</span>
	));

	return (
		<>
			{/* Browser metas  */}
			<GlobalMetas
				title={
					state.place.metaTitle ? state.place.metaTitle : state.place.title
				}
				description={state.place.metaDescription}
				url={`https://escapadesenparella.cat/allotjaments/${state.place.slug}`}
				image={state.place.cover}
				canonical={`https://escapadesenparella.cat/allotjaments/${state.place.slug}`}
			/>
			{/* Rich snippets */}
			<Breadcrumb
				page1Title="Inici"
				page1Url="https://escapadesenparella.cat"
				page2Title="Allotjaments"
				page2Url="https://escapadesenparella.cat/allotjaments"
				page3Title={state.place.metaTitle}
				page3Url={`https://escapadesenparella.cat/allotjaments/${state.place.slug}`}
			/>
			<div id="listingPage">
				<NavigationBar
					logo_url={
						"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
					}
					user={user}
				/>
				<main>
					{state.showBookmarkToast ? toast : null}
					<div className="pt-6">
						<div className="container">
							<ul className="breadcrumb">
								<li className="breadcrumb__item">
									<a href="/" title="Inici" className="breadcrumb__link">
										Inici
									</a>
								</li>
								<li className="breadcrumb__item">
									<a
										href="/allotjaments"
										title="Allotjaments"
										className="breadcrumb__link"
									>
										Allotjaments
									</a>
								</li>
								<li className="breadcrumb__item">
									<span className="breadcrumb__link active">{title}</span>
								</li>
							</ul>
						</div>
					</div>
					<article>
						{/* Listing header */}
						<section className="pt-8">
							<div className="container">
								<div className="w-full flex flex-wrap items-center">
									<div className="w-full md:w-1/2">
										<h1>{title}</h1>
										<ul className="flex flex-wrap items-center p-0 -mx-3 mt-2 mb-0 md:mb-5">
											<li className="flex flex-wrap items-center px-3">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="icon icon-tabler icon-tabler-star mr-1.5"
													width={20}
													height={20}
													viewBox="0 0 24 24"
													stroke-width={2}
													stroke="#fbbf24"
													fill="#fbbf24"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<path
														stroke="none"
														d="M0 0h24v24H0z"
														fill="none"
													></path>
													<path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"></path>
												</svg>
												<span className="text-primary-400 opacity-80">
													{state.place.place_rating}
												</span>
											</li>
											<li className="flex flex-wrap items-center px-3">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="icon icon-tabler icon-tabler-brand-safari text-secondary-500 mr-1.5"
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
													<polyline points="8 16 10 10 16 8 14 14 8 16"></polyline>
													<circle cx={12} cy={12} r={9}></circle>
												</svg>
												<span className="text-primary-400 opacity-80">{`${
													state.place.place_locality === undefined
														? ""
														: state.place.place_locality
												}${
													state.place.place_locality === undefined ? "" : ","
												} ${
													state.place.place_province || state.place.place_state
												}, ${state.place.place_country}`}</span>
											</li>
										</ul>
									</div>
									<div className="w-full md:w-1/2 mt-3 md:mt-0">
										<div className="flex flex-wrap justify-start md:justify-end items-center">
											{bookmarkButton}
											<div className="flex flex-wrap items-center -mx-2 opacity-60">
												<a
													href={`http://www.facebook.com/sharer.php?u=${urlToShare}`}
													title="Compartir a Facebook"
													className="px-2"
													target="_blank"
													rel="nofollow noopenner noreferrer"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="icon icon-tabler icon-tabler-brand-facebook"
														width={24}
														height={24}
														viewBox="0 0 24 24"
														stroke-width={2}
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
														<path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3"></path>
													</svg>
												</a>
												<a
													href={`https://twitter.com/intent/tweet?urlToShare=${urlToShare}`}
													title="Compartir a Twitter"
													className="px-2"
													target="_blank"
													rel="nofollow noopenner noreferrer"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="icon icon-tabler icon-tabler-brand-twitter"
														width={24}
														height={24}
														viewBox="0 0 24 24"
														stroke-width={2}
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
														<path d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c-.002 -.249 1.51 -2.772 1.818 -4.013z"></path>
													</svg>
												</a>
												<a
													href={`mailto:?subject=Mira%20aquesta%20escapada%20a%20Escapadesenparella.cat&body=${urlToShare}`}
													title="Compartir per correu"
													className="px-2"
													rel="nofollow noopenner noreferrer"
													target="_blank"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="icon icon-tabler icon-tabler-mail"
														width={24}
														height={24}
														viewBox="0 0 24 24"
														stroke-width={2}
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
														<rect
															x={3}
															y={5}
															width={18}
															height={14}
															rx={2}
														></rect>
														<polyline points="3 7 12 13 21 7"></polyline>
													</svg>
												</a>
											</div>
										</div>
									</div>
									<div className="w-full mt-7 md:mt-0">
										<div className="flex flex-wrap items-stretch rounded-2xl overflow-hidden -m-0.5 relative">
											<button
												data-fancybox-trigger="gallery"
												className="inline-flex items-center absolute bottom-3 right-3 text-white bg-slate-800 bg-opacity-80 text-xs py-2 px-3"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="icon icon-tabler icon-tabler-photo mr-1.5"
													width={19}
													height={19}
													viewBox="0 0 24 24"
													stroke-width={2}
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
													<line x1={15} y1={8} x2="15.01" y2={8}></line>
													<rect
														x={4}
														y={4}
														width={16}
														height={16}
														rx={3}
													></rect>
													<path d="M4 15l4 -4a3 5 0 0 1 3 0l5 5"></path>
													<path d="M14 14l1 -1a3 5 0 0 1 3 0l2 2"></path>
												</svg>
												Veure {state.place.images.length} imatges
											</button>
											<FancyboxUtil
												options={{
													infinite: true,
												}}
											>
												<div
													className="w-full lg:w-1/2 p-0.5 h-80 lg:h-50vh"
													data-fancybox="gallery"
													data-src={state.place.images[0]}
												>
													<picture>
														<img
															src={state.place.images[0]}
															className="w-full h-full object-cover"
														/>
													</picture>
												</div>
												<div className="w-full lg:w-1/2 flex flex-wrap h-40 lg:h-50vh">
													{state.place.images[1] !== undefined ? (
														<div
															className="w-1/4 lg:w-1/2 p-0.5 flex-auto h-full lg:h-1/2"
															data-fancybox="gallery"
															data-src={state.place.images[1]}
														>
															<picture>
																<img
																	src={state.place.images[1]}
																	className="w-full h-full object-cover"
																/>
															</picture>
														</div>
													) : null}
													{state.place.images[2] !== undefined ? (
														<div
															className="w-1/4 lg:w-1/2 p-0.5 flex-auto h-full lg:h-1/2"
															data-fancybox="gallery"
															data-src={state.place.images[2]}
														>
															<picture>
																<img
																	src={state.place.images[2]}
																	className="w-full h-full object-cover"
																/>
															</picture>
														</div>
													) : null}
													{state.place.images[3] !== undefined ? (
														<div
															className="w-1/4 lg:w-1/2 p-0.5 flex-auto h-full lg:h-1/2"
															data-fancybox="gallery"
															data-src={state.place.images[3]}
														>
															<picture>
																<img
																	src={state.place.images[3]}
																	className="w-full h-full object-cover"
																/>
															</picture>
														</div>
													) : null}
													{state.place.images[4] !== undefined ? (
														<div
															className="w-1/4 lg:w-1/2 p-0.5 flex-auto h-full lg:h-1/2"
															data-fancybox="gallery"
															data-src={state.place.images[4]}
														>
															<picture>
																<img
																	src={state.place.images[4]}
																	className="w-full h-full object-cover"
																/>
															</picture>
														</div>
													) : null}
												</div>
											</FancyboxUtil>
										</div>
									</div>
								</div>
							</div>
						</section>
						<section className="pt-10 pb-12 md:pb-16">
							<div className="container">
								<div className="w-full lg:w-10/12 2xl:w-9/12 mx-auto">
									<div className="flex flex-wrap items-start xl:-mx-6">
										<div className="w-full xl:w-8/12 xl:px-6 mx-auto">
											<h2 className="w-9/12">{subtitle}</h2>
											{state.organization ? (
												<div className="listing-owner mt-4">
													<Link href={`/empreses/${state.organization.slug}`}>
														<a className="flex items-center">
															<div className="rounded-full w-14 h-14 border border-primary-200 p-1 overflow-hidden mr-4">
																<picture>
																	<img
																		src={state.organization.orgLogo}
																		alt={state.organization.orgName}
																		className="w-full h-full object-cover"
																		width={96}
																		height96
																		loading="lazy"
																	/>
																</picture>
															</div>
															<div className="text-primary-500 opacity-80">
																<span className="block text-xs">
																	Gestionat per:
																</span>
																<span className="text-base">
																	{state.organization.orgName}
																</span>
															</div>
														</a>
													</Link>
												</div>
											) : null}
											<div className="border-y border-primary-200 my-8 py-5">
												<div className="flex flex-wrap items-start">
													<div className="pb-6 flex items-start">
														<div className="w-6 h-6 flex items-center justify-center">
															<svg
																xmlns="http://www.w3.org/2000/svg"
																className="icon icon-tabler icon-tabler-tag mt-0.5 block"
																width={24}
																height={24}
																viewBox="0 0 24 24"
																stroke-width={2}
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
																<circle
																	cx="8.5"
																	cy="8.5"
																	r={1}
																	fill="currentColor"
																></circle>
																<path d="M4 7v3.859c0 .537 .213 1.052 .593 1.432l8.116 8.116a2.025 2.025 0 0 0 2.864 0l4.834 -4.834a2.025 2.025 0 0 0 0 -2.864l-8.117 -8.116a2.025 2.025 0 0 0 -1.431 -.593h-3.859a3 3 0 0 0 -3 3z"></path>
															</svg>
														</div>
														<div className="pl-4">
															<p className="text-base text-primary-500 font-semibold mb-0.5">
																L'
																{state.place.type == "place"
																	? "allotjament"
																	: "activitat"}{" "}
																està catalogat com a {state.place.placeType}
															</p>
															<p className="text-sm mb-0 opacity-70">
																Els allotjaments i les activitats recomanades a
																Escapadesenparella.cat estan pensades per a que
																les parelles gaudeixin al màxim de les seves
																escapades.
															</p>
														</div>
													</div>
													<div className="pb-6 flex items-start">
														<div className="w-6 h-6 flex items-center justify-center">
															<svg
																xmlns="http://www.w3.org/2000/svg"
																className="icon icon-tabler icon-tabler-map-pin mt-0.5 block"
																width={24}
																height={24}
																viewBox="0 0 24 24"
																stroke-width={2}
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
																<circle cx={12} cy={11} r={3}></circle>
																<path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"></path>
															</svg>
														</div>
														<div className="pl-4">
															<p className="text-base text-primary-500 font-semibold mb-0.5">
																L'
																{state.place.type == "place"
																	? "allotjament"
																	: "activitat"}{" "}
																es troba a la província/zona de{" "}
																<span className="capitalize">
																	{placeRegion}
																</span>
															</p>
															<p className="text-sm mb-0 opacity-70">
																L'adreça completa de l'allotjament és{" "}
																{state.place.place_full_address}.
															</p>
														</div>
													</div>
													<div className="flex items-start">
														<div className="w-6 h-6 flex items-center justify-center">
															<svg
																xmlns="http://www.w3.org/2000/svg"
																className="icon icon-tabler icon-tabler-currency-euro mt-0.5"
																width={24}
																height={24}
																viewBox="0 0 24 24"
																stroke-width={2}
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
																<path d="M17.2 7a6 7 0 1 0 0 10"></path>
																<path d="M13 10h-8m0 4h8"></path>
															</svg>
														</div>
														<div className="pl-4">
															<p className="text-base text-primary-500 font-semibold mb-0.5">
																L'
																{state.place.type == "place"
																	? "allotjament"
																	: "activitat"}{" "}
																té un preu aproximat de {state.place.price} € la
																nit
															</p>
															<p className="text-sm mb-0 opacity-70">
																Tot i que els preus poden variar i no estiguin
																constantment actualitzats, hem calculat que el
																preu mitjà per persona per aquest allotjament és
																de {state.place.price} € la nit.
															</p>
														</div>
													</div>
												</div>
											</div>
											<h2 className="text-2xl">Sobre {title}</h2>
											<div className="mt-4">{description}</div>
										</div>
										<aside className="w-full xl:w-4/12 xl:px-6 relative xl:sticky xl:top-36 mt-7 xl:mt-0">
											<div className="p-5 rounded-md shadow-lg shadow-primary-300">
												<div className="w-full h-56 rounded-lg overflow-hidden">
													<GoogleMapReact
														bootstrapURLKeys={{
															key: `${process.env.GOOGLE_API_KEY}`,
														}}
														defaultCenter={center}
														defaultZoom={11}
														options={getMapOptions}
														yesIWantToUseGoogleMapApiInternals
														onGoogleApiLoaded={({ map, maps }) =>
															renderMarker(map, maps)
														}
													/>
												</div>
												<div className="flex flex-col w-full mt-5">
													<a
														href={`${state.place.website}`}
														className="button button__primary button__med justify-center mb-2.5"
														title="Reservar"
														rel="nofollow noreferrer"
														target="_blank"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="icon icon-tabler icon-tabler-device-laptop mr-2"
															width="22"
															height="22"
															viewBox="0 0 24 24"
															strokeWidth="1.5"
															stroke="currentColor"
															fill="none"
															strokeLinecap="round"
															strokeLinejoin="round"
														>
															<path
																stroke="none"
																d="M0 0h24v24H0z"
																fill="none"
															/>
															<line x1="3" y1="19" x2="21" y2="19" />
															<rect x="5" y="6" width="14" height="10" rx="1" />
														</svg>
														Reservar
													</a>
													<a
														href={`tel:${state.place.phone}`}
														className="button button__ghost button__med justify-center"
														title="Trucar"
														rel="nofollow noreferrer"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="icon icon-tabler icon-tabler-phone-call mr-2"
															width="22"
															height="22"
															viewBox="0 0 24 24"
															strokeWidth="1.5"
															stroke="currentColor"
															fill="none"
															strokeLinecap="round"
															strokeLinejoin="round"
														>
															<path stroke="none" d="M0 0h24v24H0z" />
															<path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
															<path d="M15 7a2 2 0 0 1 2 2" />
															<path d="M15 3a6 6 0 0 1 6 6" />
														</svg>
														Trucar
													</a>
												</div>
												{hasOpeningHours}
												<ul className="list-none mt-4 mb-0 px-0 pt-4 border-t border-primary-200">
													<li className="flex items-start">
														<div className="w-5 h-5 mr-2">
															<svg
																xmlns="http://www.w3.org/2000/svg"
																className="icon icon-tabler icon-tabler-map-pin text-secondary-500 mt-0.5"
																width="20"
																height="20"
																viewBox="0 0 24 24"
																strokeWidth="2"
																stroke="currentColor"
																fill="none"
																strokeLinecap="round"
																strokeLinejoin="round"
															>
																<path stroke="none" d="M0 0h24v24H0z" />
																<circle cx="12" cy="11" r="3" />
																<path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1 -2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
															</svg>
														</div>
														<span className="text-15 opacity-80">
															{state.place.place_full_address}
														</span>
													</li>
												</ul>
											</div>
										</aside>
									</div>
								</div>
							</div>
						</section>
					</article>
				</main>
				<FooterLinksInterest />
				<Footer
					logo_url={
						"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
					}
				/>
				<SignUpModal
					visibility={modalVisibility}
					hideModal={hideModalVisibility}
				/>
			</div>
		</>
	);
};

export async function getServerSideProps({ params }) {
	const service = new ContentService();
	const placeDetails = await service.getPlaceDetails(params.slug);
	return {
		props: {
			placeDetails,
		},
	};
}

export default PlaceListing;
