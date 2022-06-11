import { useEffect, useState } from "react";
import ContentService from "../services/contentService";
import NavigationBar from "../components/global/NavigationBar";
import { Container, Row, Spinner, Col, Breadcrumb } from "react-bootstrap";
import Head from "next/head";
import FeaturedStoryBox from "../components/listings/FeaturedStoryBox";
import PopularStoryBox from "../components/listings/PopularStoryBox";
import Link from "next/link";
import RegularStoryBox from "../components/listings/RegularStoryBox";
import { useRouter } from "next/router";
import AdSense from "react-adsense";
import Footer from "../components/global/Footer";

const StoriesList = ({ user, stories }) => {
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
    loggedUser: user,
    stories: [],
    hasStories: false,
  };
  const [state, setState] = useState(initialState);
  const service = new ContentService();

  useEffect(() => {
    const fetchData = async () => {
      //const stories = await service.getAllStories("/stories");
      const sortedStories = stories.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      let isLoaded;
      if (stories.length > 0) {
        isLoaded = true;
      } else {
        isLoaded = false;
      }
      setState({ ...state, stories: sortedStories, hasStories: isLoaded });
    };
    fetchData();
  }, []);

  if (state.hasStories === false) {
    return (
      <>
        <Head>
          <title>Carregant...</title>
        </Head>
        <Container className="spinner d-flex justify-space-between">
          <Spinner animation="border" role="status" variant="primary">
            <span className="sr-only">Carregant...</span>
          </Spinner>
        </Container>
      </>
    );
  }

  let storiesList, featuredStories, popularStories;
  if (state.hasStories === true) {
    featuredStories = state.stories
      .slice(0, 3)
      .map((el) => (
        <FeaturedStoryBox
          key={el._id}
          slug={el.slug}
          cover={el.cover}
          title={el.title}
          avatar={el.owner.avatar}
          owner={el.owner.fullName}
        />
      ));
    storiesList = state.stories
      .slice(9)
      .map((el) => (
        <RegularStoryBox
          key={el._id}
          slug={el.slug}
          cover={el.cover}
          title={el.title}
          subtitle={el.subtitle}
          avatar={el.owner.avatar}
          owner={el.owner.fullName}
        />
      ));
    popularStories = state.stories
      .slice(3, 9)
      .map((el, idx) => (
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
      ));
  }

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
      <div id="storiesList" className="stories">
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
          <section className="py-6 md:py-12">
            <div className="container relative">
              <div className="flex flex-wrap items-center justify-between">
                <div className="w-full md:w-4/12">
                  <div className="md:pr-10">
                    <h1>Històries en parella</h1>
                    <p className="mt-4">
                      Històries en parella per a inspirar, descobrir nous llocs
                      i, en definitiva, fer-vos venir ganes d'una escapada en
                      parella per recordar.
                    </p>
                  </div>
                  <div className="mt-5 flex flex-wrap items-center">
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
                <div className="w-full md:w-8/12">
                  <div className="flex flex-wrap items-center">
                    {featuredStories}
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="bg-primary-100">
            <div className="container">
              <h2>Històries més populars</h2>
              <div className="flex flex-wrap items-center mt-8 -mx-6 -mb-6">
                {popularStories}
              </div>
            </div>
          </section>
          <section className="py-6 md:py-12">
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
              <div className="flex flex-wrap items-start">
                <div className="w-full md:w-8/12 -mt-3 -mb-6">
                  {storiesList}
                </div>
                <aside className="w-full md:w-4/12">
                  <div className="ad-wrapper">
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
  const stories = await service.getAllStories("/stories");
  return {
    props: {
      stories,
    },
  };
}

export default StoriesList;
