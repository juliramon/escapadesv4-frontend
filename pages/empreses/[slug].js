import { useContext, useEffect, useState } from "react";
import NavigationBar from "../../components/global/NavigationBar";
import { Container, Row, Button, Spinner } from "react-bootstrap";
import ContentService from "../../services/contentService";
import EditOrganizationModal from "../../components/modals/EditOrganizationModal";
import Link from "next/link";
import PublicContentBox from "../../components/listings/PublicContentBox";
import SignUpModal from "../../components/modals/SignUpModal";
import UserContext from "../../contexts/UserContext";
import { useRouter } from "next/router";
import Head from "next/head";
import Error404 from "../../components/global/Error404";
import GoogleMapReact from "google-map-react";

const OrganizationProfile = ({ organizationData }) => {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const initialState = {
    joinedYear: 0,
    organizationProfile: {},
    isOrganizationAvailable: false,
    activities: [],
    places: [],
    isFetching: false,
    hasListings: false,
    hasActivities: false,
    hasPlaces: false,
    activeTab: "activities",
    profileCover: "",
    isCoverReadyToUpload: false,
  };

  const [state, setState] = useState(initialState);
  const [queryId, setQueryId] = useState(null);

  useEffect(() => {
    if (router && router.query) {
      setQueryId(router.query.id);
    }
  }, [router]);

  const service = new ContentService();

  const [modalVisibility, setModalVisibility] = useState(false);
  const [modalVisibilityOffpage, setModalVisibilityOffpage] = useState(false);
  const handleModalVisibility = () => setModalVisibility(true);
  const hideModalVisibility = () => setModalVisibility(false);
  const handleModalVisibilityOffpage = () => setModalVisibilityOffpage(true);
  const hideModalVisibilityOffpage = () => setModalVisibilityOffpage(false);

  useEffect(() => {
    const fetchData = async () => {
      let hasListings, hasActivities, hasPlaces, yearJoined;
      organizationData.organizationActivities.length > 0
        ? (hasActivities = true)
        : (hasActivities = false);
      organizationData.organizationPlaces.length > 0
        ? (hasPlaces = true)
        : (hasPlaces = false);
      organizationData.organizationActivities.length > 0 ||
      organizationData.organizationPlaces.length > 0
        ? (hasListings = true)
        : (hasListings = false);

      const getJoinedDate = () => {
        const joinedDate = new Date(
          organizationData.organizationDetails.createdAt
        );
        return (yearJoined = joinedDate.getFullYear());
      };
      getJoinedDate();
      setState({
        ...state,
        organizationProfile: organizationData.organizationDetails,
        joinedYear: yearJoined,
        isOrganizationAvailable: true,
        activities: organizationData.organizationActivities,
        places: organizationData.organizationPlaces,
        hasListings: hasListings,
        hasActivities: hasActivities,
        hasPlaces: hasPlaces,
      });
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryId, organizationData]);

  const fetchData = async () => {
    setState({ ...state, isFetching: true });
    const organizationData = await service.organizationData(router.query.slug);
    let hasListings, hasActivities, hasPlaces;
    organizationData.organizationActivities.length > 0
      ? (hasActivities = true)
      : (hasActivities = false);
    organizationData.organizationPlaces.length > 0
      ? (hasPlaces = true)
      : (hasPlaces = false);
    organizationData.organizationActivities.length > 0 ||
    organizationData.organizationPlaces.length > 0
      ? (hasListings = true)
      : (hasListings = false);
    setState({
      ...state,
      activities: organizationData.organizationActivities,
      places: organizationData.organizationPlaces,
      isFetching: false,
      hasListings: hasListings,
      hasActivities: hasActivities,
      hasPlaces: hasPlaces,
    });
  };

  let listings, contentType, linkTo, noResultsCTA;

  switch (state.activeTab) {
    case "activities":
      contentType = "activitat";
      linkTo = "/nova-activitat";
      noResultsCTA = (
        <Link href={linkTo} className="buttonDark">
          <a>Anunciar {contentType}</a>
        </Link>
      );
      break;
    case "places":
      contentType = "allotjament";
      linkTo = "/place-composer";
      noResultsCTA = (
        <Link to={linkTo} className="buttonDark">
          Add {contentType}
        </Link>
      );
      break;
    default:
      contentType = "getaway";
      linkTo = "/nova-activitat";
      noResultsCTA = (
        <Button
          className="btn btn-m btn-dark text-center"
          onClick={() => handleModalVisibility()}
        >
          Anunciar nova escapada
        </Button>
      );
  }

  let mainButton, noresults;
  if (user && user !== "null") {
    if (user._id === state.organizationProfile.owner) {
      mainButton = (
        <Button
          className="btn btn-m btn-dark text-center sidebar"
          onClick={() => handleModalVisibility()}
        >
          Editar perfil
        </Button>
      );
      noresults = (
        <div className="box empty d-flex">
          <div className="media">
            <img src="../../no-results.svg" alt="Graphic no results" />
          </div>
          <div className="text">
            <p>
              Oh no, això està molt buit.
              <br />
              Anuncia una {contentType} per a tenir més visibilitat.
            </p>
            {noResultsCTA}
          </div>
        </div>
      );
    } else {
      noresults = (
        <div className="box empty d-flex">
          <div className="media">
            <img src="../../no-results.svg" alt="Graphic no results" />
          </div>
          <div className="text">
            <p>
              <span className="profile-owner-name">
                <b>{state.organizationProfile.orgName}</b>
              </span>{" "}
              encara no ha publicat cap {contentType}.
              <br />
              Torna a intentar-ho més endavant.
            </p>
          </div>
        </div>
      );
    }
  } else {
    noresults = (
      <div className="box empty d-flex">
        <div className="media">
          <img src="../../no-results.svg" alt="Graphic no results" />
        </div>
        <div className="text">
          <p>
            <span className="profile-owner-name">
              <b>{state.organizationProfile.orgName}</b>
            </span>{" "}
            encara no ha publicat cap {contentType}.
            <br />
            Torna a intentar-ho més endavant.
          </p>
        </div>
      </div>
    );
  }

  if (state.hasListings === true) {
    if (state.activeTab === "activities") {
      if (state.hasActivities === true) {
        listings = state.activities.map((el) => (
          <PublicContentBox
            key={el._id}
            type={el.type}
            slug={el.slug}
            id={el._id}
            cover={el.images[0]}
            title={el.title}
            subtitle={el.subtitle}
            location={`${
              el.activity_locality === undefined ? "" : el.activity_locality
            } ${el.activity_locality === undefined ? "" : ","} ${
              el.activity_province || el.activity_state
            }, ${el.activity_country}`}
            website={el.website}
            phone={el.phone}
          />
        ));
      } else {
        listings = noresults;
      }
    }
    if (state.activeTab === "places") {
      if (state.hasPlaces === true) {
        listings = state.places.map((el) => (
          <PublicContentBox
            key={el._id}
            type={el.type}
            slug={el.slug}
            id={el._id}
            cover={el.cover}
            title={el.title}
            subtitle={el.subtitle}
            location={`${
              el.place_locality === undefined ? "" : el.place_locality
            }${el.place_locality === undefined ? "" : ","} ${
              el.place_province || el.place_state
            }, ${el.place_country}`}
            website={el.website}
            phone={el.phone}
          />
        ));
      } else {
        listings = noresults;
      }
    }
  } else {
    listings = noresults;
  }

  const activeTab = {
    backgroundColor: "#abc3f4",
    borderRadius: "8px",
    cursor: "pointer",
    color: "#0d1f44",
    fontWeight: "700",
  };

  const handleFileUpload = async (e) => {
    const fileToUpload = e.target.files[0];
    const uploadData = new FormData();
    uploadData.append("imageUrl", fileToUpload);
    const uploadedFile = await service.uploadFile(uploadData);
    setState({
      ...state,
      profileCover: uploadedFile.path,
      isCoverReadyToUpload: true,
    });
  };

  let editCoverButton;
  if (user && user !== "null") {
    if (state.organizationProfile) {
      if (user._id === state.organizationProfile.owner) {
        editCoverButton = (
          <label className="edit-cover">
            <input type="file" onChange={handleFileUpload} />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-photo"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#ffffff"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <line x1="15" y1="8" x2="15.01" y2="8" />
              <rect x="4" y="4" width="16" height="16" rx="3" />
              <path d="M4 15l4 -4a3 5 0 0 1 3 0l 5 5" />
              <path d="M14 14l1 -1a3 5 0 0 1 3 0l 2 2" />
            </svg>{" "}
            Editar portada
          </label>
        );
      }
    }
  }

  const refreshOrganization = () => {
    service.organizationData(router.query.slug).then((res) => {
      setState({
        ...state,
        organizationProfile: res.organizationDetails,
        isCoverReadyToUpload: false,
      });
    });
  };

  const handleSubmit = () => {
    if (state.organizationProfile) {
      const { _id } = state.organizationProfile;
      const { profileCover } = state;
      service.editOrganizationCover(_id, profileCover).then(() => {
        refreshOrganization();
      });
      setState({ ...state, isCoverReadyToUpload: false });
    }
  };

  useEffect(() => {
    if (state.isCoverReadyToUpload === true) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isCoverReadyToUpload]);

  if (state.isFetching === true) {
    return (
      <>
        <Head>
          <title>Carregant...</title>
        </Head>
        <Container className="spinner d-flex justify-space-between">
          <Spinner animation="border" role="status" variant="primary">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </Container>
      </>
    );
  }

  if (state.organizationProfile) {
    if (state.organizationProfile.isRemoved === true) {
      return (
        <>
          <Error404 />
        </>
      );
    }
  }

  let center, getMapOptions, renderMarker;
  let lat = parseFloat(state.organizationProfile.organization_lat);
  let lng = parseFloat(state.organizationProfile.organization_lng);
  if (lat && lng) {
    center = {
      lat: lat,
      lng: lng,
    };
  }
  getMapOptions = (maps) => {
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

  renderMarker = (map, maps) => {
    const position = {
      lat: lat,
      lng: lng,
    };
    new maps.Marker({ position: position, map, title: "Hello" });
  };

  return (
    <>
      <Head>
        <title>
          {state.organizationProfile.orgName} - Escapadesenparella.cat
        </title>
        <link rel="icon" href="/favicon.ico" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta
          name="description"
          content={`${state.organizationProfile.orgName}, una escapada que us encantarà! Descobreix ${state.organizationProfile.orgName} amb nosaltres i sorprèn a la teva parella. Fes clic aquí!`}
        />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`${state.organizationProfile.orgName} - Escapadesenparella.cat`}
        />
        <meta
          property="og:description"
          content={`${state.organizationProfile.orgName}, una escapada que us encantarà! Descobreix ${state.organizationProfile.orgName} amb nosaltres i sorprèn a la teva parella. Fes clic aquí!`}
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
          content={`${state.organizationProfile.orgName} - Escapadesenparella.cat`}
        />
        <meta
          name="twitter:description"
          content={`${state.organizationProfile.orgName}, una escapada que us encantarà! Descobreix ${state.organizationProfile.orgName} amb nosaltres i sorprèn a la teva parella. Fes clic aquí!`}
        />
        <meta name="twitter:image" content={state.organizationProfile.avatar} />
        <meta property="og:image" content={state.organizationProfile.avatar} />
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
      <div id="organizationProfile">
        <NavigationBar
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
          }
          user={user}
        />
        <main>
          <article>
            <Container className="mw-1200">
              <Row>
                <div className="box">
                  <div className="box-wrapper">
                    <div className="col-left">
                      <div className="header-box-wrapper">
                        <div
                          className="cover-background"
                          style={{
                            backgroundImage: `url("${state.organizationProfile.profileCover}")`,
                          }}
                        >
                          {editCoverButton}
                        </div>
                        <div className="header-box">
                          <div className="header-top-bar">
                            <div className="left">
                              <div className="organization-logo">
                                <img
                                  src={state.organizationProfile.orgLogo}
                                  alt={state.organizationProfile.orgName}
                                />
                              </div>
                              <div className="organization-meta">
                                <h1 className="organization-name">
                                  {state.organizationProfile.orgName}
                                </h1>
                                <p className="organization-slug">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="icon icon-tabler icon-tabler-at"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="#00206B"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path stroke="none" d="M0 0h24v24H0z" />
                                    <circle cx="12" cy="12" r="4" />
                                    <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0v-1.5a9 9 0 1 0 -5.5 8.28" />
                                  </svg>{" "}
                                  {state.organizationProfile.slug || "slug"} ·
                                  Verificat
                                </p>
                              </div>
                            </div>
                            <div className="right">
                              <div className="main-button">{mainButton}</div>
                            </div>
                          </div>
                          <div className="header-bottom-bar">
                            <p>{state.organizationProfile.description}</p>
                          </div>
                          <div className="filter-bar">
                            <Button
                              className="d-flex align-items-center justify-content-center"
                              variant="none"
                              style={
                                state.activeTab === "activities"
                                  ? activeTab
                                  : null
                              }
                              onClick={() =>
                                setState({
                                  ...state,
                                  activeTab: "activities",
                                })
                              }
                            >
                              Activitats ({state.activities.length || 0})
                            </Button>
                            <Button
                              variant="none"
                              className="d-flex align-items-center justify-content-center"
                              style={
                                state.activeTab === "places" ? activeTab : null
                              }
                              onClick={() =>
                                setState({ ...state, activeTab: "places" })
                              }
                            >
                              Allotjaments ({state.places.length || 0})
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="content-box">
                        <div className="listings-wrapper">{listings}</div>
                      </div>
                    </div>
                    <aside className="col-right">
                      <div className="box-right">
                        <h3>Informació de contacte</h3>
                        <ul>
                          <li>
                            <Link href={`${state.organizationProfile.website}`}>
                              <a>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="icon icon-tabler icon-tabler-device-laptop"
                                  width="22"
                                  height="22"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="#3a4887"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                  ></path>
                                  <line x1="3" y1="19" x2="21" y2="19"></line>
                                  <rect
                                    x="5"
                                    y="6"
                                    width="14"
                                    height="10"
                                    rx="1"
                                  ></rect>
                                </svg>
                                {state.organizationProfile.website}
                              </a>
                            </Link>
                          </li>
                          <li>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="icon icon-tabler icon-tabler-phone-call"
                              width="22"
                              height="22"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="#3a4887"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path stroke="none" d="M0 0h24v24H0z"></path>
                              <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2"></path>
                              <path d="M15 7a2 2 0 0 1 2 2"></path>
                              <path d="M15 3a6 6 0 0 1 6 6"></path>
                            </svg>
                            {state.organizationProfile.phone}
                          </li>
                          <li>
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
                              <path stroke="none" d="M0 0h24v24H0z"></path>
                              <circle cx="12" cy="11" r="3"></circle>
                              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1 -2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z"></path>
                            </svg>
                            {
                              state.organizationProfile
                                .organization_full_address
                            }
                          </li>
                        </ul>
                        <div className="profile-map">
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
                      </div>
                    </aside>
                  </div>
                </div>
              </Row>
            </Container>
          </article>
        </main>
        <EditOrganizationModal
          organizationDetails={organizationData.organizationDetails}
          visibility={modalVisibility}
          hideModal={() => hideModalVisibility()}
        />
        <SignUpModal
          visibility={modalVisibilityOffpage}
          hideModal={() => hideModalVisibilityOffpage()}
        />
      </div>
    </>
  );
};

export async function getServerSideProps(req) {
  const service = new ContentService();
  const organizationData = await service.organizationData(req.query.slug);
  return {
    props: {
      organizationData: organizationData,
    },
  };
}

export default OrganizationProfile;
