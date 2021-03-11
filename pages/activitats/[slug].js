import Head from "next/head";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import NavigationBar from "../../components/global/NavigationBar";
import ContentService from "../../services/contentService";
import { Container, Row, Spinner, Toast, Col } from "react-bootstrap";
import Link from "next/link";
import GoogleMapReact from "google-map-react";
import SignUpModal from "../../components/modals/SignUpModal";
import UserContext from "../../contexts/UserContext";
import ShareModal from "../../components/modals/ShareModal";

const ActivityListing = () => {
  const { user } = useContext(UserContext);
  const router = useRouter();

  const urlToShare = `https://escapadesenparella.cat/activitats/${router.query.slug}`;

  console.log(router);

  const initialState = {
    activity: {},
    isActivityLoaded: false,
    owner: {},
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
        const activityDetails = await service.activityDetails(
          router.query.slug
        );
        let bookmarkDetails, isBookmarked, isLoaded;
        if (activityDetails.type) {
          isLoaded = true;
        } else {
          isLoaded = false;
        }
        if (userBookmarks) {
          userBookmarks.forEach((el) => {
            if (
              el.bookmarkActivityRef &&
              el.bookmarkActivityRef._id === activityDetails._id
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
          activity: activityDetails,
          isActivityLoaded: isLoaded,
          owner: activityDetails.owner,
          bookmarkDetails: bookmarkDetails,
          isBookmarked: isBookmarked,
        });
      };
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryId]);

  if (state.isActivityLoaded === false) {
    return (
      <>
        <Head>
          <title>Carregant...</title>
        </Head>
        <Container className="spinner d-flex justify-space-between">
          <Spinner animation="border" role="status" variant="primary">
            <span className="sr-only">Carregant...</span>
          </Spinner>
        </Container>
      </>
    );
  }

  let { title, subtitle, description } = state.activity;

  const bookmarkListing = () => {
    const listingId = state.activity._id;
    const listingType = state.activity.type;
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
        <div
          className="listing-bookmark-wrapper"
          onClick={() => bookmarkListing()}
        >
          <button className="listing-bookmark">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-bookmark"
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
          </button>
          <span>Desar</span>
        </div>
      );
    } else {
      bookmarkButton = (
        <div
          className="listing-bookmark-wrapper"
          onClick={() => bookmarkListing()}
        >
          <button className="listing-bookmark">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-bookmark"
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
              <path
                fill="#0d1f44"
                d="M9 4h6a2 2 0 0 1 2 2v14l-5-3l-5 3v-14a2 2 0 0 1 2 -2"
              />
            </svg>
          </button>
          <span>Esborrar</span>
        </div>
      );
    }
  } else {
    bookmarkButton = (
      <div
        className="listing-bookmark-wrapper"
        onClick={() => handleModalVisibility()}
      >
        <button className="listing-bookmark">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-bookmark"
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
        </button>
        <span>Desa</span>
      </div>
    );
  }

  const shareButton = (
    <div
      className="listing-bookmark-wrapper"
      onClick={() => handleShareModalVisibility()}
    >
      <button className="listing-bookmark">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-share"
          width="44"
          height="44"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="#0d1f44"
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
      </button>
      <span>Compartir</span>
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
    lat: parseFloat(state.activity.activity_lat),
    lng: parseFloat(state.activity.activity_lng),
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
      lat: parseFloat(state.activity.activity_lat),
      lng: parseFloat(state.activity.activity_lng),
    };
    new maps.Marker({ position: position, map, title: "Hello" });
  };

  let coversList;

  if (state.isActivityLoaded === true) {
    coversList = state.activity.images.map((cover, idx) => (
      <div
        key={idx}
        className="cover"
        style={{ backgroundImage: `url(${cover})` }}
      ></div>
    ));
  }

  let activityHours, hasOpeningHours;
  if (state.activity.activity_opening_hours.length > 0) {
    activityHours = state.activity.activity_opening_hours.map((hour, idx) => (
      <li key={idx} className="activity-hour">
        {hour}
      </li>
    ));
    hasOpeningHours = (
      <div className="listing-activity-hours">
        <ul className="listing-activity-hours-list">
          <li className="header">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-calendar"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#2c3e50"
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
          {activityHours}
        </ul>
      </div>
    );
  }

  const activityCategories = state.activity.categories.map((category, idx) => (
    <li key={idx} className="activity-category">
      {category} getaway
    </li>
  ));

  const activitySeasons = state.activity.seasons.map((season, idx) => (
    <li key={idx} className="activity-season">
      {season}
    </li>
  ));

  const activityRegion = state.activity.region.map((region, idx) => (
    <li key={idx} className="activity-region">
      {region}
    </li>
  ));

  return (
    <>
      <Head>
        <title>{state.activity.title} - Escapadesenparella.cat</title>
        <link rel="icon" href="/favicon.ico" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta
          name="description"
          content={`${state.activity.title}, una escapada que us encantarà! Descobreix ${state.activity.title} amb nosaltres i sorprèn a la teva parella. Fes clic aquí!`}
        />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`${state.activity.title} - Escapadesenparella.cat`}
        />
        <meta
          property="og:description"
          content={`${state.activity.title}, una escapada que us encantarà! Descobreix ${state.activity.title} amb nosaltres i sorprèn a la teva parella. Fes clic aquí!`}
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
          content={`${state.activity.title} - Escapadesenparella.cat`}
        />
        <meta
          name="twitter:description"
          content={`${state.activity.title}, una escapada que us encantarà! Descobreix ${state.activity.title} amb nosaltres i sorprèn a la teva parella. Fes clic aquí!`}
        />
        <meta name="twitter:image" content={state.activity.images[0]} />
        <meta property="og:image" content={state.activity.images[0]} />
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
            "https://res.cloudinary.com/juligoodie/image/upload/c_scale,q_100,w_135/v1600008855/getaways-guru/static-files/logo-getaways-guru_vvbikk.svg"
          }
          user={user}
        />
        <main>
          <article>
            <Container className="mw-1200">
              {state.showBookmarkToast ? toast : null}
              <div className="box">
                <section>
                  <Row>
                    <div className="listing-header-wrapper">
                      <Col lg={12}>
                        <div className="listing-header">
                          <div className="col left">
                            <div className="listing-title-wrapper">
                              <h1 className="listing-title">{title}</h1>
                            </div>
                            <div className="listing-meta-bar">
                              <ul>
                                <li className="listing-type">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="icon icon-tabler icon-tabler-route"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="#2c3e50"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path stroke="none" d="M0 0h24v24H0z" />
                                    <circle cx="6" cy="19" r="2" />
                                    <circle cx="18" cy="5" r="2" />
                                    <path d="M12 19h4.5a3.5 3.5 0 0 0 0 -7h-8a3.5 3.5 0 0 1 0 -7h3.5" />
                                  </svg>
                                  <span>{state.activity.type}</span>
                                </li>
                                <li className="listing-rating">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="icon icon-tabler icon-tabler-star"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="#2c3e50"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path stroke="none" d="M0 0h24v24H0z" />
                                    <path d="M12 17.75l-6.172 3.245 1.179-6.873-4.993-4.867 6.9-1.002L12 2l3.086 6.253 6.9 1.002-4.993 4.867 1.179 6.873z" />
                                  </svg>
                                  <span>{state.activity.activity_rating}</span>
                                </li>
                                <li className="listing-location">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="icon icon-tabler icon-tabler-map-pin"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="#2c3e50"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path stroke="none" d="M0 0h24v24H0z" />
                                    <circle cx="12" cy="11" r="3" />
                                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1 -2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
                                  </svg>
                                  <span>{`${
                                    state.activity.activity_locality ===
                                    undefined
                                      ? ""
                                      : state.activity.activity_locality
                                  }${
                                    state.activity.activity_locality ===
                                    undefined
                                      ? ""
                                      : ","
                                  } ${
                                    state.activity.activity_province ||
                                    state.activity.activity_state
                                  }, ${state.activity.activity_country}`}</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="col right">
                            {bookmarkButton}
                            {shareButton}
                          </div>
                        </div>
                        <div className="listing-cover d-flex justify-space-between">
                          {coversList}
                        </div>
                      </Col>
                    </div>
                  </Row>
                </section>
                <section>
                  <Row>
                    <div className="listing-body">
                      <Col lg={7}>
                        <div className="listing-body-wrapper d-flex justify-content-between align-items-center">
                          <p className="listing-subtitle">{subtitle}</p>
                          <div className="listing-owner">
                            <Link href={`/usuaris/${state.owner._id}`}>
                              <a>
                                <div className="avatar">
                                  <img
                                    src={state.owner.avatar}
                                    alt={state.owner.fullName}
                                  />
                                </div>
                                <p className="listing-owner-name">
                                  {state.owner.fullName}
                                </p>
                              </a>
                            </Link>
                          </div>
                        </div>
                        <div className="listing-details-body d-flex">
                          <div className="listing-categories">
                            <span>Ideal per a...</span>
                            <ul>{activityCategories}</ul>
                          </div>
                          <div className="listing-seasons">
                            <span>Estació recomanada...</span>
                            <ul>{activitySeasons}</ul>
                          </div>
                          <div className="d-flex right">
                            <div className="listing-region">
                              <span>Es troba a</span>
                              <ul>{activityRegion}</ul>
                            </div>
                            <div className="listing-duration">
                              <span>Durada</span>
                              {state.activity.duration}{" "}
                              {state.activity.duration > 1 ? "hores" : "hora"}
                            </div>
                            <div className="listing-price">
                              <span>Preu</span>
                              {state.activity.price} €
                            </div>
                          </div>
                        </div>
                        <div className="listing-description">{description}</div>
                      </Col>
                      <Col lg={1}></Col>

                      <Col lg={4}>
                        <aside>
                          <div className="listing-details-box">
                            <div className="listing-map">
                              <GoogleMapReact
                                bootstrapURLKeys={{
                                  key:
                                    "AIzaSyAUENym8OVt2pBPNIMzvYLnXj_C7lIZtSw",
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
                            <div className="buttons">
                              <a
                                href={`http://${state.activity.website}`}
                                className="listing-Website buttonDark"
                                title="Reservar"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="icon icon-tabler icon-tabler-device-laptop"
                                  width="22"
                                  height="22"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="#ffffff"
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
                                  <rect
                                    x="5"
                                    y="6"
                                    width="14"
                                    height="10"
                                    rx="1"
                                  />
                                </svg>
                                Més informació
                              </a>

                              <a
                                href={`tel:${state.activity.phone}`}
                                className="listingPhone buttonLight"
                                title="Trucar"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="icon icon-tabler icon-tabler-phone-call"
                                  width="22"
                                  height="22"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="#2e6ae4"
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
                                  stroke="#2c3e50"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path stroke="none" d="M0 0h24v24H0z" />
                                  <circle cx="12" cy="11" r="3" />
                                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1 -2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
                                </svg>
                                {state.activity.activity_full_address}
                              </li>
                            </ul>
                          </div>
                        </aside>
                      </Col>
                    </div>
                  </Row>
                </section>
              </div>
            </Container>
          </article>
        </main>
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

export default ActivityListing;
