import { useEffect, useState, useCallback, useContext } from "react";
import { Container, Row, Button, Spinner } from "react-bootstrap";
import NavigationBar from "../components/global/NavigationBar";
import ContentService from "../services/contentService";
import ContentBox from "../components/dashboard/ContentBox";
import PublicationModal from "../components/modals/PublicationModal";
import Link from "next/link";
import Head from "next/head";
import UserContext from "../contexts/UserContext";
import { useRouter } from "next/router";
import CreateCategoryModal from "../components/modals/CreateCategoryModal";
import CategoryBox from "../components/dashboard/CategoryBox";
import MetricsBox from "../components/dashboard/MetricsBox";
import UserBox from "../components/dashboard/UserBox";
import FetchingSpinner from "../components/global/FetchingSpinner";
import CreateRegionModal from "../components/modals/CreateRegionModal";

const AdminPanel = () => {
  const { user } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!user || user === "null" || user === undefined) {
      router.push("/login");
    } else {
      if (user) {
        if (user.accountCompleted === false) {
          router.push("/signup/complete-account");
        }
        if (user.hasConfirmedEmail === false) {
          router.push("/signup/confirmacio-correu");
        }
        if (user.userType !== "admin" || !user.userType) {
          router.push("/feed");
        }
      }
    }
  }, [user]);

  if (!user) {
    return (
      <Head>
        <title>Carregant...</title>
      </Head>
    );
  }

  const initialState = {
    activities: [],
    places: [],
    stories: [],
    users: [],
    categories: [],
    isFetching: false,
    hasListings: false,
    hasActivities: false,
    hasPlaces: false,
    hasStories: false,
    hasUsers: false,
    hasCategories: false,
    sortedTitle: false,
    activeTab: "activities",
  };
  const [state, setState] = useState(initialState);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [categoryModalVisibility, setCategoryModalVisibility] = useState(false);
  const [regionModalVisibility, setRegionModalVisibility] = useState(false);

  const handleModalVisibility = () => setModalVisibility(true);
  const hideModalVisibility = () => setModalVisibility(false);

  const handleCategoryModalVisibility = () => setCategoryModalVisibility(true);
  const hideCategoryModalVisibility = () => setCategoryModalVisibility(false);

  const handleRegionModalVisibility = () => setRegionModalVisibility(true);
  const hideRegionModalVisibility = () => setRegionModalVisibility(false);

  const service = new ContentService();

  useEffect(() => {
    const fetchData = async () => {
      setState({ ...state, isFetching: true });
      const activities = await service.activities();
      const places = await service.getAllPlaces();
      const stories = await service.getAllStories();
      const users = await service.getAllUsers();
      const categories = await service.getCategories();
      const regions = await service.getRegions();
      let hasListings,
        hasActivities,
        hasPlaces,
        hasStories,
        hasUsers,
        hasCategories,
        hasRegions;
      activities.length > 0 ||
      places.length > 0 ||
      stories.length > 0 ||
      users.length > 0 ||
      categories.length > 0 ||
      regions.length > 0
        ? (hasListings = true)
        : (hasListings = false);
      activities.length > 0 ? (hasActivities = true) : (hasActivities = false);
      places.length > 0 ? (hasPlaces = true) : (hasPlaces = false);
      stories.length > 0 ? (hasStories = true) : (hasStories = false);
      users.length > 0 ? (hasUsers = true) : (hasUsers = false);
      categories.length > 0 ? (hasCategories = true) : (hasCategories = false);
      regions.length > 0 ? (hasRegions = true) : (hasRegions = false);
      setState({
        ...state,
        activities: activities,
        places: places,
        stories: stories,
        users: users,
        categories: categories,
        regions: regions,
        isFetching: false,
        hasListings: hasListings,
        hasActivities: hasActivities,
        hasPlaces: hasPlaces,
        hasStories: hasStories,
        hasUsers: hasUsers,
        hasCategories: hasCategories,
        hasRegions: hasRegions,
      });
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = useCallback(async () => {
    setState({ ...state, isFetching: true });
    const activities = await service.activities();
    const places = await service.getAllPlaces();
    const stories = await service.getAllStories();
    const users = await service.getAllUsers();
    const categories = await service.getCategories();
    const regions = await service.getRegions();
    let hasListings,
      hasActivities,
      hasPlaces,
      hasStories,
      hasUsers,
      hasCategories,
      hasRegions;
    activities.length > 0 ||
    places.length > 0 ||
    stories.length > 0 ||
    users.length > 0 ||
    categories.length > 0 ||
    regions.length > 0
      ? (hasListings = true)
      : (hasListings = false);
    activities.length > 0 ? (hasActivities = true) : (hasActivities = false);
    places.length > 0 ? (hasPlaces = true) : (hasPlaces = false);
    stories.length > 0 ? (hasStories = true) : (hasStories = false);
    users.length > 0 ? (hasUsers = true) : (hasUsers = false);
    categories.length > 0 ? (hasCategories = true) : (hasCategories = false);
    regions.length > 0 ? (hasRegions = true) : (hasRegions = false);
    setState({
      ...state,
      activities: activities,
      places: places,
      stories: stories,
      users: users,
      categories: categories,
      regions: regions,
      isFetching: false,
      hasListings: hasListings,
      hasActivities: hasActivities,
      hasPlaces: hasPlaces,
      hasStories: hasStories,
      hasUsers: hasUsers,
      hasCategories: hasCategories,
      hasRegions: hasRegions,
    });
  }, [service, state]);

  if (
    (state.isFetching === true && state.hasListings === false) ||
    state.isFetching === true
  ) {
    return <FetchingSpinner />;
  }

  let filterBox,
    listings,
    arrToSort,
    listToSort,
    contentType,
    linkTo,
    noResultsCTA;

  switch (state.activeTab) {
    case "activities":
      contentType = "activitat";
      linkTo = "/nova-activitat";
      noResultsCTA = (
        <Link href={linkTo}>
          <a className="btn btn-m btn-dark text-center">
            Recomanar {contentType}
          </a>
        </Link>
      );
      break;
    case "places":
      contentType = "allotjament";
      linkTo = "/nou-allotjament";
      noResultsCTA = (
        <Link href={linkTo}>
          <a className="btn btn-m btn-dark text-center">
            Recomanar {contentType}
          </a>
        </Link>
      );
      break;
    case "stories":
      contentType = "història";
      linkTo = "/nova-historia";
      noResultsCTA = (
        <Link href={linkTo}>
          <a className="btn btn-m btn-dark text-center">
            Publicar {contentType}
          </a>
        </Link>
      );
      break;
    default:
      contentType = "getaway";
      linkTo = "/nova-activitat";
      noResultsCTA = (
        <Button
          variant="none"
          className="btn btn-m btn-dark text-center"
          onClick={handleModalVisibility}
        >
          Recomanar una escapada
        </Button>
      );
  }

  let noresults = (
    <div className="box empty d-flex">
      <div className="media">
        <img src="../../no-results.svg" alt="Graphic no results" />
      </div>
      <div className="text">
        <p>
          Oh no, això està molt buit.
          <br />
          Inspira als altres amb una primera publicació!
        </p>
        {noResultsCTA}
      </div>
    </div>
  );

  const sortTitle = (arr, listToSort) => {
    if (state.sortedTitle === false || state.sortedTitle === "ZtoA") {
      const sortedArr = arr
        .sort((a, b) => {
          if (a.title.toLowerCase() > b.title.toLowerCase()) {
            return -1;
          }
          if (a.title.toLowerCase() < b.title.toLowerCase()) {
            return 1;
          }
          return 0;
        })
        .reverse();
      setState({ ...state, [listToSort]: sortedArr, sortedTitle: "AtoZ" });
    } else if (state.sortedTitle === "AtoZ") {
      const sortedArr = arr.sort((a, b) => {
        if (a.title.toLowerCase() > b.title.toLowerCase()) {
          return -1;
        }
        if (a.title.toLowerCase() < b.title.toLowerCase()) {
          return 1;
        }
        return 0;
      });
      setState({ ...state, [listToSort]: sortedArr, sortedTitle: "ZtoA" });
    }
  };

  if (state.hasListings === true) {
    if (state.activeTab !== "categories" || state.activeTab !== "users") {
      filterBox = (
        <div className="filter-box d-flex align-items-center justify-content-between">
          <Button variant="none">Imatge</Button>
          <Button
            variant="none"
            className="filter"
            onClick={() => sortTitle(arrToSort, listToSort)}
          >
            Títol
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-arrows-sort"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#212529"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <path d="M3 9l4-4l4 4m-4 -4v14" />
              <path d="M21 15l-4 4l-4-4m4 4v-14" />
            </svg>
          </Button>
          <Button variant="none" className="filter">
            Subtítol
          </Button>
          <Button variant="none" className="filter">
            Data
          </Button>
          <Button variant="none">Accions</Button>
        </div>
      );
    }
    if (state.activeTab === "activities") {
      if (state.hasActivities === true) {
        arrToSort = state.activities;
        listToSort = "activities";
        listings = state.activities.map((el) => (
          <ContentBox
            key={el._id}
            type={el.type}
            slug={el.slug}
            id={el._id}
            image={el.cover}
            title={el.title}
            subtitle={el.subtitle}
            publicationDate={el.createdAt}
            fetchData={fetchData}
          />
        ));
      } else {
        filterBox = null;
        listings = noresults;
      }
    }
    if (state.activeTab === "places") {
      if (state.hasPlaces === true) {
        listToSort = "places";
        arrToSort = state.places;
        listings = state.places.map((el) => (
          <ContentBox
            key={el._id}
            type={el.type}
            slug={el.slug}
            id={el._id}
            image={el.cover}
            title={el.title}
            subtitle={el.subtitle}
            publicationDate={el.createdAt}
            fetchData={fetchData}
          />
        ));
      } else {
        filterBox = null;
        listings = noresults;
      }
    }
    if (state.activeTab === "stories") {
      if (state.hasStories === true) {
        arrToSort = state.stories;
        listings = state.stories.map((el) => (
          <ContentBox
            key={el._id}
            type={el.type}
            slug={el.slug}
            id={el._id}
            image={el.cover}
            title={el.title}
            subtitle={el.subtitle}
            publicationDate={el.createdAt}
            fetchData={fetchData}
          />
        ));
      } else {
        filterBox = null;
        listings = noresults;
      }
    }
    if (state.activeTab === "users") {
      if (state.hasUsers === true) {
        filterBox = (
          <div className="filter-box d-flex align-items-center justify-content-between">
            <Button variant="none">Avatar</Button>
            <Button
              variant="none"
              className="filter"
              onClick={() => sortTitle(arrToSort, listToSort)}
            >
              Nom
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-arrows-sort"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#212529"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <path d="M3 9l4-4l4 4m-4 -4v14" />
                <path d="M21 15l-4 4l-4-4m4 4v-14" />
              </svg>
            </Button>
            <Button variant="none" className="filter">
              Correu electrònic
            </Button>
            <Button variant="none">Accions</Button>
          </div>
        );
        arrToSort = state.users;
        listings = state.users.map((el) => (
          <UserBox
            key={el._id}
            avatar={el.avatar}
            fullName={el.fullName}
            email={el.email}
            slug={el.slug}
          />
        ));
      } else {
        filterBox = null;
        listings = noresults;
      }
    }
    if (state.activeTab === "categories") {
      filterBox = (
        <>
          <Button
            variant="none"
            className="btn btn-m btn-dark"
            onClick={handleCategoryModalVisibility}
          >
            + Afegir nova categoria
          </Button>
          <br />
          <br />
          <div className="filter-box d-flex align-items-center justify-content-between">
            <Button variant="none">Imatge</Button>
            <Button
              variant="none"
              className="filter"
              onClick={() => sortTitle(arrToSort, listToSort)}
            >
              Títol
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-arrows-sort"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#212529"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <path d="M3 9l4-4l4 4m-4 -4v14" />
                <path d="M21 15l-4 4l-4-4m4 4v-14" />
              </svg>
            </Button>
            <Button variant="none" className="filter">
              Subtítol
            </Button>
            <Button variant="none">Accions</Button>
          </div>
        </>
      );
      listings = state.categories.map((el) => (
        <CategoryBox
          key={el._id}
          id={el._id}
          name={el.name}
          pluralName={el.pluralName}
          isPlace={el.isPlace}
          image={el.image}
          title={el.title}
          subtitle={el.subtitle}
          slug={el.slug}
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
  } else {
    filterBox = null;
    listings = noresults;
  }

  if (state.activeTab === "regions") {
    filterBox = (
      <>
        <Button
          variant="none"
          className="btn btn-m btn-dark"
          onClick={handleRegionModalVisibility}
        >
          + Afegir nova regió
        </Button>
        <br />
        <br />
        <div className="filter-box d-flex align-items-center justify-content-between">
          <Button variant="none">Imatge</Button>
          <Button
            variant="none"
            className="filter"
            onClick={() => sortTitle(arrToSort, listToSort)}
          >
            Títol
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-arrows-sort"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#212529"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <path d="M3 9l4-4l4 4m-4 -4v14" />
              <path d="M21 15l-4 4l-4-4m4 4v-14" />
            </svg>
          </Button>
          <Button variant="none" className="filter">
            Subtítol
          </Button>
          <Button variant="none">Accions</Button>
        </div>
      </>
    );
    listings = state.regions.map((el) => (
      <CategoryBox
        key={el._id}
        id={el._id}
        name={el.name}
        pluralName={el.pluralName}
        image={el.image}
        title={el.title}
        subtitle={el.subtitle}
        slug={el.slug}
        seoText={el.seoText}
        icon={el.icon}
        isSponsored={el.isSponsored}
        sponsorURL={el.sponsorURL}
        sponsorLogo={el.sponsorLogo}
        sponsorClaim={el.sponsorClaim}
        fetchData={fetchData}
      />
    ));
  } else {
    filterBox = null;
    listings = noresults;
  }

  const activeTab = {
    backgroundColor: "#abc3f4",
    borderRadius: "8px",
    cursor: "pointer",
    color: "#0d1f44",
  };

  let metrics, metricsList;
  if (state.hasListings) {
    metrics = [
      {
        name: "Activitats",
        value: state.activities.length,
      },
      {
        name: "Allotjaments",
        value: state.places.length,
      },
      {
        name: "Històries",
        value: state.stories.length,
      },
      {
        name: "Usuaris",
        value: state.users.length,
      },
      {
        name: "Categories",
        value: state.categories.length,
      },
      {
        name: "Regions",
        value: state.regions.length,
      },
    ];
    metricsList = metrics.map((el) => (
      <MetricsBox integer={el.value} metricName={el.name} />
    ));
  }

  return (
    <>
      <Head>
        <title>Panell d'administració - Escapadesenparella.cat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div id="dashboard" className="admin-panel">
        <NavigationBar
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
          }
          user={user}
        />
        <Container fluid className="top-nav">
          <div className="top-nav-wrapper">
            <h1 className="top-nav-title db mw-1600">Panell d'administració</h1>
          </div>
        </Container>
        <Container fluid className="mw-1600 metrics">
          <Row>
            <h2>Estadístiques de la plataforma</h2>
            <div className="metrics-list d-flex">{metricsList}</div>
          </Row>
        </Container>
        <Container fluid className="mw-1600">
          <Row>
            <h2>Estadístiques de la plataforma</h2>
          </Row>
          <Row>
            <div className="box d-flex">
              <div className="col left">
                <ul>
                  <li
                    className="list-item"
                    style={state.activeTab === "activities" ? activeTab : null}
                    onClick={() =>
                      setState({ ...state, activeTab: "activities" })
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-route"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#0d1f44"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" />
                      <circle cx="6" cy="19" r="2" />
                      <circle cx="18" cy="5" r="2" />
                      <path d="M12 19h4.5a3.5 3.5 0 0 0 0 -7h-8a3.5 3.5 0 0 1 0 -7h3.5" />
                    </svg>
                    Activitats
                  </li>
                  <li
                    className="list-item"
                    style={state.activeTab === "places" ? activeTab : null}
                    onClick={() => setState({ ...state, activeTab: "places" })}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-bed"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#0d1f44"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" />
                      <path d="M3 7v11m0 -4h18m0 4v-8a2 2 0 0 0 -2 -2h-8v6" />
                      <circle cx="7" cy="10" r="1" />
                    </svg>
                    Allotjaments
                  </li>
                  <li
                    className="list-item"
                    style={state.activeTab === "stories" ? activeTab : null}
                    onClick={() => setState({ ...state, activeTab: "stories" })}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-notebook"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#0d1f44"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" />
                      <path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-11a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1m3 0v18" />
                      <line x1="13" y1="8" x2="15" y2="8" />
                      <line x1="13" y1="12" x2="15" y2="12" />
                    </svg>
                    Històries
                  </li>
                  <li
                    className="list-item"
                    style={state.activeTab === "categories" ? activeTab : null}
                    onClick={() =>
                      setState({ ...state, activeTab: "categories" })
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-tag"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#0d1f44"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M11 3l9 9a1.5 1.5 0 0 1 0 2l-6 6a1.5 1.5 0 0 1 -2 0l-9 -9v-4a4 4 0 0 1 4 -4h4" />
                      <circle cx="9" cy="9" r="2" />
                    </svg>
                    Categories
                  </li>
                  <li
                    className="list-item"
                    style={state.activeTab === "regions" ? activeTab : null}
                    onClick={() => setState({ ...state, activeTab: "regions" })}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-tag"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#0d1f44"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M11 3l9 9a1.5 1.5 0 0 1 0 2l-6 6a1.5 1.5 0 0 1 -2 0l-9 -9v-4a4 4 0 0 1 4 -4h4" />
                      <circle cx="9" cy="9" r="2" />
                    </svg>
                    Regions
                  </li>
                  <li
                    className="list-item"
                    style={state.activeTab === "users" ? activeTab : null}
                    onClick={() => setState({ ...state, activeTab: "users" })}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-users"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#0d1f44"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
                    </svg>
                    Usuaris
                  </li>
                </ul>
                <div className="new">
                  <ul>
                    <li>
                      <Button
                        className="btn btn-m btn-dark text-center sidebar"
                        onClick={handleModalVisibility}
                      >
                        Afegir publicació
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col right">
                {filterBox}
                <div className="content-box-wrapper">{listings}</div>
              </div>
            </div>
          </Row>
        </Container>
        <PublicationModal
          visibility={modalVisibility}
          hideModal={hideModalVisibility}
        />
        <CreateCategoryModal
          visibility={categoryModalVisibility}
          hideModal={hideCategoryModalVisibility}
          fetchData={fetchData}
        />
        <CreateRegionModal
          visibility={regionModalVisibility}
          hideModal={hideRegionModalVisibility}
          fetchData={fetchData}
        />
      </div>
    </>
  );
};

export default AdminPanel;
