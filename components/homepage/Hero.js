import Link from "next/link";
import SearchBar from "../homepage/SearchBar";

const Hero = ({ background_url, title, subtitle }) => {
  return (
    <section
      id="hero"
      className="relative flex items-center justify-center py-20 rounded-md mt-6 mx-6 overflow-hidden shadow-2xl"
    >
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-0 left-0 w-full h-full bg-primary-500 bg-opacity-30 z-30"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <picture>
            <img
              src={background_url}
              alt={title}
              className="w-full h-full object-cover object-center"
              width={400}
              height={300}
              loading="eager"
            ></img>
          </picture>
        </div>
        <Link href="#featuredPlaces">
          <a className="absolute z-40 left-1/2 bottom-12 transform -translate-x-1/2 scrolldown-button">
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
        <figcaption className="text-xs text-white absolute bottom-8 right-12 z-40 text-right">
          Escapada al Pic del Campirme, 2.633m (Pallars Sobirà)
          <br />© Escapadesenparella.cat
        </figcaption>
      </div>
      <div className="container relative z-40">
        <div className="w-full">
          <div className="header-col left text-center">
            <h1 className="text-white">{title}</h1>
            <p className="text-white mt-5 text-xl">{subtitle}</p>
            <SearchBar />
            <div className="credits-bar w-full mt-4">
              <div className="credits-bar-wrapper text-xs">
                <div className="sponsor-block text-left">
                  <span className="text-white block mb-2.5">
                    Amb el suport de:
                  </span>
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
                    <p className="text-white w-52">
                      LassDive | Centre i escola d'esports aquàtics i activitats
                      d'ventura a la Costa Brava i Barcelona
                    </p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
