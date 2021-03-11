import GoogleMapReact from "google-map-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { Container, Form, Row } from "react-bootstrap";
import FetchingSpinner from "../components/global/FetchingSpinner";
import NavigationBar from "../components/global/NavigationBar";
import PublicSquareBox from "../components/listings/PublicSquareBox";
import UserContext from "../contexts/UserContext";
import ContentService from "../services/contentService";

const CategoryPage = () => {
  const { user } = useContext(UserContext);
  const router = useRouter();

  const initialState = {
    categoryDetails: {},
    results: [],
    hasResults: false,
    isFetching: false,
  };

  const [state, setState] = useState(initialState);
  const [queryId, setQueryId] = useState(null);

  useEffect(() => {
    if (router && router.query) {
      setQueryId(router.query.categoria);
    }
  }, [router]);

  const service = new ContentService();

  useEffect(() => {
    if (router.query.categoria !== undefined) {
      const fetchData = async () => {
        setState({ ...state, isFetching: true });
        const categoryDetails = await service.getCategoryDetails(
          router.query.categoria
        );
        let getResults;
        if (categoryDetails) {
          getResults = await service.getCategoryResults(categoryDetails.name);
        }
        let hasResults;
        if (getResults.results.length > 0) {
          hasResults = true;
        } else {
          hasResults = false;
        }
        setState({
          ...state,
          categoryDetails: categoryDetails,
          results: getResults.results,
          hasResults: hasResults,
          isFetching: false,
        });
      };
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryId]);

  if (state.isFetching) {
    return <FetchingSpinner />;
  }

  let resultsList;
  if (state.hasResults) {
    resultsList = state.results.map((el) => {
      let location;
      if (el.type === "activity") {
        location = (
          <span className="listing-location">{`${
            el.activity_locality === undefined ? "" : el.activity_locality
          }${el.activity_locality === undefined ? "" : ","} ${
            el.activity_province || el.activity_state
          }, ${el.activity_country}`}</span>
        );
      }
      if (el.type === "place") {
        location = (
          <span className="listing-location">{`${
            el.place_locality === undefined ? "" : el.place_locality
          }${el.place_locality === undefined ? "" : ","} ${
            el.place_province || el.place_state
          }, ${el.place_country}`}</span>
        );
      }
      return (
        <PublicSquareBox
          key={el._id}
          type={el.type}
          slug={el.slug}
          id={el._id}
          cover={el.cover}
          title={el.title}
          subtitle={el.subtitle}
          location={location}
          website={el.website}
          phone={el.phone}
        />
      );
    });
  }

  const sponsorBlock = state.categoryDetails.isSponsored ? (
    <div className="sponsor-block">
      <Link href={`${state.categoryDetails.sponsorURL}`} target="_blank">
        <a>
          <div className="sponsor-block-top">
            <div className="sponsor-block-left">
              <span>Patrocinat per</span>
            </div>
            <div className="sponsor-block-right">
              <div className="sponsor-logo">
                <img src={state.categoryDetails.sponsorLogo} />
              </div>
              <div className="sponsor-block-claim">
                <span>{state.categoryDetails.sponsorClaim}</span>
              </div>
            </div>
          </div>
        </a>
      </Link>
    </div>
  ) : null;

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
    state.results.forEach((result) => {
      let position, path;
      if (result.type === "activity") {
        position = {
          lat: parseFloat(result.activity_lat),
          lng: parseFloat(result.activity_lng),
        };
        path = "/activitats";
      }
      if (result.type === "place") {
        position = {
          lat: parseFloat(result.place_lat),
          lng: parseFloat(result.place_lng),
        };
        path = "/allotjaments";
      }
      const contentString =
        `<div id="infoview-wrapper">` +
        `<h1 id="firstHeading" class="firstHeading">${result.title}</h1>` +
        `<p>${result.subtitle}</p>` +
        `<a href="${path}/${result.slug}" title="${result.title}" target="_blank">Veure l'escapada</>` +
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

  return (
    <>
      <Head>
        <title>{state.categoryDetails.title} - Escapadesenparella.cat</title>
        <link rel="icon" href="/favicon.ico" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta
          name="description"
          content={`Històries en parella per a inspirar, descobrir nous llocs i, en definitiva, fer-vos venir ganes d'una escapada en parella per recordar.`}
        />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`${state.categoryDetails.title} - Escapadesenparella.cat`}
        />
        <meta
          property="og:description"
          content={`Històries en parella per a inspirar, descobrir nous llocs i, en definitiva, fer-vos venir ganes d'una escapada en parella per recordar.`}
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
          content={`${state.categoryDetails.title} - Escapadesenparella.cat`}
        />
        <meta
          name="twitter:description"
          content={`Històries en parella per a inspirar, descobrir nous llocs i, en definitiva, fer-vos venir ganes d'una escapada en parella per recordar.`}
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
      <div id="contentList" className="category">
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
                    <span className="block-title">Classe d'allotjament</span>
                    <Form.Check
                      label="Hotel"
                      name="placeType"
                      id="hotel"
                      //   onChange={handleCheckType}
                    />
                    <Form.Check
                      label="Apartament"
                      name="placeType"
                      id="apartment"
                      //   onChange={handleCheckType}
                    />
                    <Form.Check
                      label="Casa rural"
                      name="placeType"
                      id="ruralHouse"
                      //   onChange={handleCheckType}
                    />
                    <Form.Check
                      label="Cabanya"
                      name="placeType"
                      id="cabin"
                      //   onChange={handleCheckType}
                    />
                    <Form.Check
                      label="Casa-arbre"
                      name="placeType"
                      id="treeHouse"
                      //   onChange={handleCheckType}
                    />
                    <Form.Check
                      label="Carabana"
                      name="placeType"
                      id="trailer"
                      //   onChange={handleCheckType}
                    />
                  </div>
                  <div className="filter-block">
                    <span className="block-title">Regió</span>
                    <Form.Check
                      label="Barcelona"
                      name="placeRegion"
                      id="barcelona"
                      //   onChange={handleCheckRegion}
                    />
                    <Form.Check
                      label="Girona"
                      name="placeRegion"
                      id="girona"
                      //   onChange={handleCheckRegion}
                    />
                    <Form.Check
                      label="Lleida"
                      name="placeRegion"
                      id="lleida"
                      //   onChange={handleCheckRegion}
                    />
                    <Form.Check
                      label="Tarragona"
                      name="placeRegion"
                      id="tarragona"
                      //   onChange={handleCheckRegion}
                    />
                    <Form.Check
                      label="Costa Brava"
                      name="placeRegion"
                      id="costaBrava"
                      //   onChange={handleCheckRegion}
                    />
                    <Form.Check
                      label="Costa Daurada"
                      name="placeRegion"
                      id="costaDaurada"
                      //   onChange={handleCheckRegion}
                    />
                    <Form.Check
                      label="Pirineus"
                      name="placeRegion"
                      id="pirineus"
                      //   onChange={handleCheckRegion}
                    />
                  </div>
                  <div className="filter-block">
                    <span className="block-title">Estació de l'any</span>
                    <Form.Check
                      label="Hivern"
                      name="placeSeason"
                      id="winter"
                      //   onChange={handleCheckSeason}
                    />
                    <Form.Check
                      label="Primavera"
                      name="placeSeason"
                      id="spring"
                      //   onChange={handleCheckSeason}
                    />
                    <Form.Check
                      label="Estiu"
                      name="placeSeason"
                      id="summer"
                      //   onChange={handleCheckSeason}
                    />
                    <Form.Check
                      label="Tardor"
                      name="placeSeason"
                      id="autumn"
                      //   onChange={handleCheckSeason}
                    />
                  </div>
                </div>
              </div>
              <div className="col center">
                <div className="top-nav-wrapper">
                  <h1 className="top-nav-title">
                    {state.categoryDetails.title}
                  </h1>
                  <p className="top-nav-subtitle">
                    {state.categoryDetails.seoText}
                  </p>
                  {sponsorBlock}
                </div>
                <div className="listings-wrapper">
                  <div className="listings-list">{resultsList}</div>
                </div>
              </div>
              <div className="col right">
                <div className="map-wrapper">
                  <div className="map-block">
                    {state.hasResults ? (
                      <GoogleMapReact
                        bootstrapURLKeys={{
                          key: `${process.env.GOOGLE_API_KEY}`,
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

export default CategoryPage;
