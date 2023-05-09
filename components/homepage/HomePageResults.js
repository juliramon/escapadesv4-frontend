import Link from "next/link";
import { useEffect, useState } from "react";
import PublicSquareBox from "../../components/listings/PublicSquareBox";
import RegularListBox from "../../components/listings/RegularListBox";

const HomePageResults = ({
  categories,
  featuredRegions,
  featuredActivities,
  featuredList,
  mostRatedPlaces,
  mostRecentStories,
  featuredRomanticGetaways,
  featuredAdventureGetaways,
  featuredGastronomicGetaways,
  totals,
}) => {
  const initialState = {
    placeCategories: [],
    activityCategories: [],
    featuredRegions: [],
    mostRatedGetaways: [],
    mostRecentStories: [],
    featuredRomanticGetaways: [],
    featuredAdventureGetaways: [],
    featuredGastronomicGetaways: [],
    featuredRelaxGetaways: [],
    popularRegions: [],
    emptyBlocksPerRow: [0, 1, 2, 3],
  };
  const [state, setState] = useState(initialState);

  useEffect(() => {
    if (
      categories.length > 0 ||
      featuredRegions.length > 0 ||
      featuredActivities.length > 0 ||
      featuredList.length > 0 ||
      mostRatedPlaces.length > 0 ||
      mostRecentStories.length > 0 ||
      featuredRomanticGetaways.length > 0 ||
      featuredAdventureGetaways.length > 0 ||
      featuredGastronomicGetaways.length > 0
    ) {
      let placeCategories = [];
      let activityCategories = [];

      categories.filter((el) => {
        if (el.isPlace == true) {
          placeCategories.push(el);
        } else {
          activityCategories.push(el);
        }
      });

      setState({
        ...state,
        placeCategories: placeCategories,
        activityCategories: activityCategories,
        featuredRegions: featuredRegions,
        mostRatedGetaways: mostRatedPlaces,
        featuredList: featuredList[0],
        mostRecentStories: mostRecentStories,
        featuredRomanticGetaways: featuredRomanticGetaways,
        featuredAdventureGetaways: featuredAdventureGetaways,
        featuredGastronomicGetaways: featuredGastronomicGetaways,
        totals: totals,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const date = new Date();
  const foundationYears = date.getFullYear() - 2015;

  return (
    <div id="homePageResults" className="relative z-30">
      <div className="container">
        <div className="w-full">
          {/* Most rated getaways */}
          <section className="pt-12 lg:pt-20">
            <h2 className="mb-0">Els allotjaments més ben valorats</h2>
            <div className="flex flex-wrap items-stretch -mx-1.5 mt-2">
              {state.mostRatedGetaways.length > 0
                ? state.mostRatedGetaways.map((el, idx) => {
                    while (state.mostRatedGetaways.indexOf(el) < 4) {
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
                            el.place_locality === undefined
                              ? ""
                              : el.place_locality
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
                  })
                : state.emptyBlocksPerRow.map((el, idx) => (
                    <div
                      key={idx}
                      className="w-full md:w-1/2 lg:w-1/4 px-2"
                      role="status"
                    >
                      <div className="flex justify-center items-center max-w-sm h-56 bg-gray-300 rounded-md animate-pulse dark:bg-gray-700">
                        <div className="flex justify-center items-center w-full h-48 bg-gray-300 rounded-md sm:w-96 dark:bg-gray-700">
                          <svg
                            className="w-12 h-12 text-gray-200"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 640 512"
                          >
                            <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
                          </svg>
                        </div>
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  ))}
            </div>
            <a
              href="/allotjaments"
              title="Veure més allotjaments"
              className="button button__ghost button__med text-[16px] inline-flex items-center mt-2.5 transition-all duration-300 ease-in-out"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1.5"
                width={20}
                height={20}
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M9 6l6 6l-6 6"></path>
              </svg>
              Veure'n més
            </a>
          </section>

          {/* Most popular romantic getaways */}
          <section className="pt-12">
            <h2 className="mb-0">Escapades romàntiques per desconnectar</h2>
            <div className="flex flex-wrap items-stretch -mx-1.5 mt-2">
              {state.featuredRomanticGetaways.length > 0
                ? state.featuredRomanticGetaways.map((el) => {
                    while (state.featuredRomanticGetaways.indexOf(el) < 4) {
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
                            el.place_locality === undefined
                              ? ""
                              : el.place_locality
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
                  })
                : null}
            </div>
            <a
              href="/escapades-romantiques"
              title="Veure més escapades romàntiques"
              className="button button__ghost button__med text-[16px] inline-flex items-center mt-2.5 transition-all duration-300 ease-in-out"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1.5"
                width={20}
                height={20}
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M9 6l6 6l-6 6"></path>
              </svg>
              Veure'n més
            </a>
          </section>

          {/* Featured list */}
          {state.featuredList ? (
            <section className="pt-12">
              <h2 className="mb-0">La llista destacada</h2>
              <div className="flex flex-wrap items-center justify-end overflow-hidden relative rounded-md lg:px-10 lg:py-12 lg:pr-20 mt-4 shadow-md lg:shadow-none">
                <div className="hidden lg:block absolute inset-0 rounded-md overflow-hidden w-full lg:w-8/12">
                  <picture>
                    <source
                      srcSet="../../bg-llista-destacada.webp"
                      type="image/webp"
                    />
                    <img
                      src="../../bg-llista-destacada-s.jpg"
                      data-src="../../bg-llista-destacada-s.jpg"
                      alt="La llista destacada"
                      className="w-full  h-full object-cover rounded-md overflow-hidden"
                      width="400"
                      height="300"
                      loading="lazy"
                    />
                  </picture>
                  <figcaption className="text-xs hidden lg:block absolute bottom-2 right-3">
                    Il·lustració: Andrea Prat
                  </figcaption>
                </div>
                <div className="w-full lg:w-9/12 rounded-md bg-white relative z-10 shadow-md overflow-hidden">
                  <RegularListBox
                    key={state.featuredList._id}
                    slug={state.featuredList.slug}
                    cover={state.featuredList.cover}
                    title={state.featuredList.title}
                    subtitle={state.featuredList.subtitle}
                    avatar={state.featuredList.owner.avatar}
                    owner={state.featuredList.owner.fullName}
                    date={state.featuredList.createdAt}
                  />
                </div>
              </div>
              <a
                href="/llistes"
                title="Veure més llistes"
                className="button button__ghost button__med text-[16px] inline-flex items-center mt-3 transition-all duration-300 ease-in-out"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1.5"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M9 6l6 6l-6 6"></path>
                </svg>
                Veure'n més
              </a>
            </section>
          ) : null}

          {/* Most popular adventure getaways */}
          <section className="pt-12">
            <h2 className="mb-0">L'aventura us crida</h2>
            <div className="flex flex-wrap items-stretch -mx-1.5 mt-2">
              {state.featuredAdventureGetaways.length > 0
                ? state.featuredAdventureGetaways.map((el) => {
                    while (state.featuredAdventureGetaways.indexOf(el) < 4) {
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
                            el.place_locality === undefined
                              ? ""
                              : el.place_locality
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
                  })
                : null}
            </div>
            <a
              href="/escapades-aventura"
              title="Veure més escapades d'aventura"
              className="button button__ghost button__med text-[16px] inline-flex items-center mt-2.5 transition-all duration-300 ease-in-out"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1.5"
                width={20}
                height={20}
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M9 6l6 6l-6 6"></path>
              </svg>
              Veure'n més
            </a>
          </section>

          {/* Most popular gastronomic getaways */}
          <section className="pt-12">
            <h2 className="mb-0">La millor cita als millors restaurants</h2>
            <div className="flex flex-wrap items-stretch -mx-1.5 mt-2">
              {state.featuredGastronomicGetaways.length > 0
                ? state.featuredGastronomicGetaways.map((el) => {
                    while (state.featuredGastronomicGetaways.indexOf(el) < 4) {
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
                            el.place_locality === undefined
                              ? ""
                              : el.place_locality
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
                  })
                : null}
            </div>
            <a
              href="/escapades-gastronomiques"
              title="Veure més escapades gastronòmiques"
              className="button button__ghost button__med text-[16px] inline-flex items-center mt-2.5 transition-all duration-300 ease-in-out"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1.5"
                width={20}
                height={20}
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M9 6l6 6l-6 6"></path>
              </svg>
              Veure'n més
            </a>
          </section>

          {/* Getaway categories */}
          <section className="pt-16 pb-20 lg:pb-24" id="placesTypes">
            <div className="flex md:justify-center">
              <h2 className="mb-0 text-2xl md:text-center max-w-md">
                Escapades en parella a Catalunya, tot un món d'escapades per
                descobrir
              </h2>
            </div>

            <div className="mt-4">
              <div className="flex flex-wrap items-stretch justify-center">
                <ul className="list-none -m-1.5 pt-4 px-0 columns-1 md:columns-2 lg:columns-3 w-full">
                  {state.activityCategories
                    ? state.activityCategories.map((el, idx) => {
                        return (
                          <li key={idx} className="p-1.5">
                            <Link href="">
                              <a
                                title={el.title}
                                className="flex flex-wrap items-center shadow-md rounded-md overflow-hidden
                              "
                              >
                                <picture className="block w-16 h-16 overflow-hidden">
                                  <img
                                    src={el.image}
                                    alt={el.title}
                                    className="w-full h-full object-cover"
                                    width={48}
                                    height={48}
                                    loading="lazy"
                                  />
                                </picture>
                                <div className="pl-4 pr-6 py-4">
                                  <span className="inline-block text-[16px]">
                                    {el.title}
                                  </span>
                                </div>
                              </a>
                            </Link>
                          </li>
                        );
                      })
                    : null}

                  {state.placeCategories
                    ? state.placeCategories.map((el, idx) => {
                        return (
                          <li key={idx} className="p-1.5">
                            <Link href="">
                              <a
                                title={el.title}
                                className="flex flex-wrap items-center shadow-md rounded-md overflow-hidden
                              "
                              >
                                <picture className="block w-16 h-16 overflow-hidden">
                                  <img
                                    src={el.image}
                                    alt={el.title}
                                    className="w-full h-full object-cover"
                                    width={48}
                                    height={48}
                                    loading="lazy"
                                  />
                                </picture>
                                <div className="pl-4 pr-6 py-4">
                                  <span className="inline-block text-[16px]">
                                    {el.title}
                                  </span>
                                </div>
                              </a>
                            </Link>
                          </li>
                        );
                      })
                    : null}

                  {state.featuredRegions
                    ? state.featuredRegions.map((el, idx) => {
                        return (
                          <li key={idx} className="p-1.5">
                            <Link href="">
                              <a
                                title={el.title}
                                className="flex flex-wrap items-center shadow-md rounded-md overflow-hidden
                              "
                              >
                                <picture className="block w-16 h-16 overflow-hidden">
                                  <img
                                    src={el.image}
                                    alt={el.title}
                                    className="w-full h-full object-cover"
                                    width={48}
                                    height={48}
                                    loading="lazy"
                                  />
                                </picture>
                                <div className="pl-4 pr-6 py-4">
                                  <span className="inline-block text-[16px]">
                                    {el.title}
                                  </span>
                                </div>
                              </a>
                            </Link>
                          </li>
                        );
                      })
                    : null}
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* About us section */}
      <section className="pb-12">
        <div className="container">
          <div className="flex flex-wrap items-center justify-start overflow-hidden relative rounded-md lg:py-12 lg:pr-20">
            <div className="relative lg:absolute inset-0 rounded-md overflow-hidden flex justify-end">
              <div className="w-full lg:w-8/12 rounded-md overflow-hidden">
                <picture>
                  <source
                    srcSet="../../home-about-s-m.webp"
                    media="(max-width: 768px)"
                    type="image/webp"
                  />
                  <source
                    srcSet="../../home-about-s-m.jpg"
                    media="(max-width: 768px)"
                  />
                  <source
                    srcSet="../../home-about-s.webp"
                    media="(min-width: 768px)"
                    type="image/webp"
                  />
                  <source
                    srcSet="../../home-about-s.webp"
                    media="(max-width: 768px)"
                  />
                  <img
                    src="../../home-about-s.jpg"
                    alt="Escapades en parella, i molt més"
                    width="400"
                    height="300"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </picture>
              </div>
            </div>
            <div className="w-full lg:w-6/12 rounded-md bg-white relative z-10 lg:shadow-lg overflow-hidden pt-8 lg:px-8 lg:pb-8">
              <h2 className="mb-4">Escapades en parella, i molt més</h2>
              <p className="text-[16px]">
                Hola, som l'Andrea i en Juli, i et volem donar la benvinguda a
                Escapadesenparella.cat, el recomanador d'escapades en parella de
                referència a Catalunya. Busques{" "}
                <strong>escapades en parella</strong>? No sabeu&nbsp;
                <strong>què fer aquest cap de setmana</strong>? Cansats de fer
                sempre el mateix? A Escapadesenparella.cat tenim la sol·lució!
              </p>
              <p className="text-[16px]">
                Fa {foundationYears} anys vam començar a compartir les escapades
                en parella que fèiem arreu de Catalunya, amb l'objectiu de
                motivar a sortir a <strong>descobrir Catalunya</strong>, i donar
                a conèixer llocs únics per gaudir en parella, perquè crèiem, i
                seguim creient, que hi ha vida més enllà d'anar al cinema o
                veure Netflix al sofà.
              </p>
              <p className="text-[16px] mb-0">
                A dia d'avui estem encantats de poder seguir compartint amb tots
                vosaltres les{" "}
                <strong>millors escapades en parella a Catalunya</strong>, així
                que gràcies per ser aquí llegint aquesta nota. Perquè per
                nosaltres, Escapadesenparella.cat és molt més que escapades en
                parella; esperem transmetre't aquest sentiment!
              </p>
              <div className="mt-6">
                <a
                  href="/contacte"
                  title="Contacta'ns"
                  className="button button__primary button__med px-8"
                >
                  Contacta'ns
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePageResults;
