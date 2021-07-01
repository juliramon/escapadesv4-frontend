import Head from "next/head";
import ContentService from "../services/contentService";
import { useState, useEffect, useContext } from "react";
import Hero from "../components/homepage/Hero";
import NavigationBar from "../components/global/NavigationBar";
import Footer from "../components/global/Footer";
import HomePageResults from "../components/homepage/HomePageResults";
import { useRouter } from "next/router";
import UserContext from "../contexts/UserContext";
import FollowBox from "../components/global/FollowBox";

const Homepage = (props) => {
  const { user } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/feed");
    }
  }, [user]);

  if (user) {
    return (
      <Head>
        <title>Carregant...</title>
      </Head>
    );
  }

  const title = (
    <>
      La vostra propera escapada
      <br /> en parella comença aquí
    </>
  );

  const subtitle = <>Cerca una activitat o allotjament on escapar-vos.</>;

  return (
    <>
      <Head>
        <title>
          Escapades en parella a Catalunya, descobreix les millors! •
          Escapadesenparella.cat
        </title>
        <link rel="icon" href="/favicon.ico" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta
          name="description"
          content={`Troba les millors escapades en parella a Catalunya. Escapades en parella verificades, amb valoracions i recomanacions. Si busques escapar-te en parella, fes clic aquí, t'esperem a Escapadesenparella.cat!`}
        />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`Escapades en parella a Catalunya, descobreix les millors! • Escapadesenparella.cat`}
        />
        <meta
          property="og:description"
          content={`Troba les millors escapades en parella a Catalunya. Escapades en parella verificades, amb valoracions i recomanacions. Si busques escapar-te en parella, fes clic aquí, t'esperem a Escapadesenparella.cat!`}
        />
        <meta property="url" content={`https://escapadesenparella.cat`} />
        <meta property="og:site_name" content="Escapadesenparella.cat" />
        <meta property="og:locale" content="ca_ES" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`Escapades en parella a Catalunya, descobreix les millors! • Escapadesenparella.cat`}
        />
        <meta
          name="twitter:description"
          content={`Troba les millors escapades en parella a Catalunya. Escapades en parella verificades, amb valoracions i recomanacions. Si busques escapar-te en parella, fes clic aquí, t'esperem a Escapadesenparella.cat!`}
        />
        {/* <meta name="twitter:image" content={state.place.images[0]} />
				<meta property="og:image" content={state.place.images[0]} /> */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:heigth" content="1200" />
        <link rel="canonical" href={`https://escapadesenparella.cat`} />
        <link href={`https://escapadesenparella.cat`} rel="home" />
        <meta property="fb:pages" content="1725186064424579" />
        <meta
          name="B-verify"
          content="756319ea1956c99d055184c4cac47dbfa3c81808"
        />
      </Head>
      <div id="homepage">
        <NavigationBar
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
          }
        />
        <Hero
          background_url={
            "https://res.cloudinary.com/juligoodie/image/upload/v1612464648/getaways-guru/static-files/IMGP8453_icqjwe.jpg"
          }
          title={title}
          subtitle={subtitle}
        />
        <HomePageResults
          activities={props.activities}
          places={props.places}
          stories={props.stories}
          totals={props.totals}
        />
        <FollowBox />
        <Footer
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
          }
        />
      </div>
    </>
  );
};

export async function getStaticProps() {
  const service = new ContentService();
  const activities = await service.activities();
  const places = await service.getAllPlaces();
  const stories = await service.getAllStories();
  const totals = await service.getCategoriesTotals();
  // const activities = [];
  // const places = [];
  // const stories = [];
  return {
    props: {
      activities,
      places,
      stories,
      totals,
    },
  };
}

export default Homepage;
