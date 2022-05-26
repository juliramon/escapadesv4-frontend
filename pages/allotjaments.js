import { useEffect, useCallback, useState } from "react";
import ContentService from "../services/contentService";
import NavigationBar from "../components/global/NavigationBar";
import { Container, Row, Form } from "react-bootstrap";
import GoogleMapReact from "google-map-react";
import PublicSquareBox from "../components/listings/PublicSquareBox";
import Head from "next/head";
import { useRouter } from "next/router";
import Footer from "../components/global/Footer";
import MapModal from "../components/modals/MapModal";

const PlaceList = ({ user }) => {
  const router = useRouter();
  useEffect(() => {
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
  }, [router]);

  const initialState = {
    loggedUser: user,
    places: [],
    queryPlaceType: [],
    queryPlaceRegion: [],
    queryPlaceCategory: [],
    queryPlaceSeason: [],
    updateSearch: false,
    hasPlaces: false,
  };
  const [state, setState] = useState(initialState);

  const [stateDropdownFilters, setStateDropdownFilters] = useState(false);
  const [stateModalMap, setStateModalMap] = useState(false);

  const service = new ContentService();
  const getAllPlaces = useCallback(() => {
    service.getAllPlaces("/places").then((res) => {
      let hasPlaces;
      if (res.length > 0) {
        hasPlaces = true;
      }
      setState({ ...state, places: res, hasPlaces: hasPlaces });
    });
  }, [state, service]);

  useEffect(getAllPlaces, []);

  const handleCheckType = (e) => {
    let query = state.queryPlaceType;
    if (e.target.checked === true) {
      if (query.length < 1) {
        query.push(`${e.target.name}=${e.target.id}`);
      } else {
        query.push(e.target.id);
      }
    } else {
      let index = query.indexOf(e.target.id);
      query.splice(index, 1);
    }
    setState({ ...state, queryPlaceType: query, updateSearch: true });
  };

  const handleCheckRegion = (e) => {
    let query = state.queryPlaceRegion;
    if (e.target.checked === true) {
      if (query.length < 1) {
        query.push(`${e.target.name}=${e.target.id}`);
      } else {
        query.push(e.target.id);
      }
    } else {
      let index = query.indexOf(e.target.id);
      query.splice(index, 1);
    }
    setState({ ...state, queryPlaceRegion: query, updateSearch: true });
  };

  const handleCheckCategory = (e) => {
    let query = state.queryPlaceCategory;
    if (e.target.checked === true) {
      if (query.length < 1) {
        query.push(`${e.target.name}=${e.target.id}`);
      } else {
        query.push(e.target.id);
      }
    } else {
      let index = query.indexOf(e.target.id);
      query.splice(index, 1);
    }
    setState({ ...state, queryPlaceCategory: query, updateSearch: true });
  };

  const handleCheckSeason = (e) => {
    let query = state.queryPlaceSeason;
    if (e.target.checked === true) {
      if (query.length < 1) {
        query.push(`${e.target.name}=${e.target.id}`);
      } else {
        query.push(e.target.id);
      }
    } else {
      let index = query.indexOf(e.target.id);
      query.splice(index, 1);
    }
    setState({ ...state, queryPlaceSeason: query, updateSearch: true });
  };

  const center = {
    lat: 41.3948976,
    lng: 2.0787283,
  };

  const getMapOptions = (maps) => {
    return {
      disableDefaultUI: true,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          styles: [{ visibility: "on" }],
        },
      ],
    };
  };

  let renderMarker = (map, maps) => {
    state.places.forEach((place) => {
      const position = {
        lat: parseFloat(place.place_lat),
        lng: parseFloat(place.place_lng),
      };
      const contentString =
        `<div id="infoview-wrapper">` +
        `<h1 id="firstHeading" class="firstHeading">${place.title}</h1>` +
        `<p>${place.subtitle}</p>` +
        `</div>`;
      const infowindow = new maps.InfoWindow({
        content: contentString,
      });
      const marker = new maps.Marker({
        position: position,
        map,
        icon: "../../map-marker.svg",
      });
      marker.addListener("click", () => infowindow.open(map, marker));
    });
  };

  useEffect(() => {
    if (state.updateSearch === true) {
      service
        .searchPlaces(
          state.queryPlaceType,
          state.queryPlaceRegion,
          state.queryPlaceCategory,
          state.queryPlaceSeason
        )
        .then((res) => {
          setState({ ...state, places: res, updateSearch: false });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.updateSearch]);

  const textareaFooter = "";

  return (
    <>
      <Head>
        <title>Allotjaments amb encant - Escapadesenparella.cat</title>
        <link rel="icon" href="/favicon.ico" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta
          name="description"
          content={`Allotjaments amb encant a Catalunya. Busques hotels amb encant o cases rurals a Catalunya? Aquí trobaràs els millors els millors.`}
        />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`Allotjaments amb encant - Escapadesenparella.cat`}
        />
        <meta
          property="og:description"
          content={`Allotjaments amb encant a Catalunya. Busques hotels amb encant o cases rurals a Catalunya? Aquí trobaràs els millors els millors.`}
        />
        <meta
          property="url"
          content={`https://escapadesenparella.cat/histories`}
        />
        <meta property="og:site_name" content="Escapadesenparella.cat" />
        <meta property="og:locale" content="ca_ES" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`Allotjaments amb encant - Escapadesenparella.cat`}
        />
        <meta
          name="twitter:description"
          content={`Allotjaments amb encant a Catalunya. Busques hotels amb encant o cases rurals a Catalunya? Aquí trobaràs els millors els millors.`}
        />
        <meta
          name="twitter:image"
          content={`https://escapadesenparella.cat/img/containers/main/img/og-histories.png/69081998ba0dfcb1465f7f878cbc7912.png`}
        />
        <meta
          property="og:image"
          content={`https://escapadesenparella.cat/img/containers/main/img/og-histories.png/69081998ba0dfcb1465f7f878cbc7912.png`}
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:heigth" content="1200" />
        <link
          rel="canonical"
          href={`https://escapadesenparella.cat/histories`}
        />
        <link href={`https://escapadesenparella.cat`} rel="home" />
        <meta property="fb:pages" content="1725186064424579" />
        <meta
          name="B-verify"
          content="756319ea1956c99d055184c4cac47dbfa3c81808"
        />
      </Head>
      <div id="contentList" className="place">
        <NavigationBar
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
          }
          user={user}
        />

        <main>
          <section className="py-8 md:py-20 relative bg-gradient-to-tr from-slate-100 to-white">
            <div className="container">
              <div className="flex flex-wrap justify-start">
                <div className="w-full md:w-6/12">
                  <div className="w-full md:w-9/12">
                    <h1 className="text-2xl md:text-3xl mt-0 mb-1.5">
                      Allotjaments{" "}
                      <span className="bg-amber-100">amb encant</span>
                    </h1>
                    <strong className="uppercase text-xs tracking-widest">
                      Allotjaments a Catalunya
                    </strong>
                    <p className="mt-3">
                      Des d'<strong>hotels amb encant</strong> únics a
                      Catalunya, a <strong>cabanes acollidaroes</strong> i{" "}
                      <strong>cases-arbre</strong>, passant per{" "}
                      <strong>apartaments de somni</strong> i carabanes per
                      gaudir de l'escapada, aquí trobaràs els millors
                      allotjaments a Catalunya per a una escapada perfecta!
                    </p>
                    <div className="flex flex-wrap items-center mt-4 -mx-3 opacity-70">
                      <div className="inline-flex items-center px-3">
                        <span className="text-sm">
                          <b>{state.places.length}</b> allotjaments disponibles
                        </span>
                      </div>
                      <span className="text-primary-100">|</span>
                      <div className="inline-flex items-center px-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon icon-tabler icon-tabler-map-2 mr-2"
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="#6376a0"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <line x1="18" y1="6" x2="18" y2="6.01" />
                          <path d="M18 13l-3.5 -5a4 4 0 1 1 7 0l-3.5 5" />
                          <polyline points="10.5 4.75 9 4 3 7 3 20 9 17 15 20 21 17 21 15" />
                          <line x1="9" y1="4" x2="9" y2="17" />
                          <line x1="15" y1="15" x2="15" y2="20" />
                        </svg>
                        <button
                          className="text-sm underline"
                          onClick={() => setStateModalMap(!stateModalMap)}
                        >
                          Veure'ls al mapa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative md:absolute inset-y-0 right-0 w-full md:w-6/12 h-full">
              <picture>
                <img
                  src="https://res.cloudinary.com/juligoodie/image/upload/v1652991721/getaways-guru/allotjaments_qmoyui.jpg"
                  alt="Allotjaments amb encant a Catalunya"
                  className="w-full h-full object-cover object-center"
                  width={400}
                  height={300}
                  loading="eager"
                />
              </picture>
              <figcaption className="text-xs text-secondary-100 absolute bottom-8 right-12 z-40 text-right">
                Escapada a Mas Farner (Llívia)
                <br />© Escapadesenparella.cat
              </figcaption>
            </div>
          </section>
          <section className="md:pt-6 pb-10 md:pb-16">
            <div className="container">
              <div className="pb-3 relative flex items-center justify-end">
                <button
                  className={`button button__secondary button__med ${
                    stateDropdownFilters == true ? "active" : null
                  }`}
                  onClick={() => setStateDropdownFilters(!stateDropdownFilters)}
                >
                  {stateDropdownFilters == true ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-x mr-1.5"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#000000"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-adjustments mr-1.5"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#000000"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <circle cx="6" cy="10" r="2" />
                      <line x1="6" y1="4" x2="6" y2="8" />
                      <line x1="6" y1="12" x2="6" y2="20" />
                      <circle cx="12" cy="16" r="2" />
                      <line x1="12" y1="4" x2="12" y2="14" />
                      <line x1="12" y1="18" x2="12" y2="20" />
                      <circle cx="18" cy="7" r="2" />
                      <line x1="18" y1="4" x2="18" y2="5" />
                      <line x1="18" y1="9" x2="18" y2="20" />
                    </svg>
                  )}

                  <span>Filtrar allotjaments</span>
                </button>
                {stateDropdownFilters === true ? (
                  <div className="absolute z-50 bg-white rounded-md shadow-lg top-14 overflow-hidden">
                    <div className="flex items-start -m-5">
                      <div className="p-5">
                        <span className="text-lg font-bold mb-2 block">
                          Tipologia
                        </span>
                        <Form.Check
                          label="Hotels"
                          name="placeType"
                          id="hotel"
                          onChange={handleCheckType}
                        />
                        <Form.Check
                          label="Apartaments"
                          name="placeType"
                          id="apartament"
                          onChange={handleCheckType}
                        />
                        <Form.Check
                          label="Refugis"
                          name="placeType"
                          id="refugi"
                          onChange={handleCheckType}
                        />
                        <Form.Check
                          label="Cases-arbre"
                          name="placeType"
                          id="casaarbre"
                          onChange={handleCheckType}
                        />
                        <Form.Check
                          label="Cases rurals"
                          name="placeType"
                          id="casarural"
                          onChange={handleCheckType}
                        />
                        <Form.Check
                          label="Carabanes"
                          name="placeType"
                          id="carabana"
                          onChange={handleCheckType}
                        />
                      </div>
                      <div className="p-5">
                        <span className="text-lg font-bold mb-2 block">
                          Regió
                        </span>
                        <Form.Check
                          label="Barcelona"
                          name="placeRegion"
                          id="barcelona"
                          onChange={handleCheckRegion}
                        />
                        <Form.Check
                          label="Girona"
                          name="placeRegion"
                          id="girona"
                          onChange={handleCheckRegion}
                        />
                        <Form.Check
                          label="Lleida"
                          name="placeRegion"
                          id="lleida"
                          onChange={handleCheckRegion}
                        />
                        <Form.Check
                          label="Tarragona"
                          name="placeRegion"
                          id="tarragona"
                          onChange={handleCheckRegion}
                        />
                        <Form.Check
                          label="Costa Brava"
                          name="placeRegion"
                          id="costaBrava"
                          onChange={handleCheckRegion}
                        />
                        <Form.Check
                          label="Costa Daurada"
                          name="placeRegion"
                          id="costaDaurada"
                          onChange={handleCheckRegion}
                        />
                        <Form.Check
                          label="Pirineus"
                          name="placeRegion"
                          id="pirineus"
                          onChange={handleCheckRegion}
                        />
                      </div>
                      <div className="p-5">
                        <span className="text-lg font-bold mb-2 block">
                          Categoria
                        </span>
                        <Form.Check
                          label="Romàntiques"
                          name="placeCategory"
                          id="romantica"
                          onChange={handleCheckCategory}
                        />
                        <Form.Check
                          label="Aventura"
                          name="placeCategory"
                          id="aventura"
                          onChange={handleCheckCategory}
                        />
                        <Form.Check
                          label="Gastronòmiques"
                          name="placeCategory"
                          id="gastronomica"
                          onChange={handleCheckCategory}
                        />
                        <Form.Check
                          label="Culturals"
                          name="placeCategory"
                          id="cultural"
                          onChange={handleCheckCategory}
                        />
                        <Form.Check
                          label="Relax"
                          name="placeCategory"
                          id="relax"
                          onChange={handleCheckCategory}
                        />
                      </div>
                      <div className="p-5">
                        <span className="text-lg font-bold mb-2 block">
                          Temporada
                        </span>
                        <Form.Check
                          label="Hivern"
                          name="placeSeason"
                          id="hivern"
                          onChange={handleCheckSeason}
                        />
                        <Form.Check
                          label="Primavera"
                          name="placeSeason"
                          id="primavera"
                          onChange={handleCheckSeason}
                        />
                        <Form.Check
                          label="Estiu"
                          name="placeSeason"
                          id="estiu"
                          onChange={handleCheckSeason}
                        />
                        <Form.Check
                          label="Tardor"
                          name="placeSeason"
                          id="tardor"
                          onChange={handleCheckSeason}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="flex flex-wrap items-start -mx-2">
                {state.hasPlaces
                  ? state.places.map((el) => (
                      <PublicSquareBox
                        key={el._id}
                        type={el.type}
                        slug={el.slug}
                        id={el._id}
                        cover={el.cover}
                        title={el.title}
                        subtitle={el.subtitle}
                        rating={el.activity_rating || el.place_rating}
                        placeType={el.placeType}
                        categoria={el.categories}
                        duration={el.duration}
                        website={el.website}
                        phone={el.phone}
                        location={`${
                          el.place_locality === undefined
                            ? el.place_country
                            : el.place_locality
                        }`}
                      />
                    ))
                  : null}
              </div>
            </div>
          </section>
          {textareaFooter !== "" ? (
            <section className="pb-16">
              <div className="container">
                <div className="w-full md:w-2/4 md:mx-auto">
                  {textareaFooter}
                </div>
              </div>
            </section>
          ) : null}
        </main>
      </div>
      <Footer />
      {stateModalMap == true ? (
        <MapModal
          visibility={stateModalMap}
          hideModal={setStateModalMap}
          center={center}
          getMapOptions={getMapOptions}
          renderMarker={renderMarker}
        />
      ) : null}
    </>
  );
};

export default PlaceList;
