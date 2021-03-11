import { useEffect, useCallback, useState } from "react";
import ContentService from "../services/contentService";
import NavigationBar from "../components/global/NavigationBar";
import { Container, Row, Form } from "react-bootstrap";
import GoogleMapReact from "google-map-react";
import PublicSquareBox from "../components/listings/PublicSquareBox";
import Head from "next/head";

const PlaceList = ({ user }) => {
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
  let placesList;
  if (state.hasPlaces === true) {
    placesList = state.places.map((el) => (
      <PublicSquareBox
        key={el._id}
        type={el.type}
        slug={el.slug}
        id={el._id}
        cover={el.cover}
        title={el.title}
        subtitle={el.subtitle}
        location={`${el.place_locality === undefined ? "" : el.place_locality}${
          el.place_locality === undefined ? "" : ","
        } ${el.place_province || el.place_state}, ${el.place_country}`}
        website={el.website}
        phone={el.phone}
      />
    ));
  }

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

  const listingsCount = state.places.length;

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
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
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
            "https://res.cloudinary.com/juligoodie/image/upload/c_scale,q_100,w_135/v1600008855/getaways-guru/static-files/logo-getaways-guru_vvbikk.svg"
          }
          user={user}
        />
        <Container fluid>
          <Row>
            <div className="box d-flex">
              <div className="col left">
                <div className="filter-list">
                  <div className="filter-block">
                    <span className="block-title">Tipologia</span>
                    <Form.Check
                      label="Hotels"
                      name="placeType"
                      id="hotel"
                      onChange={handleCheckType}
                    />
                    <Form.Check
                      label="Apartments"
                      name="placeType"
                      id="apartment"
                      onChange={handleCheckType}
                    />
                    <Form.Check
                      label="Cabanyes"
                      name="placeType"
                      id="cabin"
                      onChange={handleCheckType}
                    />
                    <Form.Check
                      label="Cases-arbre"
                      name="placeType"
                      id="treeHouse"
                      onChange={handleCheckType}
                    />
                    <Form.Check
                      label="Cases rurals"
                      name="placeType"
                      id="ruralHouse"
                      onChange={handleCheckType}
                    />
                    <Form.Check
                      label="Carabanes"
                      name="placeType"
                      id="trailer"
                      onChange={handleCheckType}
                    />
                  </div>
                  <div className="filter-block">
                    <span className="block-title">Regió</span>
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
                  <div className="filter-block">
                    <span className="block-title">Categoria</span>
                    <Form.Check
                      label="Romàntic"
                      name="placeCategory"
                      id="romantic"
                      onChange={handleCheckCategory}
                    />
                    <Form.Check
                      label="Aventura"
                      name="placeCategory"
                      id="adventure"
                      onChange={handleCheckCategory}
                    />
                    <Form.Check
                      label="Gastronòmic"
                      name="placeCategory"
                      id="gastronomic"
                      onChange={handleCheckCategory}
                    />
                    <Form.Check
                      label="Cultural"
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
                  <div className="filter-block">
                    <span className="block-title">Temporada</span>
                    <Form.Check
                      label="Hivern"
                      name="placeSeason"
                      id="winter"
                      onChange={handleCheckSeason}
                    />
                    <Form.Check
                      label="Primavera"
                      name="placeSeason"
                      id="spring"
                      onChange={handleCheckSeason}
                    />
                    <Form.Check
                      label="Estiu"
                      name="placeSeason"
                      id="summer"
                      onChange={handleCheckSeason}
                    />
                    <Form.Check
                      label="Tardo"
                      name="placeSeason"
                      id="autumn"
                      onChange={handleCheckSeason}
                    />
                  </div>
                </div>
              </div>
              <div className="col center">
                <div className="top-nav-wrapper">
                  <h1 className="top-nav-title">Allotjaments</h1>
                  <p className="top-nav-subtitle">
                    Des d'<strong>hotels amb encant</strong> únics a Catalunya,
                    a <strong>cabanes acollidaroes</strong> i{" "}
                    <strong>cases-arbre</strong>, passant per{" "}
                    <strong>apartaments de somni</strong> i carabanes per gaudir
                    de l'escapada, aquí trobaràs els millors allotjaments a
                    Catalunya per a una escapada perfecta!
                  </p>
                  <div className="listings-counter">
                    <b>{listingsCount}</b> allotjaments publicats
                  </div>
                </div>
                <div className="listings-wrapper">
                  <div className="listings-list">{placesList}</div>
                </div>
              </div>
              <div className="col right">
                <div className="map-wrapper">
                  <div className="map-block">
                    {state.hasPlaces ? (
                      <GoogleMapReact
                        bootstrapURLKeys={{
                          key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
                        }}
                        defaultCenter={center}
                        defaultZoom={7}
                        options={getMapOptions}
                        yesIWantToUseGoogleMapApiInternals
                        onGoogleApiLoaded={({ map, maps }) =>
                          renderMarker(map, maps)
                        }
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

export default PlaceList;
