import Head from "next/head";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import NavigationBar from "../../components/global/NavigationBar";
import ContentService from "../../services/contentService";
import { Toast } from "react-bootstrap";
import Link from "next/link";
import GoogleMapReact from "google-map-react";
import SignUpModal from "../../components/modals/SignUpModal";
import UserContext from "../../contexts/UserContext";
import ShareModal from "../../components/modals/ShareModal";
import Footer from "../../components/global/Footer";
import FetchingSpinner from "../../components/global/FetchingSpinner";

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

  const [shareModalVisibility, setShareModalVisibility] = useState(false);
  const handleShareModalVisibility = () => setShareModalVisibility(true);
  const hideShareModalVisibility = () => setShareModalVisibility(false);

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

  const shareButton = (
    <div className="px-4" onClick={() => handleShareModalVisibility()}>
      <button className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-share mr-1"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="6" r="3" />
          <circle cx="18" cy="18" r="3" />
          <line x1="8.7" y1="10.7" x2="15.3" y2="7.3" />
          <line x1="8.7" y1="13.3" x2="15.3" y2="16.7" />
        </svg>
        <span>Compartir</span>
      </button>
    </div>
  );

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
      <li key={idx} className="place-hour">
        {hour}
      </li>
    ));
    hasOpeningHours = (
      <div className="mt-5">
        <ul className="listing-activity-hours-list">
          <li className="flex items-center font-bold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-calendar"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#00206B"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <rect x="4" y="5" width="16" height="16" rx="2" />
              <line x1="16" y1="3" x2="16" y2="7" />
              <line x1="8" y1="3" x2="8" y2="7" />
              <line x1="4" y1="11" x2="20" y2="11" />
              <line x1="11" y1="15" x2="12" y2="15" />
              <line x1="12" y1="15" x2="12" y2="18" />
            </svg>
            Horari d'obertura
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
    <span>{region}</span>
  ));

  return (
    <>
      <Head>
        <title>{state.place.metaTitle} - Escapadesenparella.cat</title>
        <link rel="icon" href="/favicon.ico" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="description" content={`${state.place.metaDescription}`} />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`${state.place.metaTitle} - Escapadesenparella.cat`}
        />
        <meta
          property="og:description"
          content={`${state.place.metaDescription}`}
        />
        <meta
          property="url"
          content={`https://escapadesenparella.cat${router.asPath}`}
        />
        <meta property="og:site_name" content="Escapadesenparella.cat" />
        <meta property="og:locale" content="ca_ES" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${state.place.metaTitle} - Escapadesenparella.cat`}
        />
        <meta
          name="twitter:description"
          content={`${state.place.metaDescription}`}
        />
        <meta name="twitter:image" content={state.place.images[0]} />
        <meta property="og:image" content={state.place.images[0]} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:heigth" content="1200" />
        <link
          rel="canonical"
          href={`https://escapadesenparella.cat${router.asPath}`}
        />
        <link href={`https://escapadesenparella.cat`} rel="home" />
        <meta property="fb:pages" content="1725186064424579" />
        <meta
          name="B-verify"
          content="756319ea1956c99d055184c4cac47dbfa3c81808"
        />
      </Head>
      <div id="listingPage">
        <NavigationBar
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
          }
          user={user}
        />
        <main>
          {state.showBookmarkToast ? toast : null}
          <article>
            {/* Listing header */}
            <section className="pt-12 md:pt-16">
              <div className="container">
                <div className="w-full flex flex-wrap items-center">
                  <div className="w-full md:w-1/2">
                    <h1>{title}</h1>
                    <ul className="flex flex-wrap items-center p-0 -mx-2 mt-3">
                      <li className="flex flex-wrap items-center px-2">
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
                      <li className="flex flex-wrap items-center px-2">
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
                  <div className="w-full md:w-1/2">
                    <div className="flex flex-wrap justify-end items-center -mx-4">
                      {bookmarkButton}
                      {shareButton}
                    </div>
                  </div>
                  <div className="w-full mt-1">
                    <div className="grid grid-cols-4 grid-rows-1 gap-0.5 rounded-lg overflow-hidden">
                      <div className="row-start-1 col-start-1 row-span-2 col-span-2 rounded-l overflow-hidden">
                        <picture>
                          <img
                            src={state.place.images[0]}
                            className="w-full h-full object-cover"
                          />
                        </picture>
                      </div>
                      <div className="row-start-1 col-start-3 row-span-1 col-span-1 overflow-hidden">
                        <picture>
                          <img
                            src={state.place.images[1]}
                            className="w-full h-full object-cover"
                          />
                        </picture>
                      </div>
                      <div className="row-start-1 col-start-4 row-span-1 col-span-1 rounded-tr overflow-hidden">
                        <picture>
                          <img
                            src={state.place.images[2]}
                            className="w-full h-full object-cover"
                          />
                        </picture>
                      </div>
                      <div className="row-start-2 col-start-3 row-span-1 col-span-1 overflow-hidden">
                        <picture>
                          <img
                            src={state.place.images[3]}
                            className="w-full h-full object-cover"
                          />
                        </picture>
                      </div>
                      <div className="row-start-2 col-start-4 row-span-1 col-span-1 rounded-br overflow-hidden">
                        <picture>
                          <img
                            src={state.place.images[4]}
                            className="w-full h-full object-cover"
                          />
                        </picture>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="pt-10 pb-12 md:pb-16">
              <div className="container">
                <div className="w-full lg:w-9/12 mx-auto ">
                  <div className="flex flex-wrap items-start -mx-6">
                    <div className="w-full lg:w-8/12 px-6 mx-auto">
                      <div className="pb-5">
                        <h2 className="w-9/12">{subtitle}</h2>
                        <div className="border-y border-primary-200 my-8 py-5">
                          <div className="flex flex-wrap items-start">
                            <div className="pb-6">
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
                                escapades
                              </p>
                            </div>
                            <div className="pb-5">
                              <p className="text-base text-primary-500 font-semibold mb-0.5">
                                L'
                                {state.place.type == "place"
                                  ? "allotjament"
                                  : "activitat"}{" "}
                                es troba a la província de {placeRegion}
                              </p>
                            </div>
                            <div className="pb-5">
                              <p className="text-base text-primary-500 font-semibold mb-0.5">
                                L'
                                {state.place.type == "place"
                                  ? "allotjament"
                                  : "activitat"}{" "}
                                té un preu aproximat de {state.place.price} € la
                                nit
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h3 className="font-normal text-xl text-primary-500 opacity-60">
                            Ideal per a una...
                          </h3>
                          <ul className="flex flex-wrap items-center w-full mt-3 -mx-1 p-0 mb-0">
                            {placeCategories}
                          </ul>
                        </div>
                        <div className="mt-4">
                          <h3 className="font-normal text-xl text-primary-500 opacity-60">
                            Estació de l'any recomanada
                          </h3>
                          <ul className="flex flex-wrap items-center w-full mt-3 -mx-1 p-0 mb-0">
                            {placeSeasons}
                          </ul>
                        </div>
                        {state.organization ? (
                          <div className="listing-owner">
                            <Link href={`/empreses/${state.organization.slug}`}>
                              <a>
                                <div className="avatar">
                                  <img
                                    src={state.organization.orgLogo}
                                    alt={state.organization.orgName}
                                  />
                                </div>
                                <p className="listing-owner-name">
                                  {state.organization.orgName}
                                </p>
                              </a>
                            </Link>
                          </div>
                        ) : null}
                      </div>
                      <div className="mt-8">{description}</div>
                    </div>
                    <aside className="w-full lg:w-4/12 px-6 static top-0 mt-5 md:mt-0">
                      <div className="p-5 rounded-md shadow-lg shadow-primary-300">
                        <div className="w-full h-56 rounded overflow-hidden">
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
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="icon icon-tabler icon-tabler-device-laptop"
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
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="icon icon-tabler icon-tabler-phone-call"
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
                        <ul className="listing-details-list">
                          <li className="listing-location">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="icon icon-tabler icon-tabler-map-pin"
                              width="22"
                              height="22"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="#00206B"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path stroke="none" d="M0 0h24v24H0z" />
                              <circle cx="12" cy="11" r="3" />
                              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1 -2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
                            </svg>
                            {state.place.place_full_address}
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
        <Footer
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
          }
        />
        <SignUpModal
          visibility={modalVisibility}
          hideModal={hideModalVisibility}
        />
        <ShareModal
          visibility={shareModalVisibility}
          hideModal={hideShareModalVisibility}
          url={urlToShare}
        />
      </div>
    </>
  );
};

export async function getStaticPaths() {
  const service = new ContentService();

  // Call an external API endpoint to get posts
  const { allPlaces } = await service.getAllPlaces();

  // Get the paths we want to pre-render based on posts
  const paths = allPlaces.map((place) => ({
    params: { slug: place.slug },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const service = new ContentService();
  const placeDetails = await service.getPlaceDetails(params.slug);
  return {
    props: {
      placeDetails,
    },
  };
}

export default PlaceListing;
