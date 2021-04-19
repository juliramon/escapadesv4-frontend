import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import PublicSquareBox from "../../components/listings/PublicSquareBox";
import ContentService from "../../services/contentService";
import FeaturedStoryBox from "../listings/FeaturedStoryBox";

const HomePageResults = ({ activities, places, stories, totals }) => {
  const initialState = {
    isFetching: false,
    romanticGetaways: [],
    popularRegions: [],
    adventureGetaways: [],
    mostRatedGetaways: [],
    gastronomicGetaways: [],
    culturalGetaways: [],
    stories: [],
  };
  const [state, setState] = useState(initialState);

  const service = new ContentService();

  useEffect(() => {
    if (activities.length > 0 || places.length > 0 || stories.length > 0) {
      let getaways = [];
      if (activities.length > 0) {
        activities.forEach((el) => getaways.push(el));
      }
      if (places.length > 0) {
        places.forEach((el) => getaways.push(el));
      }
      let hasGetaways;
      getaways.length > 0 ? (hasGetaways = true) : (hasGetaways = false);
      if (hasGetaways) {
        let romanticGetaways = [];
        let adventureGetaways = [];
        let gastronomicGetaways = [];
        let culturalGetaways = [];
        let mostRatedGetaways = [];
        getaways.forEach((el) => {
          if (el.categories.includes("adventure")) {
            adventureGetaways.push(el);
          }
          if (el.categories.includes("romantic")) {
            romanticGetaways.push(el);
          }
          if (el.categories.includes("gastronomic")) {
            gastronomicGetaways.push(el);
          }
          if (el.categories.includes("cultural")) {
            culturalGetaways.push(el);
          }
          if (el.activity_rating > 4.5 || el.place_rating > 4.5) {
            mostRatedGetaways.push(el);
          }
        });
        setState({
          ...state,
          romanticGetaways: romanticGetaways,
          adventureGetaways: adventureGetaways,
          gastronomicGetaways: gastronomicGetaways,
          culturalGetaways: culturalGetaways,
          mostRatedGetaways: mostRatedGetaways,
          stories: stories,
          totals: totals,
          isFetching: hasGetaways,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  let mostRatedSection,
    romanticGetawaysSection,
    adventureGetawaysSection,
    gastronomicGetawaysSection,
    culturalGetawaysSection,
    placeTypeSection,
    introSection,
    storiesSection;
  if (state.mostRatedGetaways.length > 0) {
    let mostRatedList = state.mostRatedGetaways.map((el, idx) => {
      while (state.mostRatedGetaways.indexOf(el) < 4) {
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
            rating={el.activity_rating || el.place_rating}
            location={location}
            website={el.website}
            phone={el.phone}
          />
        );
      }
      return undefined;
    });
    mostRatedSection = (
      <section className="homepage-section">
        <div className="homepage-section-title">
          <h2 className="uppercase">Les escapades més ben valorades</h2>
          <p>Les millors escapades en parella us estan esperant</p>
        </div>
        <div className="section-listings">
          <div className="section-listings-wrapper">{mostRatedList}</div>
        </div>
      </section>
    );
  }

  let hotels, apartaments, casesrurals, casesarbre, refugis, carabanes;
  if (state.totals !== undefined) {
    hotels = state.totals.objPlaces.hotels;
    apartaments = state.totals.objPlaces.apartaments;
    casesrurals = state.totals.objPlaces.casesrurals;
    casesarbre = state.totals.objPlaces.casesarbre;
    refugis = state.totals.objPlaces.refugis;
    carabanes = state.totals.objPlaces.carabanes;
  }

  if (state.romanticGetaways.length > 0) {
    let romanticList = state.romanticGetaways.map((el, idx) => {
      while (state.romanticGetaways.indexOf(el) < 4) {
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
            rating={el.activity_rating || el.place_rating}
            location={location}
            website={el.website}
            phone={el.phone}
          />
        );
      }
      return undefined;
    });
    romanticGetawaysSection = (
      <section className="homepage-section">
        <div className="homepage-section-title">
          <h2 className="uppercase">Escapades romàntiques per desconnectar </h2>
          <p>Perquè us mereixeu gaudir sense preocupacions</p>
        </div>
        <div className="section-listings">
          <div className="section-listings-wrapper">{romanticList}</div>
        </div>
      </section>
    );
  }
  if (state.adventureGetaways.length > 0) {
    let adventureList = state.adventureGetaways.map((el) => {
      while (state.adventureGetaways.indexOf(el) < 4) {
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
            rating={el.activity_rating || el.place_rating}
            location={location}
            website={el.website}
            phone={el.phone}
          />
        );
      }
      return undefined;
    });
    adventureGetawaysSection = (
      <section className="homepage-section">
        <div className="homepage-section-title">
          <h2 className="uppercase">L'aventura us crida</h2>
          <p>Escapades d'aventura, ideals per cremar adrenalina</p>
        </div>
        <div className="section-listings">
          <div className="section-listings-wrapper">{adventureList}</div>
        </div>
      </section>
    );
  }
  if (state.gastronomicGetaways.length > 0) {
    let gastronomicList = state.gastronomicGetaways.map((el) => {
      while (state.gastronomicGetaways.indexOf(el) < 4) {
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
            rating={el.activity_rating || el.place_rating}
            location={location}
            website={el.website}
            phone={el.phone}
          />
        );
      }
      return undefined;
    });
    gastronomicGetawaysSection = (
      <section className="homepage-section">
        <h2 className="homepage-section-title uppercase">
          La millor cita, als millors restaurants
        </h2>
        <p>Escapades gastronòmiques per a la cita ideal</p>
        <div className="section-listings">
          <div className="section-listings-wrapper">{gastronomicList}</div>
        </div>
      </section>
    );
  }
  if (state.culturalGetaways.length > 0) {
    let culturalList = state.culturalGetaways.map((el) => {
      while (state.culturalGetaways.indexOf(el) < 4) {
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
            rating={el.activity_rating || el.place_rating}
            location={location}
            website={el.website}
            phone={el.phone}
          />
        );
      }
      return undefined;
    });
    culturalGetawaysSection = (
      <section className="homepage-section">
        <h2 className="homepage-section-title uppercase">
          Escapades que us distrauran
        </h2>
        <p>Escapades culturals per fer volar la imaginació</p>
        <div className="section-listings">
          <div className="section-listings-wrapper">{culturalList}</div>
        </div>
      </section>
    );
  }
  if (state.stories.length > 0) {
    let culturalList = state.stories.map((el) => {
      while (state.stories.indexOf(el) < 4) {
        return (
          <FeaturedStoryBox
            key={el._id}
            slug={el.slug}
            id={el._id}
            cover={el.cover}
            title={el.title}
            subtitle={el.subtitle}
            owner={el.owner.fullName}
            avatar={el.owner.avatar}
          />
        );
      }
      return undefined;
    });
    storiesSection = (
      <section className="homepage-section">
        <h2 className="homepage-section-title uppercase">
          Històries en parella
        </h2>
        <p>
          Històries en parella per a inspirar, descobrir nous llocs i fer-vos
          venir ganes d'una escapada en parella per recordar
        </p>
        <div className="section-listings">
          <div className="section-listings-wrapper">{culturalList}</div>
        </div>
      </section>
    );
  }
  placeTypeSection = (
    <section className="homepage-section" id="placesTypes">
      <div className="homepage-section-title">
        <h2 className="uppercase">Allotjaments pensats per a parelles</h2>
        <p>Escapeu-vos a allotjaments amb encant arreu de Catalunya</p>
      </div>
      <div className="section-listings">
        <div className="section-litings-wrapper">
          <a
            href={`/hotels-amb-encant`}
            title="Hotels amb encant"
            rel="follow"
            className="listing"
          >
            <div className="left">
              <div className="image">
                <img
                  src="../../hotels-amb-encant-escapades-en-parella.png"
                  alt=""
                />
              </div>
            </div>
            <div className="right">
              <h3>Hotels amb encant</h3>
              <span className="counter">{hotels} hotels amb encant</span>
              <span className="cta">
                Veure'ls tots{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-arrow-narrow-right"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#2e6ae4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <line x1="15" y1="16" x2="19" y2="12" />
                  <line x1="15" y1="8" x2="19" y2="12" />
                </svg>
              </span>
            </div>
          </a>
          <a
            href={`/apartaments-per-a-parelles`}
            title="Apartaments de somni"
            rel="nofollow"
            className="listing"
          >
            <div className="left">
              <div className="image">
                <img src="../../apartamens-escapades-en-parella.png" alt="" />
              </div>
            </div>
            <div className="right">
              <h3>Apartaments de somni</h3>
              <span className="counter">
                {apartaments} apartaments de somni
              </span>
              <span className="cta">
                Veure'ls tots{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-arrow-narrow-right"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#2e6ae4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <line x1="15" y1="16" x2="19" y2="12" />
                  <line x1="15" y1="8" x2="19" y2="12" />
                </svg>
              </span>
            </div>
          </a>
          <a
            href={`/cabanyes-als-arbres`}
            title="Cases-arbre"
            rel="follow"
            className="listing"
          >
            <div className="left">
              <div className="image">
                <img src="../../cases-arbre-escapades-en-parella.png" alt="" />
              </div>
            </div>
            <div className="right">
              <h3>Cases-arbre</h3>
              <span className="counter">{casesarbre} cases-arbre</span>
              <span className="cta">
                Veure'ls tots{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-arrow-narrow-right"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#2e6ae4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <line x1="15" y1="16" x2="19" y2="12" />
                  <line x1="15" y1="8" x2="19" y2="12" />
                </svg>
              </span>
            </div>
          </a>
          <a
            href={`/cases-rurals`}
            title="Cases rurals"
            rel="follow"
            className="listing"
          >
            <div className="left">
              <div className="image">
                <img src="../../cases-rurals-escapades-en-parella.png" alt="" />
              </div>
            </div>
            <div className="right">
              <h3>Cases rurals</h3>
              <span className="counter">{casesrurals} cases rurals</span>
              <span className="cta">
                Veure'ls tots{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-arrow-narrow-right"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#2e6ae4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <line x1="15" y1="16" x2="19" y2="12" />
                  <line x1="15" y1="8" x2="19" y2="12" />
                </svg>
              </span>
            </div>
          </a>
          <a
            href={`/carabanes`}
            title="Carabanes"
            rel="nofollow"
            className="listing"
          >
            <div className="left">
              <div className="image">
                <img src="../../carabanes-escapades-en-parella.png" alt="" />
              </div>
            </div>
            <div className="right">
              <h3>Carabanes</h3>
              <span className="counter">{carabanes} carabanes</span>
              <span className="cta">
                Veure'ls tots{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-arrow-narrow-right"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#2e6ae4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <line x1="15" y1="16" x2="19" y2="12" />
                  <line x1="15" y1="8" x2="19" y2="12" />
                </svg>
              </span>
            </div>
          </a>
          <a
            href={`/refugis`}
            title="Refugis"
            rel="nofollow"
            className="listing"
          >
            <div className="left">
              <div className="image">
                <img src="../../refugis-escapades-en-parella.png" alt="" />
              </div>
            </div>
            <div className="right">
              <h3>Refugis</h3>
              <span className="counter">{refugis} refugis</span>
              <span className="cta">
                Veure'ls tots{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-arrow-narrow-right"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#2e6ae4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <line x1="15" y1="16" x2="19" y2="12" />
                  <line x1="15" y1="8" x2="19" y2="12" />
                </svg>
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
  introSection = (
    <div id="introSection">
      <Container className="mw-1200" fluid>
        <Row>
          <Col lg={12}>
            <section className="homepage-section">
              <div className="homepage-section-title">
                <h2 className="uppercase">Escapades en parella, i molt més</h2>
                <p>Nota de l'Andrea i en Juli</p>
              </div>
              <div className="homepage-section-content">
                <p>
                  Hola, som l'Andrea i en Juli, i et volem donar la benvinguda a
                  Escapadesenparella.cat, el recomanador d'escapades en parella
                  de referència a Catalunya. Busques escapades en parella? No
                  saps què fer aquest cap de setmana amb la teva parella? Cansat
                  de fer sempre el mateix? A Escapadesenparella.cat tenim la
                  sol·lució!
                </p>
                <p>
                  Ja fa tres anys que vam decidir començar a compartir les
                  escapades en parella que fem arreu de Catalunya, amb
                  l'objectiu de motivar i donar a conèixer llocs únics per viure
                  en parella, com ara hotels amb encant, escapades de cap de
                  setmana de somni, escapades romàntiques per no oblidar,
                  escapades gastronòmiques ideals per a una cita, etc. En
                  definitiva, compartir tot allò que es pot fer amb la teva
                  parella, perquè hi ha vida més enllà d'anar al cinema o veure
                  Netflix al sofà. Ep! I us ho diu dos fans de Netflix!
                </p>
                <p>
                  De fet, Escapadesenparella.cat ens ha permès, i ens segueix
                  permetent, descobrir molt més que escapades en parella. Al
                  llarg d'aquest temps hem conegut racons únics a Catalunya que
                  mai oblidarem, hem parlat amb persones abans desconegudes, que
                  s'han convertit en bons amics, i sobretot, hem rigut, après i
                  compartit.
                </p>
                <p>
                  Per acabar, no podríem estar més agraïts de tenir aquesta
                  oportunitat de seguir compartint amb tots vosaltres les
                  millors escapades en parella a Catalunya, gràcies per ser aquí
                  llegint aquesta nota. Perquè per nosaltres,
                  Escapadesenparella.cat és molt més que escapades en parella,
                  esperem transmetre't aquest sentiment!
                </p>
                <p>Ens veiem a la propera escapada!</p>
              </div>
            </section>
          </Col>
        </Row>
      </Container>
    </div>
  );
  return (
    <div id="homePageResults">
      <Container className="mw-1200" fluid>
        <Row>
          <Col lg={12}>
            {mostRatedSection}
            {romanticGetawaysSection}
            {placeTypeSection}
            {adventureGetawaysSection}
            {gastronomicGetawaysSection}
            {storiesSection}
            {culturalGetawaysSection}
          </Col>
        </Row>
      </Container>
      {introSection}
    </div>
  );
};

export default HomePageResults;
