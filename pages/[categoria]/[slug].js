import { useState, useEffect, useContext } from "react";
import { cloudinaryImage, cloudinaryResponsive } from "../../utils/cloudinary";
import { withResponsiveImages } from "../../utils/contentImages";
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
import ListingRichSnippet from "../../components/richsnippets/ListingRichSnippet";
import "@splidejs/react-splide/css/core";
import BookingCard from "../../components/listingpage/BookingCard";
import RelatedListings from "../../components/listingpage/RelatedListings";
import {
	categoryHeadingFor,
	listingPath,
	listingUrl,
} from "../../utils/listingRoutes";
import {
	idOf,
	loadListingCatalog,
	nearestListings,
	toListingCard,
} from "../../utils/relatedContent";
import {
	DEFAULT_LOCALE,
	FIELDS,
	findBySlug,
	localized,
} from "../../utils/i18n";

const GetawayListing = ({
	getawayDetails,
	categoryDetails,
	checkedCharacteristics,
	related,
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

		// Del router i no del document: la ruta ja porta el segment i el slug
		// en l'idioma que s'està veient.
		const urlToShare = `https://escapadesenparella.cat${
			router.locale && router.locale !== "ca" ? `/${router.locale}` : ""
		}/${router.query.categoria}/${router.query.slug}`;

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

		const relatedStoryCoverImg = cloudinaryImage(getawayDetails?.relatedStory?.cover, 100, 100).src;

		// El carrusel ocupa tota l'amplada al mòbil i tres columnes a
		// l'escriptori: amb `sizes` el navegador demana la mida que toca en
		// comptes de la de 805 px sempre.
		const gallerySizes =
			"(min-width: 1024px) 805px, (min-width: 768px) 50vw, 100vw";
		const galleryImage = (url) =>
			cloudinaryResponsive(url, {
				widths: [400, 600, 805, 1200],
				ratio: 3 / 4,
				sizes: gallerySizes,
			});

		const getawayCover = galleryImage(getawayDetails?.cover);
		const getawayCoverImg = getawayCover.src;

		// La fitxa és accessible des de qualsevol slug de categoria, però la URL
		// que mana és sempre la de la seva categoria principal. Sense això cada
		// variant es canonicalitzava a si mateixa i competien entre elles.
		const canonicalUrl = listingUrl(getawayDetails, router.locale);

		return (
			<>
				{/* Browser metas  */}
				<GlobalMetas
					title={getawayDetails.metaTitle}
					fallbackTitle={getawayDetails.title}
					description={getawayDetails.metaDescription}
					fallbackDescription={getawayDetails.subtitle}
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
					page3Title={getawayDetails.title}
					page3Url={canonicalUrl}
				/>
				{/* Una fitxa és un lloc, no un article: amb `TouristAttraction`
				    o `LodgingBusiness`, Google en pot llegir l'adreça, les
				    coordenades, el telèfon i l'horari. */}
				<ListingRichSnippet
					listing={getawayDetails}
					url={canonicalUrl}
					image={cloudinaryImage(getawayDetails.cover, 1200, 630).src}
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
																		getawayCover.src
																	}
																	srcSet={
																		getawayCover.srcSet
																	}
																	sizes={
																		getawayCover.sizes
																	}
																	alt={
																		getawayDetails.title
																	}
																	className={
																		"w-full h-full object-cover rounded-2xl"
																	}
																	width={
																		getawayCover.width
																	}
																	height={
																		getawayCover.height
																	}
																	loading="eager"
																	fetchpriority="high"
																	decoding="async"
																/>
															</picture>
														</div>
													</FancyboxUtil>
												</SplideSlide>
												{getawayDetails.images
													? getawayDetails.images.map(
															(el, idx) => {
																const image =
																	galleryImage(
																		el
																	);

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
																					<img
																						src={
																							image.src
																						}
																						srcSet={
																							image.srcSet
																						}
																						sizes={
																							image.sizes
																						}
																						alt={`${getawayDetails.title} - ${idx}`}
																						className={
																							"w-full h-full object-cover rounded-2xl"
																						}
																						width={
																							image.width
																						}
																						height={
																							image.height
																						}
																						loading={
																							priority
																						}
																						decoding="async"
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
														__html: withResponsiveImages(
															getawayDetails.description
														),
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
															__html: withResponsiveImages(
																getawayDetails.reasons
															),
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

						{/* Contingut relacionat: les fitxes més properes i, si no n'hi
						    ha prou, les de la destinació o la categoria. */}
						{related ? <RelatedListings {...related} /> : null}
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

/**
 * Les fitxes es generaven a cada visita: 1,1–1,8 s fins al primer byte, també
 * per a Googlebot, i són les 190 pàgines que més entren per cerca. Amb ISR es
 * generen un cop, se serveixen de la cache de Vercel i es refresquen cada dos
 * minuts, com ja fan la portada, les categories i les destinacions.
 */
export async function getStaticPaths() {
	const service = new ContentService();

	// Si l'API no respon en temps de build, no s'ha de tombar tot el build:
	// amb fallback "blocking" les pàgines es generen a la primera visita.
	const safe = async (request) => {
		try {
			return (await request()) || {};
		} catch (err) {
			console.warn(
				"getStaticPaths: no s'han pogut llistar les fitxes, es generaran sota demanda.",
			);
			return {};
		}
	};

	const [activities, places] = await Promise.all([
		safe(() => service.activities()),
		safe(() => service.getAllPlaces()),
	]);

	// `listingPath` dóna la URL canònica, `/{categoria}/{slug}`. Quan el
	// llistat de l'API no porta les categories, torna la ruta de reserva
	// (`/activitats/{slug}`), que no és d'aquesta pàgina i que redirigeix:
	// aquestes fitxes es generen a la primera visita.
	const paths = [];
	// El catàleg pot tenir slugs repetits mentre no hi hagi índex únic, i una
	// ruta repetida fa fallar el build.
	const seen = new Set();
	for (const item of [
		...(activities.allActivities || []),
		...(places.allPlaces || []),
	]) {
		const [categoria, slug] = listingPath(item).split("/").filter(Boolean);
		if (!categoria || !slug) continue;
		if (categoria === "activitats" || categoria === "allotjaments") continue;
		const path = `${categoria}/${slug}`;
		if (seen.has(path)) continue;
		seen.add(path);
		paths.push({ params: { categoria, slug } });
	}

	// "blocking" en lloc de false: amb false, una fitxa publicada des del
	// panell donaria 404 fins al següent desplegament.
	return { paths, fallback: "blocking" };
}

/** Per sota d'aquestes, el bloc «A prop d'aquí» es veu mig buit. */
const MIN_NEARBY_ITEMS = 3;

/**
 * Bloc «A prop d'aquí»: les fitxes més properes per coordenades.
 *
 * Abans depenia de la destinació, que 143 de les 191 fitxes no tenen, i sense
 * destinació queia a fitxes de la mateixa categoria d'arreu de Catalunya.
 * Totes les fitxes tenen coordenades i el llistat resumit de l'API les porta.
 * La destinació, si n'hi ha, queda com a enllaç de la capçalera.
 */
const nearbyBlock = async (service, getaway) => {
	let items = [];
	try {
		items = nearestListings(getaway, await loadListingCatalog(service));
	} catch (error) {
		return null;
	}
	if (items.length < MIN_NEARBY_ITEMS) return null;

	let destination = null;
	const destinationIds = (getaway.destinations || []).map(idOf);
	if (destinationIds.length) {
		try {
			destination =
				((await service.getDestinations()) || []).find((item) =>
					destinationIds.includes(String(item._id)),
				) || null;
		} catch (error) {
			destination = null;
		}
	}

	const locality = getaway.activity_locality || getaway.place_locality;
	return {
		eyebrow: "A prop d'aquí",
		title: locality
			? `Més escapades a prop de ${locality}`
			: "Més escapades a prop",
		description:
			"Allotjaments i experiències de la mateixa zona, per completar l'escapada.",
		...(destination
			? {
					href: `/destinacions/${destination.slug}`,
					linkLabel: "Veure tota la destinació",
			  }
			: {}),
		items: items.map(toListingCard),
	};
};

/** Reserva: el que torna la destinació, com abans. */
const destinationBlock = async (service, getaway) => {
	if (!getaway.destinations?.length) return null;
	try {
		const results = await service.getRelatedResultsByDestinationsIds(
			getaway.destinations.toString(),
		);
		// La destinació retorna també la fitxa que s'està mirant.
		const result = (results || [])
			.map((item) => ({
				...item,
				relatedResults: (item.relatedResults || []).filter(
					(listing) => listing.slug !== getaway.slug,
				),
			}))
			.find((item) => item.relatedResults.length > 0);
		if (!result) return null;
		return {
			eyebrow: "A prop d'aquí",
			title: `Més escapades a ${result.title}`,
			description: "Altres allotjaments i experiències de la mateixa zona.",
			href: `/destinacions/${result.slug}`,
			linkLabel: "Veure tota la destinació",
			items: result.relatedResults,
		};
	} catch (error) {
		return null;
	}
};

/** Última reserva: escapades destacades de la mateixa categoria. */
const categoryBlock = async (service, getaway) => {
	const heading = categoryHeadingFor(getaway.categories);
	if (!heading) return null;
	try {
		const items = (
			(await service.getFeaturedGetawaysByCategory(getaway.categories[0])) ||
			[]
		).filter((item) => item.slug !== getaway.slug);
		if (!items.length) return null;
		return {
			eyebrow: "Del mateix estil",
			title: `Més ${heading.title.charAt(0).toLowerCase()}${heading.title.slice(1)}`,
			description: "Altres escapades de la mateixa categoria.",
			href: `/${heading.slug}`,
			linkLabel: "Veure tota la categoria",
			items,
		};
	} catch (error) {
		return null;
	}
};

export async function getStaticProps({ params, locale }) {
	const service = new ContentService();
	const esTraduit = Boolean(locale) && locale !== DEFAULT_LOCALE;
	// En castellà, tant el segment de categoria com el slug de la fitxa
	// arriben traduïts i l'API no els coneix: es desfà el camí amb els
	// catàlegs, que ja estan a la memòria intermèdia del mòdul.
	const categoryDetails = esTraduit
		? findBySlug(await service.getCategories(), params.categoria, locale)
		: await service.getCategoryDetails(params.categoria);
	const slugCatala = esTraduit
		? findBySlug(await loadListingCatalog(service), params.slug, locale)
				?.slug
		: params.slug;
	const activityDetails = slugCatala
		? await service.activityDetails(slugCatala)
		: null;
	const placeDetails = slugCatala
		? await service.getPlaceDetails(slugCatala)
		: null;
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
			revalidate: 120,
		};
	}

	// La fitxa mai ha de quedar sense sortida cap a més contingut: primer les
	// més properes; si no n'hi ha prou, les de la destinació, i si tampoc, les
	// de la mateixa categoria.
	const related =
		(await nearbyBlock(service, getawayDetails)) ||
		(await destinationBlock(service, getawayDetails)) ||
		(await categoryBlock(service, getawayDetails));

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
			getawayDetails: localized(getawayDetails, locale, FIELDS.listing),
			categoryDetails: localized(categoryDetails, locale, FIELDS.category),
			checkedCharacteristics,
			related,
		},
		revalidate: 120,
	};
}

export default GetawayListing;
