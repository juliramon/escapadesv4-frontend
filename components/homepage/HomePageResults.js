import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import PublicSquareBox from "../../components/listings/PublicSquareBox";
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
          if (el.categories.includes("aventura")) {
            adventureGetaways.push(el);
          }
          if (el.categories.includes("romantica")) {
            romanticGetaways.push(el);
          }
          if (el.categories.includes("gastronomica")) {
            gastronomicGetaways.push(el);
          }
          if (el.categories.includes("cultural")) {
            culturalGetaways.push(el);
          }
          if (el.place_rating > 4.7) {
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
      while (state.mostRatedGetaways.indexOf(el) < 3) {
        let location;
        if (el.type === "activity") {
          location = (
            <span className="listing-location">{`${
              el.activity_locality === undefined
                ? el.activity_state
                : el.activity_locality
            }`}</span>
          );
        }
        if (el.type === "place") {
          location = (
            <span className="listing-location">{`${
              el.place_locality === undefined ? "" : el.place_locality
            }`}</span>
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
            placeType={el.placeType}
            categoria={el.categories}
            duration={el.duration}
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
        <div className="top-rated-badge">
          <svg width="128px" height="128px" viewBox="0 0 206 206" version="1.1">
            <title>Group 2</title>
            <g
              id="Page-1"
              stroke="none"
              strokeWidth="1"
              fill="none"
              fillRule="evenodd"
            >
              <g id="Group-2" transform="translate(3.678325, 3.000000)">
                <path
                  d="M0,111.709813 C5.79798792,161.420663 48.0544879,200 99.3216749,200 C150.426343,200 192.577363,161.66487 198.587112,112.182231 M198.59881,87.9144754 C192.63227,38.3850857 150.459631,0 99.3216749,0 C48.1434059,0 5.94459472,38.4456289 0.0304970376,88.0316311"
                  id="Shape"
                  stroke="#2E6AE4"
                  strokeWidth="5"
                  fillOpacity="0"
                  fill="#D8D8D8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M35.4452,112.096521 C41.1137637,142.214616 67.5568135,165 99.3216749,165 C131.12058,165 157.58626,142.165749 163.216304,111.99966 M163.281647,88.355957 C157.793976,58.0138882 131.245416,35 99.3216749,35 C67.4626248,35 40.9569935,57.9207104 35.3953234,88.1715887"
                  id="Shape"
                  stroke="#2E6AE4"
                  strokeWidth="5"
                  fillOpacity="0"
                  fill="#D8D8D8"
                  strokeLinecap="round"
                  strokeLinejoin="bevel"
                ></path>
                <g id="Group" transform="translate(50.321675, 51.000000)">
                  <polygon id="Path" points="0 0 98 0 98 98 0 98"></polygon>
                  <polygon
                    id="Path"
                    stroke="#2E6AE4"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points="48.0287402 72.8443637 22.6880633 86 27.5287402 58.1359975 7 38.4045701 35.3296615 34.3504449 48 9 60.6703385 34.3504449 89 38.4045701 68.4712598 58.1359975 73.3119367 86"
                  ></polygon>
                </g>
                <line
                  x1="35.4452"
                  y1="100"
                  x2="-1.0658141e-14"
                  y2="100"
                  id="Path-2"
                  stroke="#2E6AE4"
                  strokeWidth="5"
                  strokeLinecap="round"
                ></line>
                <line
                  x1="198.4452"
                  y1="100"
                  x2="163"
                  y2="100"
                  id="Path-2-Copy"
                  stroke="#2E6AE4"
                  strokeWidth="5"
                  strokeLinecap="round"
                ></line>
              </g>
            </g>
          </svg>
        </div>
        <div className="homepage-section-title">
          <h2 className="uppercase">Els allotjaments més ben valorats</h2>
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
      while (state.romanticGetaways.indexOf(el) < 3) {
        let location;
        if (el.type === "activity") {
          location = (
            <span className="listing-location">{`${
              el.activity_locality === undefined
                ? el.activity_state
                : el.activity_locality
            }`}</span>
          );
        }
        if (el.type === "place") {
          location = (
            <span className="listing-location">{`${
              el.place_locality === undefined ? "" : el.place_locality
            }`}</span>
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
            placeType={el.placeType}
            categoria={el.categories}
            duration={el.duration}
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
        </div>
        <div className="section-listings">
          <div className="section-listings-wrapper">{romanticList}</div>
        </div>
      </section>
    );
  }
  if (state.adventureGetaways.length > 0) {
    let adventureList = state.adventureGetaways.map((el) => {
      while (state.adventureGetaways.indexOf(el) < 3) {
        let location;
        if (el.type === "activity") {
          location = (
            <span className="listing-location">{`${
              el.activity_locality === undefined
                ? el.activity_state
                : el.activity_locality
            }`}</span>
          );
        }
        if (el.type === "place") {
          location = (
            <span className="listing-location">{`${
              el.place_locality === undefined ? "" : el.place_locality
            }`}</span>
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
            placeType={el.placeType}
            categoria={el.categories}
            duration={el.duration}
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
        </div>
        <div className="section-listings">
          <div className="section-listings-wrapper">{adventureList}</div>
        </div>
      </section>
    );
  }
  if (state.gastronomicGetaways.length > 0) {
    let gastronomicList = state.gastronomicGetaways.map((el) => {
      while (state.gastronomicGetaways.indexOf(el) < 3) {
        let location;
        if (el.type === "activity") {
          location = (
            <span className="listing-location">{`${
              el.activity_locality === undefined
                ? el.activity_state
                : el.activity_locality
            }`}</span>
          );
        }
        if (el.type === "place") {
          location = (
            <span className="listing-location">{`${
              el.place_locality === undefined ? "" : el.place_locality
            }`}</span>
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
            placeType={el.placeType}
            categoria={el.categories}
            duration={el.duration}
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
        <div className="section-listings">
          <div className="section-listings-wrapper">{gastronomicList}</div>
        </div>
      </section>
    );
  }
  if (state.culturalGetaways.length > 0) {
    let culturalList = state.culturalGetaways.map((el) => {
      while (state.culturalGetaways.indexOf(el) < 3) {
        let location;
        if (el.type === "activity") {
          location = (
            <span className="listing-location">{`${
              el.activity_locality === undefined
                ? el.activity_state
                : el.activity_locality
            }`}</span>
          );
        }
        if (el.type === "place") {
          location = (
            <span className="listing-location">{`${
              el.place_locality === undefined ? "" : el.place_locality
            }`}</span>
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
            placeType={el.placeType}
            categoria={el.categories}
            duration={el.duration}
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
          Escapades en parella per a desconnectar
        </h2>
        <div className="section-listings">
          <div className="section-listings-wrapper">{culturalList}</div>
        </div>
      </section>
    );
  }
  if (state.stories.length > 0) {
    let culturalList = state.stories.map((el) => {
      while (state.stories.indexOf(el) < 3) {
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
                <picture>
                  <source srcSet="../../hotels-amb-encant-escapades-en-parella.png" />
                  <img
                    src="../../hotels-amb-encant-escapades-en-parella.png"
                    data-src="../../hotels-amb-encant-escapades-en-parella.png"
                    alt="Hotels amb encant"
                    width="400"
                    height="300"
                    loading="lazy"
                  />
                </picture>
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
                <picture>
                  <source srcSet="../../apartamens-escapades-en-parella.png" />
                  <img
                    src="../../apartamens-escapades-en-parella.png"
                    data-src="../../apartamens-escapades-en-parella.png"
                    alt="Apartaments de somni"
                    width="400"
                    height="300"
                    loading="lazy"
                  />
                </picture>
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
                <picture>
                  <source srcSet="../../cases-arbre-escapades-en-parella.png" />
                  <img
                    src="../../cases-arbre-escapades-en-parella.png"
                    data-src="../../cases-arbre-escapades-en-parella.png"
                    alt="Cases-arbre"
                    width="400"
                    height="300"
                    loading="lazy"
                  />
                </picture>
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
                <picture>
                  <source srcSet="../../cases-rurals-escapades-en-parella.png" />
                  <img
                    src="../../cases-rurals-escapades-en-parella.png"
                    data-src="../../cases-rurals-escapades-en-parella.png"
                    alt="Cases rurals"
                    width="400"
                    height="300"
                    loading="lazy"
                  />
                </picture>
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
                <picture>
                  <source srcSet="../../carabanes-escapades-en-parella.png" />
                  <img
                    src="../../carabanes-escapades-en-parella.png"
                    data-src="../../carabanes-escapades-en-parella.png"
                    alt="Carabanes"
                    width="400"
                    height="300"
                    loading="lazy"
                  />
                </picture>
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
                <picture>
                  <source srcSet="../../refugis-escapades-en-parella.png" />
                  <img
                    src="../../refugis-escapades-en-parella.png"
                    data-src="../../refugis-escapades-en-parella.png"
                    alt="Refugis"
                    width="400"
                    height="300"
                    loading="lazy"
                  />
                </picture>
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
