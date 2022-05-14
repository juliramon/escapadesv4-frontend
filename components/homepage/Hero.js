import { Container, Row, Col } from "react-bootstrap";
import SearchBar from "../homepage/SearchBar";

const Hero = ({ background_url, title, subtitle }) => {
  return (
    <section id="hero" className="relative flex items-center justify-center">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 z-30"></div>
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
      </div>
      <div className="container relative z-40">
        <div className="w-full">
          <div className="header-col left text-center">
            <h1 className="header-title text-white">{title}</h1>
            <p className="header-subtitle text-white">{subtitle}</p>
            <SearchBar />
            <div className="credits-bar w-full mt-4">
              <div className="credits-bar-wrapper text-xs">
                <div className="sponsor-block text-left">
                  <span className="text-white inline-block mb-2.5">
                    Amb el suport de:
                  </span>
                  <a
                    href="#"
                    title="LassDive"
                    className="flex items-center w-full"
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
