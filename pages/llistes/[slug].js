import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import Footer from "../../components/global/Footer";
import NavigationBar from "../../components/global/NavigationBar";
import ShareModal from "../../components/modals/ShareModal";
import SignUpModal from "../../components/modals/SignUpModal";
import UserContext from "../../contexts/UserContext";
import ContentService from "../../services/contentService";
import ReactHtmlParser from "react-html-parser";

const ListView = () => {
  const { user } = useContext(UserContext);
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

  const urlToShare = `https://escapadesenparella.cat/llistes/${router.query.slug}`;

  const initialState = {
    list: {},
    listLoaded: false,
    owner: {},
  };

  const [state, setState] = useState(initialState);
  const [queryId, setQueryId] = useState(null);
  useEffect(() => {
    if (router && router.query) {
      setQueryId(router.query.slug);
    }
  }, [router]);

  const service = new ContentService();

  const [modalVisibility, setModalVisibility] = useState(false);
  const handleModalVisibility = () => setModalVisibility(true);
  const hideModalVisibility = () => setModalVisibility(false);

  const [shareModalVisibility, setShareModalVisibility] = useState(false);
  const handleShareModalVisibility = () => setShareModalVisibility(true);
  const hideShareModalVisibility = () => setShareModalVisibility(false);

  useEffect(() => {
    if (router.query.slug !== undefined) {
      const fetchData = async () => {
        const listDetails = await service.getListDetails(router.query.slug);
        let isLoaded;
        if (listDetails.type) {
          isLoaded = true;
        } else {
          isLoaded = false;
        }
        setState({
          ...state,
          list: listDetails,
          listLoaded: isLoaded,
          owner: listDetails.owner,
        });
      };
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryId]);

  if (state.listLoaded === false) {
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

  let { title, subtitle, description } = state.list;

  const shareButton = (
    <div
      className="listing-bookmark-wrapper"
      onClick={() => handleShareModalVisibility()}
    >
      <button className="listing-bookmark">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-share"
          width="44"
          height="44"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="#0d1f44"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="6" r="3" />
          <circle cx="18" cy="18" r="3" />
          <line x1="8.7" y1="10.7" x2="15.3" y2="7.3" />
          <line x1="8.7" y1="13.3" x2="15.3" y2="16.7" />
        </svg>
      </button>
      <span>Compartir</span>
    </div>
  );

  let cover;
  if (state.listLoaded === true) {
    cover = (
      <div
        className="cover"
        style={{ backgroundImage: `url(${state.list.cover})` }}
      ></div>
    );
  }

  return (
    <>
      <Head>
        <title>{state.list.metaTitle} - Escapadesenparella.cat</title>
        <link rel="icon" href="/favicon.ico" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="description" content={`${state.list.metaDescription}`} />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`${state.list.metaTitle} - Escapadesenparella.cat`}
        />
        <meta
          property="og:description"
          content={`${state.list.metaDescription}`}
        />
        <meta
          property="url"
          content={`https://escapadesenparella.cat${router.asPath}`}
        />
        <meta property="og:site_name" content="Escapadesenparella.cat" />
        <meta property="og:locale" content="ca_ES" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${state.list.metaTitle} - Escapadesenparella.cat`}
        />
        <meta
          name="twitter:description"
          content={`${state.list.metaDescription}`}
        />
        <meta name="twitter:image" content={state.list.cover} />
        <meta property="og:image" content={state.list.cover} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:heigth" content="1200" />
        <link
          rel="canonical"
          href={`https://escapadesenparella.cat${router.asPath}`}
        />
        <link href={`https://escapadesenparella.cat`} rel="home" />
        <meta property="fb:pages" content="1725186064424579" />
        <meta
          name="B-verify"
          content="756319ea1956c99d055184c4cac47dbfa3c81808"
        />
      </Head>
      <div id="listingPage" className="list">
        <NavigationBar
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
          }
          user={user}
        />
        <main className="list-wrapper">
          <Container>
            <Row>
              <Col lg={9}>
                <section>
                  <div className="listing-header-wrapper">
                    <div className="listing-header">
                      <h1 className="listing-title">{title}</h1>
                      <p className="listing-subtitle">{subtitle}</p>
                    </div>
                    <div className="listing-header-meta">
                      <div className="col left">
                        <div className="listing-owner">
                          <Link href={`/usuaris/${state.owner._id}`}>
                            <a>
                              <div className="avatar">
                                <img
                                  src={state.owner.avatar}
                                  alt={state.owner.fullName}
                                />
                              </div>
                              <p className="listing-owner-name">
                                {state.owner.fullName}
                                <span>@escapadesenparella</span>
                              </p>
                            </a>
                          </Link>
                        </div>
                      </div>
                      <div className="col right">{shareButton}</div>
                    </div>
                  </div>
                  <div className="listing-cover">
                    {cover}
                    <p className="cover-text">
                      Foto d' <u>Andrea Prat</u> i <u>Juli Ramon</u> per
                      Escapadesenparella.cat
                    </p>
                  </div>
                </section>
                <section>
                  <div className="separator-body">
                    <div className="separator-body-wrapper">
                      <span>•</span>
                      <span>•</span>
                      <span>•</span>
                    </div>
                  </div>
                  <article className="listing-body">
                    <div className="listing-body-wrapper d-flex justify-content-between align-items-center"></div>
                    <div className="listing-description">
                      {ReactHtmlParser(description)}
                    </div>
                  </article>
                </section>
                <section>
                  <div className="cta-instagram-footer">
                    <h2>
                      Descobreix més escapades com aquesta.
                      <br /> Segueix-nos a Instagram!
                    </h2>
                    <div className="link-instagram">
                      <a
                        href="https://instagram.com/escapadesenparella"
                        title="Segueix Escapadesenparella.cat a Instagram"
                        rel="nofollow"
                        target="_blank"
                      >
                        @escapadesenparella.cat{" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon icon-tabler icon-tabler-arrow-narrow-right"
                          width="30"
                          height="30"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="#F03E51"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <line x1="15" y1="16" x2="19" y2="12" />
                          <line x1="15" y1="8" x2="19" y2="12" />
                        </svg>
                      </a>
                    </div>
                    <div className="banner-wrapper">
                      <div className="left">
                        <img
                          src="https://res.cloudinary.com/juligoodie/image/upload/v1610652281/getaways-guru/static-files/escapadesenparella-comes-rubio_luuish.jpg"
                          alt=""
                        />
                      </div>
                      <div className="right">
                        <img
                          src="https://res.cloudinary.com/juligoodie/image/upload/v1610652281/getaways-guru/static-files/escapadesenparella-tossa-mar_m2lvdz.jpg"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </section>
              </Col>
            </Row>
          </Container>
        </main>
        <SignUpModal
          visibility={modalVisibility}
          hideModal={hideModalVisibility}
        />
        <ShareModal
          visibility={shareModalVisibility}
          hideModal={hideShareModalVisibility}
          url={urlToShare}
        />
        <Footer
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
          }
        />
      </div>
    </>
  );
};

export default ListView;
