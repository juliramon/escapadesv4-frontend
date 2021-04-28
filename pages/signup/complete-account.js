import { useContext, useEffect, useState } from "react";
import { Button, Container, Form, Row, Spinner } from "react-bootstrap";
import NavigationBar from "../../components/global/NavigationBar";
import AuthService from "../../services/authService";
import ContentService from "../../services/contentService";
import Router, { useRouter } from "next/router";
import UserContext from "../../contexts/UserContext";
import Head from "next/head";

const CompleteAccount = () => {
  const { user, refreshUserData } = useContext(UserContext);
  const router = useRouter();

  const initialState = {
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
    service.getUserProfile(user._id).then((res) => {
      refreshUserData(res);
    });
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
        Router.push("/feed");
      })
      .catch((err) => console.error(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitSelection();
  };

  const [queryId, setQueryId] = useState(null);
  useEffect(() => {
    if (router && router.route) {
      setQueryId(router.route);
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>Completa el teu compte - Escapadesenparella.cat</title>
      </Head>
      <section id="completeAccountPage">
        <NavigationBar
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
          }
          user={user}
          path={queryId}
        />
        <Container fluid className="mw-1600">
          <Row>
            <div className="box d-flex">
              <div className="col left"></div>
              <div className="col center">
                <div className="top-nav-wrapper">
                  <h1 className="top-nav-title">Selecciona temes d'interès</h1>
                  <p className="top-nav-subtitle">
                    Selecciona les regions, categories i allotjaments que més
                    t'interessin per a mantenir-te inspirat!
                    <br />
                    Sempre podràs modificar la teva selecció des del teu compte.
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
                    label="Romàntiques"
                    name="category"
                    id="romantica"
                    onChange={handleCheck}
                  />
                  <Form.Check
                    label="Aventura"
                    name="category"
                    id="aventura"
                    onChange={handleCheck}
                  />
                  <Form.Check
                    label="Gastronòmiques"
                    name="category"
                    id="gastronomica"
                    onChange={handleCheck}
                  />
                  <Form.Check
                    label="Culturals"
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
                    label="A la neu"
                    name="season"
                    onChange={handleCheck}
                    id="hivern"
                  />
                  <Form.Check
                    label="Primavera"
                    name="season"
                    onChange={handleCheck}
                    id="primavera"
                  />
                  <Form.Check
                    label="Estiu"
                    name="season"
                    onChange={handleCheck}
                    id="estiu"
                  />
                  <Form.Check
                    label="Tardo"
                    name="season"
                    onChange={handleCheck}
                    id="tardor"
                  />
                  <Form.Check
                    label="Apartaments"
                    name="type"
                    onChange={handleCheck}
                    id="apartament"
                  />
                  <Form.Check
                    label="Refugis"
                    name="type"
                    id="refugi"
                    onChange={handleCheck}
                  />
                  <Form.Check
                    label="Cases-arbre"
                    name="type"
                    id="casaarbre"
                    onChange={handleCheck}
                  />
                  <Form.Check
                    label="Cases rurals"
                    name="type"
                    id="casarural"
                    onChange={handleCheck}
                  />
                  <Form.Check
                    label="Carabanes"
                    name="type"
                    id="carabana"
                    onChange={handleCheck}
                  />
                  <Form.Check
                    label="Hotels"
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
                    Continuar{" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-arrow-narrow-right"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#ffffff"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <line x1="15" y1="16" x2="19" y2="12" />
                      <line x1="15" y1="8" x2="19" y2="12" />
                    </svg>
                  </Button>
                ) : (
                  <Button type="submit" variant="none" disabled>
                    Continuar{" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-arrow-narrow-right"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#ffffff"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <line x1="15" y1="16" x2="19" y2="12" />
                      <line x1="15" y1="8" x2="19" y2="12" />
                    </svg>
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
