import Link from "next/link";
import SearchBar from "../homepage/SearchBar";

const Hero = ({ background_url, background_url_mob, title, subtitle }) => {
  return (
    <section
      id="hero"
      className="relative flex items-center justify-center pt-8 pb-8 lg:py-36"
    >
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-0 left-0 w-full h-full bg-primary-500 bg-opacity-30 z-30"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <picture>
            <source srcSet={background_url_mob} media="(max-width: 768px)" />
            <source srcSet={background_url} media="(min-width: 768px)" />
            <img
              src={background_url}
              dataSrc={background_url}
              alt={title}
              className="w-full h-full object-cover object-center"
              width={375}
              height={425}
              loading="eager"
            ></img>
          </picture>
        </div>
        <Link href="#homePageResults">
          <a className="hidden md:block absolute z-40 left-1/2 bottom-12 transform -translate-x-1/2 scrolldown-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-arrow-down-circle"
              width="35"
              height="35"
              viewBox="0 0 24 24"
              strokeWidth="1"
              stroke="#ffffff"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <circle cx="12" cy="12" r="9" />
              <line x1="8" y1="12" x2="12" y2="16" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="16" y1="12" x2="12" y2="16" />
            </svg>
          </a>
        </Link>
        <figcaption className="hidden lg:block text-xs text-white absolute bottom-8 right-6 md:right-12 z-40 text-right">
          Escapada al Pic del Campirme, 2.633m (Pallars Sobirà)
          <br />© Escapadesenparella.cat
        </figcaption>
      </div>
      <div className="container relative z-40">
        <div className="w-full lg:w-10/12 xl:w-8/12 lg:mx-auto">
          <div className="header-col left">
            <h1 className="text-white text-2xl leading-tight md:leading-1.1 md:text-5xl">
              {title}
            </h1>
            <SearchBar />
            {/* <div className="w-full mt-4 text-xs text-left">
              <span className="text-white block mb-2.5">Amb el suport de:</span>
              <a
                href="#"
                title="LassDive"
                className="inline-flex items-center"
                target="_blank"
                rel="nofollow noopener"
              >
                <picture>
                  <source srcSet="https://files.123inventatuweb.com/acens227517/image/lassdive-groc100.gif" />
                  <img
                    src="https://files.123inventatuweb.com/acens227517/image/lassdive-groc100.gif"
                    data-src="https://files.123inventatuweb.com/acens227517/image/lassdive-groc100.gif"
                    alt="LassDive"
                    className="object-contain object-center h-auto mr-4 w-36"
                    width="400"
                    height="300"
                    loading="lazy"
                  />
                </picture>
                <p className="text-white w-52 pl-5 md:pl-0 mb-0 leading-tight">
                  LassDive | Centre i escola d'esports aquàtics i activitats
                  d'ventura a la Costa Brava i Barcelona
                </p>
              </a>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
