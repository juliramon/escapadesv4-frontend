import { useEffect, useCallback, useState } from "react";
import ContentService from "../services/contentService";
import NavigationBar from "../components/global/NavigationBar";
import PublicSquareBox from "../components/listings/PublicSquareBox";
import Head from "next/head";
import { useRouter } from "next/router";
import Footer from "../components/global/Footer";
import MapModal from "../components/modals/MapModal";

const PlaceList = ({ user, placesResults }) => {
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

  useEffect(() => {
    if (placesResults) {
      setState({ ...state, places: placesResults, hasPlaces: true });
    }
  }, []);

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
      const contentString = `<a href="/activitats/${place.slug}" title="${place.title}" class="gmaps-infobox" target="_blank">
        <div class="gmaps-infobox__picture">
          <picture>
            <img src="${place.images[0]}" alt="${place.title}" class="object-cover w-full h-full" width="80" height="80">
          </picture>
        </div>
        <div class="gmaps-infobox__text">
          <span class="gmaps-infobox__title">${place.title}</span>
          <span class="gmaps-infobox__intro">${place.subtitle}</span>
        </div>
        </a>`;
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
          <div className="pt-6">
            <div className="container">
              <ul className="breadcrumb">
                <li className="breadcrumb__item">
                  <a href="/" title="Inici" className="breadcrumb__link">
                    Inici
                  </a>
                </li>
                <li className="breadcrumb__item">
                  <span className="breadcrumb__link active">
                    Allotjaments a Catalunya
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <section className="py-6 md:py-12">
            <div className="container relative">
              <div className="flex flex-wrap items-start justify-start">
                <div className="w-full md:w-8/12 xl:w-5/12">
                  <h1 className="my-0">
                    <span className="text-secondary-500">Allotjaments</span> amb
                    encant
                  </h1>
                </div>
                <div className="w-full mt-8">
                  <div className="grid grid-cols-4 grid-rows-2 gap-2.5 rounded overflow-hidden">
                    <div className="row-start-1 col-start-1 row-span-2 col-span-2 rounded-l overflow-hidden">
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
                    </div>
                    <div className="row-start-1 col-start-3 row-span-1 col-span-1 overflow-hidden">
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
                    </div>
                    <div className="row-start-1 col-start-4 row-span-1 col-span-1 rounded-tr overflow-hidden">
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
                    </div>
                    <div className="row-start-2 col-start-3 row-span-1 col-span-1 overflow-hidden">
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
                    </div>
                    <div className="row-start-2 col-start-4 row-span-1 col-span-1 rounded-br overflow-hidden">
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
                    </div>
                  </div>
                </div>
                <div className="w-full mt-3">
                  <figcaption className="text-xs text-primary-400 text-right">
                    Escapada a Mas Farner (Llívia) / © Escapadesenparella.cat
                  </figcaption>
                </div>
                <div className="w-full mt-5">
                  <div className="max-w-xl">
                    <h2>
                      Descobreix {state.places.length} allotjaments amb encant
                      per a una escapada en parella increïble a Catalunya
                    </h2>
                    <p className="mt-6 text-lg leading-relaxed">
                      Des d'<strong>hotels amb encant</strong> únics a
                      Catalunya, a <strong>cabanes acollidaroes</strong> i{" "}
                      <strong>cases-arbre</strong>, passant per{" "}
                      <strong>apartaments de somni</strong> i carabanes per
                      gaudir de l'escapada, aquí trobaràs els millors
                      allotjaments a Catalunya per a una escapada perfecta!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="pt-6 pb-8 md:pt-12 md:pb-16">
            <div className="container">
              <div className="w-full flex flex-wrap items-center justify-between pb-6">
                <div class="w-full md:w-1/2">
                  <h2>Allotjaments per a parelles</h2>
                </div>
                <div className="relative flex items-center justify-end w-full md:w-1/2">
                  <button
                    className="text-sm inline-flex flex-nowrap items-center button button__ghost button__med mr-3"
                    onClick={() => setStateModalMap(!stateModalMap)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-map-2 mr-2"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
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
                    Veure'ls al mapa
                  </button>
                  <button
                    className={`button button__ghost button__med ${
                      stateDropdownFilters == true ? "active" : null
                    }`}
                    onClick={() =>
                      setStateDropdownFilters(!stateDropdownFilters)
                    }
                  >
                    {stateDropdownFilters == true ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-x mr-2"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
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
                        className="icon icon-tabler icon-tabler-adjustments mr-2"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
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
                    <div className="absolute z-30 bg-white rounded-md shadow-lg top-14 overflow-hidden p-7">
                      <div className="flex items-start -m-5">
                        <div className="p-5">
                          <span className="text-lg mb-2 block">Tipologia</span>
                          <fieldset>
                            <label className="cursor-pointer">
                              <input
                                type="checkbox"
                                name="placeType"
                                id="hotel"
                                onChange={handleCheckType}
                                className="mr-2"
                              />
                              Hotels
                            </label>
                          </fieldset>
                          <fieldset>
                            <label className="cursor-pointer">
                              <input
                                type="checkbox"
                                name="placeType"
                                id="apartament"
                                onChange={handleCheckType}
                                className="mr-2"
                              />
                              Apartaments
                            </label>
                          </fieldset>
                          <fieldset>
                            <label className="cursor-pointer">
                              <input
                                type="checkbox"
                                name="placeType"
                                id="refugi"
                                onChange={handleCheckType}
                                className="mr-2"
                              />
                              Refugis
                            </label>
                          </fieldset>
                          <fieldset>
                            <label className="cursor-pointer">
                              <input
                                type="checkbox"
                                name="placeType"
                                id="casaarbre"
                                onChange={handleCheckType}
                                className="mr-2"
                              />
                              Cases-arbre
                            </label>
                          </fieldset>
                          <fieldset>
                            <label className="cursor-pointer">
                              <input
                                type="checkbox"
                                name="placeType"
                                id="casarural"
                                onChange={handleCheckType}
                                className="mr-2"
                              />
                              Cases rurals
                            </label>
                          </fieldset>
                          <fieldset>
                            <label className="cursor-pointer">
                              <input
                                type="checkbox"
                                name="placeType"
                                id="carabana"
                                onChange={handleCheckType}
                                className="mr-2"
                              />
                              Carabanes
                            </label>
                          </fieldset>
                        </div>
                        <div className="p-5">
                          <span className="text-lg mb-2 block">Regió</span>
                          <fieldset>
                            <label className="cursor-pointer">
                              <input
                                type="checkbox"
                                name="placeRegion"
                                id="barcelona"
                                onChange={handleCheckRegion}
                                className="mr-2"
                              />
                              Barcelona
                            </label>
                          </fieldset>
                          <fieldset>
                            <label className="cursor-pointer">
                              <input
                                type="checkbox"
                                name="placeRegion"
                                id="girona"
                                onChange={handleCheckRegion}
                                className="mr-2"
                              />
                              Girona
                            </label>
                          </fieldset>
                          <fieldset>
                            <label className="cursor-pointer">
                              <input
                                type="checkbox"
                                name="placeRegion"
                                id="lleida"
                                onChange={handleCheckRegion}
                                className="mr-2"
                              />
                              Lleida
                            </label>
                          </fieldset>
                          <fieldset>
                            <label className="cursor-pointer">
                              <input
                                type="checkbox"
                                name="placeRegion"
                                id="tarragona"
                                onChange={handleCheckRegion}
                                className="mr-2"
                              />
                              Tarragona
                            </label>
                          </fieldset>
                          <fieldset>
                            <label className="cursor-pointer">
                              <input
                                type="checkbox"
                                name="placeRegion"
                                id="costaBrava"
                                onChange={handleCheckRegion}
                                className="mr-2"
                              />
                              Costa Brava
                            </label>
                          </fieldset>
                          <fieldset>
                            <label className="cursor-pointer">
                              <input
                                type="checkbox"
                                name="placeRegion"
                                id="costaDaurada"
                                onChange={handleCheckRegion}
                                className="mr-2"
                              />
                              Costa Daurada
                            </label>
                          </fieldset>
                          <fieldset>
                            <label className="cursor-pointer">
                              <input
                                type="checkbox"
                                name="placeRegion"
                                id="pirineus"
                                onChange={handleCheckRegion}
                                className="mr-2"
                              />
                              Pirineus
                            </label>
                          </fieldset>
                        </div>
                        <div className="p-5">
                          <span className="text-lg mb-2 block">Categoria</span>
                          <fieldset>
                            <label className="cursor-pointer">
                              <input
                                type="checkbox"
                                name="placeCategory"
                                id="romantica"
                                onChange={handleCheckCategory}
                                className="mr-2"
                              />
                              Romàntiques
                            </label>
                          </fieldset>
                          <fieldset>
                            <label className="cursor-pointer">
                              <input
                                type="checkbox"
                                name="placeCategory"
                                id="aventura"
                                onChange={handleCheckCategory}
                                className="mr-2"
                              />
                              Aventura
                            </label>
                          </fieldset>
                          <fieldset>
                            <label className="cursor-pointer">
                              <input
                                type="checkbox"
                                name="placeCategory"
                                id="gastronomica"
                                onChange={handleCheckCategory}
                                className="mr-2"
                              />
                              Gastronòmiques
                            </label>
                          </fieldset>
                          <fieldset>
                            <label className="cursor-pointer">
                              <input
                                type="checkbox"
                                name="placeCategory"
                                id="cultural"
                                onChange={handleCheckCategory}
                                className="mr-2"
                              />
                              Culturals
                            </label>
                          </fieldset>
                          <fieldset>
                            <label className="cursor-pointer">
                              <input
                                type="checkbox"
                                name="placeCategory"
                                id="relax"
                                onChange={handleCheckCategory}
                                className="mr-2"
                              />
                              Relax
                            </label>
                          </fieldset>
                        </div>
                        <div className="p-5">
                          <span className="text-lg mb-2 block">Temporada</span>
                          <fieldset>
                            <label className="cursor-pointer">
                              <input
                                type="checkbox"
                                name="placeSeason"
                                id="hivern"
                                onChange={handleCheckSeason}
                                className="mr-2"
                              />
                              Hivern
                            </label>
                          </fieldset>
                          <fieldset>
                            <label className="cursor-pointer">
                              <input
                                type="checkbox"
                                name="placeSeason"
                                id="primavera"
                                onChange={handleCheckSeason}
                                className="mr-2"
                              />
                              Primavera
                            </label>
                          </fieldset>
                          <fieldset>
                            <label className="cursor-pointer">
                              <input
                                type="checkbox"
                                name="placeSeason"
                                id="estiu"
                                onChange={handleCheckSeason}
                                className="mr-2"
                              />
                              Estiu
                            </label>
                          </fieldset>
                          <fieldset>
                            <label className="cursor-pointer">
                              <input
                                type="checkbox"
                                name="placeSeason"
                                id="tardor"
                                onChange={handleCheckSeason}
                                className="mr-2"
                              />
                              Tardor
                            </label>
                          </fieldset>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
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

export async function getStaticProps({ params }) {
  const service = new ContentService();
  const placesResults = await service.getAllPlaces();
  return {
    props: {
      placesResults,
    },
  };
}

export default PlaceList;
