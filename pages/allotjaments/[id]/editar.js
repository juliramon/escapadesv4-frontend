import { useState, useEffect, useContext } from "react";
import NavigationBar from "../../../components/global/NavigationBar";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import ContentService from "../../../services/contentService";
import Router, { useRouter } from "next/router";
import Autocomplete from "react-google-autocomplete";
import UserContext from "../../../contexts/UserContext";
import Head from "next/head";

const ActivityEditionForm = () => {
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
    place: {},
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
      isReadyToSubmit: false,
    },
    isPlaceLoaded: false,
  };
  const [state, setState] = useState(initialState);

  const [queryId, setQueryId] = useState(null);
  useEffect(() => {
    if (router && router.query) {
      setQueryId(router.query.id);
    }
  }, [router]);

  const service = new ContentService();

  useEffect(() => {
    const fetchData = async () => {
      let placeDetails = await service.getPlaceDetails(queryId);
      setState({
        ...state,
        place: placeDetails,
        formData: {
          _id: placeDetails._id,
          type: placeDetails.type,
          title: placeDetails.title,
          subtitle: placeDetails.subtitle,
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
          isReadyToSubmit: false,
        },
        isPlaceLoaded: true,
      });
    };
    fetchData();
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
    state.place.categories.includes("romantic")
      ? (isRomantic = true)
      : (isRomantic = false);
    state.place.categories.includes("adventure")
      ? (isAdventure = true)
      : (isAdventure = false);
    state.place.categories.includes("gastronomic")
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
    state.place.seasons.includes("winter")
      ? (isWinter = true)
      : (isWinter = false);
    state.place.seasons.includes("spring")
      ? (isSpring = true)
      : (isSpring = false);
    state.place.seasons.includes("summer")
      ? (isSummer = true)
      : (isSummer = false);
    state.place.seasons.includes("autumn")
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
    state.place.placeType.includes("apartment")
      ? (isApartment = true)
      : (isApartment = false);
    state.place.placeType.includes("cabin")
      ? (isCabin = true)
      : (isCabin = false);
    state.place.placeType.includes("treeHouse")
      ? (isTreehouse = true)
      : (isTreehouse = false);
    state.place.placeType.includes("ruralHouse")
      ? (isRuralHouse = true)
      : (isRuralHouse = false);
    state.place.placeType.includes("trailer")
      ? (isTrailer = true)
      : (isTrailer = false);
    state.place.placeType.includes("hotel")
      ? (isHotel = true)
      : (isHotel = false);
  }

  const {
    title,
    subtitle,
    place_full_address,
    phone,
    website,
    price,
    description,
  } = state.place;

  const submitPlace = () => {
    console.log("place submitted");
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
        price
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
        <title>Edita l'activitat - Escapadesenparella.cat</title>
      </Head>

      <div id="activity" className="composer">
        <NavigationBar
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/c_scale,q_100,w_135/v1600008855/getaways-guru/static-files/logo-getaways-guru_vvbikk.svg"
          }
          user={user}
          path={queryId}
        />
        <Container className="mw-1600">
          <Row>
            <Col lg={12} className="sided-shadow">
              <div className="form-composer">
                <h1>Editar l'allotjament</h1>
                <p className="sub-h1">
                  Edit and submit your activity so others start enjoying it.
                </p>
              </div>
              <Form onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="Activity title"
                    defaultValue={title}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Subtitle</Form.Label>
                  <Form.Control
                    type="text"
                    name="subtitle"
                    placeholder="Activity subtitle"
                    defaultValue={subtitle}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Row>
                  <Col lg={3}>
                    <Form.Group>
                      <Form.Label>Activity Category</Form.Label>
                      <Form.Check
                        type="checkbox"
                        name="romantic"
                        id="romantic"
                        label="Romantic"
                        onChange={handleCheckCategory}
                        checked={isRomantic}
                      />
                      <Form.Check
                        type="checkbox"
                        name="adventure"
                        id="adventure"
                        label="Adventure"
                        onChange={handleCheckCategory}
                        checked={isAdventure}
                      />

                      <Form.Check
                        type="checkbox"
                        name="gastronomic"
                        id="gastronomic"
                        label="Gastronomic"
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
                      <Form.Label>Activity Season</Form.Label>
                      <Form.Check
                        type="checkbox"
                        name="winter"
                        id="winter"
                        label="Winter"
                        onChange={handleCheckSeason}
                        checked={isWinter}
                      />
                      <Form.Check
                        type="checkbox"
                        name="spring"
                        id="spring"
                        label="Spring"
                        onChange={handleCheckSeason}
                        checked={isSpring}
                      />
                      <Form.Check
                        type="checkbox"
                        name="summer"
                        id="summer"
                        label="Summer"
                        onChange={handleCheckSeason}
                        checked={isSummer}
                      />
                      <Form.Check
                        type="checkbox"
                        name="autumn"
                        id="autumn"
                        label="Autumn"
                        onChange={handleCheckSeason}
                        checked={isAutumn}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={3}>
                    <Form.Group>
                      <Form.Group>
                        <Form.Label>Activity Region</Form.Label>
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
                        <Form.Label>Place Type</Form.Label>
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
                          id="apartment"
                          label="Apartment"
                          name="placeType"
                          onChange={handleCheckPlaceType}
                          checked={isApartment}
                        />
                        <Form.Check
                          type="radio"
                          id="cabin"
                          label="Cabin"
                          name="placeType"
                          onChange={handleCheckPlaceType}
                          checked={isCabin}
                        />
                        <Form.Check
                          type="radio"
                          id="treeHouse"
                          label="Treehouse"
                          name="placeType"
                          onChange={handleCheckPlaceType}
                          checked={isTreehouse}
                        />
                        <Form.Check
                          type="radio"
                          id="ruralHouse"
                          label="Rural house"
                          name="placeType"
                          onChange={handleCheckPlaceType}
                          checked={isRuralHouse}
                        />
                        <Form.Check
                          type="radio"
                          id="trailer"
                          label="Trailer"
                          name="placeType"
                          onChange={handleCheckPlaceType}
                          checked={isTrailer}
                        />
                      </Form.Group>
                    </Form.Group>
                  </Col>
                </Form.Row>
                <Form.Group>
                  <Form.Label>Location</Form.Label>
                  <Autocomplete
                    className="location-control"
                    apiKey={`${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`}
                    style={{ width: "100%" }}
                    defaultValue={place_full_address}
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
                    placeholder={"Type the activity address"}
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
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        placeholder="Phone number for contact details"
                        onChange={handleChange}
                        value={phone}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={4}>
                    <Form.Group>
                      <Form.Label>Website</Form.Label>
                      <Form.Control
                        type="url"
                        name="website"
                        placeholder="Place website"
                        onChange={handleChange}
                        value={website}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={4}>
                    <Form.Group>
                      <Form.Label>Price per night (€)</Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        placeholder="Place price"
                        onChange={handleChange}
                        value={price}
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
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows="5"
                    type="text"
                    name="description"
                    placeholder="Activity description"
                    defaultValue={description}
                    onChange={handleChange}
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
                <Button type="submit" variant="none" onClick={handleSubmit}>
                  Save changes
                </Button>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </>
  );
};

export default ActivityEditionForm;
