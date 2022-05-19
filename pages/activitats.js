import { useEffect, useCallback, useState } from "react";
import ContentService from "../services/contentService";
import NavigationBar from "../components/global/NavigationBar";
import { Form } from "react-bootstrap";
import Head from "next/head";
import PublicSquareBox from "../components/listings/PublicSquareBox";
import { useRouter } from "next/router";
import Footer from "../components/global/Footer";
import MapModal from "../components/modals/MapModal";

const ActivityList = () => {
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
    activities: [],
    queryActivityRegion: [],
    queryActivityCategory: [],
    queryActivitySeason: [],
    updateSearch: false,
    hasActivities: false,
  };

  const [state, setState] = useState(initialState);

  const [stateDropdownFilters, setStateDropdownFilters] = useState(false);
  const [stateModalMap, setStateModalMap] = useState(false);

  const service = new ContentService();
  const getAllActivities = useCallback(() => {
    service.activities("/activities").then((res) => {
      let hasActivities;
      if (res.length > 0) {
        hasActivities = true;
      }
      setState({ ...state, activities: res, hasActivities: hasActivities });
    });
  }, [state, service]);
  useEffect(getAllActivities, []);

  const handleCheckRegion = (e) => {
    let query = state.queryActivityRegion;
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
    setState({ ...state, queryActivityRegion: query, updateSearch: true });
  };

  const handleCheckCategory = (e) => {
    let query = state.queryActivityCategory;
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
    setState({ ...state, queryActivityCategory: query, updateSearch: true });
  };

  const handleCheckSeason = (e) => {
    let query = state.queryActivitySeason;
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
    setState({ ...state, queryActivitySeason: query, updateSearch: true });
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

  const renderMarker = (map, maps) => {
    const bounds = new maps.LatLngBounds();
    state.activities.forEach((activity) => {
      const position = {
        lat: parseFloat(activity.activity_lat),
        lng: parseFloat(activity.activity_lng),
      };
      const contentString =
        `<div id="infoview-wrapper">` +
        `<h1 id="firstHeading" class="firstHeading">${activity.title}</h1>` +
        `<p>${activity.subtitle}</p>` +
        `</div>`;
      const infowindow = new maps.InfoWindow({
        content: contentString,
      });
      const marker = new maps.Marker({
        position: position,
        map,
        icon: "../../map-marker.svg",
      });
      bounds.extend(marker.position);
      marker.addListener("click", () => infowindow.open(map, marker));
    });
    map.fitBounds(bounds);
  };

  useEffect(() => {
    if (state.updateSearch === true) {
      service
        .searchActivities(
          state.queryActivityRegion,
          state.queryActivityCategory,
          state.queryActivitySeason
        )
        .then((res) => {
          setState({ ...state, activities: res, updateSearch: false });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.updateSearch]);

  const textareaFooter = "";

  return (
    <>
      <Head>
        <title>Activitats en parella - Escapadesenparella.cat</title>
      </Head>
      <div id="contentList" className="activity">
        <NavigationBar
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
          }
        />
        <main>
          <section className="py-8 md:py-20 relative bg-gradient-to-tr from-slate-100 to-white">
            <div className="container">
              <div className="flex flex-wrap justify-start">
                <div className="w-full md:w-6/12">
                  <div className="w-full md:w-9/12">
                    <h1 className="text-2xl md:text-3xl mt-0 mb-1.5">
                      Activitats{" "}
                      <span className="bg-amber-100">per fer en parella</span>
                    </h1>
                    <strong className="uppercase text-xs tracking-widest">
                      Activitats a Catalunya
                    </strong>
                    <p className="mt-3">
                      Calceu-vos les botes, poseu-vos el banyador, prepareu-vos
                      la motxilla o despengeu l'anorac; aquí trobareu les
                      millors <strong>activitats en parella</strong> a
                      Catalunya!
                    </p>
                    <div className="flex flex-wrap items-center mt-4 -mx-3 opacity-70">
                      <div className="inline-flex items-center px-3">
                        <span className="text-sm">
                          <b>{state.activities.length}</b> activitats
                          disponibles
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
                          Veure-les al mapa
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
                  src="https://res.cloudinary.com/juligoodie/image/upload/v1652983702/getaways-guru/activitats-en-parella_unz7x4.jpg"
                  alt=""
                  className="w-full h-full object-cover object-center"
                  width={400}
                  height={300}
                  loading="eager"
                />
              </picture>
              <figcaption className="text-xs text-secondary-100 absolute bottom-8 right-12 z-40 text-right">
                Escapada al Santuari de Cabrera (Osona)
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

                  <span>Filtrar activitats</span>
                </button>
                {stateDropdownFilters === true ? (
                  <div className="absolute z-50 bg-white rounded-md shadow-lg top-14 overflow-hidden">
                    <div className="flex items-start -m-5">
                      <div className="p-5">
                        <span className="text-lg font-bold mb-2 block">
                          Regió
                        </span>
                        <Form.Check
                          label="Barcelona"
                          name="activityRegion"
                          id="barcelona"
                          onChange={handleCheckRegion}
                          className="py-1"
                        />
                        <Form.Check
                          label="Girona"
                          name="activityRegion"
                          id="girona"
                          onChange={handleCheckRegion}
                          className="py-1"
                        />
                        <Form.Check
                          label="Lleida"
                          name="activityRegion"
                          id="lleida"
                          onChange={handleCheckRegion}
                          className="py-1"
                        />
                        <Form.Check
                          label="Tarragona"
                          name="activityRegion"
                          id="tarragona"
                          onChange={handleCheckRegion}
                          className="py-1"
                        />
                        <Form.Check
                          label="Costa Brava"
                          name="activityRegion"
                          id="costaBrava"
                          onChange={handleCheckRegion}
                          className="py-1"
                        />
                        <Form.Check
                          label="Costa Daurada"
                          name="activityRegion"
                          id="costaDaurada"
                          onChange={handleCheckRegion}
                          className="py-1"
                        />
                        <Form.Check
                          label="Pirineus"
                          name="activityRegion"
                          id="pirineus"
                          onChange={handleCheckRegion}
                          className="py-1"
                        />
                      </div>
                      <div className="p-5">
                        <span className="text-lg font-bold mb-2 block">
                          Categoria
                        </span>
                        <Form.Check
                          label="Romàntiques"
                          name="activityCategory"
                          id="romantica"
                          onChange={handleCheckCategory}
                          className="py-1"
                        />
                        <Form.Check
                          label="Aventura"
                          name="activityCategory"
                          id="aventura"
                          onChange={handleCheckCategory}
                          className="py-1"
                        />
                        <Form.Check
                          label="Gastronòmiques"
                          name="activityCategory"
                          id="gastronomica"
                          onChange={handleCheckCategory}
                          className="py-1"
                        />
                        <Form.Check
                          label="Culturals"
                          name="activityCategory"
                          id="cultural"
                          onChange={handleCheckCategory}
                          className="py-1"
                        />
                        <Form.Check
                          label="Relax"
                          name="activityCategory"
                          id="relax"
                          onChange={handleCheckCategory}
                          className="py-1"
                        />
                      </div>
                      <div className="p-5">
                        <span className="text-lg font-bold mb-2 block">
                          Temporada
                        </span>
                        <Form.Check
                          label="Hivern"
                          name="activitySeason"
                          id="hivern"
                          onChange={handleCheckSeason}
                          className="py-1"
                        />
                        <Form.Check
                          label="Primavera"
                          name="activitySeason"
                          id="primavera"
                          onChange={handleCheckSeason}
                          className="py-1"
                        />
                        <Form.Check
                          label="Estiu"
                          name="activitySeason"
                          id="estiu"
                          onChange={handleCheckSeason}
                          className="py-1"
                        />
                        <Form.Check
                          label="Tardor"
                          name="activitySeason"
                          id="tardor"
                          onChange={handleCheckSeason}
                          className="py-1"
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="flex flex-wrap items-start -mx-2">
                {state.hasActivities
                  ? state.activities.map((el) => (
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
                          el.activity_locality === undefined
                            ? el.activity_country
                            : el.activity_locality
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

export default ActivityList;
