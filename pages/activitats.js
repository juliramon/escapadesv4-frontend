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
      <div id="contentList" className="activity relative">
        <NavigationBar
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
          }
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
                    Activitats a Catalunya
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <section className="py-6 md:py-12">
            <div className="container relative">
              <div className="flex flex-wrap items-center justify-start">
                <div className="w-full md:w-8/12 xl:w-5/12">
                  <h1 className="my-0">
                    <span className="text-secondary-500">Activitats</span> per
                    fer en parella a Catalunya
                  </h1>
                </div>
                <div className="w-full mt-8">
                  <div className="grid grid-cols-4 grid-rows-2 gap-2.5 rounded overflow-hidden">
                    <div className="row-start-1 col-start-1 row-span-2 col-span-2 rounded-l overflow-hidden">
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
                    </div>
                    <div className="row-start-1 col-start-3 row-span-1 col-span-1 overflow-hidden">
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
                    </div>
                    <div className="row-start-1 col-start-4 row-span-1 col-span-1 rounded-tr overflow-hidden">
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
                    </div>
                    <div className="row-start-2 col-start-3 row-span-1 col-span-1 overflow-hidden">
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
                    </div>
                    <div className="row-start-2 col-start-4 row-span-1 col-span-1 rounded-br overflow-hidden">
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
                    </div>
                  </div>
                </div>
                <div className="w-full mt-3">
                  <figcaption className="text-xs text-primary-400 text-right">
                    Escapada al Santuari de Cabrera (Osona) / ©
                    Escapadesenparella.cat
                  </figcaption>
                </div>
                <div className="w-full mt-5">
                  <div className="max-w-xl">
                    <h2>
                      Descobreix {state.activities.length} activitats,
                      excursions, gastronomia i paratges extraordinaris per a
                      una escapada en parella de somni a Catalunya
                    </h2>
                    <p className="mt-6 text-base leading-relaxed">
                      Calceu-vos les botes, poseu-vos el banyador, prepareu-vos
                      la motxilla o despengeu l'anorac; aquí trobareu les
                      millors <strong>activitats en parella</strong> a
                      Catalunya!
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
                  <h2>Activitats destacades</h2>
                  <p className="mt-2.5">
                    Descobreix activitats i escapades d'aventura per fer
                    Catalunya
                  </p>
                </div>
                <div className="relative flex items-center justify-end w-full md:w-1/2">
                  <button
                    className="text-sm inline-flex flex-nowrap items-center text-white button button__ghost button__med mr-3"
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
                    Veure-les al mapa
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
                    <span>Filtrar activitats</span>
                  </button>
                  {stateDropdownFilters === true ? (
                    <div className="absolute z-50 bg-white rounded-md shadow-lg top-14 overflow-hidden p-7">
                      <div className="flex items-start -m-5">
                        <div className="p-5">
                          <span className="text-lg mb-2 block">Regió</span>
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
                          <span className="text-lg mb-2 block">Categoria</span>
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
                          <span className="text-lg mb-2 block">Temporada</span>
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
