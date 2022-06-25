import { useEffect, useState } from "react";
import ContentService from "../services/contentService";
import NavigationBar from "../components/global/NavigationBar";
import { Container, Spinner } from "react-bootstrap";
import Head from "next/head";
import { useRouter } from "next/router";
import FeaturedListBox from "../components/listings/FeaturedListBox";
import RegularListBox from "../components/listings/RegularListBox";
import ShareBar from "../components/social/ShareBar";
import AdSense from "react-adsense";
import Footer from "../components/global/Footer";

const ListsList = ({ user, lists }) => {
  const router = useRouter();

  const urlToShare = `https://escapadesenparella.cat/llistes`;

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
    lists: [],
    hasLists: false,
  };
  const [state, setState] = useState(initialState);
  const service = new ContentService();

  useEffect(() => {
    const fetchData = async () => {
      //const lists = await service.getLists();
      let isLoaded;
      if (lists.length > 0) {
        isLoaded = true;
      } else {
        isLoaded = false;
      }
      setState({ ...state, lists: lists.reverse(), hasLists: isLoaded });
    };
    fetchData();
  }, []);

  if (state.hasLists === false) {
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

  let listsList, featuredList;
  if (state.hasLists === true) {
    featuredList = state.lists
      .reverse()
      .slice(0, 1)
      .map((el) => (
        <FeaturedListBox
          key={el._id}
          slug={el.slug}
          cover={el.cover}
          title={el.title}
          subtitle={el.subtitle}
          avatar={el.owner.avatar}
          owner={el.owner.fullName}
          date={el.createdAt}
        />
      ));
    listsList = state.lists
      .reverse()
      .slice(1)
      .map((el) => (
        <RegularListBox
          key={el._id}
          slug={el.slug}
          cover={el.cover}
          title={el.title}
          subtitle={el.subtitle}
          avatar={el.owner.avatar}
          owner={el.owner.fullName}
          date={el.createdAt}
        />
      ));
  }

  return (
    <>
      <Head>
        <title>Llistes d'escapades - Escapadesenparella.cat</title>
        <link rel="icon" href="/favicon.ico" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta
          name="description"
          content={`Llistes d'escapades per a inspirar, descobrir nous llocs i, en definitiva, fer-vos venir ganes d'una escapada en parella per recordar.`}
        />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`Llistes d'escapades - Escapadesenparella.cat`}
        />
        <meta
          property="og:description"
          content={`Llistes d'escapades per a inspirar, descobrir nous llocs i, en definitiva, fer-vos venir ganes d'una escapada en parella per recordar.`}
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
          content={`Llistes d'escapades - Escapadesenparella.cat`}
        />
        <meta
          name="twitter:description"
          content={`Llistes d'escapades per a inspirar, descobrir nous llocs i, en definitiva, fer-vos venir ganes d'una escapada en parella per recordar.`}
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
      <div className="lists">
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
                  <span className="breadcrumb__link active">Llistes</span>
                </li>
              </ul>
            </div>
          </div>
          <section className="py-6 lg:pt-10 lg:pb-16">
            <div className="container">
              <div className="flex flex-wrap items-start -mx-6">
                <div className="w-full lg:w-3/5 px-6 order-2 lg:order-none">
                  <div className="lists__featured">{featuredList}</div>
                  <div className="flex flex-wrap items-start pt-10">
                    <div className="w-full -mt-3 -mb-6">{listsList}</div>
                  </div>
                </div>
                <aside className="w-full lg:w-2/5 px-6 lg:sticky top-28 order-1 lg:order-none">
                  <div className="title-area">
                    <h1>Llistes</h1>
                    <p className="text-lg mt-4">
                      Descobreix les millors escapades en parella a Catalunya a
                      través de llistes gestionades 100% per l'equip d'
                      <u>escapadesenparella</u>.
                    </p>
                  </div>
                  <div className="cloud-tags">
                    <ShareBar url={urlToShare} />
                  </div>
                  <div className="ad-wrapper border-t border-primary-200 mt-5 pt-5 ">
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
  const lists = await service.getLists();
  return {
    props: {
      lists,
    },
  };
}

export default ListsList;
