import { useEffect, useState } from "react";
import ContentService from "../services/contentService";
import NavigationBar from "../components/global/NavigationBar";
import FetchingSpinner from "../components/global/FetchingSpinner";
import Head from "next/head";
import FeaturedStoryBox from "../components/listings/FeaturedStoryBox";
import PopularStoryBox from "../components/listings/PopularStoryBox";
import RegularStoryBox from "../components/listings/RegularStoryBox";
import { useRouter } from "next/router";
import AdSense from "react-adsense";
import Footer from "../components/global/Footer";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import ShareBar from "../components/social/ShareBar";

const StoriesList = ({
  user,
  mostRecentStories,
  totalItems,
  stories,
  featuredStories,
  numPages,
}) => {
  const router = useRouter();

  const urlToShare = `https://escapadesenparella.cat/histories`;

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
    mostRecentStories: [],
    stories: [],
    featuredStories: [],
    hasStories: false,
    isFetching: false,
    numActivities: 0,
    numPages: 0,
    currentPage: 1,
  };

  const [state, setState] = useState(initialState);
  const service = new ContentService();

  useEffect(() => {
    if (stories) {
      setState({
        ...state,
        mostRecentStories: mostRecentStories,
        stories: stories,
        featuredStories: featuredStories,
        hasStories: true,
        numStories: totalItems,
        numPages: numPages,
      });
    }
  }, []);

  if (!state.hasStories) {
    return <FetchingSpinner />;
  }

  const loadMoreResults = async (page) => {
    setState({ ...state, isFetching: true });
    const { stories } = await service.paginateStories(page);
    setState({
      ...state,
      stories: [...state.stories, ...stories],
      isFetching: false,
      currentPage: ++state.currentPage,
    });
  };

  return (
    <>
      <Head>
        <title>Històries en parella - Escapadesenparella.cat</title>
        <link rel="icon" href="/favicon.ico" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta
          name="description"
          content={`Històries en parella per a inspirar, descobrir nous llocs i, en definitiva, fer-vos venir ganes d'una escapada en parella per recordar.`}
        />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`$Històries en parella - Escapadesenparella.cat`}
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
          content={`$Històries en parella - Escapadesenparella.cat`}
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
      <div className="stories">
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
                    Històries en parella
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <section className="py-6 md:pt-10 md:pb-16">
            <div className="container relative">
              <div className="w-full md:w-8/12 lg:w-6/12 md:mx-auto text-center">
                <h1>Històries en parella</h1>
                <p className="mt-4 text-lg">
                  Històries en parella per a inspirar, descobrir nous llocs i,
                  en definitiva, fer-vos venir ganes d'una escapada en parella
                  per recordar.
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center">
                  <div className="w-24 h-auto mr-4">
                    <picture>
                      <img
                        src="https://res.cloudinary.com/juligoodie/image/upload/v1618330078/getaways-guru/static-files/avatars-juli-andrea_c6dio6.png"
                        alt="Andrea i Juli, credors d'Escapadesenparella.cat"
                        className="w-full h-auto"
                        loading="eager"
                      />
                    </picture>
                  </div>
                  <span className="text-sm text-primary-400 relative -top-1">
                    De la mà de l'<b>Andrea i en Juli</b>,<br /> creadors
                    d'Escapadesenparella.cat
                  </span>
                </div>
              </div>
              <div className="w-full mt-10">
                <div className="flex flex-wrap items-center relative">
                  <Swiper
                    modules={[Navigation]}
                    spaceBetween={4}
                    slidesPerView={1}
                    navigation={{
                      nextEl: ".swiper-prev",
                      prevEl: ".swiper-next",
                    }}
                    breakpoints={{
                      768: {
                        slidesPerView: 2,
                      },
                      1024: {
                        slidesPerView: 3,
                      },
                      1280: {
                        slidesPerView: 4,
                      },
                    }}
                  >
                    {state.mostRecentStories.map((el) => (
                      <SwiperSlide key={el._id}>
                        <FeaturedStoryBox
                          slug={el.slug}
                          cover={el.cover}
                          title={el.title}
                          avatar={el.owner.avatar}
                          owner={el.owner.fullName}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <button className="bg-white shadow-xl w-10 h-10 flex items-center justify-center swiper-next absolute top-1/2 -left-4 z-40 transform -translate-y-1/2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-arrow-narrow-left text-primary-500"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <line x1="5" y1="12" x2="9" y2="16" />
                      <line x1="5" y1="12" x2="9" y2="8" />
                    </svg>
                  </button>
                  <button className="bg-white shadow-xl w-10 h-10 flex items-center justify-center swiper-prev absolute top-1/2 -right-4 z-40 transform -translate-y-1/2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-arrow-narrow-right text-primary-500"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <line x1="15" y1="16" x2="19" y2="12" />
                      <line x1="15" y1="8" x2="19" y2="12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </section>
          <section className="py-6 md:py-16 bg-primary-100">
            <div className="container">
              <h2>Històries destacades</h2>
              <div className="flex flex-wrap items-center mt-8 -mx-6 -mb-6">
                {state.hasStories
                  ? state.featuredStories.map((el, idx) => (
                      <PopularStoryBox
                        key={el._id}
                        slug={el.slug}
                        title={el.title}
                        subtitle={el.subtitle}
                        avatar={el.owner.avatar}
                        owner={el.owner.fullName}
                        cover={el.cover}
                        idx={`0${idx + 1}`}
                      />
                    ))
                  : null}
              </div>
            </div>
          </section>
          <section className="py-6 md:py-16">
            <div className="container">
              <div className="w-full border-b border-primary-300 pb-6 mb-8">
                <h2>Més històries per a inspirar-vos</h2>
                <p className="mt-4">
                  Des del Delta de l'Ebre fins al Cap de Creus, passant pels
                  cims més alts dels Pirineus.
                  <br /> Aquí t'expliquem les nostres aventures en parella a
                  Catalunya.
                </p>
              </div>
              <div className="flex flex-wrap items-start -mx-6">
                <div className="w-full lg:w-3/5 px-6 order-2 lg:order-none">
                  {state.stories.map((el) => (
                    <RegularStoryBox
                      key={el._id}
                      slug={el.slug}
                      cover={el.cover}
                      title={el.title}
                      subtitle={el.subtitle}
                      avatar={el.owner.avatar}
                      owner={el.owner.fullName}
                      date={el.createdAt}
                    />
                  ))}
                  <div>
                    {state.currentPage !== state.numPages ? (
                      <div className="w-full mt-10 flex justify-center">
                        {!state.isFetching ? (
                          <button
                            className="button button__primary button__lg"
                            onClick={() => loadMoreResults(state.currentPage)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="icon icon-tabler icon-tabler-plus mr-2"
                              width={20}
                              height={20}
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="currentColor"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              ></path>
                              <line x1={12} y1={5} x2={12} y2={19}></line>
                              <line x1={5} y1={12} x2={19} y2={12}></line>
                            </svg>
                            Veure'n més
                          </button>
                        ) : (
                          <button className="button button__primary button__lg">
                            <svg
                              role="status"
                              className="w-5 h-5 mr-2.5 text-primary-400 animate-spin dark:text-gray-600 fill-white"
                              viewBox="0 0 100 101"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                              />
                              <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                              />
                            </svg>
                            Carregant
                          </button>
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <aside className="w-full lg:w-2/5 px-6 lg:sticky top-28 order-2 lg:order-none">
                  <div className="cloud-tags">
                    <ShareBar url={urlToShare} />
                  </div>
                  <div className="ad-wrapper border-t border-primary-200 mt-5 pt-5">
                    <div className="ad-block">
                      <AdSense.Google
                        client="ca-pub-6252269250624547"
                        slot="9182372294"
                        style={{ display: "block" }}
                        format="auto"
                        responsive="true"
                        layoutKey="-gw-1+2a-9x+5c"
                      />
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer
        logo_url={
          "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
        }
      />
    </>
  );
};

export async function getStaticProps() {
  const service = new ContentService();
  const { totalItems, stories, featuredStories, numPages } =
    await service.getStories();
  const mostRecentStories = await service.getMostRecentStories();
  return {
    props: {
      mostRecentStories,
      totalItems,
      stories,
      featuredStories,
      numPages,
    },
  };
}

export default StoriesList;
