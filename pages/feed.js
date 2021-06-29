import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Container, Row, Spinner } from "react-bootstrap";
import ContentService from "../services/contentService";
import PublickSquareBox from "../components/listings/PublicSquareBox";
import Link from "next/link";
import NavigationBar from "../components/global/NavigationBar";
import UserContext from "../contexts/UserContext";
import PaymentService from "../services/paymentService";
import ButtonSharePost from "../components/buttons/ButtonSharePost";

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
    userSubscription: {},
  };

  const [state, setState] = useState(initialState);

  const service = new ContentService();
  const paymentService = new PaymentService();

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        setState({ ...state, isFetching: true });
        const userCustomActivities = await service.getUserCustomActivities();
        const userCustomPlaces = await service.getUserCustomPlaces();
        const userOrganizations = await service.checkOrganizationsOwned();
        const userSubscription = await paymentService.checkUserSubscription();
        let hasActivities, hasPlaces, hasListings, hasOrganizations;
        userCustomActivities.length > 0
          ? (hasActivities = true)
          : (hasActivities = false);
        userCustomPlaces.length > 0 ? (hasPlaces = true) : (hasPlaces = false);
        userCustomActivities.length > 0 && userCustomPlaces.length > 0
          ? (hasListings = true)
          : (hasListings = false);
        userOrganizations.number > 0
          ? (hasOrganizations = true)
          : (hasOrganizations = false);
        setState({
          ...state,
          hasListings: hasListings,
          hasActivities: hasActivities,
          hasPlaces: hasPlaces,
          hasOrganizations: hasOrganizations,
          userCustomActivities: userCustomActivities,
          userCustomPlaces: userCustomPlaces,
          userOrganizations: userOrganizations,
          userSubscription: userSubscription,
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
          slug={el.slug}
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

  let organizationsList = [];
  if (state.userOrganizations !== undefined) {
    organizationsList = state.userOrganizations.organizations.map((el, idx) => (
      <li key={idx}>
        <Link href={`/empreses/${el.slug}`}>
          <a>
            <div className="organization-wrapper">
              <div className="organization-left">
                <div className="organization-logo">
                  <img src={el.orgLogo} alt={el.orgName} />
                </div>
              </div>
              <div className="organization-right">
                <h3>{el.orgName}</h3>
              </div>
            </div>
          </a>
        </Link>
      </li>
    ));
  }

  let organizationsBlock, recommendPostButton;
  if (state.userOrganizations) {
    if (state.userOrganizations.number > 0) {
      organizationsBlock = (
        <div className="organizations">
          <p>Les teves empreses ({state.userOrganizations.number})</p>
          <ul className="menu-organizations">{organizationsList}</ul>
        </div>
      );
    } else {
      null;
    }
  }
  if (state.userSubscription) {
    if (
      state.userSubscription.numberOfPublications === "0" &&
      state.userSubscription.plan === "basic"
    ) {
      recommendPostButton = <ButtonSharePost canPublish={true} />;
    } else if (
      state.userSubscription.numberOfPublications < 3 &&
      state.userSubscription.plan === "premium"
    ) {
      recommendPostButton = <ButtonSharePost canPublish={true} />;
    } else if (state.userSubscription.plan === "superior") {
      recommendPostButton = <ButtonSharePost canPublish={true} />;
    } else {
      recommendPostButton = <ButtonSharePost canPublish={false} />;
    }
  }

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
            "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
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
                  {organizationsBlock}
                  <div className="links">
                    <p>Gestiona el teu compte</p>
                    <ul>
                      <li>
                        <Link href="/dashboard">
                          <a>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="icon icon-tabler icon-tabler-layout-list"
                              width="22"
                              height="22"
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
                              width="22"
                              height="22"
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
                              width="22"
                              height="22"
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
                  {recommendPostButton}
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
      </div>
    </>
  );
};

export default Feed;
