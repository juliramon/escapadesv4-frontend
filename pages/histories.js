import { useEffect, useCallback, useState } from "react";
import ContentService from "../services/contentService";
import PublicContentBox from "../components/listings/PublicContentBox";
import NavigationBar from "../components/global/NavigationBar";
import { Container, Row, Form, Spinner } from "react-bootstrap";
import Head from "next/head";

const StoriesList = ({ user }) => {
  const initialState = {
    loggedUser: user,
    stories: [],
    hasStories: false,
  };
  const [state, setState] = useState(initialState);
  const service = new ContentService();
  const getAllStories = useCallback(() => {
    service.getAllStories("/stories").then((res) => {
      let hasStories;
      if (res.length > 0) {
        hasStories = true;
      }
      setState({ ...state, stories: res, hasStories: hasStories });
    });
  }, [state, service]);
  useEffect(getAllStories, []);
  let storiesList;
  if (state.hasStories === true) {
    storiesList = state.stories.map((el) => (
      <PublicContentBox
        key={el._id}
        type={el.type}
        id={el._id}
        image={el.images[0]}
        title={el.title}
        subtitle={el.subtitle}
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
      <div id="storiesList" className="stories">
        <NavigationBar
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/c_scale,q_100,w_135/v1600008855/getaways-guru/static-files/logo-getaways-guru_vvbikk.svg"
          }
          user={user}
        />
        <Container fluid className="mw-1600">
          <Row>
            <div className="box d-flex">
              <div className="col center">
                <div className="top-nav-wrapper">
                  <h1 className="top-nav-title">Històries en parella</h1>
                  <p className="top-nav-subtitle">
                    Històries en parella per a inspirar, descobrir nous llocs i,
                    en definitiva, fer-vos venir ganes d'una escapada en parella
                    per recordar. De la mà de l'Andrea i en Juli.
                  </p>
                </div>
                <div className="listings-wrapper">
                  <div className="listings-list">{storiesList}</div>
                </div>
              </div>
            </div>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default StoriesList;
