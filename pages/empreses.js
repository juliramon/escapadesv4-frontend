import Head from "next/head";
import Link from "next/link";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Footer from "../components/global/Footer";
import NavigationBar from "../components/global/NavigationBar";

const Serveis = ({ user }) => {
  return (
    <>
      <Head>
        <title>
          Multiplica la teva presencia online... i els teus clients –
          Escpadesenparella.cat
        </title>
      </Head>
      <main id="landingServices" className="services">
        <NavigationBar
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
          }
          user={user}
        />
        <Container className="mw-1200">
          <div className="box">
            <section className="page-header">
              <Row>
                <Col lg={12}>
                  <div className="page-header-wrapper">
                    <div className="col-left">
                      <h1 className="page-header-title">
                        Multiplica la teva presència online... i els teus
                        clients
                      </h1>
                      <p className="page-header-subtitle">
                        Amplia la visibilitat del teu negoci llistant-lo al
                        recomanador especialista en escapades en parella a
                        Catalunya.
                      </p>
                      <Link href={"/serveis/registre"}>
                        <a className="btn">Publicar el meu negoci</a>
                      </Link>
                    </div>
                    <div className="col-right">
                      <div className="header-infographic-wrapper">
                        <img src="https://res.cloudinary.com/juligoodie/image/upload/v1619903999/getaways-guru/static-files/serveis-header-image_gaxysb.svg" />
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </section>
            <section className="services-signup">
              <Row>
                <Col lg={12}>
                  <div className="services-signup-wrapper">
                    <div className="col-left">
                      <h2 className="page-h2-title">Llista el teu negoci...</h2>
                      <p className="page-h2-subtitle">
                        El teu negoci es veurá perfecte en qualsevol dispositiu.
                        <br />
                        Et donaràs a conèixer a nous clients, amb tota la
                        informació que necessiten.
                      </p>
                      <ul>
                        <li>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-circle-check"
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="#FF8D76"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <circle cx="12" cy="12" r="9" />
                            <path d="M9 12l2 2l4 -4" />
                          </svg>
                          Gal·leria d'imatges
                        </li>
                        <li>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-circle-check"
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="#FF8D76"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <circle cx="12" cy="12" r="9" />
                            <path d="M9 12l2 2l4 -4" />
                          </svg>
                          Descripció del negoci
                        </li>
                        <li>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-circle-check"
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="#FF8D76"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <circle cx="12" cy="12" r="9" />
                            <path d="M9 12l2 2l4 -4" />
                          </svg>
                          Serveis i preus
                        </li>
                        <li>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-circle-check"
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="#FF8D76"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <circle cx="12" cy="12" r="9" />
                            <path d="M9 12l2 2l4 -4" />
                          </svg>
                          Telèfon i mail de contacte
                        </li>
                        <li>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-circle-check"
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="#FF8D76"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <circle cx="12" cy="12" r="9" />
                            <path d="M9 12l2 2l4 -4" />
                          </svg>
                          Reserves
                        </li>
                        <li>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-circle-check"
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="#FF8D76"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <circle cx="12" cy="12" r="9" />
                            <path d="M9 12l2 2l4 -4" />
                          </svg>
                          Xarxes social
                        </li>
                      </ul>
                    </div>
                    <div className="col-right"></div>
                  </div>
                </Col>
              </Row>
            </section>
          </div>
        </Container>
      </main>
      <Footer
        logo_url={
          "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
        }
      />
    </>
  );
};

export default Serveis;
