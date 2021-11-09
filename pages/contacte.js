import React, { useContext, useEffect } from "react";
import "tailwindcss/tailwind.css";
import UserContext from "../contexts/UserContext";
import Head from "next/head";
import { useRouter } from "next/router";
import NavigationBar from "../components/global/NavigationBar";

const Contacte = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <Head>
        <title>Gestor - Escapadesenparella.cat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div id="contact">
        <NavigationBar
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
          }
          user={user}
        />
      </div>
      <section className="py-8 md:py-12">
        <div className="container">
          <div className="flex flex-wrap">
            <h1 className="flex flex-col">Contacte</h1>
            <div className="p-3">
              <p>
                Escapadesenparella.cat és el portal especialista en escapades en
                parella a Catalunya. Si vols donar a conèixer la teva empresa,
                vols conèixer els serveis que oferim, o tens dubtes en relació a
                la plataforma, envia el formulari a continuació:
              </p>
              <form>
                <div className="flex flex-wrap">
                  <label>Nom i cognom</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Escriure el teu nom i cognom"
                  />
                </div>
                <div className="flex flex-wrap">
                  <label>Correu electrònic</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Escriu el teu correu electrònic"
                  />
                </div>
                <div className="flex flex-wrap">
                  <label>Número de telèfon</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Escriu el teu número de telèfon"
                  />
                </div>
                <div className="flex flex-wrap">
                  <label>Pàgina web</label>
                  <input
                    type="url"
                    name="web"
                    placeholder="Escriu la web del teu negoci (si en tens)"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contacte;
