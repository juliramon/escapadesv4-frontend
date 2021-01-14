import Head from "next/head";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import NavigationBar from "../../components/global/NavigationBar";
import ContentService from "../../services/contentService";
import { Container, Row, Spinner, Toast, Col } from "react-bootstrap";
import Link from "next/link";
import SignUpModal from "../../components/modals/SignUpModal";
import UserContext from "../../contexts/UserContext";
import ShareModal from "../../components/modals/ShareModal";
import parse from "html-react-parser";
import readingTime from "reading-time";
import { PhotoSwipeGallery } from "react-photoswipe";
import Footer from "../../components/global/Footer";

const StoryListing = () => {
  const { user } = useContext(UserContext);
  const router = useRouter();

  console.log(router);

  const urlToShare = `https://escapadesenparella.cat/histories/${router.query.id}`;

  const initialState = {
    story: {},
    storyLoaded: false,
    owner: {},
  };
  const [state, setState] = useState(initialState);
  const [queryId, setQueryId] = useState(null);
  useEffect(() => {
    if (router && router.query) {
      setQueryId(router.query.id);
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
    const fetchData = async () => {
      const storyDetails = await service.getStoryDetails(queryId);
      let isLoaded;
      if (storyDetails.type) {
        isLoaded = true;
      } else {
        isLoaded = false;
      }
      setState({
        ...state,
        story: storyDetails,
        storyLoaded: isLoaded,
        owner: storyDetails.owner,
      });
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryId]);

  if (state.storyLoaded === false) {
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

  let { title, subtitle, description } = state.story;

  let parsedDescription, readingTimeIndicator;
  let slicedDescription = [];

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

  let coversList;
  if (state.storyLoaded === true) {
    coversList = state.story.images.map((cover, idx) => (
      <div
        key={idx}
        className="cover"
        style={{ backgroundImage: `url(${cover})` }}
      ></div>
    ));
  }

  const stateImages = [...state.story.images];
  const stateImagesList = stateImages.map((el, idx) => ({
    src: el,
    thumbnail: el,
    w: 1200,
    h: 900,
    title: state.story.title,
  }));

  const getThumbnailContent = (item) => {
    return <img src={item.thumbnail} width={120} height={90} />;
  };

  const photoSwipeGallery = (
    <PhotoSwipeGallery
      items={stateImagesList}
      thumbnailContent={getThumbnailContent}
      options={{ history: false }}
    />
  );

  const welcomeText = (
    <h2>{title}: Benvinguts a l'escapada de la setmana, ens hi acompanyes?</h2>
  );

  if (description) {
    parsedDescription = parse(description);
    let parsedDescriptionArray = [parsedDescription];
    readingTimeIndicator = readingTime(parsedDescriptionArray);
    parsedDescriptionArray.map((el) => slicedDescription.push(el));
    console.log(slicedDescription);
    slicedDescription[0].splice(4, 0, photoSwipeGallery);
    slicedDescription[0].splice(1, 0, welcomeText);
  }

  return (
    <>
      <Head>
        <title>{state.story.title} - Escapadesenparella.cat</title>
        <link rel="icon" href="/favicon.ico" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="description" content={`${state.story.subtitle}`} />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`${state.story.title} - Escapadesenparella.cat`}
        />
        <meta property="og:description" content={`${state.story.subtitle}`} />
        <meta
          property="url"
          content={`https://escapadesenparella.cat${router.asPath}`}
        />
        <meta property="og:site_name" content="Escapadesenparella.cat" />
        <meta property="og:locale" content="ca_ES" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${state.story.title} - Escapadesenparella.cat`}
        />
        <meta name="twitter:description" content={`${state.story.subtitle}`} />
        <meta name="twitter:image" content={state.story.images[0]} />
        <meta property="og:image" content={state.story.images[0]} />
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
      <div id="listingPage" className="story">
        <NavigationBar
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/c_scale,q_100,w_135/v1600008855/getaways-guru/static-files/logo-getaways-guru_vvbikk.svg"
          }
          user={user}
        />
        <main>
          <article>
            <Container className="mw-1200">
              <div className="box">
                <section>
                  <Row>
                    <div className="listing-header-wrapper">
                      <Col lg={12}>
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
                                  </p>
                                </a>
                              </Link>
                            </div>
                            <span className="separator">·</span>
                            <div className="reading-time">
                              <p>
                                {readingTimeIndicator.words} minut de lectura
                              </p>
                            </div>
                          </div>
                          <div className="col right">{shareButton}</div>
                        </div>
                      </Col>
                    </div>
                  </Row>
                  <Row>
                    <Col lg={12}>
                      <div className="listing-cover">
                        {coversList}
                        <p className="cover-text">
                          Foto d' <u>Andrea Prat</u> i <u>Juli Ramon</u> per
                          Escapadesenparella.cat
                        </p>
                      </div>
                    </Col>
                  </Row>
                </section>
                <section>
                  <Row>
                    <Col lg="12">
                      <div className="separator-body">
                        <div className="separator-body-wrapper">
                          <span>•</span>
                          <span>•</span>
                          <span>•</span>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <article className="listing-body">
                      <Col lg={12}>
                        <div className="listing-body-wrapper d-flex justify-content-between align-items-center"></div>
                        <div className="listing-description">
                          {slicedDescription}
                        </div>
                      </Col>
                    </article>
                  </Row>
                </section>
                <section>
                  <Row>
                    <Col lg={12}>
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
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
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
                    </Col>
                  </Row>
                </section>
              </div>
            </Container>
          </article>
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
      </div>
      <Footer
        logo_url={
          "https://res.cloudinary.com/juligoodie/image/upload/c_scale,q_100,w_135/v1600008855/getaways-guru/static-files/logo-getaways-guru_vvbikk.svg"
        }
      />
    </>
  );
};

export default StoryListing;
