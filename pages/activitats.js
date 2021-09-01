import { useEffect, useCallback, useState } from "react";
import ContentService from "../services/contentService";
import NavigationBar from "../components/global/NavigationBar";
import { Container, Row, Form } from "react-bootstrap";
import GoogleMapReact from "google-map-react";
import Head from "next/head";
import PublicSquareBox from "../components/listings/PublicSquareBox";
import { useRouter } from "next/router";

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
  let activitiesList;
  if (state.hasActivities) {
    activitiesList = state.activities.map((el) => (
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
    ));
  }

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

  const listingsCount = state.activities.length;

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
        <Container fluid>
          <Row>
            <div className="box d-flex">
              <div className="col left">
                <div className="filter-list">
                  <div className="filter-block">
                    <span className="block-title">Regió</span>
                    <Form.Check
                      label="Barcelona"
                      name="activityRegion"
                      id="barcelona"
                      onChange={handleCheckRegion}
                    />
                    <Form.Check
                      label="Girona"
                      name="activityRegion"
                      id="girona"
                      onChange={handleCheckRegion}
                    />
                    <Form.Check
                      label="Lleida"
                      name="activityRegion"
                      id="lleida"
                      onChange={handleCheckRegion}
                    />
                    <Form.Check
                      label="Tarragona"
                      name="activityRegion"
                      id="tarragona"
                      onChange={handleCheckRegion}
                    />
                    <Form.Check
                      label="Costa Brava"
                      name="activityRegion"
                      id="costaBrava"
                      onChange={handleCheckRegion}
                    />
                    <Form.Check
                      label="Costa Daurada"
                      name="activityRegion"
                      id="costaDaurada"
                      onChange={handleCheckRegion}
                    />
                    <Form.Check
                      label="Pirineus"
                      name="activityRegion"
                      id="pirineus"
                      onChange={handleCheckRegion}
                    />
                  </div>
                  <div className="filter-block">
                    <span className="block-title">Categoria</span>
                    <Form.Check
                      label="Romàntiques"
                      name="activityCategory"
                      id="romantica"
                      onChange={handleCheckCategory}
                    />
                    <Form.Check
                      label="Aventura"
                      name="activityCategory"
                      id="aventura"
                      onChange={handleCheckCategory}
                    />
                    <Form.Check
                      label="Gastronòmiques"
                      name="activityCategory"
                      id="gastronomica"
                      onChange={handleCheckCategory}
                    />
                    <Form.Check
                      label="Culturals"
                      name="activityCategory"
                      id="cultural"
                      onChange={handleCheckCategory}
                    />
                    <Form.Check
                      label="Relax"
                      name="activityCategory"
                      id="relax"
                      onChange={handleCheckCategory}
                    />
                  </div>
                  <div className="filter-block">
                    <span className="block-title">Temporada</span>
                    <Form.Check
                      label="Hivern"
                      name="activitySeason"
                      id="hivern"
                      onChange={handleCheckSeason}
                    />
                    <Form.Check
                      label="Primavera"
                      name="activitySeason"
                      id="primavera"
                      onChange={handleCheckSeason}
                    />
                    <Form.Check
                      label="Estiu"
                      name="activitySeason"
                      id="estiu"
                      onChange={handleCheckSeason}
                    />
                    <Form.Check
                      label="Tardor"
                      name="activitySeason"
                      id="tardor"
                      onChange={handleCheckSeason}
                    />
                  </div>
                </div>
              </div>
              <div className="col center">
                <div className="top-nav-wrapper">
                  <h1 className="top-nav-title">Activitats</h1>
                  <p className="top-nav-subtitle">
                    Calceu-vos les vostres millors botes, poseu-vos el banyador,
                    prepareu-vos la motxilla o despengeu l'anorac; aquí trobareu
                    les millors activitats en parella a Catalunya! Escapeu-vos i
                    gaudir d'activitats per a tots els gustos.
                  </p>
                  <div className="listings-counter">
                    <b>{listingsCount}</b> activitats publicades
                  </div>
                </div>
                <div className="listings-wrapper">
                  <div className="listings-list">{activitiesList}</div>
                </div>
              </div>
              <div className="col right">
                <div className="map-wrapper">
                  <div className="map-block">
                    {state.hasActivities ? (
                      <GoogleMapReact
                        bootstrapURLKeys={{
                          key: `${process.env.GOOGLE_API_KEY}`,
                        }}
                        center={center}
                        defaultCenter={center}
                        defaultZoom={7}
                        options={getMapOptions}
                        yesIWantToUseGoogleMapApiInternals
                        onGoogleApiLoaded={({ map, maps }) => {
                          renderMarker(map, maps);
                        }}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default ActivityList;
