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
import FancyboxUtil from "../../utils/FancyboxUtils";
import GlobalMetas from "../../components/head/GlobalMetas";
import BreadcrumbRichSnippet from "../../components/richsnippets/BreadcrumbRichSnippet";
import { formatDateTimeToISODate } from "../../utils/helpers";
import ListingDiscount from "../../components/listingpage/ListingDiscount";

const GetawayListing = ({
	getawayDetails,
	categoryDetails,
	checkedCharacteristics,
}) => {
	const { user } = useContext(UserContext);
	const router = useRouter();

	if (getawayDetails && categoryDetails) {
		// ACTIVITY DETAILS
		if (getawayDetails.type == "activity") {
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

			const urlToShare = `https://escapadesenparella.cat/${categoryDetails.slug}/${router.query.slug}`;

			const initialState = {
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
									el.bookmarkActivityRef &&
									el.bookmarkActivityRef._id ===
									getawayDetails._id
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
							bookmarkDetails: bookmarkDetails,
							isBookmarked: isBookmarked,
						});
					};
					fetchData();
				}
				// eslint-disable-next-line react-hooks/exhaustive-deps
			}, [queryId]);

			const bookmarkListing = () => {
				const listingId = getawayDetails._id;
				const listingType = getawayDetails.type;
				service.bookmark(listingId, listingType).then((res) => {
					setState({
						...state,
						isBookmarked: !state.isBookmarked,
						showBookmarkToast: true,
						toastMessage: res.message || "Listing bookmarked!",
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
									width="44"
									height="44"
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
						<div
							className="listing-bookmark-wrapper"
							onClick={() => bookmarkListing()}
						>
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
					<div
						className="px-4"
						onClick={() => handleModalVisibility()}
					>
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
						setState({
							...state,
							showBookmarkToast: false,
							toastMessage: "",
						})
					}
					show={state.showBookmarkToast}
					delay={5000}
					autohide
				>
					<Toast.Header>
						<img
							src="../../logo-xs.svg"
							className="rounded-md mr-2"
							alt=""
						/>
						<strong className="mr-auto">Getaways.guru</strong>
					</Toast.Header>
					<Toast.Body>
						{state.toastMessage} <br />{" "}
						<Link href={"/bookmarks"}>See all bookmarks</Link>{" "}
					</Toast.Body>
				</Toast>
			);

			const center = {
				lat: parseFloat(getawayDetails.activity_lat),
				lng: parseFloat(getawayDetails.activity_lng),
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
					lat: parseFloat(getawayDetails.activity_lat),
					lng: parseFloat(getawayDetails.activity_lng),
				};
				new maps.Marker({ position: position, map, title: "Hello" });
			};

			let activityHours, hasOpeningHours;
			if (getawayDetails.activity_opening_hours.length > 0) {
				activityHours = getawayDetails.activity_opening_hours.map(
					(hour, idx) => (
						<li
							key={idx}
							className="capitalize text-15 text-primary-400"
						>
							{hour}
						</li>
					)
				);

				hasOpeningHours = (
					<div className="my-5 py-5 border-t border-primary-100 border-b">
						<ul className="list-none p-0 m-0">
							<li className="flex flex-wrap items-center mb-3">
								<span className="block w-full">
									Horari d'atenció al públic{" "}
								</span>
								<span className="block w-full text-xs opacity-80 -mt-0.5">
									Font: Google
								</span>
							</li>
							{activityHours}
						</ul>
					</div>
				);
			}

			const activityCategories = getawayDetails.categories.map(
				(category, idx) => (
					<li key={idx} className="activity-category">
						Escapada {category}
					</li>
				)
			);

			const activitySeasons = getawayDetails.seasons.map(
				(season, idx) => (
					<li key={idx} className="activity-season">
						{season}
					</li>
				)
			);

			const activityRegion = getawayDetails.region.map((region, idx) => (
				<span key={idx}>{region}</span>
			));

			return (
				<>
					{/* Browser metas  */}
					<GlobalMetas
						title={getawayDetails.metaTitle}
						description={getawayDetails.metaDescription}
						url={`https://escapadesenparella.cat/${categoryDetails.slug}/${getawayDetails.slug}`}
						image={getawayDetails.cover}
						canonical={`https://escapadesenparella.cat/${categoryDetails.slug}/${getawayDetails.slug}`}
					/>
					{/* Rich snippets */}
					<BreadcrumbRichSnippet
						page1Title="Inici"
						page1Url="https://escapadesenparella.cat"
						page2Title={categoryDetails.title}
						page2Url={`https://escapadesenparella.cat/${categoryDetails.slug}`}
						page3Title={getawayDetails.metaTitle}
						page3Url={`https://escapadesenparella.cat/${categoryDetails.slug}/${getawayDetails.slug}`}
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
							<div className="py-5 bg-primary-500 text-white">
								<div className="container">
									<ul className="breadcrumb">
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
											<a
												href={`/${categoryDetails.slug}`}
												title={categoryDetails.title}
												className="breadcrumb__link"
											>
												{categoryDetails.title}
											</a>
										</li>
										<li className="breadcrumb__item">
											<span className="breadcrumb__link active">
												{getawayDetails.title}
											</span>
										</li>
									</ul>
								</div>
							</div>
							<article>
								{/* Listing header */}
								<section className="pt-2 md:pt-5 bg-primary-500">
									<div className="container">
										<div className="w-full flex flex-wrap items-center">
											<div className="w-full md:w-1/2 text-white">
												<div className="flex items-start">
													<h1>
														{getawayDetails.title}
													</h1>
													{getawayDetails.isVerified ? (
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="ml-2 relative -top-2 text-[#57A1FE]"
															width={28}
															height={28}
															viewBox="0 0 24 24"
															strokeWidth={1.5}
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
															<path
																d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z"
																strokeWidth={0}
																fill="currentColor"
															></path>
														</svg>
													) : null}
												</div>
												<ul className="flex flex-wrap items-center p-0 -mx-2 mt-2 mb-0 md:mb-5">
													{getawayDetails.isVerified ? (
														<li className="flex flex-wrap items-center px-2">
															<svg
																xmlns="http://www.w3.org/2000/svg"
																className="mr-1.5 text-white"
																width={18}
																height={18}
																viewBox="0 0 24 24"
																strokeWidth={
																	1.5
																}
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
																<path
																	d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z"
																	strokeWidth={
																		0
																	}
																	fill="currentColor"
																></path>
															</svg>
															<span className="text-white text-sm relative inline-block top-px">
																Escapada
																verificada
															</span>
														</li>
													) : null}
													<li className="flex flex-wrap items-center px-2">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="mr-1.5 text-white"
															width={16}
															height={16}
															viewBox="0 0 24 24"
															strokeWidth={1.5}
															stroke="currentCOlor"
															fill="currentCOlor"
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
														<span className="text-white text-sm relative inline-block top-px">
															{
																getawayDetails.activity_rating
															}
														</span>
													</li>
													<li className="flex flex-wrap items-center px-2">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="mr-1.5 text-white"
															width={18}
															height={18}
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
															<circle
																cx={12}
																cy={12}
																r={9}
															></circle>
														</svg>
														<span className="text-white text-sm relative inline-block top-px">{`${getawayDetails.activity_locality ===
															undefined
															? ""
															: getawayDetails.activity_locality
															}${getawayDetails.activity_locality ===
																undefined
																? ""
																: ","
															} ${getawayDetails.activity_province ||
															getawayDetails.activity_state
															}, ${getawayDetails.activity_country
															}`}</span>
													</li>
												</ul>
											</div>
											<div className="hidden md:block w-full md:w-1/2 mt-3 md:mt-0">
												<div className="flex flex-wrap justify-start md:justify-end items-center">
													<button className="text-white inline-flex items-center text-sm relative after:block after:absolute after:-bottom-1 after:inset-x-0 after:bg-white after:h-px">
														<span>Compartir</span>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="ml-1.5 relative -top-px"
															width={18}
															height={18}
															viewBox="0 0 24 24"
															strokeWidth={1.5}
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
															<path d="M6 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
															<path d="M18 6m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
															<path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
															<path d="M8.7 10.7l6.6 -3.4"></path>
															<path d="M8.7 13.3l6.6 3.4"></path>
														</svg>
													</button>
												</div>
											</div>
											<div className="w-full mt-5 md:mt-2.5">
												<div className="flex flex-wrap items-stretch rounded-sm overflow-hidden relative -m-0.5">
													<button
														data-fancybox-trigger="gallery"
														className="inline-flex items-center absolute bottom-5 right-5 text-primary-500 bg-white rounded text-xs py-2 px-3 shadow-md"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="icon icon-tabler icon-tabler-photo mr-1.5"
															width={19}
															height={19}
															viewBox="0 0 24 24"
															strokeWidth={1.5}
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
																x1={15}
																y1={8}
																x2="15.01"
																y2={8}
															></line>
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
														Veure{" "}
														{
															getawayDetails
																.images.length
														}{" "}
														imatges
													</button>
													<FancyboxUtil
														options={{
															infinite: true,
														}}
													>
														<div
															className="w-full lg:w-1/2 h-80 lg:h-50vh p-0.5"
															data-fancybox="gallery"
															data-src={
																getawayDetails
																	.images[0]
															}
														>
															<picture>
																<img
																	src={
																		getawayDetails
																			.images[0]
																	}
																	className="w-full h-full object-cover"
																/>
															</picture>
														</div>
														<div className="w-full lg:w-1/2 flex flex-wrap h-40 lg:h-50vh">
															{getawayDetails
																.images[1] !==
																undefined ? (
																<div
																	className="w-1/4 lg:w-1/2 flex-auto h-full lg:h-1/2 p-0.5"
																	data-fancybox="gallery"
																	data-src={
																		getawayDetails
																			.images[1]
																	}
																>
																	<picture>
																		<img
																			src={
																				getawayDetails
																					.images[1]
																			}
																			className="w-full h-full object-cover"
																		/>
																	</picture>
																</div>
															) : null}
															{getawayDetails
																.images[2] !==
																undefined ? (
																<div
																	className="w-1/4 lg:w-1/2 flex-auto h-full lg:h-1/2 p-0.5"
																	data-fancybox="gallery"
																	data-src={
																		getawayDetails
																			.images[2]
																	}
																>
																	<picture>
																		<img
																			src={
																				getawayDetails
																					.images[2]
																			}
																			className="w-full h-full object-cover"
																		/>
																	</picture>
																</div>
															) : null}
															{getawayDetails
																.images[3] !==
																undefined ? (
																<div
																	className="w-1/4 lg:w-1/2 flex-auto h-full lg:h-1/2 p-0.5"
																	data-fancybox="gallery"
																	data-src={
																		getawayDetails
																			.images[3]
																	}
																>
																	<picture>
																		<img
																			src={
																				getawayDetails
																					.images[3]
																			}
																			className="w-full h-full object-cover"
																		/>
																	</picture>
																</div>
															) : null}
															{getawayDetails
																.images[4] !==
																undefined ? (
																<div
																	className="w-1/4 lg:w-1/2 flex-auto h-full lg:h-1/2 p-0.5"
																	data-fancybox="gallery"
																	data-src={
																		getawayDetails
																			.images[4]
																	}
																>
																	<picture>
																		<img
																			src={
																				getawayDetails
																					.images[4]
																			}
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
								<section className="pt-5 pb-12 md:pt-10 md:pb-16">
									<div className="container">
										<div className="w-full lg:w-10/12 mx-auto">
											<div className="flex flex-wrap items-start xl:-mx-6">
												<div className="w-full xl:w-7/12 xl:px-6 mx-auto">
													<div>
														{getawayDetails.relatedStory ? (
															<Link
																href={`/histories/${getawayDetails.relatedStory.slug}`}
															>
																<a className="p-5 rounded-md border border-primary-50 w-full block group mb-6">
																	<span className="inline-flex items-center">
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			className="mr-1.5 text-secondary-800"
																			width={
																				20
																			}
																			height={
																				20
																			}
																			viewBox="0 0 24 24"
																			strokeWidth={
																				1.5
																			}
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
																			<path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-11a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1m3 0v18"></path>
																			<path d="M13 8l2 0"></path>
																			<path d="M13 12l2 0"></path>
																		</svg>
																		<span className="text-sm relative top-0.5 flex-1">
																			Llegeix
																			la
																			nostra
																			escapada
																			a{" "}
																			<u>
																				{
																					getawayDetails.title
																				}
																			</u>
																			:
																		</span>
																	</span>
																	<span className="block text-lg group-hover:text-secondary-800 transition-all duration-300 ease-in-out">
																		{
																			getawayDetails
																				.relatedStory
																				.title
																		}
																	</span>
																	<time className="text-sm text-primary-300 inline-block -mt-1.5">
																		Publicada
																		el{" "}
																		{formatDateTimeToISODate(
																			getawayDetails
																				.relatedStory
																				.createdAt
																		)}
																	</time>
																</a>
															</Link>
														) : null}
														<h2 className="w-full md:w-9/12">
															{
																getawayDetails.subtitle
															}
														</h2>
														<div className="border-y border-primary-200 my-4 md:my-8 py-5">
															<div className="flex flex-wrap items-start">
																<div className="pb-6 flex items-start">
																	<div className="w-6 h-6 flex items-center justify-center">
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			className="icon icon-tabler icon-tabler-tag mt-0.5 block"
																			width={
																				24
																			}
																			height={
																				24
																			}
																			viewBox="0 0 24 24"
																			strokeWidth={
																				2
																			}
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
																				r={
																					1
																				}
																				fill="currentColor"
																			></circle>
																			<path d="M4 7v3.859c0 .537 .213 1.052 .593 1.432l8.116 8.116a2.025 2.025 0 0 0 2.864 0l4.834 -4.834a2.025 2.025 0 0 0 0 -2.864l-8.117 -8.116a2.025 2.025 0 0 0 -1.431 -.593h-3.859a3 3 0 0 0 -3 3z"></path>
																		</svg>
																	</div>
																	<div className="pl-4">
																		<p className="text-base text-primary-500 font-semibold mb-0.5">
																			L'
																			{getawayDetails.type ==
																				"place"
																				? "allotjament"
																				: "activitat"}{" "}
																			està
																			catalogat
																			com
																			a{" "}
																			{
																				getawayDetails.placeType
																			}
																		</p>
																		<p className="text-sm mb-0 opacity-70">
																			Els
																			allotjaments
																			i
																			les
																			activitats
																			recomanades
																			a
																			Escapadesenparella.cat
																			estan
																			pensades
																			per
																			a
																			que
																			les
																			parelles
																			gaudeixin
																			al
																			màxim
																			de
																			les
																			seves
																			escapades.
																		</p>
																	</div>
																</div>
																<div className="pb-6 flex items-start">
																	<div className="w-6 h-6 flex items-center justify-center">
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			className="icon icon-tabler icon-tabler-map-pin mt-0.5 block"
																			width={
																				24
																			}
																			height={
																				24
																			}
																			viewBox="0 0 24 24"
																			strokeWidth={
																				2
																			}
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
																				cx={
																					12
																				}
																				cy={
																					11
																				}
																				r={
																					3
																				}
																			></circle>
																			<path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"></path>
																		</svg>
																	</div>
																	<div className="pl-4">
																		<p className="text-base text-primary-500 font-semibold mb-0.5">
																			L'
																			{getawayDetails.type ==
																				"place"
																				? "allotjament"
																				: "activitat"}{" "}
																			es
																			troba
																			a la
																			zona
																			de{" "}
																			<span className="capitalize">
																				{
																					getawayDetails
																						.region[0]
																				}
																			</span>
																		</p>
																		<p className="text-sm mb-0 opacity-70">
																			L'adreça
																			completa
																			de
																			l'allotjament
																			és{" "}
																			{
																				getawayDetails.place_full_address
																			}
																			.
																		</p>
																	</div>
																</div>
																<div className="flex items-start">
																	<div className="w-6 h-6 flex items-center justify-center">
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			className="icon icon-tabler icon-tabler-currency-euro mt-0.5"
																			width={
																				24
																			}
																			height={
																				24
																			}
																			viewBox="0 0 24 24"
																			strokeWidth={
																				2
																			}
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
																			{getawayDetails.type ==
																				"place"
																				? "allotjament"
																				: "activitat"}{" "}
																			té
																			un
																			preu
																			aproximat
																			de{" "}
																			{
																				getawayDetails.price
																			}{" "}
																			€ la
																			nit
																		</p>
																		<p className="text-sm mb-0 opacity-70">
																			Tot
																			i
																			que
																			els
																			preus
																			poden
																			variar
																			i no
																			estiguin
																			constantment
																			actualitzats,
																			hem
																			calculat
																			que
																			el
																			preu
																			mitjà
																			per
																			persona
																			per
																			aquest
																			allotjament
																			és
																			de{" "}
																			{
																				getawayDetails.price
																			}{" "}
																			€ la
																			nit.
																		</p>
																	</div>
																</div>
															</div>
														</div>
													</div>
													<div>
														<h2 className="text-2xl font-body">
															Sobre{" "}
															{
																getawayDetails.title
															}
														</h2>
														<div
															className="mt-4 listing__description"
															dangerouslySetInnerHTML={{
																__html: getawayDetails.description,
															}}
														></div>
													</div>
													<div className="pt-8">
														<h2 className="text-2xl font-body">
															Com arribar a{" "}
															{
																getawayDetails.title
															}
														</h2>
														<div className="flex flex-wrap items-center mt-4">
															<div className="w-5 h-5 mr-2">
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	width="20"
																	height="20"
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
																	/>
																	<circle
																		cx="12"
																		cy="11"
																		r="3"
																	/>
																	<path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1 -2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
																</svg>
															</div>
															<span className="text-15 opacity-80">
																{
																	getawayDetails.activity_full_address
																}
															</span>
														</div>
														<div className="w-full mt-5 h-72 rounded-md overflow-hidden">
															<GoogleMapReact
																bootstrapURLKeys={{
																	key: `${process.env.GOOGLE_API_KEY}`,
																}}
																defaultCenter={
																	center
																}
																defaultZoom={11}
																options={
																	getMapOptions
																}
																yesIWantToUseGoogleMapApiInternals
																onGoogleApiLoaded={({
																	map,
																	maps,
																}) =>
																	renderMarker(
																		map,
																		maps
																	)
																}
															/>
														</div>
													</div>
												</div>
												<aside className="w-full xl:w-5/12 xl:px-6 relative xl:sticky xl:top-36">
													<div className="p-5 rounded shadow-lg shadow-primary-50">
														{getawayDetails.isVerified ? (
															<div>
																<div className="flex items-center">
																	<svg
																		xmlns="http://www.w3.org/2000/svg"
																		className="mr-1 text-[#57A1FE]"
																		width={
																			22
																		}
																		height={
																			22
																		}
																		viewBox="0 0 24 24"
																		strokeWidth={
																			1.5
																		}
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
																		<path
																			d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z"
																			strokeWidth={
																				0
																			}
																			fill="currentColor"
																		></path>
																	</svg>
																	<span className="inline-block text-sm text-primary-400 font-normal">
																		Escapada
																		verificada
																	</span>
																</div>
																{getawayDetails.review ? (
																	<div className="w-full bg-tertiary-50 rounded p-5 mt-3">
																		<blockquote className="font-headings text-lg pr-8">
																			{
																				getawayDetails.review
																			}
																			<cite className="block mt-4 text-sm">
																				<picture>
																					<img
																						src="/signatura-andrea-juli.svg"
																						className="w-32 h-auto"
																						alt="Andrea i Juli"
																						loading="lazy"
																					/>
																				</picture>
																			</cite>
																		</blockquote>
																	</div>
																) : null}
															</div>
														) : null}

														{hasOpeningHours}

														<div className="fixed z-50 lg:z-auto bottom-0 inset-x-0 lg:bottom-auto lg:inset-x-auto lg:relative flex flex-row items-stretch bg-white py-3 px-4 lg:p-0 border-t border-primary-200 lg:border-none mt-5 -mx-1.5">
															{getawayDetails?.phone !==
																"-" &&
																getawayDetails?.phone !==
																"" ? (
																<div className="flex-1 px-1.5">
																	<a
																		href={`tel:${getawayDetails.phone}`}
																		className="button button__ghost button__med justify-center items-center w-full"
																		title="Trucar"
																		target="_blank"
																		rel="nofollow noreferrer"
																	>
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			className="mr-1.5"
																			width={
																				24
																			}
																			height={
																				24
																			}
																			viewBox="0 0 24 24"
																			strokeWidth={
																				1.5
																			}
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
																			<path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2"></path>
																		</svg>
																		Trucar
																	</a>
																</div>
															) : null}
															{getawayDetails?.website !==
																"-" &&
																getawayDetails?.website !==
																"" ? (
																<div className="flex-1 px-1.5">
																	<a
																		href={`${getawayDetails.website}`}
																		className="button button__primary button__med justify-center items-center w-full"
																		title="Reservar"
																		target="_blank"
																		rel="nofollow noreferrer"
																	>
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			className="mr-1.5"
																			width={
																				24
																			}
																			height={
																				24
																			}
																			viewBox="0 0 24 24"
																			strokeWidth={
																				1.5
																			}
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
																			<path d="M19.5 7a9 9 0 0 0 -7.5 -4a8.991 8.991 0 0 0 -7.484 4"></path>
																			<path d="M11.5 3a16.989 16.989 0 0 0 -1.826 4"></path>
																			<path d="M12.5 3a16.989 16.989 0 0 1 1.828 4"></path>
																			<path d="M19.5 17a9 9 0 0 1 -7.5 4a8.991 8.991 0 0 1 -7.484 -4"></path>
																			<path d="M11.5 21a16.989 16.989 0 0 1 -1.826 -4"></path>
																			<path d="M12.5 21a16.989 16.989 0 0 0 1.828 -4"></path>
																			<path d="M2 10l1 4l1.5 -4l1.5 4l1 -4"></path>
																			<path d="M17 10l1 4l1.5 -4l1.5 4l1 -4"></path>
																			<path d="M9.5 10l1 4l1.5 -4l1.5 4l1 -4"></path>
																		</svg>
																		Reservar
																	</a>
																</div>
															) : null}
														</div>
													</div>
													{getawayDetails.discountCode ? <ListingDiscount discountCode={getawayDetails.discountCode} discountInfo={getawayDetails.discountInfo} /> : null}
												</aside>
											</div>
										</div>
									</div>
								</section>
							</article>
						</main>
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
		}

		// PLACE DETAILS
		if (getawayDetails.type == "place") {
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

			const urlToShare = `https://escapadesenparella.cat/${categoryDetails.slug}/${router.query.slug}`;

			const initialState = {
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
									el.bookmarkPlaceRef._id ===
									getawayDetails._id
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
							bookmarkDetails: userBookmarks,
							isBookmarked: isBookmarked,
						});
					};
					fetchData();
				}
				// eslint-disable-next-line react-hooks/exhaustive-deps
			}, [queryId]);

			const bookmarkListing = () => {
				const listingId = getawayDetails._id;
				const listingType = getawayDetails.type;
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
					<div
						className="px-4"
						onClick={() => handleModalVisibility()}
					>
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
						setState({
							...state,
							showBookmarkToast: false,
							toastMessage: "",
						})
					}
					show={state.showBookmarkToast}
					delay={5000}
					autohide
				>
					<Toast.Header>
						<img
							src="../../logo-xs.svg"
							className="rounded-md mr-2"
							alt=""
						/>
						<strong className="mr-auto">Getaways.guru</strong>
					</Toast.Header>
					<Toast.Body>
						{state.toastMessage} <br />{" "}
						<Link href={"/bookmarks"}>See all bookmarks</Link>{" "}
					</Toast.Body>
				</Toast>
			);

			const center = {
				lat: parseFloat(getawayDetails.place_lat),
				lng: parseFloat(getawayDetails.place_lng),
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
					lat: parseFloat(getawayDetails.place_lat),
					lng: parseFloat(getawayDetails.place_lng),
				};
				new maps.Marker({ position: position, map, title: "Hello" });
			};

			let coversList,
				placeHours,
				hasOpeningHours,
				placeCategories,
				placeSeasons;

			if (state.placeLoaded === true) {
				coversList = getawayDetails.images.map((cover, idx) => (
					<picture key={idx}>
						<img
							src={cover}
							className="w-full h-fullobject-cover"
						/>
					</picture>
				));

				if (getawayDetails.place_opening_hours.length > 0) {
					placeHours = getawayDetails.place_opening_hours.map(
						(hour, idx) => (
							<li
								key={idx}
								className="capitalize text-15 text-primary-400"
							>
								{hour}
							</li>
						)
					);
					hasOpeningHours = (
						<div className="my-5 py-5 border-t border-primary-100 border-b">
							<ul className="list-none p-0 m-0">
								<li className="flex flex-wrap items-center mb-3">
									<span className="block w-full">
										Horari d'atenció al públic{" "}
									</span>
									<span className="block w-full text-xs opacity-80 -mt-0.5">
										Font: Google
									</span>
								</li>
								{placeHours}
							</ul>
						</div>
					);
				}

				placeCategories = getawayDetails.categories.map(
					(category, idx) => (
						<li
							key={idx}
							className="flex flex-wrap items-center px-1"
						>
							<span className="bg-primary-200 text-primary-400 rounded-md px-2 py-1 mr-1 capitalize text-sm">
								Escapada {category}
							</span>
						</li>
					)
				);

				placeSeasons = getawayDetails.seasons.map((season, idx) => (
					<li key={idx} className="flex flex-wrap items-center px-1">
						<span className="bg-primary-200 text-primary-400 rounded-md px-2 py-1 mr-1 capitalize text-sm">
							{season}
						</span>
					</li>
				));
			}

			return (
				<>
					{/* Browser metas  */}
					<GlobalMetas
						title={getawayDetails.metaTitle}
						description={getawayDetails.metaDescription}
						url={`https://escapadesenparella.cat/${categoryDetails.slug}/${getawayDetails.slug}`}
						image={getawayDetails.cover}
						canonical={`https://escapadesenparella.cat/${categoryDetails.slug}/${getawayDetails.slug}`}
					/>
					{/* Rich snippets */}
					<BreadcrumbRichSnippet
						page1Title="Inici"
						page1Url="https://escapadesenparella.cat"
						page2Title={categoryDetails.title}
						page2Url={`https://escapadesenparella.cat/${categoryDetails.slug}`}
						page3Title={getawayDetails.metaTitle}
						page3Url={`https://escapadesenparella.cat/allotjaments/${getawayDetails.slug}`}
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
							<div className="py-5 bg-primary-500 text-white">
								<div className="container">
									<ul className="breadcrumb">
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
											<a
												href={`/${categoryDetails.slug}`}
												title={categoryDetails.title}
												className="breadcrumb__link"
											>
												{categoryDetails.title}
											</a>
										</li>
										<li className="breadcrumb__item">
											<span className="breadcrumb__link active">
												{getawayDetails.title}
											</span>
										</li>
									</ul>
								</div>
							</div>
							<article>
								{/* Listing header */}
								<section className="pt-2 md:pt-5 bg-primary-500">
									<div className="container">
										<div className="w-full flex flex-wrap items-center">
											<div className="w-full md:w-1/2 text-white">
												<div className="flex items-start">
													<h1>
														{getawayDetails.title}
													</h1>
													{getawayDetails.isVerified ? (
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="ml-2 relative -top-2 text-[#57A1FE]"
															width={28}
															height={28}
															viewBox="0 0 24 24"
															strokeWidth={1.5}
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
															<path
																d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z"
																strokeWidth={0}
																fill="currentColor"
															></path>
														</svg>
													) : null}
												</div>
												<ul className="flex flex-wrap items-center p-0 -mx-2 mt-2 mb-0 md:mb-5">
													{getawayDetails.isVerified ? (
														<li className="flex flex-wrap items-center px-2">
															<svg
																xmlns="http://www.w3.org/2000/svg"
																className="mr-1.5 text-white"
																width={18}
																height={18}
																viewBox="0 0 24 24"
																strokeWidth={
																	1.5
																}
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
																<path
																	d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z"
																	strokeWidth={
																		0
																	}
																	fill="currentColor"
																></path>
															</svg>
															<span className="text-white text-sm relative inline-block top-px">
																Escapada
																verificada
															</span>
														</li>
													) : null}
													<li className="flex flex-wrap items-center px-2">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="mr-1.5 text-white"
															width={16}
															height={16}
															viewBox="0 0 24 24"
															strokeWidth={1.5}
															stroke="currentCOlor"
															fill="currentCOlor"
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
														<span className="text-white text-sm relative inline-block top-px">
															{
																getawayDetails.place_rating
															}
														</span>
													</li>
													<li className="flex flex-wrap items-center px-2">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="mr-1.5 text-white"
															width={18}
															height={18}
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
															<circle
																cx={12}
																cy={12}
																r={9}
															></circle>
														</svg>
														<span className="text-white text-sm relative inline-block top-px">{`${getawayDetails.place_locality ===
															undefined
															? ""
															: getawayDetails.place_locality
															}${getawayDetails.place_locality ===
																undefined
																? ""
																: ","
															} ${getawayDetails.place_province ||
															getawayDetails.place_state
															}, ${getawayDetails.place_country
															}`}</span>
													</li>
												</ul>
											</div>
											<div className="hidden md:block w-full md:w-1/2 mt-3 md:mt-0">
												<div className="flex flex-wrap justify-start md:justify-end items-center">
													<button className="text-white inline-flex items-center text-sm relative after:block after:absolute after:-bottom-1 after:inset-x-0 after:bg-white after:h-px">
														<span>Compartir</span>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="ml-1.5 relative -top-px"
															width={18}
															height={18}
															viewBox="0 0 24 24"
															strokeWidth={1.5}
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
															<path d="M6 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
															<path d="M18 6m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
															<path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
															<path d="M8.7 10.7l6.6 -3.4"></path>
															<path d="M8.7 13.3l6.6 3.4"></path>
														</svg>
													</button>
												</div>
											</div>
											<div className="w-full mt-5 md:mt-2.5">
												<div className="flex flex-wrap items-stretch rounded-sm overflow-hidden relative -m-0.5">
													<button
														data-fancybox-trigger="gallery"
														className="inline-flex items-center absolute bottom-5 right-5 text-primary-500 bg-white rounded text-xs py-2 px-3 shadow-md"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="icon icon-tabler icon-tabler-photo mr-1.5"
															width={19}
															height={19}
															viewBox="0 0 24 24"
															strokeWidth={1.5}
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
																x1={15}
																y1={8}
																x2="15.01"
																y2={8}
															></line>
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
														Veure{" "}
														{
															getawayDetails
																.images.length
														}{" "}
														imatges
													</button>
													<FancyboxUtil
														options={{
															infinite: true,
														}}
													>
														<div
															className="w-full lg:w-1/2 h-80 lg:h-50vh p-0.5"
															data-fancybox="gallery"
															data-src={
																getawayDetails.cover
															}
														>
															<picture>
																<img
																	src={
																		getawayDetails.cover
																	}
																	className="w-full h-full object-cover"
																/>
															</picture>
														</div>
														<div className="w-full lg:w-1/2 flex flex-wrap h-40 lg:h-50vh">
															{getawayDetails
																.images[0] !==
																undefined ? (
																<div
																	className="w-1/4 lg:w-1/2 flex-auto h-full lg:h-1/2 p-0.5"
																	data-fancybox="gallery"
																	data-src={
																		getawayDetails
																			.images[0]
																	}
																>
																	<picture>
																		<img
																			src={
																				getawayDetails
																					.images[0]
																			}
																			className="w-full h-full object-cover"
																		/>
																	</picture>
																</div>
															) : null}
															{getawayDetails
																.images[1] !==
																undefined ? (
																<div
																	className="w-1/4 lg:w-1/2 flex-auto h-full lg:h-1/2 p-0.5"
																	data-fancybox="gallery"
																	data-src={
																		getawayDetails
																			.images[1]
																	}
																>
																	<picture>
																		<img
																			src={
																				getawayDetails
																					.images[1]
																			}
																			className="w-full h-full object-cover"
																		/>
																	</picture>
																</div>
															) : null}
															{getawayDetails
																.images[2] !==
																undefined ? (
																<div
																	className="w-1/4 lg:w-1/2 flex-auto h-full lg:h-1/2 p-0.5"
																	data-fancybox="gallery"
																	data-src={
																		getawayDetails
																			.images[2]
																	}
																>
																	<picture>
																		<img
																			src={
																				getawayDetails
																					.images[2]
																			}
																			className="w-full h-full object-cover"
																		/>
																	</picture>
																</div>
															) : null}
															{getawayDetails
																.images[3] !==
																undefined ? (
																<div
																	className="w-1/4 lg:w-1/2 flex-auto h-full lg:h-1/2 p-0.5"
																	data-fancybox="gallery"
																	data-src={
																		getawayDetails
																			.images[3]
																	}
																>
																	<picture>
																		<img
																			src={
																				getawayDetails
																					.images[3]
																			}
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
								<section className="pt-5 pb-12 md:pt-10 md:pb-16">
									<div className="container">
										<div className="w-full lg:w-10/12 mx-auto">
											<div className="flex flex-wrap items-start xl:-mx-6">
												<div className="w-full xl:w-7/12 xl:px-6 mx-auto order-2 lg:order-none">
													<div>
														{getawayDetails.relatedStory ? (
															<Link
																href={`/histories/${getawayDetails.relatedStory.slug}`}
															>
																<a className="p-5 rounded-md border border-primary-50 w-full block group mb-6">
																	<span className="inline-flex items-center">
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			className="mr-1.5 text-secondary-800"
																			width={
																				20
																			}
																			height={
																				20
																			}
																			viewBox="0 0 24 24"
																			strokeWidth={
																				1.5
																			}
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
																			<path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-11a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1m3 0v18"></path>
																			<path d="M13 8l2 0"></path>
																			<path d="M13 12l2 0"></path>
																		</svg>
																		<span className="text-sm relative top-0.5 flex-1">
																			Llegeix
																			la
																			nostra
																			escapada
																			a{" "}
																			<u>
																				{
																					getawayDetails.title
																				}
																			</u>
																			:
																		</span>
																	</span>
																	<span className="block text-lg group-hover:text-secondary-800 transition-all duration-300 ease-in-out">
																		{
																			getawayDetails
																				.relatedStory
																				.title
																		}
																	</span>
																	<time className="text-sm text-primary-300 inline-block -mt-1.5">
																		Publicada
																		el{" "}
																		{formatDateTimeToISODate(
																			getawayDetails
																				.relatedStory
																				.createdAt
																		)}
																	</time>
																</a>
															</Link>
														) : null}
														<h2 className="w-full md:w-9/12">
															{
																getawayDetails.subtitle
															}
														</h2>
														<div className="border-y border-primary-200 my-4 md:my-8 py-5">
															<div className="flex flex-wrap items-start">
																<div className="pb-6 flex items-start">
																	<div className="w-6 h-6 flex items-center justify-center">
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			className="icon icon-tabler icon-tabler-tag mt-0.5 block"
																			width={
																				24
																			}
																			height={
																				24
																			}
																			viewBox="0 0 24 24"
																			strokeWidth={
																				2
																			}
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
																				r={
																					1
																				}
																				fill="currentColor"
																			></circle>
																			<path d="M4 7v3.859c0 .537 .213 1.052 .593 1.432l8.116 8.116a2.025 2.025 0 0 0 2.864 0l4.834 -4.834a2.025 2.025 0 0 0 0 -2.864l-8.117 -8.116a2.025 2.025 0 0 0 -1.431 -.593h-3.859a3 3 0 0 0 -3 3z"></path>
																		</svg>
																	</div>
																	<div className="pl-4">
																		<p className="text-base text-primary-500 font-semibold mb-0.5">
																			L'
																			{getawayDetails.type ==
																				"place"
																				? "allotjament"
																				: "activitat"}{" "}
																			està
																			catalogat
																			com
																			a{" "}
																			{
																				getawayDetails.placeType
																			}
																		</p>
																		<p className="text-sm mb-0 opacity-70">
																			Els
																			allotjaments
																			i
																			les
																			activitats
																			recomanades
																			a
																			Escapadesenparella.cat
																			estan
																			pensades
																			per
																			a
																			que
																			les
																			parelles
																			gaudeixin
																			al
																			màxim
																			de
																			les
																			seves
																			escapades.
																		</p>
																	</div>
																</div>
																<div className="pb-6 flex items-start">
																	<div className="w-6 h-6 flex items-center justify-center">
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			className="icon icon-tabler icon-tabler-map-pin mt-0.5 block"
																			width={
																				24
																			}
																			height={
																				24
																			}
																			viewBox="0 0 24 24"
																			strokeWidth={
																				2
																			}
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
																				cx={
																					12
																				}
																				cy={
																					11
																				}
																				r={
																					3
																				}
																			></circle>
																			<path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"></path>
																		</svg>
																	</div>
																	<div className="pl-4">
																		<p className="text-base text-primary-500 font-semibold mb-0.5">
																			L'
																			{getawayDetails.type ==
																				"place"
																				? "allotjament"
																				: "activitat"}{" "}
																			es
																			troba
																			a la
																			zona
																			de{" "}
																			<span className="capitalize">
																				{
																					getawayDetails
																						.region[0]
																				}
																			</span>
																		</p>
																		<p className="text-sm mb-0 opacity-70">
																			L'adreça
																			completa
																			de
																			l'allotjament
																			és{" "}
																			{
																				getawayDetails.place_full_address
																			}
																			.
																		</p>
																	</div>
																</div>
																<div className="flex items-start">
																	<div className="w-6 h-6 flex items-center justify-center">
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			className="icon icon-tabler icon-tabler-currency-euro mt-0.5"
																			width={
																				24
																			}
																			height={
																				24
																			}
																			viewBox="0 0 24 24"
																			strokeWidth={
																				2
																			}
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
																			{getawayDetails.type ==
																				"place"
																				? "allotjament"
																				: "activitat"}{" "}
																			té
																			un
																			preu
																			aproximat
																			de{" "}
																			{
																				getawayDetails.price
																			}{" "}
																			€ la
																			nit
																		</p>
																		<p className="text-sm mb-0 opacity-70">
																			Tot
																			i
																			que
																			els
																			preus
																			poden
																			variar
																			i no
																			estiguin
																			constantment
																			actualitzats,
																			hem
																			calculat
																			que
																			el
																			preu
																			mitjà
																			per
																			persona
																			per
																			aquest
																			allotjament
																			és
																			de{" "}
																			{
																				getawayDetails.price
																			}{" "}
																			€ la
																			nit.
																		</p>
																	</div>
																</div>
															</div>
														</div>
													</div>

													<div>
														<h2 className="text-2xl font-body">
															Sobre{" "}
															{
																getawayDetails.title
															}
														</h2>
														<div
															className="mt-4 listing__description"
															dangerouslySetInnerHTML={{
																__html: getawayDetails.description,
															}}
														></div>
													</div>

													{checkedCharacteristics.length >
														0 ? (
														<div className="pt-8">
															<h2 className="text-2xl font-body">
																Què trobareu a{" "}
																{
																	getawayDetails.title
																}
																?
															</h2>
															<div className="mt-7">
																<ul className="p-0 -m-2.5 flex flex-wrap">
																	{checkedCharacteristics.map(
																		(
																			el
																		) => (
																			<li
																				key={
																					el.name
																				}
																				className="flex flex-col items-center w-1/2 md:w-1/3 lg:w-1/4 p-2.5"
																			>
																				<span
																					dangerouslySetInnerHTML={{
																						__html: el.icon,
																					}}
																					className="inline-block [&>svg]:w-9 [&>svg]:h-9 mb-1.5"
																				></span>
																				<span className="inline-block text-sm text-center">
																					{
																						el.name
																					}
																				</span>
																			</li>
																		)
																	)}
																</ul>
															</div>
														</div>
													) : null}

													<div className="pt-8">
														<h2 className="text-2xl font-body">
															Com arribar a{" "}
															{
																getawayDetails.title
															}
														</h2>
														<div className="flex flex-wrap items-center mt-4">
															<div className="w-5 h-5 mr-2">
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	width="20"
																	height="20"
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
																	/>
																	<circle
																		cx="12"
																		cy="11"
																		r="3"
																	/>
																	<path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1 -2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
																</svg>
															</div>
															<span className="text-15 opacity-80">
																{
																	getawayDetails.place_full_address
																}
															</span>
														</div>
														<div className="w-full mt-5 h-72 rounded-md overflow-hidden">
															<GoogleMapReact
																bootstrapURLKeys={{
																	key: `${process.env.GOOGLE_API_KEY}`,
																}}
																defaultCenter={
																	center
																}
																defaultZoom={11}
																options={
																	getMapOptions
																}
																yesIWantToUseGoogleMapApiInternals
																onGoogleApiLoaded={({
																	map,
																	maps,
																}) =>
																	renderMarker(
																		map,
																		maps
																	)
																}
															/>
														</div>
													</div>
												</div>
												<aside className="w-full xl:w-5/12 xl:px-6 relative xl:sticky xl:top-36 order-1 lg:order-none mb-6 lg:mb-0">
													<div className="p-5 rounded shadow-lg shadow-primary-50">
														{getawayDetails.isVerified ? (
															<div>
																<div className="flex items-center">
																	<svg
																		xmlns="http://www.w3.org/2000/svg"
																		className="mr-1 text-[#57A1FE]"
																		width={
																			22
																		}
																		height={
																			22
																		}
																		viewBox="0 0 24 24"
																		strokeWidth={
																			1.5
																		}
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
																		<path
																			d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z"
																			strokeWidth={
																				0
																			}
																			fill="currentColor"
																		></path>
																	</svg>
																	<span className="inline-block text-sm text-primary-400 font-normal">
																		Escapada
																		verificada
																	</span>
																</div>
																{getawayDetails.review ? (
																	<div className="w-full bg-tertiary-50 rounded p-5 mt-3">
																		<blockquote className="font-headings text-lg pr-8">
																			{
																				getawayDetails.review
																			}
																			<cite className="block mt-4 text-sm">
																				<picture>
																					<img
																						src="/signatura-andrea-juli.svg"
																						className="w-32 h-auto"
																						alt="Andrea i Juli"
																						loading="lazy"
																					/>
																				</picture>
																			</cite>
																		</blockquote>
																	</div>
																) : null}
															</div>
														) : null}

														{hasOpeningHours}

														<div className="fixed z-50 lg:z-auto bottom-0 inset-x-0 lg:bottom-auto lg:inset-x-auto lg:relative flex flex-row items-stretch bg-white py-3 px-4 lg:p-0 border-t border-primary-200 lg:border-none mt-5 -mx-1.5">
															{getawayDetails?.phone !==
																"-" &&
																getawayDetails?.phone !==
																"" ? (
																<div className="flex-1 px-1.5">
																	<a
																		href={`tel:${getawayDetails.phone}`}
																		className="button button__ghost button__med justify-center items-center w-full"
																		title="Trucar"
																		target="_blank"
																		rel="nofollow noreferrer"
																	>
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			className="mr-1.5"
																			width={
																				24
																			}
																			height={
																				24
																			}
																			viewBox="0 0 24 24"
																			strokeWidth={
																				1.5
																			}
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
																			<path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2"></path>
																		</svg>
																		Trucar
																	</a>
																</div>
															) : null}
															{getawayDetails?.website !==
																"-" &&
																getawayDetails?.website !==
																"" ? (
																<div className="flex-1 px-1.5">
																	<a
																		href={`${getawayDetails.website}`}
																		className="button button__primary button__med justify-center items-center w-full"
																		title="Reservar"
																		target="_blank"
																		rel="nofollow noreferrer"
																	>
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			className="mr-1.5"
																			width={
																				24
																			}
																			height={
																				24
																			}
																			viewBox="0 0 24 24"
																			strokeWidth={
																				1.5
																			}
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
																			<path d="M19.5 7a9 9 0 0 0 -7.5 -4a8.991 8.991 0 0 0 -7.484 4"></path>
																			<path d="M11.5 3a16.989 16.989 0 0 0 -1.826 4"></path>
																			<path d="M12.5 3a16.989 16.989 0 0 1 1.828 4"></path>
																			<path d="M19.5 17a9 9 0 0 1 -7.5 4a8.991 8.991 0 0 1 -7.484 -4"></path>
																			<path d="M11.5 21a16.989 16.989 0 0 1 -1.826 -4"></path>
																			<path d="M12.5 21a16.989 16.989 0 0 0 1.828 -4"></path>
																			<path d="M2 10l1 4l1.5 -4l1.5 4l1 -4"></path>
																			<path d="M17 10l1 4l1.5 -4l1.5 4l1 -4"></path>
																			<path d="M9.5 10l1 4l1.5 -4l1.5 4l1 -4"></path>
																		</svg>
																		Reservar
																	</a>
																</div>
															) : null}
														</div>
													</div>
													{getawayDetails.discountCode ? <ListingDiscount discountCode={getawayDetails.discountCode} discountInfo={getawayDetails.discountInfo} /> : null}
												</aside>
											</div>
										</div>
									</div>
								</section>
							</article>
						</main>
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
		}
	}
};

export async function getServerSideProps({ params }) {
	const service = new ContentService();
	const categoryDetails = await service.getCategoryDetails(params.categoria);
	const activityDetails = await service.activityDetails(params.slug);
	const placeDetails = await service.getPlaceDetails(params.slug);
	const characteristics = await service.getCharacteristics();

	let getawayDetails, storyDetails;
	if (activityDetails != undefined) {
		getawayDetails = activityDetails;
	} else {
		getawayDetails = placeDetails;
	}

	if (activityDetails == null && placeDetails == null) {
		return {
			notFound: true,
		};
	}

	let checkedCharacteristics = [];

	if (getawayDetails?.characteristics) {
		getawayDetails.characteristics.forEach((getawayCharacteristic) => {
			characteristics.forEach((rawCharacteristic) => {
				if (getawayCharacteristic == rawCharacteristic.name) {
					checkedCharacteristics.push({
						icon: rawCharacteristic.icon,
						name: rawCharacteristic.name,
					});
				}
			});
		});
	}

	return {
		props: {
			getawayDetails,
			categoryDetails,
			checkedCharacteristics,
		},
	};
}

export default GetawayListing;
