import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import { Button, Container, Form, Row } from "react-bootstrap";
import NavigationBar from "../components/global/NavigationBar";
import UserContext from "../contexts/UserContext";
import AuthService from "../services/authService";
import ContentService from "../services/contentService";

const CompleteAccount = () => {
  const { user, refreshUserData } = useContext(UserContext);

  if (user && user !== "null" && user.accountCompleted === true) {
    Router.push("/feed");
  }
  const initialState = {
    loggedUser: user,
    typesToFollow: [],
    categoriesToFollow: [],
    regionsToFollow: [],
    seasonsToFollow: [],
    hasTypes: false,
    hasCategories: false,
    hasRegions: false,
    hasSeasons: false,
    accountCompleted: false,
    isReadyToSubmit: false,
  };

  const [state, setState] = useState(initialState);
  const authService = new AuthService();
  const service = new ContentService();

  const handleCheck = (e) => {
    let regions = state.regionsToFollow;
    let types = state.typesToFollow;
    let categories = state.categoriesToFollow;
    let seasons = state.seasonsToFollow;
    if (e.target.name === "region") {
      if (e.target.checked === true) {
        regions.push(e.target.id);
        setState({ ...state, regionsToFollow: regions, hasRegions: true });
      } else {
        let index = regions.indexOf(e.target.id);
        regions.splice(index, 1);
        if (regions.length > 0) {
          setState({ ...state, regionsToFollow: regions, hasRegions: true });
        } else {
          setState({ ...state, regionsToFollow: regions, hasRegions: false });
        }
      }
    } else if (e.target.name === "type") {
      if (e.target.checked === true) {
        types.push(e.target.id);
        setState({ ...state, typesToFollow: types, hasTypes: true });
      } else {
        let index = types.indexOf(e.target.id);
        types.splice(index, 1);
        if (types.length > 0) {
          setState({ ...state, typesToFollow: types, hasTypes: true });
        } else {
          setState({ ...state, typesToFollow: types, hasTypes: false });
        }
      }
    } else if (e.target.name === "category") {
      if (e.target.checked === true) {
        categories.push(e.target.id);
        setState({
          ...state,
          categoriesToFollow: categories,
          hasCategories: true,
        });
      } else {
        let index = categories.indexOf(e.target.id);
        categories.splice(index, 1);
        if (categories.length > 0) {
          setState({
            ...state,
            categoriesToFollow: categories,
            hasCategories: true,
          });
        } else {
          setState({
            ...state,
            categoriesToFollow: categories,
            hasCategories: false,
          });
        }
      }
    } else if (e.target.name === "season") {
      if (e.target.checked === true) {
        seasons.push(e.target.id);
        setState({ ...state, seasonsToFollow: seasons, hasSeasons: true });
      } else {
        let index = seasons.indexOf(e.target.id);
        seasons.splice(index, 1);
        if (seasons.length > 0) {
          setState({ ...state, seasonsToFollow: seasons, hasSeasons: true });
        } else {
          setState({ ...state, seasonsToFollow: seasons, hasSeasons: false });
        }
      }
    }
  };

  useEffect(() => {
    if (
      state.hasCategories &&
      state.hasRegions &&
      state.hasTypes &&
      state.hasSeasons
    ) {
      setState({ ...state, accountCompleted: true, isReadyToSubmit: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.hasCategories, state.hasRegions, state.hasTypes, state.hasSeasons]);

  const getUserUpdatedData = () => {
    service
      .getUserProfile(state.loggedUser._id)
      .then((res) => refreshUserData(res));
  };

  const submitSelection = () => {
    const {
      accountCompleted,
      typesToFollow,
      categoriesToFollow,
      regionsToFollow,
      seasonsToFollow,
    } = state;
    authService
      .completeAccount(
        accountCompleted,
        typesToFollow,
        categoriesToFollow,
        regionsToFollow,
        seasonsToFollow
      )
      .then(() => {
        setState({
          ...state,
          formData: {
            typesToFollow: [],
            categoriesToFollow: [],
            regionsToFollow: [],
            seasonsToFollow: [],
            hasTypes: false,
            hasCategories: false,
            hasRegions: false,
            hasSeasons: false,
            accountCompleted: false,
            isReadyToSubmit: false,
          },
        });
        getUserUpdatedData();
        history.push("/feed");
      })
      .catch((err) => console.error(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitSelection();
  };

  return (
    <>
      <Head>
        <title>Completa el teu compte - Escapadesenparella.cat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section id="completeAccountPage">
        <NavigationBar
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/c_scale,q_100,w_135/v1600008855/getaways-guru/static-files/logo-getaways-guru_vvbikk.svg"
          }
          user={user}
        />
        <Container fluid className="mw-1600">
          <Row>
            <div className="box d-flex">
              <div className="col left"></div>
              <div className="col center">
                <div className="top-nav-wrapper">
                  <h1 className="top-nav-title">Select topics to follow</h1>
                  <p className="top-nav-subtitle">
                    Select which regions, categories or places are of most
                    interest to you to get inspired.
                    <br />
                    You will later be ablet to modify your selection.
                  </p>
                </div>
                <div className="selection-box">
                  <Form.Check
                    label="Barcelona"
                    name="region"
                    id="barcelona"
                    onChange={handleCheck}
                  />
                  <Form.Check
                    label="Girona"
                    name="region"
                    id="girona"
                    onChange={handleCheck}
                  />
                  <Form.Check
                    label="Lleida"
                    name="region"
                    id="lleida"
                    onChange={handleCheck}
                  />
                  <Form.Check
                    label="Tarragona"
                    name="region"
                    id="tarragona"
                    onChange={handleCheck}
                  />
                  <Form.Check
                    label="Costa Brava"
                    name="region"
                    id="costaBrava"
                    onChange={handleCheck}
                  />
                  <Form.Check
                    label="Costa Daurada"
                    name="region"
                    id="costaDaurada"
                    onChange={handleCheck}
                  />
                  <Form.Check
                    label="Pirineus"
                    name="region"
                    id="pirineus"
                    onChange={handleCheck}
                  />
                  <Form.Check
                    label="Romantic"
                    name="category"
                    id="romantic"
                    onChange={handleCheck}
                  />
                  <Form.Check
                    label="Adventure"
                    name="category"
                    id="adventure"
                    onChange={handleCheck}
                  />
                  <Form.Check
                    label="Gastronomic"
                    name="category"
                    id="gastronomic"
                    onChange={handleCheck}
                  />
                  <Form.Check
                    label="Cultural"
                    name="category"
                    onChange={handleCheck}
                    id="cultural"
                  />
                  <Form.Check
                    label="Relax"
                    name="category"
                    onChange={handleCheck}
                    id="relax"
                  />
                  <Form.Check
                    label="Winter"
                    name="season"
                    onChange={handleCheck}
                    id="winter"
                  />
                  <Form.Check
                    label="Spring"
                    name="season"
                    onChange={handleCheck}
                    id="spring"
                  />
                  <Form.Check
                    label="Summer"
                    name="season"
                    onChange={handleCheck}
                    id="summer"
                  />
                  <Form.Check
                    label="Autumn"
                    name="season"
                    onChange={handleCheck}
                    id="autumn"
                  />
                  <Form.Check
                    label="Summer"
                    name="season"
                    onChange={handleCheck}
                    id="summer"
                  />
                  <Form.Check
                    label="Apartment"
                    name="type"
                    onChange={handleCheck}
                    id="apartment"
                  />
                  <Form.Check
                    label="Cabin"
                    name="type"
                    id="cabin"
                    onChange={handleCheck}
                  />
                  <Form.Check
                    label="Tree house"
                    name="type"
                    id="treehouse"
                    onChange={handleCheck}
                  />
                  <Form.Check
                    label="Rural house"
                    name="type"
                    id="ruralhouse"
                    onChange={handleCheck}
                  />
                  <Form.Check
                    label="Trailer"
                    name="type"
                    id="trailer"
                    onChange={handleCheck}
                  />
                  <Form.Check
                    label="Hotel"
                    name="type"
                    id="hotel"
                    onChange={handleCheck}
                  />
                </div>
              </div>
              <div className="col left"></div>
            </div>
          </Row>
        </Container>
        <div className="progress-bar-outter">
          <Container className="d-flex align-items-center">
            <div className="col left"></div>
            <div className="col center"></div>
            <div className="col right">
              <div className="buttons d-flex justify-space-between justify-content-end">
                {state.isReadyToSubmit ? (
                  <Button type="submit" variant="none" onClick={handleSubmit}>
                    Save & continue
                  </Button>
                ) : (
                  <Button type="submit" variant="none" disabled>
                    Save & continue
                  </Button>
                )}
              </div>
            </div>
          </Container>
        </div>
      </section>
    </>
  );
};

export default CompleteAccount;
