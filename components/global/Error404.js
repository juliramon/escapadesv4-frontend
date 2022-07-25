import Head from "next/head";
import Link from "next/link";
import { useContext } from "react";
import UserContext from "../../contexts/UserContext";
import Footer from "./Footer";
import NavigationBar from "./NavigationBar";

const Error404 = () => {
  const { user } = useContext(UserContext);
  let button;
  if (!user) {
    button = (
      <Link href="/">
        <a className="button button__primary button__lg w-auto mt-2">
          Tornar al començament
        </a>
      </Link>
    );
  } else {
    button = (
      <Link href="/feed">
        <a className="button button__primary button__lg w-auto mt-2">
          Tornar al feed
        </a>
      </Link>
    );
  }
  return (
    <>
      <Head>
        <title>404 | Escapadesenparella.cat</title>
        <meta name="robots" content="noindex"></meta>
      </Head>
      <div>
        <NavigationBar
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
          }
          user={user}
        />
        <main>
          <section class="py-12 md:py-28">
            <div className="container">
              <div className="w-full flex flex-wrap justify-center">
                <h1 className="text-3xl xl:text-7xl text-center w-full">
                  Error 404
                </h1>
                <p className="text-xl mt-2 text-center w-full">
                  Ep! Aquesta pàgina no existeix...
                </p>
                {button}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Error404;
