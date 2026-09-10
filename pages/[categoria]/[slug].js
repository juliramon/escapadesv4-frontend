import { useState, useEffect, useContext } from "react";
import { cloudinaryUrl } from "../../utils/cloudinary";
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
import ShareBarModal from "../../components/social/ShareBarModal";
import { Splide, SplideTrack, SplideSlide } from "@splidejs/react-splide";
import AdBanner from "../../components/ads/AdBanner";
import ArticleRichSnippet from "../../components/richsnippets/ArticleRichSnippet";
import "@splidejs/react-splide/css/core";
import BookingCard from "../../components/listingpage/BookingCard";
import RelatedListings from "../../components/listingpage/RelatedListings";
import {
	categoryHeadingFor,
	listingUrl,
} from "../../utils/listingRoutes";

const GetawayListing = ({
	getawayDetails,
	categoryDetails,
	checkedCharacteristics,
	relatedResults,
	relatedByCategory,
}) => {
	const { user } = useContext(UserContext);
	const router = useRouter();

	if (getawayDetails && categoryDetails) {
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

		// Fetch bookmarks
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
							if (getawayDetails.type == "activity") {
								if (
									el.bookmarkActivityRef &&
									el.bookmarkActivityRef._id ===
										getawayDetails._id
								) {
									return (bookmarkDetails = el);
								}
							}

							if (getawayDetails.type == "place") {
								if (
									el.bookmarkPlaceRef &&
									el.bookmarkPlaceRef._id ===
										getawayDetails._id
								) {
									return (bookmarkDetails = el);
								}
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
			lat: parseFloat(
				getawayDetails?.activity_lat
					? getawayDetails.activity_lat
					: getawayDetails.place_lat
			),
			lng: parseFloat(
				getawayDetails?.activity_lng
					? getawayDetails.activity_lng
					: getawayDetails.place_lng
			),
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
				lat: parseFloat(
					getawayDetails?.activity_lat
						? getawayDetails.activity_lat
						: getawayDetails.place_lat
				),
				lng: parseFloat(
					getawayDetails?.activity_lng
						? getawayDetails.activity_lng
						: getawayDetails.place_lng
				),
			};
			new maps.Marker({ position: position, map, title: "Hello" });
		};

		let workingHours = null;

		if (getawayDetails.type == "activity") {
			workingHours = getawayDetails.activity_opening_hours;
		} else {
			workingHours = getawayDetails.place_opening_hours;
		}

		const rating = getawayDetails.activity_rating
			? getawayDetails.activity_rating
			: getawayDetails.place_rating;

		const locality = getawayDetails?.activity_locality
			? getawayDetails.activity_locality
			: getawayDetails?.place_locality
			? getawayDetails.place_locality
			: null;
		const province = getawayDetails?.activity_province
			? getawayDetails.activity_province || getawayDetails?.activity_state
			: getawayDetails?.place_province || getawayDetails?.place_state;

		let fullLocation = "";
		if (locality) {
			fullLocation += locality;
		}
		if (locality && province) {
			fullLocation += ", ";
		}
		if (province) {
			fullLocation += province;
		}

		const fullAddress = getawayDetails?.activity_full_address
			? getawayDetails.activity_full_address
			: getawayDetails?.place_full_address
			? getawayDetails.place_full_address
			: null;
		const mainCategory =
			getawayDetails.type === "activity" && getawayDetails?.categories
				? getawayDetails.categories[0]
				: getawayDetails?.placeType
				? getawayDetails.placeType
				: null;

		const relatedStoryCoverImg = cloudinaryUrl(getawayDetails?.relatedStory?.cover, "w_100,h_100,c_fill");

		const getawayCoverImg = cloudinaryUrl(getawayDetails?.cover, "w_805,h_605,c_fill");

		// La fitxa és accessible des de qualsevol slug de categoria, però la URL
		// que mana és sempre la de la seva categoria principal. Sense això cada
		// variant es canonicalitzava a si mateixa i competien entre elles.
		const canonicalUrl = listingUrl(getawayDetails);
		const categoryHeading = categoryHeadingFor(getawayDetails.categories);

		return (
			<>
				{/* Browser metas  */}
				<GlobalMetas
					title={getawayDetails.metaTitle}
					description={getawayDetails.metaDescription}
					url={canonicalUrl}
					image={getawayDetails.cover}
					canonical={canonicalUrl}
				/>
				{/* Rich snippets */}
				<BreadcrumbRichSnippet
					page1Title="Inici"
					page1Url="https://escapadesenparella.cat"
					page2Title={categoryDetails.title}
					page2Url={`https://escapadesenparella.cat/${categoryDetails.slug}`}
					page3Title={getawayDetails.metaTitle}
					page3Url={canonicalUrl}
				/>
				<ArticleRichSnippet
					headline={getawayDetails.title}
					summary={getawayDetails.subtitle}
					image={getawayDetails.cover}
					author={getawayDetails.owner.fullName}
					publicationDate={getawayDetails.createdAt}
					modificationDate={getawayDetails.updatedAt}
				/>
				<div id="listingPage">
					<NavigationBar user={user} />
					<main>
						{state.showBookmarkToast ? toast : null}

						<article>
							{/* Listing header */}
							<section className="pt-8 md:pt-12 lg:pt-20">
								<div className="container">
									<div className="grid grid-cols-1 md:grid-cols-12">
										<div className="col-start-1 col-span-12">
											{/* Breadcrumbs */}
											<ul className="breadcrumb justify-center">
												<li className="breadcrumb__item">
													<a
														href="/"
														className="breadcrumb__link"
													>
														Inici
													</a>
												</li>
												<li className="breadcrumb__item">
													{getawayDetails.type ===
													"activity" ? (
														<a
															href={`/activitats`}
															title={`Experiències`}
															className="breadcrumb__link"
														>
															Experiències
														</a>
													) : (
														<a
															href={`/allotjaments`}
															title={`Allotjaments`}
															className="breadcrumb__link"
														>
															Allotjaments
														</a>
													)}
												</li>
												<li className="breadcrumb__item">
													<a
														href={`/${categoryDetails.slug}`}
														title={
															categoryDetails.title
														}
														className="breadcrumb__link"
													>
														{categoryDetails.title}
													</a>
												</li>
											</ul>

											<div className="md:max-w-xl lg:max-w-5xl mx-auto text-center mt-4">
												<h1 className="my-0 text-balance">
													{getawayDetails.title}
												</h1>
												<p className="mt-4 !mb-0 text-block--xl leading-normal max-w-[55ch] mx-auto [&>p]:inline">
													{getawayDetails.subtitle}
												</p>
												<ul className="flex flex-wrap items-center justify-center m-0 p-0 gap-x-2 mt-6">
													{getawayDetails.isVerified ? (
														<li className="flex flex-wrap items-center text-primary-500 bg-gray-100 rounded-lg py-2.5 px-3 text-sm gap-x-1">
															<svg
																xmlns="http://www.w3.org/2000/svg"
																className="text-[#57A1FE]"
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
															Verificada
														</li>
													) : null}
													<li className="flex flex-wrap items-center text-primary-500 bg-gray-100 rounded-lg py-2.5 px-3 text-sm gap-x-1">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width={16}
															height={16}
															viewBox="0 0 24 24"
															strokeWidth={1.5}
															stroke="currentCOlor"
															fill="none"
															strokeLinecap="round"
															strokeLinejoin="round"
														>
															<path
																stroke="none"
																d="M0 0h24v24H0z"
																fill="none"
															/>
															<path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
														</svg>
														{rating}
													</li>
													<li className="flex flex-wrap items-center text-primary-500 bg-gray-100 rounded-lg py-2.5 px-3 text-sm gap-x-1">
														<svg
															xmlns="http://www.w3.org/2000/svg"
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
															<polyline points="8 16 10 10 16 8 14 14 8 16"></polyline>
															<circle
																cx={12}
																cy={12}
																r={9}
															></circle>
														</svg>
														{fullLocation}
													</li>
													<li className="flex flex-wrap items-center text-primary-500 bg-gray-100 rounded-lg py-2.5 px-3 text-sm gap-x-1">
														<ShareBarModal
															picture={
																getawayDetails.cover
															}
															title={
																getawayDetails.title
															}
															rating={rating}
															slug={urlToShare}
															locality={
																fullLocation
															}
															colorClass={
																"text-primary-500 text-sm"
															}
														/>
													</li>
												</ul>
											</div>
										</div>
									</div>
								</div>
							</section>
							<section class="pt-8 md:pt-12">
								{/* Slider images */}
								<div className="container">
									<div className="relative z-10 rounded-2xl">
										<Splide
											options={{
												type: "slide",
												gap: "20px",
												perMove: 1,
												perPage: 3,
												breakpoints: {
													1024: {
														perPage: 2,
													},
													768: {
														perPage: 1,
													},
												},
												arrows: true,
												pagination: false,
											}}
											hasTrack={false}
											aria-label="Carousel d'imatges"
										>
											<SplideTrack>
												<SplideSlide>
													<FancyboxUtil
														options={{
															infinite: true,
														}}
													>
														<div
															className="w-full aspect-[4/3] overflow-hidden"
															data-fancybox="gallery"
															data-src={
																getawayCoverImg
															}
														>
															<picture className="block w-full h-full">
																<img
																	src={
																		getawayCoverImg
																	}
																	alt={
																		getawayDetails.title
																	}
																	className={
																		"w-full h-full object-cover rounded-2xl"
																	}
																	width={400}
																	height={300}
																	loading="eager"
																/>
															</picture>
														</div>
													</FancyboxUtil>
												</SplideSlide>
												{getawayDetails.images
													? getawayDetails.images.map(
															(el, idx) => {
																const imageSrc =
																	el?.substring(
																		0,
																		51
																	);
																const imageId =
																	el?.substring(
																		63
																	);
																const imageModSrc = `${imageSrc}w_805,h_605,c_fill/${imageId}`;
																const imageModSrcMob = `${imageSrc}w_400,h_300,c_fill/${imageId}`;

																const priority =
																	idx === 1 ||
																	idx === 2
																		? "eager"
																		: "lazy";
																return (
																	<SplideSlide
																		key={
																			idx
																		}
																	>
																		<FancyboxUtil
																			options={{
																				infinite: true,
																			}}
																		>
																			<div
																				className="w-full aspect-[4/3] overflow-hidden"
																				data-fancybox="gallery"
																				data-src={
																					el
																				}
																			>
																				<picture className="block w-full h-full bg-primary-50">
																					<source
																						srcSet={
																							imageModSrcMob
																						}
																						media="(max-width: 768px)"
																					/>
																					<source
																						srcSet={
																							imageModSrc
																						}
																						media="(min-width: 768px)"
																					/>
																					<img
																						src={
																							imageModSrc
																						}
																						alt={`${getawayDetails.title} - ${idx}`}
																						className={
																							"w-full h-full object-cover rounded-2xl"
																						}
																						width={
																							400
																						}
																						height={
																							300
																						}
																						loading={
																							priority
																						}
																					/>
																				</picture>
																			</div>
																		</FancyboxUtil>
																	</SplideSlide>
																);
															}
													  )
													: null}
											</SplideTrack>
											<div className="splide__arrows">
												<button className="splide__arrow splide__arrow--prev w-12 h-12 bg-white rounded-full shadow flex items-center justify-center absolute top-1/2 -translate-y-1/2 left-7 md:left-9 lg:left-16 2xl:left-20">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="icon icon-tabler icon-tabler-chevron-left"
														width={24}
														height={24}
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
														/>
														<path d="M15 6l-6 6l6 6" />
													</svg>
												</button>
												<button className="splide__arrow splide__arrow--next w-12 h-12 bg-white rounded-full shadow flex items-center justify-center absolute top-1/2 -translate-y-1/2 right-7 md:right-9 lg:right-16 2xl:right-20">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="icon icon-tabler icon-tabler-chevron-right"
														width={24}
														height={24}
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
														/>
														<path d="M9 6l6 6l-6 6" />
													</svg>
												</button>
											</div>
										</Splide>
									</div>
								</div>

								{/* Listing content */}
								<div className="container py-8 md:py-12 lg:pb-20 listing__description">
									<div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-9">
										<div className="w-full col-span-1 md:col-start-2 md:col-span-6">
											{/* Verified review */}
											{getawayDetails.isVerified ? (
												<div className="max-w-[666px] pt-8">
													{getawayDetails.review &&
													getawayDetails.review !==
														"false" ? (
														<div className="w-full">
															<blockquote className="font-headings text-lg lg:text-2xl font-light leading-normal md:leading-loose">
																"
																{
																	getawayDetails.review
																}
																"
																<cite className="block mt-4 text-sm">
																	<picture>
																		<img
																			src="/signatura-andrea-juli.svg"
																			className="w-32 md:w-36 h-auto"
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

											{/* About this listing */}
											<div
												className={`max-w-[666px] ${
													getawayDetails.isVerified
														? "border-t border-primary-50 pt-8 mt-8 md:pt-12 md:mt-12"
														: ""
												}`}
											>
												<h2 className="mt-0">
													Sobre {getawayDetails.title}
												</h2>
												<div
													className="mt-4 listing__description"
													dangerouslySetInnerHTML={{
														__html: getawayDetails.description,
													}}
												></div>
											</div>

											{/* Section reasons / characteristics */}
											{checkedCharacteristics?.length >
											0 ? (
												<div className="pt-8 mt-8 md:pt-12 md:mt-12 border-t border-primary-50 max-w-[666px]">
													<h2>
														Què trobareu a{" "}
														{getawayDetails.title}?
													</h2>
													<div className="mt-7">
														<ul className="p-0 -m-2.5 flex flex-wrap">
															{checkedCharacteristics.map(
																(el) => (
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

											{getawayDetails?.reasons &&
											getawayDetails.reasons !== "" ? (
												<div className="pt-8 mt-8 md:pt-12 md:mt-12 border-t border-primary-50 max-w-[666px]">
													<h2 className="mb-1">
														Per què realitzar
														aquesta activitat?
													</h2>
													<p>
														Us compartim 5 raons per
														les quals creiem que
														hauríeu de fer aquesta
														escapada:
													</p>
													<div
														className="mt-4 listing__description"
														dangerouslySetInnerHTML={{
															__html: getawayDetails.reasons,
														}}
													></div>
												</div>
											) : null}

											{/* Section how to arrive */}
											<div className="pt-8 mt-8 md:pt-12 md:mt-12 border-t border-primary-50 max-w-[666px]">
												<h2>
													Com arribar a{" "}
													{getawayDetails.title}
												</h2>
												<div className="flex flex-wrap items-center mt-2.5">
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
													<span className="text-15 opacity-80 flex-1">
														{fullAddress}
													</span>
												</div>
												<div className="w-full mt-7 aspect-[4/3] md:aspect-[16/9] rounded-xl overflow-hidden">
													<GoogleMapReact
														bootstrapURLKeys={{
															key: `${process.env.GOOGLE_API_KEY}`,
														}}
														defaultCenter={center}
														defaultZoom={11}
														options={getMapOptions}
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

										{/* Listing aside details + contact buttons */}
										<aside className="w-full col-span-1 md:col-span-4 relative z-10">
											<div className="relative xl:sticky xl:top-24">
												<BookingCard
													type={getawayDetails.type}
													price={getawayDetails.price}
													rating={rating}
													isVerified={getawayDetails.isVerified}
													website={getawayDetails.website}
													phone={getawayDetails.phone}
													discountCode={getawayDetails.discountCode}
													discountInfo={getawayDetails.discountInfo}
												/>

												<div className="p-7 bg-white rounded-2xl border border-primary-50 mt-7">
													{getawayDetails.relatedStory ? (
														<div className="mb-7 pb-7 border-primary-50 border-b">
															<Link
																href={`/histories/${getawayDetails.relatedStory.slug}`}
															>
																<a className="block">
																	<div class="inline-flex items-center">
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			className="mr-1.5"
																			width={
																				18
																			}
																			height={
																				18
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
																				fill="#57A1FE"
																			></path>
																		</svg>
																		<span className="text-sm">
																			T'expliquem
																			la
																			nostra
																			escapada{" "}
																			<u>
																				{
																					getawayDetails.title
																				}
																			</u>
																			:
																		</span>
																	</div>

																	<div className="flex flex-wrap mt-3">
																		<picture className="block relative w-16 h-16 overflow-hidden rounded-2xl">
																			<img
																				src={
																					relatedStoryCoverImg
																				}
																				alt={
																					getawayDetails
																						.relatedStory
																						.title
																				}
																				className={
																					"w-full h-full object-cover"
																				}
																				width={
																					64
																				}
																				height={
																					64
																				}
																				loading="lazy"
																			/>
																		</picture>
																		<div className="pl-5 flex-1">
																			<h3 className="block mt-0 mb-0.5">
																				{
																					getawayDetails
																						.relatedStory
																						.title
																				}
																			</h3>
																			<p className="text-sm font-light mb-4">
																				{
																					getawayDetails
																						.relatedStory
																						.subtitle
																				}
																			</p>
																			<div className="flex items-center">
																				<time className="text-sm block font-light">
																					Publicada
																					el{" "}
																					{formatDateTimeToISODate(
																						getawayDetails
																							.relatedStory
																							.createdAt
																					)}
																				</time>
																				<span className="text-sm inline-block mx-1.5">
																					|
																				</span>
																				<span className="text-sm inline-block">
																					Llegir-ne
																					més
																				</span>
																			</div>
																		</div>
																	</div>
																</a>
															</Link>
														</div>
													) : null}

													{/* Price and location grid */}
													<div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-9">
														<div className="">
															<h3>
																Tipus d'
																{getawayDetails.type ==
																"place"
																	? "allotjament"
																	: "activitat"}{" "}
															</h3>
															<p className="font-light capitalize mb-0">
																{mainCategory}
															</p>
														</div>
														<div className="">
															<h3>
																Direcció de l'
																{getawayDetails.type ==
																"place"
																	? "allotjament"
																	: "activitat"}
															</h3>

															<p className="font-light mb-0">
																{fullAddress}
															</p>
														</div>
													</div>


												</div>

												{/* Ad unit */}
												<div className="p-7 bg-white rounded-2xl border border-primary-50 mt-7">
													<span className="inline-block text-xs">
														Anunci
													</span>
													<AdBanner
														data-ad-slot="4940975412"
														data-ad-format="auto"
														data-full-width-responsive="true"
													/>
												</div>
											</div>
										</aside>
									</div>
								</div>
							</section>
						</article>

						{/* Contingut relacionat: primer per destinació i, si la fitxa no
						    en té cap, per categoria. */}
						{relatedResults.length > 0
							? relatedResults.map((result) => (
									<RelatedListings
										key={result._id}
										eyebrow="A prop d'aquí"
										title={`Més escapades a ${result.title}`}
										description="Altres allotjaments i experiències de la mateixa zona."
										href={`/destinacions/${result.slug}`}
										linkLabel="Veure tota la destinació"
										items={result.relatedResults}
									/>
							  ))
							: relatedByCategory.length > 0 && categoryHeading ? (
									<RelatedListings
										eyebrow="Del mateix estil"
										title={`Més ${categoryHeading.title.charAt(0).toLowerCase()}${categoryHeading.title.slice(1)}`}
										description="Altres escapades de la mateixa categoria."
										href={`/${categoryHeading.slug}`}
										linkLabel="Veure tota la categoria"
										items={relatedByCategory}
									/>
							  ) : null}
					</main>
					<Footer />
					<SignUpModal
						visibility={modalVisibility}
						hideModal={hideModalVisibility}
					/>
					{/* Sense anunci ancorat: a mòbil la part inferior és per a la barra de
					    reserva, que és el que ha de rebre el clic. */}
					<div className="booking-bar-spacer" />
				</div>
			</>
		);
	}
};

export async function getServerSideProps({ params }) {
	const service = new ContentService();
	const categoryDetails = await service.getCategoryDetails(params.categoria);
	const activityDetails = await service.activityDetails(params.slug);
	const placeDetails = await service.getPlaceDetails(params.slug);
	const characteristics = await service.getCharacteristics();

	let getawayDetails;
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

	let relatedResults = [];

	if (getawayDetails.destinations.length > 0) {
		let ids = getawayDetails.destinations.toString();
		relatedResults = await service.getRelatedResultsByDestinationsIds(ids);

		// La destinació retorna també la fitxa que s'està mirant.
		relatedResults = (relatedResults || []).map((result) => ({
			...result,
			relatedResults: (result.relatedResults || []).filter(
				(item) => item.slug !== getawayDetails.slug
			),
		}));
	}

	// Si la fitxa no té destinació —o la destinació no torna res— caiem a
	// escapades de la mateixa categoria, perquè la fitxa mai quedi sense
	// sortida cap a més contingut.
	let relatedByCategory = [];
	const hasDestinationResults = relatedResults.some(
		(result) => result.relatedResults && result.relatedResults.length > 0
	);

	if (!hasDestinationResults && getawayDetails.categories?.length) {
		relatedResults = [];
		try {
			const byCategory = await service.getFeaturedGetawaysByCategory(
				getawayDetails.categories[0]
			);
			relatedByCategory = (byCategory || []).filter(
				(item) => item.slug !== getawayDetails.slug
			);
		} catch (error) {
			relatedByCategory = [];
		}
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
			relatedResults,
			relatedByCategory,
		},
	};
}

export default GetawayListing;
