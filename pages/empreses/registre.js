import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { useCookies } from "react-cookie";
import slugify from "slugify";
import UserContext from "../../contexts/UserContext";
import AuthService from "../../services/authService";
import ContentService from "../../services/contentService";
import PaymentService from "../../services/paymentService";
import Autocomplete from "react-google-autocomplete";
import Plans from "../../components/global/Plans";

const Registre = () => {
  const { user, refreshUserData } = useContext(UserContext);
  const router = useRouter();
  const service = new AuthService();
  const serviceContent = new ContentService();
  const [cookies, setCookie, removeCookie] = useCookies("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");
    }
    if (query.get("canceled")) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, []);

  const initialState = {
    step: 1,
    orgName: "",
    blopOrgLogo: "",
    orgLogo: "",
    orgLogoCloudImage: "",
    orgLogoCloudImageUploaded: false,
    VATNumber: "",
    followers: 0,
    formType: "",
    paymentFrequency: "annual",
    organizationLocation: undefined,
    isReadyToSubmit: false,
    errorMessage: {
      picture: "",
      company: "",
      VAT: "",
      location: "",
    },
  };

  const [state, setState] = useState(initialState);
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);

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

  useEffect(() => {
    if (
      state.orgName !== "" &&
      state.VATNumber !== "" &&
      state.blopOrgLogo !== "" &&
      state.organizationLocation !== undefined
    ) {
      setIsReadyToSubmit(true);
    }
  }, [state]);

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

  let errorMessage;

  if (state.errorMessage.picture) {
    errorMessage = (
      <Alert variant="danger">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-shield-x"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="#fff"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" />
          <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" />
          <path d="M10 10l4 4m0 -4l-4 4" />
        </svg>
        {state.errorMessage.picture}
      </Alert>
    );
  } else {
    null;
  }

  const handleFileUpload = async (e) => {
    const orgLogo = state.orgLogo;
    const uploadData = new FormData();
    uploadData.append("imageUrl", orgLogo);
    const uploadedOrgLogo = await serviceContent.uploadFile(uploadData);
    if (uploadedOrgLogo.message) {
      setState({
        ...state,
        errorMessage: {
          ...state.errorMessage,
          picture: uploadedOrgLogo.message,
        },
      });
    } else {
      setState({
        ...state,
        orgLogoCloudImage: uploadedOrgLogo.path,
        orgLogoCloudImageUploaded: true,
      });
    }
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
    const { orgName, orgLogoCloudImage, VATNumber, followers } = state;
    const {
      organization_full_address,
      organization_streetNumber,
      organization_street,
      organization_locality,
      organization_zipcode,
      organization_province,
      organization_state,
      organization_country,
      organization_lat,
      organization_lng,
      additionalInfo,
    } = state.organizationLocation;
    const infoProvided = true;
    service
      .createOrganization(
        orgName,
        slug,
        orgLogoCloudImage,
        VATNumber,
        followers,
        infoProvided,
        organization_full_address,
        organization_streetNumber,
        organization_street,
        organization_locality,
        organization_zipcode,
        organization_province,
        organization_state,
        organization_country,
        organization_lat,
        organization_lng,
        additionalInfo
      )
      .then(() => {
        setState(initialState);
        router.push("/empreses/registre?step=seleccio-pla");
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (state.orgLogoCloudImageUploaded === true) {
      submitForm();
    }
  }, [state]);

  const getUserUpdatedData = () => {
    serviceContent.getUserProfile(user._id).then((res) => refreshUserData(res));
  };

  useEffect(() => {
    if (router.query.step === "informacio-empresa") {
      setState({ ...state, step: "informacio-empresa" });
    }
    if (
      router.query.step === "seleccio-pla" ||
      router.query.step === "seleccio-pla?canceled=true"
    ) {
      setState({ ...state, step: "seleccio-pla" });
    }
    if (
      router.query.step === "seleccio-tipologia" ||
      router.query.step === "seleccio-tipologia?success=true"
    ) {
      getUserUpdatedData();
      setState({ ...state, step: "seleccio-tipologia" });
      if (router.query.form === "activitat") {
        setState({ ...state, formType: "activitat" });
      }
      if (router.query.form === "allotjament") {
        setState({ ...state, formType: "allotjament" });
      }
    }
  }, [router]);

  const handleActivityForm = () => {
    router.push("/nova-activitat?step=publicacio-fitxa");
  };

  const handlePlaceForm = () => {
    router.push("/nou-allotjament?step=publicacio-fitxa");
  };

  let step1, step2, step3, funnelSteps;

  if (cookies.funnelOrigin === "headerBtn") {
    funnelSteps = (
      <>
        <div className="funnel-steps-wrapper">
          <ul>
            <li
              className={state.step === "informacio-empresa" ? "active" : null}
            >
              Pas 1
            </li>
            <li className={state.step === "seleccio-pla" ? "active" : null}>
              Pas 2
            </li>
            <li
              className={state.step === "seleccio-tipologia" ? "active" : null}
            >
              Pas 3
            </li>
            <li className={state.step === "publicar-fitxa" ? "active" : null}>
              Pas 4
            </li>
          </ul>
        </div>
      </>
    );
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
                  {errorMessage}
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
                            <Form.Label>CIF o NIF</Form.Label>
                            <Form.Control
                              name="VATNumber"
                              type="text"
                              onChange={handleChange}
                              placeholder="Escriu el CIF o NIF de la teva empresa..."
                            />
                          </Form.Group>
                          <Form.Group>
                            <Form.Label>Direcció de facturació</Form.Label>
                            <Autocomplete
                              className="form-control"
                              apiKey={`${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`}
                              style={{ width: "100%" }}
                              onPlaceSelected={(organization) => {
                                let organization_full_address,
                                  organization_streetNumber,
                                  organization_street,
                                  organization_locality,
                                  organization_zipcode,
                                  organization_province,
                                  organization_state,
                                  organization_country,
                                  organization_lat,
                                  organization_lng;
                                organization_full_address =
                                  organization.formatted_address;
                                organization.address_components.forEach(
                                  (el) => {
                                    if (el.types[0] === "street_number") {
                                      organization_streetNumber = el.long_name;
                                    }
                                    if (el.types[0] === "route") {
                                      organization_street = el.long_name;
                                    }
                                    if (el.types[0] === "locality") {
                                      organization_locality = el.long_name;
                                    }
                                    if (el.types[0] === "postal_code") {
                                      organization_zipcode = el.long_name;
                                    }
                                    if (
                                      el.types[0] ===
                                      "administrative_area_level_2"
                                    ) {
                                      organization_province = el.long_name;
                                    }
                                    if (
                                      el.types[0] ===
                                      "administrative_area_level_1"
                                    ) {
                                      organization_state = el.long_name;
                                    }
                                    if (el.types[0] === "country") {
                                      organization_country = el.long_name;
                                    }
                                  }
                                );

                                if (organization.geometry.viewport) {
                                  organization_lat = Object.values(
                                    organization.geometry.viewport
                                  )[0].i;
                                  organization_lng = Object.values(
                                    organization.geometry.viewport
                                  )[1].i;
                                }

                                setState({
                                  ...state,
                                  organizationLocation: {
                                    organization_full_address: organization_full_address,
                                    organization_streetNumber: organization_streetNumber,
                                    organization_street: organization_street,
                                    organization_locality: organization_locality,
                                    organization_zipcode: organization_zipcode,
                                    organization_province: organization_province,
                                    organization_state: organization_state,
                                    organization_country: organization_country,
                                    organization_lat: organization_lat,
                                    organization_lng: organization_lng,
                                  },
                                });
                              }}
                              types={["address"]}
                              placeholder={"Escriu la direcció de facturació"}
                              fields={[
                                "address_components",
                                "formatted_address",
                                "geometry",
                              ]}
                            />
                          </Form.Group>
                          <Form.Group>
                            <Form.Control
                              name="additionalLocationInfo"
                              type="text"
                              onChange={(e) =>
                                setState({
                                  ...state,
                                  organizationLocation: {
                                    ...state.organizationLocation,
                                    additionalInfo: e.target.value,
                                  },
                                })
                              }
                              placeholder="Informació addicional de l'adreça de facturació"
                            />
                          </Form.Group>
                        </div>
                      </div>
                      <Form.Group className="form-group-submit">
                        {isReadyToSubmit ? (
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
                        ) : (
                          <Button
                            className="btn btn-m btn-submit"
                            type="submit"
                            disabled
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
                        )}
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
      <section className="services-plans">
        <Plans />
      </section>
    );
    step3 = (
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
  } else {
    funnelSteps = (
      <>
        <div className="funnel-steps-wrapper">
          <ul>
            <li
              className={state.step === "informacio-empresa" ? "active" : null}
            >
              Pas 1
            </li>
            <li
              className={state.step === "seleccio-tipologia" ? "active" : null}
            >
              Pas 2
            </li>
            <li className={state.step === "publicar-fitxa" ? "active" : null}>
              Pas 3
            </li>
          </ul>
        </div>
      </>
    );
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
  }

  let contentPage;
  if (state.step === "informacio-empresa") {
    contentPage = step1;
  }
  if (state.step === "seleccio-pla") {
    contentPage = step2;
  }
  if (state.step === "seleccio-tipologia") {
    if (cookies.funnelOrigin) {
      contentPage = step3;
    } else {
      if (state.formType === "activitat") {
        contentPage = step3.activitat;
      }
      if (state.formType === "allotjament") {
        contentPage = step3.allotjament;
      }
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
                <Col lg={12}>{funnelSteps}</Col>
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
