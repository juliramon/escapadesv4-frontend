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

const AdminPanel = () => {
  const { user } = useContext(UserContext);
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.push("/login");
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
  const handleModalVisibility = () => setModalVisibility(true);
  const hideModalVisibility = () => setModalVisibility(false);

  const service = new ContentService();

  useEffect(() => {
    const fetchData = async () => {
      setState({ ...state, isFetching: true });
      const activities = await service.activities();
      const places = await service.getAllPlaces();
      const stories = await service.getAllStories();
      const users = await service.getAllUsers();
      const categories = [];
      let hasListings,
        hasActivities,
        hasPlaces,
        hasStories,
        hasUsers,
        hasCategories;
      activities.length > 0 ||
      places.length > 0 ||
      stories.length > 0 ||
      users.length > 0 ||
      categories.length > 0
        ? (hasListings = true)
        : (hasListings = false);
      activities.length > 0 ? (hasActivities = true) : (hasActivities = false);
      places.length > 0 ? (hasPlaces = true) : (hasPlaces = false);
      stories.length > 0 ? (hasStories = true) : (hasStories = false);
      users.length > 0 ? (hasUsers = true) : (hasUsers = false);
      categories.length > 0 ? (hasCategories = true) : (hasCategories = false);
      setState({
        ...state,
        activities: activities,
        places: places,
        stories: stories,
        users: users,
        categories: categories,
        isFetching: false,
        hasListings: hasListings,
        hasActivities: hasActivities,
        hasPlaces: hasPlaces,
        hasStories: hasStories,
        hasUsers: hasUsers,
        hasCategories: hasCategories,
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
    const categories = [];
    let hasListings,
      hasActivities,
      hasPlaces,
      hasStories,
      hasUsers,
      hasCategories;
    activities.length > 0 ||
    places.length > 0 ||
    stories.length > 0 ||
    users.length > 0 ||
    categories.length > 0
      ? (hasListings = true)
      : (hasListings = false);
    activities.length > 0 ? (hasActivities = true) : (hasActivities = false);
    places.length > 0 ? (hasPlaces = true) : (hasPlaces = false);
    stories.length > 0 ? (hasStories = true) : (hasStories = false);
    users.length > 0 ? (hasUsers = true) : (hasUsers = false);
    categories.length > 0 ? (hasCategories = true) : (hasCategories = false);
    setState({
      ...state,
      activities: activities,
      places: places,
      stories: stories,
      users: users,
      categories: categories,
      isFetching: false,
      hasListings: hasListings,
      hasActivities: hasActivities,
      hasPlaces: hasPlaces,
      hasStories: hasStories,
      hasUsers: hasUsers,
      hasCategories: hasCategories,
    });
  }, [service, state]);

  if (state.isFetching === true && state.hasListings === false) {
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
          <a className="btn btn-primary text-center">Recomanar {contentType}</a>
        </Link>
      );
      break;
    case "places":
      contentType = "allotjament";
      linkTo = "/nou-allotjament";
      noResultsCTA = (
        <Link href={linkTo}>
          <a className="btn btn-primary text-center">Recomanar {contentType}</a>
        </Link>
      );
      break;
    case "stories":
      contentType = "història";
      linkTo = "/nova-historia";
      noResultsCTA = (
        <Link href={linkTo}>
          <a className="btn btn-primary text-center">Publicar {contentType}</a>
        </Link>
      );
      break;
    default:
      contentType = "getaway";
      linkTo = "/nova-activitat";
      noResultsCTA = (
        <Button
          className="btn btn-primary text-center"
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
        arrToSort = state.users;
        listings = state.users.map((el) => (
          <ContentBox
            key={el._id}
            image={el.avatar}
            title={el.fullName}
            subtitle={el.email}
          />
        ));
      } else {
        filterBox = null;
        listings = noresults;
      }
      if (state.activeTab === "categories") {
        if (state.hasCategories === true) {
        }
      }
    }
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

  return (
    <>
      <Head>
        <title>Panell d'administració - Escapadesenparella.cat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div id="dashboard">
        <NavigationBar
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/c_scale,q_100,w_135/v1600008855/getaways-guru/static-files/logo-getaways-guru_vvbikk.svg"
          }
          user={user}
        />
        <Container fluid className="top-nav">
          <div className="top-nav-wrapper">
            <h1 className="top-nav-title db mw-1600">Panell d'administració</h1>
          </div>
        </Container>
        <Container fluid className="mw-1600">
          <Row>
            <div className="box d-flex">
              <div className="col left">
                <ul>
                  <li className="list-title">Continguts</li>
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
                        className="btn btn-primary text-center sidebar"
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
      </div>
    </>
  );
};

export default AdminPanel;
