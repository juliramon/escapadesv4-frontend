import Head from "next/head";
import { Router, useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useCookies } from "react-cookie";
import slugify from "slugify";
import NavigationBar from "../../components/global/NavigationBar";
import UserContext from "../../contexts/UserContext";
import AuthService from "../../services/authService";
import ContentService from "../../services/contentService";

const Registre = () => {
  const { user } = useContext(UserContext);
  const router = useRouter();

  const service = new AuthService();
  const serviceContent = new ContentService();

  const [cookies, setCookie, removeCookie] = useCookies("");

  const initialState = {
    step: 1,
    orgName: "",
    blopOrgLogo: "",
    orgLogo: "",
    orgLogoCloudImage: "",
    orgLogoCloudImageUploaded: false,
    VATNumber: "",
    followers: 0,
    accountCompleted: false,
    formType: "",
  };

  const [state, setState] = useState(initialState);

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

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const saveFileToStatus = (e) => {
    const fileToUpload = e.target.files[0];
    setState({
      ...state,
      blopOrgLogo: URL.createObjectURL(fileToUpload),
      orgLogo: fileToUpload,
    });
  };

  const handleFileUpload = async (e) => {
    const orgLogo = state.orgLogo;
    const uploadData = new FormData();
    uploadData.append("imageUrl", orgLogo);
    const uploadedOrgLogo = await serviceContent.uploadFile(uploadData);
    setState({
      ...state,
      orgLogoCloudImage: uploadedOrgLogo.path,
      orgLogoCloudImageUploaded: true,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFileUpload();
  };

  const submitForm = async () => {
    const slug = await slugify(state.orgName, {
      remove: /[*+~.,()'"!:@]/g,
      lower: true,
    });
    const {
      orgName,
      orgLogoCloudImage,
      VATNumber,
      followers,
      accountCompleted,
    } = state;
    service
      .createOrganization(
        orgName,
        slug,
        orgLogoCloudImage,
        VATNumber,
        followers,
        accountCompleted
      )
      .then(() => {
        setState(initialState);
        router.push("/empreses/registre?step=2");
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (state.orgLogoCloudImageUploaded === true) {
      submitForm();
    }
  }, [state]);

  useEffect(() => {
    if (router.query.step === "2") {
      setState({ ...state, step: 2 });
    }
    if (router.query.step === "3") {
      if (router.query.form === "activitat") {
        setState({ ...state, step: 3, formType: "activitat" });
      }
      if (router.query.form === "allotjament") {
        setState({ ...state, step: 3, formType: "allotjament" });
      }
    }
  }, [router]);

  const handleActivityForm = () => {
    router.push("/empreses/registre?step=3&form=activitat");
  };

  const handlePlaceForm = () => {
    router.push("/empreses/registre?step=3&form=allotjament");
  };

  let step1, step2, step3, step4;

  if (cookies.funnelOrigin === "headerBtn") {
    step1 = (
      <>
        <section className="page-header step1 plans">
          <Row>
            <Col lg={12}>
              <div className="page-header-wrapper">
                <h1 className="page-header-title">
                  Potencia la visibilitat del teu negoci
                </h1>
                <p className="page-header-subtitle">
                  Arriba a parelles d'arreu de Catalunya amb els nostres plans
                </p>
              </div>
              <div className="plans-table">
                <div className="plans-table-wrapper">
                  <div className="plan-box">
                    <div className="top">
                      <span>Pla Bàsic</span>
                      <h3 className="price-tag">Gratuït</h3>
                    </div>
                    <div className="bottom">
                      <button className="btn-soft-blue">
                        Continuar{" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon icon-tabler icon-tabler-arrow-narrow-right"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="#3a4887"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <line x1="15" y1="16" x2="19" y2="12" />
                          <line x1="15" y1="8" x2="19" y2="12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="plan-box">
                    <div className="top">
                      <span>Pla Superior</span>
                      <h3 className="price-tag">
                        7{" "}
                        <span className="price-span">
                          Desde
                          <br /> € / mes
                        </span>
                      </h3>
                    </div>
                    <div className="bottom">
                      <button className="btn-soft-orange">
                        Continuar{" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon icon-tabler icon-tabler-arrow-narrow-right"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="#b8761a"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <line x1="15" y1="16" x2="19" y2="12" />
                          <line x1="15" y1="8" x2="19" y2="12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="plan-box">
                    <div className="top">
                      <span>Pla Premium</span>
                      <h3 className="price-tag">
                        22{" "}
                        <span className="price-span">
                          Desde
                          <br /> € / mes
                        </span>
                      </h3>
                    </div>
                    <div className="bottom">
                      <button className="btn-soft-red">
                        Continuar{" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon icon-tabler icon-tabler-arrow-narrow-right"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="#ac402a"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <line x1="15" y1="16" x2="19" y2="12" />
                          <line x1="15" y1="8" x2="19" y2="12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="plans-comparison-grid">
                  <h2>Selecciona el pla que millor t'encaixi</h2>
                  <div className="plans-comparison-grid-wrapper">
                    <div className="plans-comparison-grid-row">
                      <div class="plans-comparison-grid-title"></div>
                      <div class="plans-comparison-grid-title">
                        <span>Pla Bàsic</span>
                      </div>
                      <div class="plans-comparison-grid-title">
                        <span>Pla Superior</span>
                      </div>
                      <div class="plans-comparison-grid-title">
                        <span>Pla Premium</span>
                      </div>
                    </div>
                    <div className="plans-comparison-grid-row">
                      <div class="plans-comparison-feature-tag">
                        <span>
                          Número de publicacions
                          <br /> (Activitats i/o allotjaments)
                        </span>
                      </div>
                      <div class="plans-comparison-feature-mark">1</div>
                      <div class="plans-comparison-feature-mark">3</div>
                      <div class="plans-comparison-feature-mark">
                        Il·limitades
                      </div>
                    </div>
                    <div className="plans-comparison-grid-row">
                      <div class="plans-comparison-feature-tag">
                        <span>Millor posicionament en buscadors</span>
                      </div>
                      <div class="plans-comparison-feature-mark">Y</div>
                      <div class="plans-comparison-feature-mark">Y</div>
                      <div class="plans-comparison-feature-mark">Y</div>
                    </div>
                    <div className="plans-comparison-grid-row">
                      <div class="plans-comparison-feature-tag">
                        <span>
                          Publicacions amb direcció i mapa
                          <br /> de localització
                        </span>
                      </div>
                      <div class="plans-comparison-feature-mark">Y</div>
                      <div class="plans-comparison-feature-mark">Y</div>
                      <div class="plans-comparison-feature-mark">Y</div>
                    </div>
                    <div className="plans-comparison-grid-row">
                      <div class="plans-comparison-feature-tag">
                        <span>Perfil públic d'empresa</span>
                      </div>
                      <div class="plans-comparison-feature-mark">X</div>
                      <div class="plans-comparison-feature-mark">Y</div>
                      <div class="plans-comparison-feature-mark">Y</div>
                    </div>
                    <div className="plans-comparison-grid-row">
                      <div class="plans-comparison-feature-tag">
                        <span>Publicacions amb telèfon de contacte</span>
                      </div>
                      <div class="plans-comparison-feature-mark">X</div>
                      <div class="plans-comparison-feature-mark">Y</div>
                      <div class="plans-comparison-feature-mark">Y</div>
                    </div>
                    <div className="plans-comparison-grid-row">
                      <div class="plans-comparison-feature-tag">
                        <span>
                          Publicacions amb enllaç al teu motor de reserva
                        </span>
                      </div>
                      <div class="plans-comparison-feature-mark">X</div>
                      <div class="plans-comparison-feature-mark">Y</div>
                      <div class="plans-comparison-feature-mark">Y</div>
                    </div>
                    <div className="plans-comparison-grid-row">
                      <div class="plans-comparison-feature-tag">
                        <span>
                          Publicacions amb enllaços als teus perfils socials
                        </span>
                      </div>
                      <div class="plans-comparison-feature-mark">X</div>
                      <div class="plans-comparison-feature-mark">Y</div>
                      <div class="plans-comparison-feature-mark">Y</div>
                    </div>
                    <div className="plans-comparison-grid-row">
                      <div class="plans-comparison-feature-tag">
                        <span>
                          Publicacions destacades a les nostres pàgines de
                          resultats
                        </span>
                      </div>
                      <div class="plans-comparison-feature-mark">X</div>
                      <div class="plans-comparison-feature-mark">Y</div>
                      <div class="plans-comparison-feature-mark">Y</div>
                    </div>
                    <div className="plans-comparison-grid-row">
                      <div class="plans-comparison-feature-tag">
                        <span>Assessorament personalitzat</span>
                      </div>
                      <div class="plans-comparison-feature-mark">X</div>
                      <div class="plans-comparison-feature-mark">Y</div>
                      <div class="plans-comparison-feature-mark">Y</div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </section>
      </>
    );
    step2 = <>provide info</>;
    step3 = <>select type</>;
    step4 = <>publish</>;
  } else {
    step1 = (
      <>
        <section className="page-header">
          <Row>
            <Col lg={12}>
              <div className="page-header-wrapper">
                <div className="col-left">
                  <h1 className="page-header-title">
                    Hola {user.fullName}!<br />
                    Anem a crear el teu compte d'empresa.
                  </h1>
                  <p className="page-header-subtitle">
                    Entra la informació bàsica de la teva empresa{" "}
                  </p>
                  <div className="company-registration-form">
                    <Form>
                      <div className="form-group-wrapper">
                        <div className="form-group-left">
                          <Form.Group>
                            <Form.Label>
                              <Form.Control
                                name="orgLogo"
                                type="file"
                                onChange={saveFileToStatus}
                                hidden
                              />
                              <div className="company-logo">
                                <img
                                  src={state.blopOrgLogo}
                                  alt={state.orgName}
                                />
                                <div className="company-logo-overlay">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="icon icon-tabler icon-tabler-camera-plus"
                                    width="44"
                                    height="44"
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
                                    ></path>
                                    <circle cx="12" cy="13" r="3"></circle>
                                    <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h2m9 7v7a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2"></path>
                                    <line x1="15" y1="6" x2="21" y2="6"></line>
                                    <line x1="18" y1="3" x2="18" y2="9"></line>
                                  </svg>
                                </div>
                              </div>
                            </Form.Label>
                          </Form.Group>
                        </div>
                        <div className="form-group-right">
                          <Form.Group>
                            <Form.Label>Nom de l'empresa</Form.Label>
                            <Form.Control
                              name="orgName"
                              type="text"
                              onChange={handleChange}
                              placeholder="Escriu el nom de la teva empresa..."
                            />
                          </Form.Group>
                          <Form.Group>
                            <Form.Label>CIF/NIF</Form.Label>
                            <Form.Control
                              name="VATNumber"
                              type="text"
                              onChange={handleChange}
                              placeholder="Escriu el CIF o NIF de la teva empresa..."
                            />
                          </Form.Group>
                        </div>
                      </div>
                      <Form.Group className="form-group-submit">
                        <Button
                          className="btn btn-m btn-submit"
                          type="submit"
                          onClick={handleSubmit}
                        >
                          Continuar{" "}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-arrow-narrow-right"
                            width="22"
                            height="22"
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
                          </svg>{" "}
                        </Button>
                      </Form.Group>
                    </Form>
                  </div>
                </div>
                <div className="col-right">
                  <div className="header-infographic-wrapper">
                    <img src="https://res.cloudinary.com/juligoodie/image/upload/v1619903999/getaways-guru/static-files/serveis-header-image_gaxysb.svg" />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </section>
      </>
    );
    step2 = (
      <>
        <section className="page-header step2">
          <Row>
            <Col lg={12}>
              <div className="page-header-wrapper">
                <div class="top">
                  <h1 className="page-header-title">
                    Selecciona la tipologia
                    <br /> amb la que identifiques més
                    <br /> la teva empresa.
                  </h1>
                  <p className="page-header-subtitle"></p>
                </div>
                <div className="bottom">
                  <div className="cards-wrapper">
                    <div className="card" onClick={handleActivityForm}>
                      <h2 className="page-header-subtitle">Activitats</h2>
                      <p>
                        Selecciona aquesta opció si la teva empresa es dedica a
                        organitzar activitats en interiors o a l'aire lliure.
                      </p>
                      <button className="btn btn-l btn-blue">
                        Publicar activitat{" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="icon icon-tabler icon-tabler-arrow-narrow-right"
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="#3A4887"
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <line x1="15" y1="16" x2="19" y2="12" />
                          <line x1="15" y1="8" x2="19" y2="12" />
                        </svg>
                      </button>
                    </div>
                    <div className="card" onClick={handlePlaceForm}>
                      <h2 className="page-header-subtitle">Allotjaments</h2>
                      <p>
                        Selecciona aquesta opció si la teva empresa es dedica a
                        gestionar un allotjament o un establiment.
                      </p>
                      <button className="btn btn-l btn-blue">
                        Publicar allotjament{" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="icon icon-tabler icon-tabler-arrow-narrow-right"
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="#3A4887"
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <line x1="15" y1="16" x2="19" y2="12" />
                          <line x1="15" y1="8" x2="19" y2="12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </section>
      </>
    );
    step3 = {
      activitat: (
        <>
          <section className="page-header step3 activitat">
            <Row>
              <Col lg={12}>
                <div className="page-header-wrapper">
                  <div className="col-left">
                    <h1 className="page-header-title">
                      Potencia la visibilitat de la teva activitat
                    </h1>
                    <p className="page-header-subtitle">
                      Arriba a parelles d'arreu de Catalunya amb els nostres
                      plans
                    </p>
                    <div className="company-registration-form">
                      <Form>
                        <div className="form-group-wrapper">
                          <Form.Group>
                            <Form.Label>Nom de l'activitat</Form.Label>
                            <Form.Control
                              name="orgName"
                              type="text"
                              onChange={handleChange}
                              placeholder="Ex. Excursió amb Rucs al Corredor"
                            />
                          </Form.Group>
                          <Form.Group>
                            <Form.Label>Subtítol</Form.Label>
                            <Form.Control
                              name="VATNumber"
                              type="text"
                              onChange={handleChange}
                              placeholder="Ex. Fantàstica escapada amb rucs al Corredor. Us encantarà!"
                            />
                          </Form.Group>
                        </div>
                        <Form.Group className="form-group-submit">
                          <Button
                            className="btn btn-m btn-submit"
                            type="submit"
                            onClick={handleSubmit}
                          >
                            Publicar{" "}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="icon icon-tabler icon-tabler-arrow-narrow-right"
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
                              <line x1="5" y1="12" x2="19" y2="12" />
                              <line x1="15" y1="16" x2="19" y2="12" />
                              <line x1="15" y1="8" x2="19" y2="12" />
                            </svg>{" "}
                          </Button>
                        </Form.Group>
                      </Form>
                    </div>
                  </div>
                  <div className="col-right">
                    <div className="header-infographic-wrapper">
                      <img src="https://res.cloudinary.com/juligoodie/image/upload/v1619903999/getaways-guru/static-files/serveis-header-image_gaxysb.svg" />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </section>
        </>
      ),
      allotjament: (
        <>
          <section className="page-header">
            <Row>
              <Col lg={12}>
                <div className="page-header-wrapper">
                  <div className="col-left">
                    <h1 className="page-header-title">
                      Potencia la visibilitat del teu allotjament
                    </h1>
                    <p className="page-header-subtitle">
                      Arriba a parelles d'arreu de Catalunya amb els nostres
                      plans
                    </p>
                    <div className="plans-table">
                      <div className="plans-table-wrapper">
                        <div className="plan-box">
                          <div className="top">
                            <span>Pla Bàsic</span>
                            <h3>Gratuït</h3>
                          </div>
                          <div className="bottom">
                            <button>Registra't</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-right">
                    <div className="header-infographic-wrapper">
                      <img src="https://res.cloudinary.com/juligoodie/image/upload/v1619903999/getaways-guru/static-files/serveis-header-image_gaxysb.svg" />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </section>
        </>
      ),
    };
  }

  let contentPage;
  if (state.step === 1) {
    contentPage = step1;
  }
  if (state.step === 2) {
    contentPage = step2;
  }
  if (state.step === 3) {
    if (state.formType === "activitat") {
      contentPage = step3.activitat;
    }
    if (state.formType === "allotjament") {
      contentPage = step3.allotjament;
    }
  }

  return (
    <>
      <Head>
        <title>Crea el teu compte d'empresa – Escapadesenparella.cat</title>
      </Head>
      <main id="landingServices" className="services-form">
        <Container className="mw-1200">
          <div className="box">
            <section className="funnel-steps">
              <Row>
                <Col lg={12}>
                  <div className="funnel-steps-wrapper">
                    <ul>
                      <li className={state.step === 1 ? "active" : null}>
                        Pas 1
                      </li>
                      <li className={state.step === 2 ? "active" : null}>
                        Pas 2
                      </li>
                      <li className={state.step === 3 ? "active" : null}>
                        Pas 3
                      </li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </section>
            {contentPage}
          </div>
        </Container>
      </main>
    </>
  );
};

export default Registre;
