import { useState, useEffect, useContext } from "react";
import NavigationBar from "../components/global/NavigationBar";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import ContentService from "../services/contentService";
import Router, { useRouter } from "next/router";
import Autocomplete from "react-google-autocomplete";
import UserContext from "../contexts/UserContext";
import Head from "next/head";
import slugify from "slugify";

const PlaceForm = () => {
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
    formData: {
      emptyForm: true,
      type: "place",
      title: "",
      subtitle: "",
      categories: [],
      seasons: [],
      region: "",
      placeType: "",
      cover: "",
      blopCover: "",
      images: [],
      blopImages: [],
      cloudImages: [],
      coverCloudImage: "",
      cloudImagesUploaded: false,
      coverCloudImageUploaded: false,
      description: "",
      phone: "",
      website: "",
      place_full_address: "",
      place_locality: "",
      place_province: "",
      place_state: "",
      place_country: "",
      place_lat: "",
      place_lng: "",
      place_rating: 0,
      place_id: "",
      place_opening_hours: "",
      price: "",
      organization: "",
      isReadyToSubmit: false,
    },
  };

  const [state, setState] = useState(initialState);
  const [queryId, setQueryId] = useState(null);
  useEffect(() => {
    if (router && router.route) {
      setQueryId(router.route);
    }
  }, [router]);
  const service = new ContentService();

  useEffect(() => {
    const fetchData = async () => {
      const userOrganizations = await service.checkOrganizationsOwned();
      let hasOrganizations;
      userOrganizations.number > 0
        ? (hasOrganizations = true)
        : (hasOrganizations = false);
      setState({
        ...state,
        formData: { ...state.formData, userOrganizations: userOrganizations },
      });
    };
    fetchData();
  }, []);

  const saveFileToStatus = (e) => {
    const fileToUpload = e.target.files[0];
    if (e.target.name === "cover") {
      setState({
        ...state,
        formData: {
          ...state.formData,
          blopCover: URL.createObjectURL(fileToUpload),
          cover: fileToUpload,
        },
      });
    } else {
      setState({
        ...state,
        formData: {
          ...state.formData,
          blopImages: [
            ...state.formData.blopImages,
            URL.createObjectURL(fileToUpload),
          ],
          images: [...state.formData.images, fileToUpload],
        },
      });
    }
  };

  const imagesList = state.formData.blopImages.map((el, idx) => (
    <div className="image" key={idx}>
      <img src={el} />
    </div>
  ));

  let coverImage;
  if (state.formData.blopCover) {
    coverImage = (
      <div className="image">
        <img src={state.formData.blopCover} />
      </div>
    );
  }

  const handleFileUpload = async (e) => {
    const imagesList = state.formData.images;
    const cover = state.formData.cover;
    let uploadedImages = [];
    const uploadData = new FormData();
    uploadData.append("imageUrl", cover);
    const uploadedCover = await service.uploadFile(uploadData);
    imagesList.forEach((el) => {
      const uploadData = new FormData();
      uploadData.append("imageUrl", el);
      service.uploadFile(uploadData).then((res) => {
        uploadedImages.push(res.path);
        if (uploadedImages.length === state.formData.images.length) {
          setState({
            ...state,
            formData: {
              ...state.formData,
              cloudImages: uploadedImages,
              coverCloudImage: uploadedCover.path,
              cloudImagesUploaded: true,
              coverCloudImageUploaded: true,
            },
          });
        }
      });
    });
  };

  const handleCheckCategory = (e) => {
    let categories = state.formData.categories;
    if (e.target.checked === true) {
      categories.push(e.target.id);
    } else {
      let index = categories.indexOf(e.target.id);
      categories.splice(index, 1);
    }
    setState({
      ...state,
      formData: { ...state.formData, categories: categories },
    });
  };

  const handleCheckSeason = (e) => {
    let seasons = state.formData.seasons;
    if (e.target.checked === true) {
      seasons.push(e.target.id);
    } else {
      let index = seasons.indexOf(e.target.id);
      seasons.splice(index, 1);
    }
    setState({
      ...state,
      formData: { ...state.formData, seasons: seasons },
    });
  };

  const handleCheckRegion = (e) => {
    setState({
      ...state,
      formData: { ...state.formData, region: e.target.id },
    });
  };

  const handleCheckPlaceType = (e) => {
    setState({
      ...state,
      formData: { ...state.formData, placeType: e.target.id },
    });
  };

  const handleCheckOrganization = (e) => {
    setState({
      ...state,
      formData: { ...state.formData, organization: e.target.id },
    });
  };

  const handleChange = (e) => {
    setState({
      ...state,
      formData: {
        ...state.formData,
        [e.target.name]: e.target.value,
        emptyForm: false,
      },
    });
  };

  const submitPlace = async () => {
    const slug = await slugify(state.formData.title, {
      remove: /[*+~.,()'"!:@]/g,
      lower: true,
    });
    const {
      type,
      title,
      subtitle,
      categories,
      seasons,
      region,
      placeType,
      coverCloudImage,
      cloudImages,
      description,
      phone,
      website,
      place_full_address,
      place_locality,
      place_province,
      place_state,
      place_country,
      place_lat,
      place_lng,
      place_rating,
      place_id,
      place_opening_hours,
      price,
      organization,
    } = state.formData;
    service
      .place(
        type,
        slug,
        title,
        subtitle,
        categories,
        seasons,
        region,
        placeType,
        coverCloudImage,
        cloudImages,
        description,
        phone,
        website,
        place_full_address,
        place_locality,
        place_province,
        place_state,
        place_country,
        place_lat,
        place_lng,
        place_rating,
        place_id,
        place_opening_hours,
        price,
        organization
      )
      .then(() => {
        service.editUserPlan(user._id, true, true, true, true);
        paymentService.editUserSubscription();
        Router.push("/dashboard");
      })
      .catch((err) => console.error(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFileUpload();
  };

  useEffect(() => {
    if (
      state.formData.cloudImagesUploaded === true &&
      state.formData.coverCloudImageUploaded === true
    ) {
      submitPlace();
    }
  }, [state.formData]);

  useEffect(() => {
    const {
      title,
      subtitle,
      categories,
      seasons,
      region,
      placeType,
      place_full_address,
      phone,
      website,
      coverImage,
      images,
      price,
      description,
      organization,
    } = state.formData;

    if (
      title &&
      subtitle &&
      categories &&
      seasons &&
      region &&
      placeType &&
      place_full_address &&
      phone &&
      website &&
      images.length > 0 &&
      coverImage !== "" &&
      description &&
      price &&
      organization
    ) {
      setState((state) => ({ ...state, isReadyToSubmit: true }));
    }
  }, [state.formData]);

  useEffect(() => {
    if (router.query.step === "publicacio-fitxa") {
      setState({ ...state, step: "publicacio-fitxa" });
    }
  }, [router]);

  let funnelSteps;
  if (state.step) {
    funnelSteps = (
      <>
        <div className="funnel-steps-wrapper" style={{ marginTop: "60px" }}>
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
            <li className={state.step === "publicacio-fitxa" ? "active" : null}>
              Pas 4
            </li>
          </ul>
        </div>
      </>
    );
  }

  let organizationsList = [];
  if (state.formData.userOrganizations !== undefined) {
    organizationsList = state.formData.userOrganizations.organizations.map(
      (el, idx) => (
        <label key={idx}>
          <input
            value={el.orgName}
            name="orgName"
            type="radio"
            id={el._id}
            onChange={handleCheckOrganization}
          />
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
        </label>
      )
    );
  }

  return (
    <>
      <Head>
        <title>
          Potencia la visibilitat del teu allotjament - Escapadesenparella.cat
        </title>
      </Head>

      <div id="place" className="composer">
        <NavigationBar
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
          }
          user={user}
          path={queryId}
        />
        <Container className="mw-1600">
          <section className="funnel-steps">
            <Row>
              <Col lg={12}>{funnelSteps}</Col>
            </Row>
          </section>
          <Row>
            <Col lg={12} className="sided-shadow">
              <div className="form-composer">
                <h1>Potencia la visibilitat del teu allotjament</h1>
                <p className="sub-h1">
                  Descriu l'allotjament per arribar a parelles d'arreu de
                  Catalunya
                </p>
              </div>
              <Form>
                <Form.Group style={{ display: "inline-block" }}>
                  <Form.Label>Empresa propietària</Form.Label>
                  <div className="organizations-list">{organizationsList}</div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Títol</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="Títol de l'allotjament"
                    onChange={handleChange}
                    value={state.formData.title}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Subtítol</Form.Label>
                  <Form.Control
                    type="text"
                    name="subtitle"
                    placeholder="Subtítol de l'allotjament"
                    onChange={handleChange}
                    value={state.formData.subtitle}
                  />
                </Form.Group>
                <Form.Row>
                  <Col lg={3}>
                    <Form.Group>
                      <Form.Label>Categories</Form.Label>
                      <Form.Check
                        type="checkbox"
                        name="romantica"
                        id="romantica"
                        label="Romàntica"
                        onChange={handleCheckCategory}
                      />
                      <Form.Check
                        type="checkbox"
                        name="aventura"
                        id="aventura"
                        label="Aventura"
                        onChange={handleCheckCategory}
                      />
                      <Form.Check
                        type="checkbox"
                        name="gastronomica"
                        id="gastronomica"
                        label="Gastronòmica"
                        onChange={handleCheckCategory}
                      />
                      <Form.Check
                        type="checkbox"
                        name="cultural"
                        id="cultural"
                        label="Cultural"
                        onChange={handleCheckCategory}
                      />
                      <Form.Check
                        type="checkbox"
                        name="relax"
                        id="relax"
                        label="Relax"
                        onChange={handleCheckCategory}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={3}>
                    <Form.Group>
                      <Form.Label>Estació de l'any</Form.Label>
                      <Form.Check
                        type="checkbox"
                        name="hivern"
                        id="hivern"
                        label="Hivern"
                        onChange={handleCheckSeason}
                      />
                      <Form.Check
                        type="checkbox"
                        name="primavera"
                        id="primavera"
                        label="Primavera"
                        onChange={handleCheckSeason}
                      />
                      <Form.Check
                        type="checkbox"
                        name="estiu"
                        id="estiu"
                        label="Estiu"
                        onChange={handleCheckSeason}
                      />
                      <Form.Check
                        type="checkbox"
                        name="tardor"
                        id="tardor"
                        label="Tardor"
                        onChange={handleCheckSeason}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={3}>
                    <Form.Group>
                      <Form.Group>
                        <Form.Label>Regió</Form.Label>
                        <Form.Check
                          type="radio"
                          id="barcelona"
                          label="Barcelona"
                          name="activitySeason"
                          onChange={handleCheckRegion}
                        />
                        <Form.Check
                          type="radio"
                          id="tarragona"
                          label="Tarragona"
                          name="activitySeason"
                          onChange={handleCheckRegion}
                        />
                        <Form.Check
                          type="radio"
                          id="girona"
                          label="Girona"
                          name="activitySeason"
                          onChange={handleCheckRegion}
                        />
                        <Form.Check
                          type="radio"
                          id="lleida"
                          label="Lleida"
                          name="activitySeason"
                          onChange={handleCheckRegion}
                        />
                        <Form.Check
                          type="radio"
                          id="costaBrava"
                          label="Costa Brava"
                          name="activitySeason"
                          onChange={handleCheckRegion}
                        />
                        <Form.Check
                          type="radio"
                          id="costaDaurada"
                          label="Costa Daurada"
                          name="activitySeason"
                          onChange={handleCheckRegion}
                        />
                        <Form.Check
                          type="radio"
                          id="pirineus"
                          label="Pirineus"
                          name="activitySeason"
                          onChange={handleCheckRegion}
                        />
                      </Form.Group>
                    </Form.Group>
                  </Col>
                  <Col lg={3}>
                    <Form.Group>
                      <Form.Group>
                        <Form.Label>Tipus d'allotjament</Form.Label>
                        <Form.Check
                          type="radio"
                          id="hotel"
                          label="Hotel"
                          name="placeType"
                          onChange={handleCheckPlaceType}
                        />
                        <Form.Check
                          type="radio"
                          id="apartament"
                          label="Apartament"
                          name="placeType"
                          onChange={handleCheckPlaceType}
                        />
                        <Form.Check
                          type="radio"
                          id="refugi"
                          label="Cabanya"
                          name="placeType"
                          onChange={handleCheckPlaceType}
                        />
                        <Form.Check
                          type="radio"
                          id="casaarbre"
                          label="Casa-arbre"
                          name="placeType"
                          onChange={handleCheckPlaceType}
                        />
                        <Form.Check
                          type="radio"
                          id="casarural"
                          label="Casa rural"
                          name="placeType"
                          onChange={handleCheckPlaceType}
                        />
                        <Form.Check
                          type="radio"
                          id="carabana"
                          label="Carabana"
                          name="placeType"
                          onChange={handleCheckPlaceType}
                        />
                      </Form.Group>
                    </Form.Group>
                  </Col>
                </Form.Row>
                <Form.Group>
                  <Form.Label>Localització</Form.Label>
                  <Autocomplete
                    className="location-control"
                    apiKey={`${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`}
                    style={{ width: "100%" }}
                    onPlaceSelected={(place) => {
                      let place_full_address,
                        place_locality,
                        place_province,
                        place_state,
                        place_country,
                        place_lat,
                        place_lng,
                        place_rating,
                        place_id,
                        place_opening_hours;

                      place_full_address = place.formatted_address;
                      place.address_components.forEach((el) => {
                        if (el.types[0] === "locality") {
                          place_locality = el.long_name;
                        }
                        if (el.types[0] === "administrative_area_level_2") {
                          place_province = el.long_name;
                        }
                        if (el.types[0] === "administrative_area_level_1") {
                          place_state = el.long_name;
                        }
                        if (el.types[0] === "country") {
                          place_country = el.long_name;
                        }
                      });

                      if (place.geometry.viewport) {
                        place_lat = Object.values(place.geometry.viewport)[0].i;
                        place_lng = Object.values(place.geometry.viewport)[1].i;
                      }

                      place_rating = place.rating;
                      place_id = place.place_id;

                      if (place.opening_hours) {
                        place_opening_hours = place.opening_hours.weekday_text;
                      }

                      setState({
                        ...state,
                        formData: {
                          ...state.formData,
                          place_full_address: place_full_address,
                          place_locality: place_locality,
                          place_province: place_province,
                          place_state: place_state,
                          place_country: place_country,
                          place_lat: place_lat,
                          place_lng: place_lng,
                          place_rating: place_rating,
                          place_id: place_id,
                          place_opening_hours: place_opening_hours,
                        },
                      });
                    }}
                    types={["establishment"]}
                    placeholder={"Escriu la direcció de l'allotjament"}
                    fields={[
                      "rating",
                      "place_id",
                      "opening_hours",
                      "address_components",
                      "formatted_address",
                      "geometry",
                    ]}
                  />
                </Form.Group>
                <Form.Row>
                  <Col lg={4}>
                    <Form.Group>
                      <Form.Label>Telèfon</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        placeholder="Número de telèfon de contacte"
                        onChange={handleChange}
                        value={state.formData.phone}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={4}>
                    <Form.Group>
                      <Form.Label>Pàgina web</Form.Label>
                      <Form.Control
                        type="url"
                        name="website"
                        placeholder="Pàgina web de reserva o contacte"
                        onChange={handleChange}
                        value={state.formData.website}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={4}>
                    <Form.Group>
                      <Form.Label>Preu per nit (€)</Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        placeholder="Preu per nit de l'allotjament"
                        onChange={handleChange}
                        value={state.formData.price}
                      />
                    </Form.Group>
                  </Col>
                </Form.Row>
                <div className="cover">
                  <span>Imatge de portada</span>
                  <div className="images-wrapper">
                    <div className="top-bar">
                      <Form.Group>
                        <div className="image-drop-zone">
                          <Form.Label>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="icon icon-tabler icon-tabler-camera-plus"
                              width="22"
                              height="22"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="#0d1f44"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
                              <circle cx="12" cy="13" r="3" />
                              <path d="M5 7h2a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h2m9 7v7a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
                              <line x1="15" y1="6" x2="21" y2="6" />
                              <line x1="18" y1="3" x2="18" y2="9" />
                            </svg>
                            Afegir imatge
                            <Form.Control
                              type="file"
                              name="cover"
                              onChange={saveFileToStatus}
                              max="1"
                            />
                          </Form.Label>
                        </div>
                      </Form.Group>
                    </div>
                    <div className="images-list-wrapper">
                      <div className="image-wrapper">{coverImage}</div>
                    </div>
                  </div>
                </div>
                <div className="images">
                  <span>Imatges d'aquest allotjament</span>
                  <div className="images-wrapper">
                    <div className="top-bar">
                      <Form.Group>
                        <div className="image-drop-zone">
                          <Form.Label>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="icon icon-tabler icon-tabler-camera-plus"
                              width="22"
                              height="22"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="#0d1f44"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
                              <circle cx="12" cy="13" r="3" />
                              <path d="M5 7h2a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h2m9 7v7a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
                              <line x1="15" y1="6" x2="21" y2="6" />
                              <line x1="18" y1="3" x2="18" y2="9" />
                            </svg>
                            Afegir imatge
                            <Form.Control
                              type="file"
                              onChange={saveFileToStatus}
                            />
                          </Form.Label>
                        </div>
                      </Form.Group>
                    </div>
                    <div className="images-list-wrapper">
                      <div className="image-wrapper">{imagesList}</div>
                    </div>
                  </div>
                </div>
                <Form.Group>
                  <Form.Label>Descripció</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows="5"
                    type="text"
                    name="description"
                    placeholder="Descripció de l'allotjament"
                    onChange={handleChange}
                    value={state.formData.description}
                  />
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Container>
        <div className="progress-bar-outter">
          <Container className="d-flex align-items-center">
            <div className="col left">{/* <span>Section 1 of 7 </span> */}</div>
            <div className="col center">
              {/* <div className="progress">
							<div
								className="progress-bar"
								role="progressbar"
								style={{width: "33%"}}
								aria-valuenow="25"
								aria-valuemin="0"
								aria-valuemax="100"
							></div>
						</div> */}
            </div>
            <div className="col right">
              <div className="buttons d-flex justify-space-between justify-content-end">
                {state.isReadyToSubmit ? (
                  <Button type="submit" variant="none" onClick={handleSubmit}>
                    Publicar
                  </Button>
                ) : (
                  <Button type="submit" variant="none" disabled>
                    Publicar
                  </Button>
                )}
              </div>
            </div>
          </Container>
        </div>
      </div>
    </>
  );
};

export default PlaceForm;
