import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import NavigationBar from "../../components/global/NavigationBar";
import ContentService from "../../services/contentService";
import Link from "next/link";
import SignUpModal from "../../components/modals/SignUpModal";
import UserContext from "../../contexts/UserContext";
import ShareModal from "../../components/modals/ShareModal";
import parse from "html-react-parser";
import readingTime from "reading-time";
import { PhotoSwipeGallery } from "react-photoswipe";
import Footer from "../../components/global/Footer";
import FooterHistoria from "../../components/global/FooterHistoria";
import FetchingSpinner from "../../components/global/FetchingSpinner";
import GlobalMetas from "../../components/head/GlobalMetas";
import Breadcrumb from "../../components/richsnippets/Breadcrumb";

const StoryListing = ({ storyDetails }) => {
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

  const urlToShare = `https://escapadesenparella.cat/histories/${router.query.slug}`;

  const initialState = {
    story: {},
    storyLoaded: false,
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
    if (storyDetails !== undefined) {
      setState({
        ...state,
        story: storyDetails,
        storyLoaded: storyDetails !== undefined ? true : false,
        owner: storyDetails.owner,
      });
    }
  }, []);

  if (state.storyLoaded === false) {
    return <FetchingSpinner />;
  }

  let { title, subtitle, description } = state.story;

  let parsedDescription, readingTimeIndicator;
  let slicedDescription = [];

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

  const stateImages = [...state.story.images];
  const stateImagesList = stateImages.map((el, idx) => ({
    src: el,
    thumbnail: el,
    w: 1200,
    h: 800,
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
    <h2 className="mb-8">
      {title}: Benvinguts a l'escapada de la setmana, ens hi acompanyes?
    </h2>
  );

  if (description) {
    parsedDescription = parse(description);
    let parsedDescriptionArray = [parsedDescription];
    readingTimeIndicator = readingTime(parsedDescriptionArray);
    parsedDescriptionArray.map((el) => slicedDescription.push(el));
    if (slicedDescription[0].length > 1) {
      slicedDescription[0].splice(4, 0, photoSwipeGallery);
      slicedDescription[0].splice(1, 0, welcomeText);
    }
  }

  return (
    <>
      {/* Browser metas  */}
      <GlobalMetas
        title={state.story.metaTitle}
        description={state.story.metaDescription}
        url={`https://escapadesenparella.cat/histories/${state.story.slug}`}
        image={state.story.cover}
        canonical={`https://escapadesenparella.cat/histories/${state.story.slug}`}
      />
      {/* Rich snippets */}
      <Breadcrumb
        page1Title="Inici"
        page1Url="https://escapadesenparella.cat"
        page2Title="Històries"
        page2Url="https://escapadesenparella.cat/histories"
        page3Title={state.story.metaTitle}
        page3Url={`https://escapadesenparella.cat/histories/${state.story.slug}`}
      />
      <div className="listing-story">
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
                  <a href="/histories" className="breadcrumb__link">
                    Històries en parella
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
                <p className="text-lg md:text-xl pr-16">{subtitle}</p>
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
                    <span className="mx-2">·</span>
                    <span>{readingTimeIndicator.words} minut de lectura</span>
                  </div>
                  {shareButton}
                </div>
              </div>
              {state.storyLoaded === true ? (
                <div className="w-full md:w-10/12 md:mx-auto mt-10">
                  <div className="aspect-w-16 aspect-h-9 rounded overflow-hidden">
                    <picture>
                      <img
                        src={state.story.cover}
                        alt={title}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                    </picture>
                  </div>
                  <figcaption className="text-sm text-center mt-4">
                    Foto d' <u>Andrea Prat</u> i <u>Juli Ramon</u> per
                    Escapadesenparella.cat
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
                <div className="listing-description">{slicedDescription}</div>
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
      </div>
      <Footer
        logo_url={
          "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
        }
      />
    </>
  );
};

export async function getStaticPaths() {
  const service = new ContentService();

  // Call an external API endpoint to get posts
  const { allStories } = await service.getAllStories("/all-stories");

  // Get the paths we want to pre-render based on posts
  const paths = allStories.map((story) => ({
    params: { slug: story.slug },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const service = new ContentService();
  const storyDetails = await service.getStoryDetails(params.slug);
  return {
    props: {
      storyDetails,
    },
  };
}

export default StoryListing;
