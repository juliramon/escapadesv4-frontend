import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import Footer from "../../components/global/Footer";
import NavigationBar from "../../components/global/NavigationBar";
import ShareModal from "../../components/modals/ShareModal";
import SignUpModal from "../../components/modals/SignUpModal";
import UserContext from "../../contexts/UserContext";
import ContentService from "../../services/contentService";
import ReactHtmlParser from "react-html-parser";
import FooterHistoria from "../../components/global/FooterHistoria";

const ListView = ({ listDetails }) => {
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
    if (listDetails !== undefined) {
      setState({
        ...state,
        list: listDetails,
        listLoaded: listDetails.type ? true : false,
        owner: listDetails.owner,
      });
    }
  }, []);

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
      className="flex items-center justify-center button button__ghost button__med cursor-pointer mt-5 md:mt-0 w-full md:w-auto"
      onClick={() => handleShareModalVisibility()}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-share mr-3"
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
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="6" r="3" />
        <circle cx="18" cy="18" r="3" />
        <line x1="8.7" y1="10.7" x2="15.3" y2="7.3" />
        <line x1="8.7" y1="13.3" x2="15.3" y2="16.7" />
      </svg>
      <span className="text-sm">Compartir</span>
    </div>
  );

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
      <div className="listing-list">
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
                  <a href="/llistes" className="breadcrumb__link">
                    Llistes
                  </a>
                </li>
                <li className="breadcrumb__item">
                  <span className="breadcrumb__link active">{title}</span>
                </li>
              </ul>
            </div>
          </div>
          <article className="pt-6 md:pt-12 pb-4">
            <div className="container">
              <div className="max-w-2xl mx-auto">
                <h1 className="mb-4">{title}</h1>
                <p className="text-lg md:text-xl md:pr-16">{subtitle}</p>
                <div className="mt-6 flex flex-wrap items-center justify-between">
                  <div className="flex flex-wrap items-center">
                    <Link href={`/usuaris/${state.owner._id}`}>
                      <a className="flex items-center">
                        <div className="rounded-full overflow-hidden w-12 h-12 mr-3">
                          <picture>
                            <img
                              src={state.owner.avatar}
                              alt={state.owner.fullName}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                              loadgin="eager"
                            />
                          </picture>
                        </div>
                        <span className="listing-owner-name">
                          {state.owner.fullName}
                        </span>
                      </a>
                    </Link>
                  </div>
                  {shareButton}
                </div>
              </div>
              {state.listLoaded === true ? (
                <div className="w-full md:w-10/12 md:mx-auto mt-10">
                  <div className="aspect-w-16 aspect-h-9 rounded overflow-hidden">
                    <picture>
                      <img
                        src={state.list.cover}
                        alt={state.list.title}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                    </picture>
                  </div>
                  <figcaption className="text-sm text-center mt-4">
                    {state.list.title}
                  </figcaption>
                </div>
              ) : null}
              <div className="text-center mx-10 py-10">
                <div className="flex items-center justify-center -mx-3">
                  <span className="text-xs px-3">•</span>
                  <span className="text-xs px-3">•</span>
                  <span className="text-xs px-3">•</span>
                </div>
              </div>
              <div className="max-w-2xl mx-auto">
                <div className="list__description">
                  {ReactHtmlParser(description)}
                </div>
              </div>
            </div>
          </article>
        </main>
        <section>
          <div className="container">
            <FooterHistoria />
          </div>
        </section>

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

export async function getStaticPaths() {
  const service = new ContentService();

  // Call an external API endpoint to get posts
  const { allLists } = await service.getLists();

  // Get the paths we want to pre-render based on posts
  const paths = allLists.map((list) => ({
    params: { slug: list.slug },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const service = new ContentService();
  const listDetails = await service.getListDetails(params.slug);
  return {
    props: {
      listDetails,
    },
  };
}

export default ListView;
