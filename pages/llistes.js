import { useEffect, useState } from "react";
import ContentService from "../services/contentService";
import NavigationBar from "../components/global/NavigationBar";
import { Container, Row, Spinner, Col, Breadcrumb } from "react-bootstrap";
import Head from "next/head";
import { useRouter } from "next/router";
import FeaturedListBox from "../components/listings/FeaturedListBox";
import RegularListBox from "../components/listings/RegularListBox";
import ShareBar from "../components/social/ShareBar";

const ListsList = ({ user }) => {
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
      const lists = await service.getLists();
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
      <main id="lists" className="lists">
        <NavigationBar
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
          }
          user={user}
        />
        <Container>
          <Row>
            <Col lg={12}>
              <div className="box d-flex">
                <section className="listings-wrapper">
                  <div className="listings-list featured">{featuredList}</div>
                  <div className="listings-list regular">
                    <div className="title-area">
                      <h3 className="uppercase small">Darreres</h3>
                    </div>
                    <div className="listings-list-wrapper">{listsList}</div>
                  </div>
                </section>
                <aside className="sidebar-right">
                  <div className="title-area">
                    <h2>Llistes</h2>
                    <p>
                      Descobreix les millors escapades en parella a Catalunya a
                      través de llistes gestionades 100% per l'equip d'
                      <u>escapadesenparella</u>.
                    </p>
                  </div>
                  <div className="cloud-tags">
                    <ShareBar url={urlToShare} />
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
                        stroke="#00206B"
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
            </Col>
          </Row>
        </Container>
      </main>
    </>
  );
};

export default ListsList;
