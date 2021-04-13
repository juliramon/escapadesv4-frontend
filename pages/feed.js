import Head from "next/head";
import Router, { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Button, Container, Row, Spinner } from "react-bootstrap";
import ContentService from "../services/contentService";
import PublickSquareBox from "../components/listings/PublicSquareBox";
import Link from "next/link";
import NavigationBar from "../components/global/NavigationBar";
import PublicationModal from "../components/modals/PublicationModal";
import UserContext from "../contexts/UserContext";

const Feed = () => {
  const { user } = useContext(UserContext);

  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  const initialState = {
    hasListings: false,
    hasActivities: false,
    hasPlaces: false,
    userCustomActivities: [],
    userCustomPlaces: [],
  };
  const [state, setState] = useState(initialState);

  const service = new ContentService();
  const [modalVisibility, setModalVisibility] = useState(false);
  const handleModalVisibility = () => setModalVisibility(true);
  const hideModalVisibility = () => setModalVisibility(false);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        setState({ ...state, isFetching: true });
        const userCustomActivities = await service.getUserCustomActivities();
        const userCustomPlaces = await service.getUserCustomPlaces();
        let hasActivities, hasPlaces, hasListings;
        userCustomActivities.length > 0
          ? (hasActivities = true)
          : (hasActivities = false);
        userCustomPlaces.length > 0 ? (hasPlaces = true) : (hasPlaces = false);
        userCustomActivities.length > 0 && userCustomPlaces.length > 0
          ? (hasListings = true)
          : (hasListings = false);
        setState({
          ...state,
          hasListings: hasListings,
          hasActivities: hasActivities,
          hasPlaces: hasPlaces,
          userCustomActivities: userCustomActivities,
          userCustomPlaces: userCustomPlaces,
        });
      };
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const resultsToShow = [];
  if (state.userCustomActivities) {
    if (state.userCustomActivities.length > 0) {
      state.userCustomActivities.map((el) => resultsToShow.push(el));
    }
  }
  if (state.userCustomPlaces) {
    if (state.userCustomPlaces.length > 0) {
      state.userCustomPlaces.map((el) => resultsToShow.push(el));
    }
  }

  let resultsList;
  if (!state.hasListings) {
    resultsList = (
      <Container className="spinner d-flex justify-space-between">
        <Spinner animation="border" role="status" variant="primary">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Container>
    );
  } else {
    resultsList = resultsToShow.map((el) => {
      let location;
      if (el.type === "activity") {
        location = (
          <span className="listing-location">{`${
            el.activity_locality === undefined ? "" : el.activity_locality
          }${el.activity_locality === undefined ? "" : ","} ${
            el.activity_province || el.activity_state
          }, ${el.activity_country}`}</span>
        );
      }
      if (el.type === "place") {
        location = (
          <span className="listing-location">{`${
            el.place_locality === undefined ? "" : el.place_locality
          }${el.place_locality === undefined ? "" : ","} ${
            el.place_province || el.place_state
          }, ${el.place_country}`}</span>
        );
      }
      return (
        <PublickSquareBox
          key={el._id}
          type={el.type}
          cover={el.cover}
          title={el.title}
          subtitle={el.subtitle}
          location={location}
          website={el.website}
        />
      );
    });
  }

  let topicsFollowed = [];
  if (user) {
    if (user.typesToFollow.length > 0) {
      user.typesToFollow.map((el) => topicsFollowed.push(el));
    }
    if (user.categoriesToFollow.length > 0) {
      user.categoriesToFollow.map((el) => topicsFollowed.push(el));
    }
    if (user.seasonsToFollow.length > 0) {
      user.seasonsToFollow.map((el) => topicsFollowed.push(el));
    }
    if (user.regionsToFollow.length > 0) {
      user.regionsToFollow.map((el) => topicsFollowed.push(el));
    }
  }

  const topicsList = topicsFollowed.map((el, idx) => (
    <li key={idx}>
      <Link href="/">
        <a>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-hash"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#2c3e50"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" />
            <line x1="5" y1="9" x2="19" y2="9" />
            <line x1="5" y1="15" x2="19" y2="15" />
            <line x1="11" y1="4" x2="7" y2="20" />
            <line x1="17" y1="4" x2="13" y2="20" />
          </svg>{" "}
          {el}
        </a>
      </Link>
    </li>
  ));

  if (!user) {
    return (
      <Head>
        <title>Carregant...</title>
      </Head>
    );
  }

  return (
    <>
      <Head>
        <title>Feed - Escapadesenparella.cat</title>
      </Head>
      <div id="feed">
        <NavigationBar
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/c_scale,q_100,w_135/v1600008855/getaways-guru/static-files/logo-getaways-guru_vvbikk.svg"
          }
          user={user}
        />
        <Container fluid className="mw-1600">
          <Row>
            <div className="box d-flex">
              <div className="col left">
                <div className="user-meta">
                  <div className="user-meta-wrapper">
                    <div className="avatar avatar-s">
                      <img src={user.avatar} alt={user.fullName} />
                    </div>
                    <div className="user-text">
                      <p>Benvingut,</p>
                      <h1>{user.fullName}</h1>
                    </div>
                  </div>
                </div>
                <div className="weather-meta"></div>
                <div className="left-menu">
                  <div className="topics">
                    <p>Temes que segueixes</p>
                    <ul className="menu-topics">{topicsList}</ul>
                  </div>
                  {/* <div className="content">
										<p>Explora i descobreix</p>
										<ul>
											<li>
												<Link href="/usuaris">
													<a>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="icon icon-tabler icon-tabler-users"
															width="28"
															height="28"
															viewBox="0 0 24 24"
															strokeWidth="1.5"
															stroke="#0D1F44"
															fill="none"
															strokeLinecap="round"
															strokeLinejoin="round"
														>
															<path stroke="none" d="M0 0h24v24H0z" />
															<circle cx="9" cy="7" r="4" />
															<path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
															<path d="M16 3.13a4 4 0 0 1 0 7.75" />
															<path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
														</svg>
														Comunitat
													</a>
												</Link>
											</li>
										</ul>
									</div> */}
                  <div className="links">
                    <p>Gestiona el teu compte</p>
                    <ul>
                      <li>
                        <Link href="/dashboard">
                          <a>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="icon icon-tabler icon-tabler-layout-list"
                              width="28"
                              height="28"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="#0D1F44"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path stroke="none" d="M0 0h24v24H0z" />
                              <rect x="4" y="4" width="16" height="6" rx="2" />
                              <rect x="4" y="14" width="16" height="6" rx="2" />
                            </svg>
                            Gestor
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link href={`/bookmarks`}>
                          <a>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="icon icon-tabler icon-tabler-bookmark"
                              width="28"
                              height="28"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="#0D1F44"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path stroke="none" d="M0 0h24v24H0z" />
                              <path d="M9 4h6a2 2 0 0 1 2 2v14l-5-3l-5 3v-14a2 2 0 0 1 2 -2" />
                            </svg>
                            Desats
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link href={`/usuaris/${user._id}`}>
                          <a>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="icon icon-tabler icon-tabler-user"
                              width="28"
                              height="28"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="#0D1F44"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path stroke="none" d="M0 0h24v24H0z" />
                              <circle cx="12" cy="7" r="4" />
                              <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                            </svg>
                            Perfil
                          </a>
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="new">
                    <Button
                      className="btn btn-primary text-center sidebar"
                      onClick={handleModalVisibility}
                    >
                      Recomanar escapada
                    </Button>
                  </div>
                </div>
              </div>
              <div className="col center">
                <div className="col-title">
                  <p className="small">
                    Resultats basats en els temes que segueixes
                  </p>
                </div>
                <div className="col-results">{resultsList}</div>
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

export default Feed;
