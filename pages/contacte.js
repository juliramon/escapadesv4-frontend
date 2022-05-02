import Head from "next/head";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Footer from "../components/global/Footer";
import NavigationBar from "../components/global/NavigationBar";

const Contacte = ({ user }) => {
  return (
    <>
      <Head>
        <title>Contacta amb nosaltres - Escapadesenparella.cat</title>
      </Head>
      <main>
        <NavigationBar
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
          }
          user={user}
        />
        <section className="relative overflow-hidden">
          <div className="box flex flex-wrap">
            <div className="w-full md:w-2/3 py-8 md:py-16 px-12 lg:px-20 h-full">
              <div className="w-full lg:w-9/12 xl:w-7/12 mx-auto">
                <div className="w-full lg:w-10/12">
                  <h1 className="mt-0">Contacte</h1>
                  <p>
                    Vols que col·laborem per donar a conèixer el teu allotjament
                    o activitat? Tens dubtes sobre com podem donar a conèixer la
                    teva marca? No saps on escapar-te? Contacta'ns! 👇{" "}
                  </p>
                  <form name="" id="" className="mt-8">
                    <fieldset className="form-group">
                      <label for="name" className="form-label">
                        Nom i cognom
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Escriu el teu nom i cognom"
                        className="form-control"
                        required
                      />
                    </fieldset>
                    <fieldset className="form-group">
                      <label for="email" className="form-label">
                        Correu electrònic
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Escriu el teu correu electrònic"
                        className="form-control"
                        required
                      />
                    </fieldset>
                    <fieldset className="form-group">
                      <label for="phone" className="form-label">
                        Telèfon
                      </label>
                      <input
                        type="phone"
                        name="phone"
                        placeholder="Escriu el teu nom i cognom"
                        className="form-control"
                        required
                      />
                    </fieldset>
                    <fieldset className="form-group">
                      <label for="name" className="form-label">
                        Pàgina web
                      </label>
                      <input
                        type="url"
                        name="name"
                        placeholder="Escriu la pàgina web del teu negoci"
                        className="form-control"
                        required
                      />
                    </fieldset>
                    <fieldset className="form-group mt-4">
                      <button
                        type="submit"
                        className="button button__primary button__med px-12 lg:px-16"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon icon-tabler icon-tabler-brand-telegram mr-2.5"
                          width="25"
                          height="25"
                          viewBox="0 0 24 24"
                          strokeWidth="1.2"
                          stroke="#ffffff"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4" />
                        </svg>
                        Enviar formulari
                      </button>
                    </fieldset>
                  </form>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3 md:absolute right-0 top-0 max-h-96 md:max-h-full md:h-full bg-red-100 order-last lg:order-none">
              <picture>
                <img
                  src="https://res.cloudinary.com/juligoodie/image/upload/v1651513521/getaways-guru/contacta-amb-nosaltres_sg47zn.jpg"
                  alt="Contacta amb nosaltres"
                  className="w-full h-full object-cover"
                  width={400}
                  height={300}
                  loading="lazy"
                />
              </picture>
            </div>
          </div>
        </section>
      </main>
      <Footer
        logo_url={
          "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
        }
      />
    </>
  );
};

export default Contacte;
