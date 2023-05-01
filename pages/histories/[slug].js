import { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import NavigationBar from "../../components/global/NavigationBar";
import ContentService from "../../services/contentService";
import UserContext from "../../contexts/UserContext";
import parse from "html-react-parser";
import Footer from "../../components/global/Footer";
import FooterHistoria from "../../components/global/FooterHistoria";
import GlobalMetas from "../../components/head/GlobalMetas";
import Breadcrumb from "../../components/richsnippets/Breadcrumb";
import Article from "../../components/richsnippets/Article";
import AdInArticle from "../../components/ads/AdInArticle";

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

  let parsedDescription;
  let slicedDescription = [];

  const welcomeText = (
    <div className="mb-8">
      <h2 className="mb-5">
        {storyDetails.title}: Benvinguts a l'escapada de la setmana, ens hi
        acompanyeu?
      </h2>
      <div className="bg-primary-100">
        <AdInArticle />
      </div>
    </div>
  );

  const buildImagesGrid = (start, end) => {
    const images = storyDetails.images.slice(start, end);

    return (
      <div className="columns-1 md:columns-2 gap-2.5 md:gap-4">
        {images.map((image, idx) => {
          return (
            <picture key={idx} className="block mb-2.5 md:mb-4">
              <img
                src={image}
                alt={`${storyDetails.title} - ${idx + 1}`}
                width={400}
                height={300}
                loading="lazy"
              />
            </picture>
          );
        })}
      </div>
    );
  };

  if (storyDetails.description) {
    parsedDescription = parse(storyDetails.description);
    parsedDescription.map((el) => slicedDescription.push(el));
    if (slicedDescription.length > 1) {
      slicedDescription.splice(1, 0, welcomeText);
      slicedDescription.forEach((el, idx) => {
        if (
          typeof el.props.children == "string" &&
          el.props.children.includes("post_images")
        ) {
          const str = el.props.children;

          const found = str.replace(/^\D+/g, "");
          const foundArr = found.slice(0, -2).split(",");
          const startingIndex = foundArr[0];
          const endIndex = foundArr[1];

          slicedDescription[idx] = buildImagesGrid(startingIndex, endIndex);
        }
      });
    }
  }

  const publicationDate = new Date(storyDetails.createdAt).toLocaleDateString(
    "ca-es",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  const updatedDate = new Date(storyDetails.updatedAt).toLocaleDateString(
    "ca-es",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  const coverPath = storyDetails.cover.substring(0, 51);
  const imageId = storyDetails.cover.substring(63);
  const coverImg = `${coverPath}w_400,h_300,c_fill/${imageId}`;

  const coverAuthorPath = storyDetails.owner.avatar.substring(0, 51);
  const imageAuthorId = storyDetails.owner.avatar.substring(63);
  const coverAuthorImg = `${coverAuthorPath}w_32,h_32,c_fill/${imageAuthorId}`;

  return (
    <>
      {/* Browser metas  */}
      <GlobalMetas
        title={storyDetails.metaTitle}
        description={storyDetails.metaDescription}
        url={`https://escapadesenparella.cat/histories/${storyDetails.slug}`}
        image={storyDetails.cover}
        canonical={`https://escapadesenparella.cat/histories/${storyDetails.slug}`}
      />
      {/* Rich snippets */}
      <Breadcrumb
        page1Title="Inici"
        page1Url="https://escapadesenparella.cat"
        page2Title="Històries"
        page2Url="https://escapadesenparella.cat/histories"
        page3Title={storyDetails.metaTitle}
        page3Url={`https://escapadesenparella.cat/histories/${storyDetails.slug}`}
      />
      <Article
        headline={storyDetails.title}
        summary={storyDetails.subtitle}
        image={storyDetails.cover}
        author={storyDetails.owner.fullName}
        publicationDate={storyDetails.createdAt}
        modificationDate={storyDetails.updatedAt}
      />
      <div className="listing-story">
        <NavigationBar
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
          }
          user={user}
        />
        <div className="pt-3 px-4">
          <div className="w-full">
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
                <span className="breadcrumb__link active">
                  {storyDetails.title}
                </span>
              </li>
            </ul>
          </div>
        </div>
        <main>
          <article className="pt-12 pb-4">
            <div className="container">
              <div className="max-w-full md:max-w-2xl mx-auto">
                <h1 className="md:text-center">{storyDetails.title}</h1>
                <p className="text-lg md:text-xl md:text-center md:px-16 mt-2.5">
                  {storyDetails.subtitle}
                </p>
                <div className="mt-3 flex flex-wrap items-center md:justify-center">
                  <div className="flex flex-wrap items-center">
                    <div className="rounded-full overflow-hidden w-8 h-8 mr-2.5">
                      <picture>
                        <img
                          src={coverAuthorImg}
                          alt={storyDetails.owner.fullName}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                          loadgin="eager"
                          fetchpriority="high"
                        />
                      </picture>
                    </div>
                    <span className="text-sm text-primary-400 text-opacity-80">
                      {storyDetails.owner.fullName}
                    </span>
                    <span className="mx-2 text-sm text-primary-400 text-opacity-80">
                      ·
                    </span>
                    <span className="text-sm text-primary-400 text-opacity-80">
                      Publicat el{" "}
                      <time dateTime={storyDetails.createdAt}>
                        <u>{publicationDate}</u>
                      </time>
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-full md:max-w-4xl md:mx-auto mt-6">
                <div className="aspect-w-16 aspect-h-9 rounded-md overflow-hidden">
                  <picture>
                    <source srcSet={coverImg} media="(max-width: 768px)" />
                    <source
                      srcSet={storyDetails.cover}
                      media="(min-width: 768px)"
                    />
                    <img
                      src={coverImg}
                      alt={storyDetails.title}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover"
                      fetchpriority="high"
                      loading="eager"
                    />
                  </picture>
                </div>
                <figcaption className="text-xs mt-2 text-primary-400 text-opacity-80">
                  Foto d' <u>Andrea Prat</u> i <u>Juli Ramon</u> per
                  Escapadesenparella.cat
                </figcaption>
              </div>

              <div className="w-full max-w-full md:max-w-2xl mx-auto pt-8">
                <div className="text-center text-tertiary-500 text-opacity-80 text-sm py-4 mb-5 md:mb-6 bg-tertiary-100 bg-opacity-50 flex items-center justify-center rounded-md">
                  <span className="inline-block">
                    Darrera actualització:{" "}
                    <time dateTime={updatedDate}>
                      <u>{updatedDate}</u>
                    </time>
                  </span>
                </div>
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
      </div>
      <Footer
        logo_url={
          "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
        }
      />
    </>
  );
};

export async function getServerSideProps({ params }) {
  const service = new ContentService();
  const storyDetails = await service.getStoryDetails(params.slug);

  if (!storyDetails) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      storyDetails,
    },
  };
}

export default StoryListing;
