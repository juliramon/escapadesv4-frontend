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

const Dashboard = () => {
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
    allListings: [],
    activities: [],
    places: [],
    stories: [],
    isFetching: false,
    hasListings: false,
    hasActivities: false,
    hasPlaces: false,
    hasStories: false,
    sortedTitle: false,
    activeTab: "all",
  };
  const [state, setState] = useState(initialState);
  const [modalVisibility, setModalVisibility] = useState(false);
  const handleModalVisibility = () => setModalVisibility(true);
  const hideModalVisibility = () => setModalVisibility(false);

  const service = new ContentService();

  useEffect(() => {
    const fetchData = async () => {
      setState({ ...state, isFetching: true });
      const userActivities = await service.userActivities(user._id);
      const userPlaces = await service.getUserPlaces(user._id);
      const userStories = await service.getUserStories(user._id);
      let getAllListings = [];
      let hasListings, hasActivities, hasPlaces, hasStories;
      userActivities.length > 0
        ? (hasActivities = true)
        : (hasActivities = false);
      userPlaces.length > 0 ? (hasPlaces = true) : (hasPlaces = false);
      userStories.length > 0 ? (hasStories = true) : (hasStories = false);
      userActivities.length > 0 ||
      userPlaces.length > 0 ||
      userStories.length > 0
        ? (hasListings = true)
        : (hasListings = false);
      userActivities.map((el) => getAllListings.push(el));
      userPlaces.map((el) => getAllListings.push(el));
      userStories.map((el) => getAllListings.push(el));
      setState({
        ...state,
        allListings: getAllListings,
        activities: userActivities,
        places: userPlaces,
        stories: userStories,
        isFetching: false,
        hasListings: hasListings,
        hasActivities: hasActivities,
        hasPlaces: hasPlaces,
        hasStories: hasStories,
      });
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = useCallback(async () => {
    setState({ ...state, isFetching: true });
    const userActivities = await service.userActivities(user._id);
    const userPlaces = await service.getUserPlaces(user._id);
    const userStories = await service.getUserStories(user._id);
    let hasListings, hasActivities, hasPlaces, hasStories;
    userActivities.length > 0
      ? (hasActivities = true)
      : (hasActivities = false);
    userPlaces.length > 0 ? (hasPlaces = true) : (hasPlaces = false);
    userStories.length > 0 ? (hasStories = true) : (hasStories = false);
    userActivities.length > 0 || userPlaces.length > 0 || userStories.length > 0
      ? (hasListings = true)
      : (hasListings = false);
    let getAllListings = [];
    userActivities.map((el) => getAllListings.push(el));
    userPlaces.map((el) => getAllListings.push(el));
    userStories.map((el) => getAllListings.push(el));
    setState({
      ...state,
      allListings: getAllListings,
      activities: userActivities,
      places: userPlaces,
      stories: userStories,
      isFetching: false,
      hasListings: hasListings,
      hasActivities: hasActivities,
      hasPlaces: hasPlaces,
      hasStories: hasStories,
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
    if (state.activeTab === "all") {
      arrToSort = state.allListings;
      listToSort = "allListings";
      listings = state.allListings.map((el) => (
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
        <title>Gestor - Escapadesenparella.cat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div id="dashboard">
        <NavigationBar
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
          }
          user={user}
        />
        <Container fluid className="top-nav">
          <div className="top-nav-wrapper">
            <h1 className="top-nav-title db mw-1600">Gestor</h1>
          </div>
        </Container>
        <Container fluid className="mw-1600">
          <Row>
            <div className="box d-flex">
              <div className="col left">
                <ul>
                  <li className="list-title">Publicacions</li>
                  <li
                    className="list-item"
                    style={state.activeTab === "all" ? activeTab : null}
                    onClick={() => setState({ ...state, activeTab: "all" })}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-layout-list"
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
                      <rect x="4" y="4" width="16" height="6" rx="2" />
                      <rect x="4" y="14" width="16" height="6" rx="2" />
                    </svg>
                    Totes
                  </li>
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

export default Dashboard;
