import { useState, useEffect, useContext } from "react";
import NavigationBar from "../../../components/global/NavigationBar";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import ContentService from "../../../services/contentService";
import { useRouter } from "next/router";
import Autocomplete from "react-google-autocomplete";
import UserContext from "../../../contexts/UserContext";
import Head from "next/head";
import slugify from "slugify";

const ActivityEditionForm = () => {
  const { user } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
    if (
      router.pathname.includes("editar") ||
      router.pathname.includes("nova-activitat") ||
      router.pathname.includes("nou-allotjament") ||
      router.pathname.includes("nova-historia")
    ) {
      document.querySelector("body").classList.add("composer");
    } else {
      document.querySelector("body").classList.remove("composer");
    }
  }, [user, router]);

  if (!user) {
    return (
      <Head>
        <title>Carregant...</title>
      </Head>
    );
  }

  const initialState = {
    activity: {},
    formData: {
      emptyForm: true,
      type: "activity",
      title: "",
      subtitle: "",
      categories: [],
      seasons: [],
      region: "",
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
      activity_full_address: "",
      activity_locality: "",
      activity_province: "",
      activity_state: "",
      activity_country: "",
      activity_lat: "",
      activity_lng: "",
      activity_rating: 0,
      activity_place_id: "",
      activity_opening_hours: "",
      duration: "",
      price: "",
      userOrganizations: "",
      isReadyToSubmit: false,
      metaTitle: "",
      metaDescription: "",
    },
    isActivityLoaded: false,
  };
  const [state, setState] = useState(initialState);
  const [queryId, setQueryId] = useState(null);
  const [activeTab, setActiveTab] = useState("main");

  useEffect(() => {
    if (router && router.query) {
      setQueryId(router.query.slug);
    }
  }, [router]);

  const service = new ContentService();

  useEffect(() => {
    if (router.query.slug !== undefined) {
      const fetchData = async () => {
        const userOrganizations = await service.checkOrganizationsOwned();
        let hasOrganizations;
        userOrganizations.number > 0
          ? (hasOrganizations = true)
          : (hasOrganizations = false);
        let activityDetails = await service.activityDetails(router.query.slug);
        setState({
          activity: activityDetails,
          formData: {
            _id: activityDetails._id,
            type: activityDetails.type,
            title: activityDetails.title,
            subtitle: activityDetails.subtitle,
            categories: activityDetails.categories,
            seasons: activityDetails.seasons,
            region: activityDetails.region,
            cover: activityDetails.cover,
            blopCover: "",
            images: [],
            blopImages: [],
            cloudImages: [],
            coverCloudImage: "",
            cloudImagesUploaded: false,
            coverCloudImageUploaded: false,
            phone: activityDetails.phone,
            website: activityDetails.website,
            activity_full_address: "",
            activity_locality: "",
            activity_province: "",
            activity_state: "",
            activity_country: "",
            activity_lat: "",
            activity_lng: "",
            activity_rating: 0,
            activity_place_id: "",
            activity_opening_hours: "",
            duration: "",
            price: "",
            metaTitle: activityDetails.metaTitle,
            metaDescription: activityDetails.metaDescription,
            userOrganizations: userOrganizations,
          },
          isActivityLoaded: true,
        });
      };
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryId]);

  const saveFileToStatus = (e) => {
    const fileToUpload = e.target.files[0];
    if (e.target.name === "cover") {
      setState({
        ...state,
        formData: {
          ...state.formData,
          blopCover: URL.createObjectURL(fileToUpload),
          cover: fileToUpload,
          updatedCover: true,
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
          updatedImages: true,
        },
      });
    }
  };

  let imagesList, coverImage;

  if (
    state.activity.images ||
    state.formData.blopImages ||
    state.formData.images
  ) {
    let stateImages;
    state.formData.blopImages.length > 0
      ? (stateImages = state.formData.blopImages)
      : (stateImages = state.activity.images);
    if (stateImages) {
      imagesList = stateImages.map((el, idx) => (
        <div className="image" key={idx}>
          <img src={el} />
        </div>
      ));
    }
  }

  if (
    state.activity.cover ||
    state.formData.blopCover ||
    state.formData.cover
  ) {
    let stateCover;
    state.formData.blopCover !== ""
      ? (stateCover = state.formData.blopCover)
      : (stateCover = state.activity.cover);
    coverImage = (
      <div className="image">
        <img src={stateCover} />
        <button></button>
      </div>
    );
  }

  let selectedOrganization;
  if (state.formData.userOrganizations) {
    if (state.formData.userOrganizations.organizations) {
      state.formData.userOrganizations.organizations.forEach((el) => {
        if (state.activity.organization) {
          if (el._id === state.activity.organization._id) {
            selectedOrganization = state.activity.organization._id;
          }
        }
      });
    }
  }

  let isRomantic,
    isAdventure,
    isGastronomic,
    isCultural,
    isRelax,
    isWinter,
    isSpring,
    isSummer,
    isAutumn,
    isBarcelona,
    isTarragona,
    isGirona,
    isLleida,
    isCostaBrava,
    isCostaDaurada,
    isPirineus;

  if (state.activity.categories) {
    state.activity.categories.includes("romàntica")
      ? (isRomantic = true)
      : (isRomantic = false);
    state.activity.categories.includes("aventura")
      ? (isAdventure = true)
      : (isAdventure = false);
    state.activity.categories.includes("gastronòmica")
      ? (isGastronomic = true)
      : (isGastronomic = false);
    state.activity.categories.includes("cultural")
      ? (isCultural = true)
      : (isCultural = false);
    state.activity.categories.includes("relax")
      ? (isRelax = true)
      : (isRelax = false);
  }
  if (state.activity.seasons) {
    state.activity.seasons.includes("hivern")
      ? (isWinter = true)
      : (isWinter = false);
    state.activity.seasons.includes("primavera")
      ? (isSpring = true)
      : (isSpring = false);
    state.activity.seasons.includes("estiu")
      ? (isSummer = true)
      : (isSummer = false);
    state.activity.seasons.includes("tardor")
      ? (isAutumn = true)
      : (isAutumn = false);
  }
  if (state.activity.region) {
    state.activity.region.includes("barcelona")
      ? (isBarcelona = true)
      : (isBarcelona = false);
    state.activity.region.includes("tarragona")
      ? (isTarragona = true)
      : (isTarragona = false);
    state.activity.region.includes("girona")
      ? (isGirona = true)
      : (isGirona = false);
    state.activity.region.includes("lleida")
      ? (isLleida = true)
      : (isLleida = false);
    state.activity.region.includes("costaBrava")
      ? (isCostaBrava = true)
      : (isCostaBrava = false);
    state.activity.region.includes("costaDaurada")
      ? (isCostaDaurada = true)
      : (isCostaDaurada = false);
    state.activity.region.includes("pirineus")
      ? (isPirineus = true)
      : (isPirineus = false);
  }

  const {
    title,
    subtitle,
    activity_full_address,
    phone,
    website,
    price,
    duration,
    description,
    metaTitle,
    metaDescription,
  } = state.activity;

  const submitActivity = async () => {
    const slug = await slugify(state.activity.title, {
      remove: /[*+~.,()'"!:@]/g,
      lower: true,
    });
    const {
      _id,
      title,
      subtitle,
      categories,
      seasons,
      region,
      cover,
      images,
      description,
      phone,
      website,
      activity_full_address,
      activity_locality,
      activity_province,
      activity_state,
      activity_country,
      activity_lat,
      activity_lng,
      activity_rating,
      activity_place_id,
      activity_opening_hours,
      duration,
      price,
      metaTitle,
      metaDescription,
    } = state.activity;
    const { coverCloudImage, cloudImages } = state.formData;
    const { organization } = state;
    let activityCover, activityImages;
    coverCloudImage !== ""
      ? (activityCover = coverCloudImage)
      : (activityCover = cover);
    cloudImages.length > 0
      ? (activityImages = cloudImages)
      : (activityImages = images);
    service
      .editActivity(
        _id,
        slug,
        title,
        subtitle,
        categories,
        seasons,
        region,
        activityCover,
        activityImages,
        description,
        phone,
        website,
        activity_full_address,
        activity_locality,
        activity_province,
        activity_state,
        activity_country,
        activity_lat,
        activity_lng,
        activity_rating,
        activity_place_id,
        activity_opening_hours,
        duration,
        price,
        organization,
        metaTitle,
        metaDescription
      )
      .then(() => router.push("/dashboard"));
  };

  const handleFileUpload = (e) => {
    const cover = state.formData.cover;
    let uploadedCover = "";
    const uploadData = new FormData();
    if (state.formData.updatedCover) {
      uploadData.append("imageUrl", cover);
      service.uploadFile(uploadData).then((res) => {
        setState({
          ...state,
          formData: {
            ...state.formData,
            coverCloudImage: res.path,
            coverCloudImageUploaded: true,
          },
        });
      });
    }
    if (state.formData.updatedImages) {
      const imagesList = state.formData.images;
      let uploadedImages = [];
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
                cloudImagesUploaded: true,
              },
            });
          }
        });
      });
    }
    if (state.formData.updatedImages && state.formData.updatedCover) {
      const imagesList = state.formData.images;
      const cover = state.formData.cover;
      let uploadedImages = [];
      let uploadedCover = "";
      const uploadData = new FormData();
      uploadData.append("imageUrl", cover);
      service.uploadFile(uploadData).then((res) => {
        uploadedCover = res.path;
      });

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
                coverCloudImage: uploadedCover,
                cloudImagesUploaded: true,
                coverCloudImageUploaded: true,
              },
            });
          }
        });
      });
    }
  };

  const handleCheckCategory = (e) => {
    let categories = state.activity.categories;
    if (e.target.checked === true) {
      categories.push(e.target.id);
    } else {
      let index = categories.indexOf(e.target.id);
      categories.splice(index, 1);
    }
    setState({
      ...state,
      activity: { ...state.activity, categories: categories },
    });
  };

  const handleCheckSeason = (e) => {
    let seasons = state.activity.seasons;
    if (e.target.checked === true) {
      seasons.push(e.target.id);
    } else {
      let index = seasons.indexOf(e.target.id);

      seasons.splice(index, 1);
    }
    setState({
      ...state,
      activity: { ...state.activity, seasons: seasons },
    });
  };

  const handleCheckRegion = (e) => {
    setState({
      ...state,
      activity: { ...state.activity, region: e.target.id },
    });
  };

  const handleCheckOrganization = (e) => {
    setState({
      ...state,
      organization: e.target.id,
    });
  };

  const handleChange = (e) =>
    setState({
      ...state,
      activity: { ...state.activity, [e.target.name]: e.target.value },
    });

  useEffect(() => {
    if (
      state.formData.cloudImagesUploaded === true ||
      state.formData.coverCloudImageUploaded === true
    ) {
      submitActivity();
    }
  }, [state.formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (state.formData.updatedImages || state.formData.updatedCover) {
      handleFileUpload();
    } else {
      submitActivity();
    }
  };

  let organizationsList = [];
  if (state.formData.userOrganizations !== undefined) {
    if (state.formData.userOrganizations.organizations !== undefined) {
      organizationsList = state.formData.userOrganizations.organizations.map(
        (el, idx) => {
          let isChecked;
          if (!state.organization) {
            if (selectedOrganization === el._id) {
              isChecked = true;
            }
          }
          return (
            <label key={idx}>
              <input
                value={el.orgName}
                name="orgName"
                type="radio"
                id={el._id}
                onChange={handleCheckOrganization}
                checked={isChecked}
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
          );
        }
      );
    }
  }

  return (
    <>
      <Head>
        <title>Edita l'activitat - Escapadesenparella.cat</title>
      </Head>
      <div id="activity">
        <NavigationBar
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
          }
          user={user}
          path={queryId}
        />
        <Container className="mw-1600">
          <Row>
            <Col lg={12}>
              <div className="form-composer">
                <div className="form-composer__header">
                  <div className="form-composer__header-left">
                    <h1>Editar l'activitat</h1>
                    <p className="sub-h1">
                      Edita i desa els canvis de la teva activitat
                    </p>
                  </div>
                  <div className="form-composer__header-right">
                    <Button type="submit" variant="none" onClick={handleSubmit}>
                      Guardar canvis
                    </Button>
                  </div>
                </div>
                <div className="form-composer__body">
                  <div className="form-composer__tab-bar">
                    <button
                      className={
                        activeTab === "main"
                          ? "form-composer__tab active"
                          : "form-composer__tab"
                      }
                      onClick={() => setActiveTab("main")}
                    >
                      Contingut principal
                    </button>
                    <button
                      className={
                        activeTab === "seo"
                          ? "form-composer__tab active"
                          : "form-composer__tab"
                      }
                      onClick={() => setActiveTab("seo")}
                    >
                      SEO
                    </button>
                  </div>
                  {activeTab === "main" ? (
                    <div className="form-composer__post-content">
                      <Form onSubmit={handleSubmit}>
                        <Form.Group style={{ display: "inline-block" }}>
                          <Form.Label>Empresa propietària</Form.Label>
                          <div className="organizations-list">
                            {organizationsList}
                          </div>
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Títol</Form.Label>
                          <Form.Control
                            type="text"
                            name="title"
                            placeholder="Títol de l'activitat"
                            defaultValue={title}
                            onChange={handleChange}
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Subtítol</Form.Label>
                          <Form.Control
                            type="text"
                            name="subtitle"
                            placeholder="Subtítol de l'activitat"
                            defaultValue={subtitle}
                            onChange={handleChange}
                          />
                        </Form.Group>
                        <Form.Row>
                          <Col lg={4}>
                            <Form.Group>
                              <Form.Label>Categoria d'escapada</Form.Label>
                              <Form.Check
                                type="checkbox"
                                name="romantica"
                                id="romantica"
                                label="Romàntica"
                                onChange={handleCheckCategory}
                                checked={isRomantic}
                              />
                              <Form.Check
                                type="checkbox"
                                name="aventura"
                                id="aventura"
                                label="Aventura"
                                onChange={handleCheckCategory}
                                checked={isAdventure}
                              />

                              <Form.Check
                                type="checkbox"
                                name="gastronomica"
                                id="gastronomica"
                                label="Gastronòmica"
                                onChange={handleCheckCategory}
                                checked={isGastronomic}
                              />
                              <Form.Check
                                type="checkbox"
                                name="cultural"
                                id="cultural"
                                label="Cultural"
                                onChange={handleCheckCategory}
                                checked={isCultural}
                              />
                              <Form.Check
                                type="checkbox"
                                name="relax"
                                id="relax"
                                label="Relax"
                                onChange={handleCheckCategory}
                                checked={isRelax}
                              />
                            </Form.Group>
                          </Col>
                          <Col lg={4}>
                            <Form.Group>
                              <Form.Label>Estació recomanada</Form.Label>
                              <Form.Check
                                type="checkbox"
                                name="hivern"
                                id="hivern"
                                label="Hivern"
                                onChange={handleCheckSeason}
                                checked={isWinter}
                              />
                              <Form.Check
                                type="checkbox"
                                name="primavera"
                                id="primavera"
                                label="Primavera"
                                onChange={handleCheckSeason}
                                checked={isSpring}
                              />
                              <Form.Check
                                type="checkbox"
                                name="estiu"
                                id="estiu"
                                label="Estiu"
                                onChange={handleCheckSeason}
                                checked={isSummer}
                              />
                              <Form.Check
                                type="checkbox"
                                name="tardor"
                                id="tardor"
                                label="Tardor"
                                onChange={handleCheckSeason}
                                checked={isAutumn}
                              />
                            </Form.Group>
                          </Col>
                          <Col lg={4}>
                            <Form.Group>
                              <Form.Group>
                                <Form.Label>Regió de l'activitat</Form.Label>
                                <Form.Check
                                  type="radio"
                                  id="barcelona"
                                  label="Barcelona"
                                  name="activitySeason"
                                  onChange={handleCheckRegion}
                                  checked={isBarcelona}
                                />
                                <Form.Check
                                  type="radio"
                                  id="tarragona"
                                  label="Tarragona"
                                  name="activitySeason"
                                  onChange={handleCheckRegion}
                                  checked={isTarragona}
                                />
                                <Form.Check
                                  type="radio"
                                  id="girona"
                                  label="Girona"
                                  name="activitySeason"
                                  onChange={handleCheckRegion}
                                  checked={isGirona}
                                />
                                <Form.Check
                                  type="radio"
                                  id="lleida"
                                  label="Lleida"
                                  name="activitySeason"
                                  onChange={handleCheckRegion}
                                  checked={isLleida}
                                />
                                <Form.Check
                                  type="radio"
                                  id="costaBrava"
                                  label="Costa Brava"
                                  name="activitySeason"
                                  onChange={handleCheckRegion}
                                  checked={isCostaBrava}
                                />
                                <Form.Check
                                  type="radio"
                                  id="costaDaurada"
                                  label="Costa Daurada"
                                  name="activitySeason"
                                  onChange={handleCheckRegion}
                                  checked={isCostaDaurada}
                                />
                                <Form.Check
                                  type="radio"
                                  id="pirineus"
                                  label="Pirineus"
                                  name="activitySeason"
                                  onChange={handleCheckRegion}
                                  checked={isPirineus}
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
                            defaultValue={activity_full_address}
                            onPlaceSelected={(activity) => {
                              let activity_full_address,
                                activity_locality,
                                activity_province,
                                activity_state,
                                activity_country,
                                activity_lat,
                                activity_lng,
                                activity_rating,
                                activity_id,
                                activity_opening_hours;

                              activity_full_address =
                                activity.formatted_address;
                              activity.address_components.forEach((el) => {
                                if (el.types[0] === "locality") {
                                  activity_locality = el.long_name;
                                }
                                if (
                                  el.types[0] === "administrative_area_level_2"
                                ) {
                                  activity_province = el.long_name;
                                }
                                if (
                                  el.types[0] === "administrative_area_level_1"
                                ) {
                                  activity_state = el.long_name;
                                }
                                if (el.types[0] === "country") {
                                  activity_country = el.long_name;
                                }
                              });

                              if (activity.geometry.viewport) {
                                activity_lat = Object.values(
                                  activity.geometry.viewport
                                )[0].i;
                                activity_lng = Object.values(
                                  activity.geometry.viewport
                                )[1].i;
                              }

                              activity_rating = activity.rating;
                              activity_id = activity.place_id;

                              if (activity.opening_hours) {
                                activity_opening_hours =
                                  activity.opening_hours.weekday_text;
                              }

                              setState({
                                ...state,
                                activity: {
                                  ...state.activity,
                                  activity_full_address: activity_full_address,
                                  activity_locality: activity_locality,
                                  activity_province: activity_province,
                                  activity_state: activity_state,
                                  activity_country: activity_country,
                                  activity_lat: activity_lat,
                                  activity_lng: activity_lng,
                                  activity_rating: activity_rating,
                                  activity_id: activity_id,
                                  activity_opening_hours:
                                    activity_opening_hours,
                                },
                              });
                            }}
                            types={["establishment"]}
                            placeholder={
                              "Escriu la localització de l'activitat"
                            }
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
                          <Col lg={6}>
                            <Form.Group>
                              <Form.Label>Número de telèfon</Form.Label>
                              <Form.Control
                                type="tel"
                                name="phone"
                                placeholder="Phone number for contact details"
                                onChange={handleChange}
                                value={phone}
                              />
                            </Form.Group>
                          </Col>
                          <Col lg={6}>
                            <Form.Group>
                              <Form.Label>Pàgina web</Form.Label>
                              <Form.Control
                                type="url"
                                name="website"
                                placeholder="Activity website"
                                onChange={handleChange}
                                value={website}
                              />
                            </Form.Group>
                          </Col>
                        </Form.Row>
                        <Form.Row>
                          <Col lg={6}>
                            <Form.Group>
                              <Form.Label>Preu per persona (€)</Form.Label>
                              <Form.Control
                                type="number"
                                name="price"
                                placeholder="Activity price"
                                onChange={handleChange}
                                value={price}
                              />
                            </Form.Group>
                          </Col>
                          <Col lg={6}>
                            <Form.Group>
                              <Form.Label>Durada (h)</Form.Label>
                              <Form.Control
                                type="number"
                                name="duration"
                                placeholder="Activity duration"
                                onChange={handleChange}
                                value={duration}
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
                                    {state.formData.cover
                                      ? "Canviar imatge"
                                      : "Seleccionar imatge"}

                                    <Form.Control
                                      type="file"
                                      name="cover"
                                      onChange={saveFileToStatus}
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
                          <span>Imatges d'aquesta història</span>
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
                                    Seleccionar imatges
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
                            rows="10"
                            type="text"
                            name="description"
                            placeholder="Activity description"
                            defaultValue={description}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Form>
                    </div>
                  ) : (
                    <div className="form-composer__seo">
                      <Form onSubmit={handleSubmit}>
                        <Form.Group>
                          <Form.Label>
                            Meta títol{" "}
                            <span className="form-composer__label-description">
                              Cada publicació hauria de tenir un meta títol
                              únic, idealment de menys de 60 caràcters de
                              llargada
                            </span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="metaTitle"
                            placeholder="Meta títol"
                            defaultValue={metaTitle}
                            onChange={handleChange}
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>
                            Meta descripció{" "}
                            <span className="form-composer__label-description">
                              Cada publicació hauria de tenir una meta
                              descripció única, idealment de menys de 160
                              caràcters de llargada
                            </span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="metaDescription"
                            placeholder="Meta descripció"
                            defaultValue={metaDescription}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Form>
                    </div>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default ActivityEditionForm;
