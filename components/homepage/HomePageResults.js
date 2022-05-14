import Link from "next/link";
import { useEffect, useState } from "react";
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

  const date = new Date();
  const foundationYears = date.getFullYear() - 2015;

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
      <section className="homepage-section pt-16 relative">
        <span
          id="featuredPlaces"
          className="absolute -top-24 left-0 w-full block"
        ></span>
        <div className="homepage-section-title">
          <h2>Els allotjaments més ben valorats</h2>
        </div>
        <div className="section-listings">
          <div className="flex flex-wrap items-start -mx-3">
            {mostRatedList}
          </div>
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
      <section className="homepage-section pt-16">
        <div className="homepage-section-title">
          <h2 className="">Escapades romàntiques per desconnectar </h2>
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
      <section className="homepage-section pt-16">
        <div className="homepage-section-title">
          <h2 className="">L'aventura us crida</h2>
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
      <section className="homepage-section pt-16">
        <h2 className="homepage-section-title">
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
      <section className="homepage-section pt-16">
        <h2 className="homepage-section-title">
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
      <section className="homepage-section pt-16">
        <h2 className="homepage-section-title">Històries en parella</h2>
        <div className="section-listings">
          <div className="flex flex-wrap items-stretch justify-between -m-3">
            {culturalList}
          </div>
        </div>
      </section>
    );
  }
  placeTypeSection = (
    <section className="homepage-section pt-16" id="placesTypes">
      <div className="homepage-section-title">
        <h2 className="">Allotjaments pensats per a parelles</h2>
      </div>
      <div className="section-listings">
        <div className="flex flex-wrap items-center justify-between -m-4">
          <a
            href={`/hotels-amb-encant`}
            title="Hotels amb encant"
            rel="follow"
            className="listing flex items-center w-full md:w-1/2 lg:w-1/3 px-4"
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
            className="listing flex items-center w-full md:w-1/2 lg:w-1/3 px-4"
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
            className="listing flex items-center w-full md:w-1/2 lg:w-1/3 p-4"
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
            className="listing flex items-center w-full md:w-1/2 lg:w-1/3 px-4"
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
            className="listing flex items-center w-full md:w-1/2 lg:w-1/3 px-4"
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
            className="listing flex items-center w-full md:w-1/2 lg:w-1/3 px-4"
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
    <section
      id="introSection"
      className="homepage-section mt-16 xl:mt-36 py-16"
    >
      <div className="container">
        <div className="w-full flex flex-wrap items-start">
          <div className="w-full lg:w-1/2 -mt-32 xl:-mt-44">
            <picture>
              <img
                src="https://res.cloudinary.com/juligoodie/image/upload/v1652535865/getaways-guru/about-home_mikxom.jpg"
                alt="Escapades en parella, i molt més"
                className="w-full h-full object-cover object-center rounded-lg"
                width={300}
                height={400}
                loading="lazy"
              ></img>
            </picture>
            <figcaption className="text-xs mt-2.5">
              Andrea i Juli, Castell de Rocabruna (Ripollès) / ©
              Escapadesenparella.cat
            </figcaption>
          </div>
          <div className="w-full lg:w-1/2 pt-12 lg:pt-0 lg:pl-16">
            <div className="homepage-section-title">
              <h2 className="">Escapades en parella, i molt més</h2>
            </div>
            <div className="homepage-section-content mt-4">
              <p>
                Hola, som l'Andrea i en Juli, i et volem donar la benvinguda a
                Escapadesenparella.cat, el recomanador d'escapades en parella de
                referència a Catalunya. Busques{" "}
                <strong>escapades en parella</strong>? No sabeu&nbsp;
                <strong>què fer aquest cap de setmana</strong>? Cansats de fer
                sempre el mateix? A Escapadesenparella.cat tenim la sol·lució!
              </p>
              <p>
                Fa {foundationYears} anys vam començar a compartir les escapades
                en parella que fèiem arreu de Catalunya, amb l'objectiu de
                motivar a sortir a <strong>descobrir Catalunya</strong>, i donar
                a conèixer llocs únics per gaudir en parella, perquè crèiem, i
                seguim creient, que hi ha vida més enllà d'anar al cinema o
                veure Netflix al sofà.
              </p>
              <p>
                A dia d'avui estem encantats de poder seguir compartint amb tots
                vosaltres les{" "}
                <strong>millors escapades en parella a Catalunya</strong>, així
                que gràcies per ser aquí llegint aquesta nota. Perquè per
                nosaltres, Escapadesenparella.cat és molt més que escapades en
                parella; esperem transmetre't aquest sentiment!
              </p>
              <div className="flex flex-wrap items-center -mx-2 mt-4">
                <div className="px-2">
                  <Link href="#">
                    <a className="button button__primary button__lg inline-flex">
                      Conèix-nos millor
                    </a>
                  </Link>
                </div>
                <div className="px-2">
                  <Link href="/contacte">
                    <a className="button button__secondary button__lg inline-flex">
                      Contacta'ns
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div id="homePageResults" className="relative z-40">
      <div className="container">
        <div className="w-full">
          {mostRatedSection}
          {romanticGetawaysSection}
          {placeTypeSection}
          {adventureGetawaysSection}
          {gastronomicGetawaysSection}
          {storiesSection}
          {culturalGetawaysSection}
        </div>
      </div>
      {introSection}
    </div>
  );
};

export default HomePageResults;
