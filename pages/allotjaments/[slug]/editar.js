import { useState, useEffect, useContext } from "react";
import NavigationBar from "../../../components/global/NavigationBar";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import ContentService from "../../../services/contentService";
import Router, { useRouter } from "next/router";
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
    place: {},
    formData: {
      emptyForm: true,
      type: "place",
      title: "",
      subtitle: "",
      slug: "slug",
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
      isReadyToSubmit: false,
      metaTitle: "",
      metaDescription: "",
    },
    isPlaceLoaded: false,
  };
  const [state, setState] = useState(initialState);
  const [queryId, setQueryId] = useState(null);
  const [activeTab, setActiveTab] = useState("main");

  useEffect(() => {
    if (router && router.query) {
      setQueryId(router.query.id);
    }
  }, [router]);

  const service = new ContentService();

  useEffect(() => {
    if (router.query.slug !== undefined) {
      const fetchData = async () => {
        let placeDetails = await service.getPlaceDetails(router.query.slug);
        setState({
          ...state,
          place: placeDetails,
          formData: {
            _id: placeDetails._id,
            type: placeDetails.type,
            title: placeDetails.title,
            subtitle: placeDetails.subtitle,
            slug: placeDetails.slug,
            categories: placeDetails.categories,
            seasons: placeDetails.seasons,
            region: placeDetails.region,
            placeType: placeDetails.placeType,
            cover: placeDetails.cover,
            blopCover: "",
            images: [],
            blopImages: [],
            cloudImages: [],
            coverCloudImage: "",
            cloudImagesUploaded: false,
            coverCloudImageUploaded: false,
            phone: placeDetails.phone,
            website: placeDetails.website,
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
            metaTitle: placeDetails.metaTitle,
            metaDescription: placeDetails.metaDescription,
          },
          isPlaceLoaded: true,
        });
      };
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryId, router.query.slug]);

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
    state.place.images ||
    state.formData.blopImages ||
    state.formData.images
  ) {
    let stateImages;
    state.formData.blopImages.length > 0
      ? (stateImages = state.formData.blopImages)
      : (stateImages = state.place.images);
    if (stateImages) {
      imagesList = stateImages.map((el, idx) => (
        <div className="image" key={idx}>
          <img src={el} />
        </div>
      ));
    }
  }

  if (state.formData.blopCover || state.formData.cover) {
    coverImage = (
      <div className="image">
        <img src={state.formData.blopCover || state.formData.cover} />
        <button></button>
      </div>
    );
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
    isPirineus,
    isApartment,
    isCabin,
    isTreehouse,
    isRuralHouse,
    isTrailer,
    isHotel;

  if (state.place.categories) {
    state.place.categories.includes("romantica")
      ? (isRomantic = true)
      : (isRomantic = false);
    state.place.categories.includes("aventura")
      ? (isAdventure = true)
      : (isAdventure = false);
    state.place.categories.includes("gastronomica")
      ? (isGastronomic = true)
      : (isGastronomic = false);
    state.place.categories.includes("cultural")
      ? (isCultural = true)
      : (isCultural = false);
    state.place.categories.includes("relax")
      ? (isRelax = true)
      : (isRelax = false);
  }
  if (state.place.seasons) {
    state.place.seasons.includes("hivern")
      ? (isWinter = true)
      : (isWinter = false);
    state.place.seasons.includes("primavera")
      ? (isSpring = true)
      : (isSpring = false);
    state.place.seasons.includes("estiu")
      ? (isSummer = true)
      : (isSummer = false);
    state.place.seasons.includes("tardor")
      ? (isAutumn = true)
      : (isAutumn = false);
  }
  if (state.place.region) {
    state.place.region.includes("barcelona")
      ? (isBarcelona = true)
      : (isBarcelona = false);
    state.place.region.includes("tarragona")
      ? (isTarragona = true)
      : (isTarragona = false);
    state.place.region.includes("girona")
      ? (isGirona = true)
      : (isGirona = false);
    state.place.region.includes("lleida")
      ? (isLleida = true)
      : (isLleida = false);
    state.place.region.includes("costaBrava")
      ? (isCostaBrava = true)
      : (isCostaBrava = false);
    state.place.region.includes("costaDaurada")
      ? (isCostaDaurada = true)
      : (isCostaDaurada = false);
    state.place.region.includes("pirineus")
      ? (isPirineus = true)
      : (isPirineus = false);
  }
  if (state.place.placeType) {
    state.place.placeType.includes("apartament")
      ? (isApartment = true)
      : (isApartment = false);
    state.place.placeType.includes("refugi")
      ? (isCabin = true)
      : (isCabin = false);
    state.place.placeType.includes("casaarbre")
      ? (isTreehouse = true)
      : (isTreehouse = false);
    state.place.placeType.includes("casarural")
      ? (isRuralHouse = true)
      : (isRuralHouse = false);
    state.place.placeType.includes("carabana")
      ? (isTrailer = true)
      : (isTrailer = false);
    state.place.placeType.includes("hotel")
      ? (isHotel = true)
      : (isHotel = false);
  }

  const submitPlace = async () => {
    const {
      _id,
      title,
      subtitle,
      categories,
      seasons,
      region,
      placeType,
      cover,
      images,
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
      slug,
      metaTitle,
      metaDescription,
    } = state.place;
    const { coverCloudImage, cloudImages } = state.formData;
    let placeCover, placeImages;
    coverCloudImage !== ""
      ? (placeCover = coverCloudImage)
      : (placeCover = cover);
    cloudImages.length > 0
      ? (placeImages = cloudImages)
      : (placeImages = images);
    service
      .editPlace(
        _id,
        slug,
        title,
        subtitle,
        categories,
        seasons,
        region,
        placeType,
        placeCover,
        placeImages,
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
    let categories = state.place.categories;
    if (e.target.checked === true) {
      categories.push(e.target.id);
    } else {
      let index = categories.indexOf(e.target.id);
      categories.splice(index, 1);
    }
    setState({
      ...state,
      place: { ...state.place, categories: categories },
    });
  };

  const handleCheckSeason = (e) => {
    let seasons = state.place.seasons;
    if (e.target.checked === true) {
      seasons.push(e.target.id);
    } else {
      let index = seasons.indexOf(e.target.id);

      seasons.splice(index, 1);
    }
    setState({
      ...state,
      place: { ...state.place, seasons: seasons },
    });
  };

  const handleCheckRegion = (e) => {
    setState({
      ...state,
      place: { ...state.place, region: e.target.id },
    });
  };

  const handleCheckPlaceType = (e) => {
    setState({
      ...state,
      place: { ...state.place, placeType: e.target.id },
    });
  };

  const handleChange = (e) =>
    setState({
      ...state,
      place: { ...state.place, [e.target.name]: e.target.value },
    });

  useEffect(() => {
    if (
      state.formData.cloudImagesUploaded === true ||
      state.formData.coverCloudImageUploaded === true
    ) {
      submitPlace();
    }
  }, [state.formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (state.formData.updatedImages || state.formData.updatedCover) {
      handleFileUpload();
    } else {
      submitPlace();
    }
  };

  return (
    <>
      <Head>
        <title>Edita l'allotjament - Escapadesenparella.cat</title>
      </Head>
      <div id="activity" className="composer">
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
                    <h1>Editar l'allotjament</h1>
                    <p className="sub-h1">
                      Edit and submit your activity so others start enjoying it.
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
                        <Form.Group>
                          <Form.Label>Títol</Form.Label>
                          <Form.Control
                            type="text"
                            name="title"
                            placeholder="Títol de l'allotjament"
                            value={state.place.title}
                            onChange={handleChange}
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Subtítol</Form.Label>
                          <Form.Control
                            type="text"
                            name="subtitle"
                            placeholder="Subtítol de l'allotjament"
                            value={state.place.subtitle}
                            onChange={handleChange}
                          />
                        </Form.Group>
                        <Form.Row>
                          <Col lg={3}>
                            <Form.Group>
                              <Form.Label>Categories d'escapada</Form.Label>
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
                                id="aventura "
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
                          <Col lg={3}>
                            <Form.Group>
                              <Form.Label>Estació de l'any</Form.Label>
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
                                  checked={isHotel}
                                />
                                <Form.Check
                                  type="radio"
                                  id="apartament"
                                  label="Apartament"
                                  name="placeType"
                                  onChange={handleCheckPlaceType}
                                  checked={isApartment}
                                />
                                <Form.Check
                                  type="radio"
                                  id="refugi"
                                  label="Refugi"
                                  name="placeType"
                                  onChange={handleCheckPlaceType}
                                  checked={isCabin}
                                />
                                <Form.Check
                                  type="radio"
                                  id="casaarbre"
                                  label="Casa-arbre"
                                  name="placeType"
                                  onChange={handleCheckPlaceType}
                                  checked={isTreehouse}
                                />
                                <Form.Check
                                  type="radio"
                                  id="casarural"
                                  label="Casa rural"
                                  name="placeType"
                                  onChange={handleCheckPlaceType}
                                  checked={isRuralHouse}
                                />
                                <Form.Check
                                  type="radio"
                                  id="carabana"
                                  label="Carabana"
                                  name="placeType"
                                  onChange={handleCheckPlaceType}
                                  checked={isTrailer}
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
                            value={state.place.place_full_address}
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
                                if (
                                  el.types[0] === "administrative_area_level_2"
                                ) {
                                  place_province = el.long_name;
                                }
                                if (
                                  el.types[0] === "administrative_area_level_1"
                                ) {
                                  place_state = el.long_name;
                                }
                                if (el.types[0] === "country") {
                                  place_country = el.long_name;
                                }
                              });

                              if (place.geometry.viewport) {
                                place_lat = Object.values(
                                  place.geometry.viewport
                                )[0].i;
                                place_lng = Object.values(
                                  place.geometry.viewport
                                )[1].i;
                              }

                              place_rating = place.rating;
                              place_id = place.place_id;

                              if (place.opening_hours) {
                                place_opening_hours =
                                  place.opening_hours.weekday_text;
                              }

                              setState({
                                ...state,
                                place: {
                                  ...state.place,
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
                                value={state.place.phone}
                              />
                            </Form.Group>
                          </Col>
                          <Col lg={4}>
                            <Form.Group>
                              <Form.Label>
                                Pàgina web de reserva o contacte
                              </Form.Label>
                              <Form.Control
                                type="url"
                                name="website"
                                placeholder="Pàgina web de reserva o contacte"
                                onChange={handleChange}
                                value={state.place.website}
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
                                value={state.place.price}
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
                            placeholder="Descripció de l'allotjament"
                            value={state.place.description}
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
                            value={state.place.metaTitle}
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
                            value={state.place.metaDescription}
                            onChange={handleChange}
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Slug</Form.Label>
                          <Form.Control
                            type="text"
                            name="slug"
                            placeholder="Slug de l'allotjament"
                            value={state.place.slug}
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
