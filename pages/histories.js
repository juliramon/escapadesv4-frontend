import { useEffect, useCallback, useState } from "react";
import ContentService from "../services/contentService";
import NavigationBar from "../components/global/NavigationBar";
import { Container, Row, Spinner, Col, Breadcrumb } from "react-bootstrap";
import Head from "next/head";
import FeaturedStoryBox from "../components/listings/FeaturedStoryBox";
import PopularStoryBox from "../components/listings/PopularStoryBox";
import Link from "next/link";
import RegularStoryBox from "../components/listings/RegularStoryBox";

const StoriesList = ({ user }) => {
  const initialState = {
    loggedUser: user,
    stories: [],
    hasStories: false,
  };
  const [state, setState] = useState(initialState);
  const service = new ContentService();

  useEffect(() => {
    const fetchData = async () => {
      const stories = await service.getAllStories("/stories");
      let isLoaded;
      if (stories.length > 0) {
        isLoaded = true;
      } else {
        isLoaded = false;
      }
      setState({ ...state, stories: stories, hasStories: isLoaded });
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
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
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
      <main id="storiesList" className="stories">
        <NavigationBar
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
          }
          user={user}
        />
        <Container fluid className="mw-1600">
          <Row>
            <Col lg={12}>
              <div className="box d-flex featured-stories">
                <div className="col left">
                  <div className="top-nav-wrapper">
                    <Breadcrumb>
                      <Breadcrumb.Item href="/" rel="follow">
                        Inici
                      </Breadcrumb.Item>
                      <Breadcrumb.Item active>
                        Històries en parella
                      </Breadcrumb.Item>
                    </Breadcrumb>
                    <h1 className="top-nav-title">Històries en parella</h1>
                    <p className="top-nav-subtitle">
                      Històries en parella per a inspirar, descobrir nous llocs
                      i, en definitiva, fer-vos venir ganes d'una escapada en
                      parella per recordar.
                    </p>
                    <div className="attribution">
                      <div className="media-area">
                        <img
                          src="https://res.cloudinary.com/juligoodie/image/upload/v1618330078/getaways-guru/static-files/avatars-juli-andrea_c6dio6.png"
                          alt="Andrea i Juli, credors d'Escapadesenparella.cat"
                        />
                      </div>
                      <p className="text-area">
                        De la mà de l'<b>Andrea i en Juli</b>,<br /> creadors
                        d'Escapadesenparella.cat
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col right">
                  <div className="featured-listings listings-wrapper">
                    <div className="listings-list d-flex">
                      {featuredStories}
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        <section id="popularStories">
          <Container className="mw-1600" fluid>
            <Row className="popular-stories">
              <Col lg={12}>
                <div className="col">
                  <div className="box">
                    <h2 className="uppercase small">Històries més populars</h2>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <div className="col">
                  <div className="listings-wrapper">
                    <div className="listings-list">{popularStories}</div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
        <section id="regularStories">
          <Container className="mw-1600" fluid>
            <Row>
              <div className="box d-flex">
                <div className="col center">
                  <div className="title-area">
                    <h2 className="uppercase small">
                      Més històries per a inspirar-vos
                    </h2>
                    <p>
                      Des del Delta de l'Ebre fins al Cap de Creus, passant pels
                      cims més alts dels Pirineus.
                      <br /> Aquí t'expliquem les nostres aventures en parella a
                      Catalunya.
                    </p>
                  </div>
                  <div className="listings-wrapper">
                    <div className="listings-list">{storiesList}</div>
                  </div>
                </div>
                <aside className="sidebar-right">
                  <h2 className="uppercase small">
                    Descobreix més escapades interessants
                  </h2>
                  <div className="cloud-tags">
                    <Link href="/">
                      <a
                        href="/activitats"
                        title="Activitats"
                        className="cloud-tag"
                      >
                        Activitats
                      </a>
                    </Link>
                    <Link href="/allotjaments">
                      <a
                        href="/allotjaments"
                        title="Allotjaments"
                        className="cloud-tag"
                      >
                        Allotjaments
                      </a>
                    </Link>
                    <Link href="/search?query=">
                      <a
                        href="/search?query="
                        title="Cercador d'escapades"
                        className="cloud-tag"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon icon-tabler icon-tabler-search"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="#2c3e50"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <circle cx="10" cy="10" r="7" />
                          <line x1="21" y1="21" x2="15" y2="15" />
                        </svg>
                        Cercador d'escapades
                      </a>
                    </Link>
                  </div>
                  <div className="ad-wrapper">
                    <div className="ad-block"></div>
                  </div>
                  <div className="legal-links">
                    <ul>
                      <li>Qui som?</li>
                      <li>Què fem?</li>
                      <li>Blog</li>
                      <li>Política de Privacitat</li>
                      <li>Condicions d'Ús</li>
                      <li>Política de Cookies</li>
                    </ul>
                    <ul>
                      <li>
                        <b>Segueix-nos a:</b>
                      </li>
                      <li>Instagram</li>
                      <li>Facebook</li>
                      <li>Twitter</li>
                    </ul>
                    <span className="copyright">
                      Copyright © 2021. Tots els drets reservats.
                      <br />
                      Desenvolupat i gestionat amb{" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-heart"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="#2c3e50"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z"></path>
                        <path
                          fill="red"
                          stroke="none"
                          d="M12 20l-7 -7a4 4 0 0 1 6.5 -6a.9 .9 0 0 0 1 0a4 4 0 0 1 6.5 6l-7 7"
                        ></path>
                      </svg>{" "}
                      per en <u>Juli Ramon</u> i l'<u>Andrea Prat</u> a
                      Barcelona
                    </span>
                  </div>
                </aside>
              </div>
            </Row>
          </Container>
        </section>
      </main>
    </>
  );
};

export default StoriesList;
