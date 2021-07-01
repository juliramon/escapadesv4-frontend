import { Container, Row, Col } from "react-bootstrap";
import SearchBar from "../homepage/SearchBar";

const Hero = ({ title, subtitle }) => {
  return (
    <section id="hero">
      <div className="overlay"></div>
      <Container className="mw-1200" fluid>
        <Row>
          <Col lg={12}>
            <div className="hero-wrapper">
              <div className="hero-left">
                <h1 className="header-title">{title}</h1>
                {/* <p className="header-subtitle">{subtitle}</p> */}
                <SearchBar />
              </div>
              <div className="hero-right"></div>
            </div>
          </Col>
        </Row>
      </Container>
      <div className="credits-bar">
        <div className="credits-bar-wrapper">
          <div className="block-left"></div>
          <div className="block-right">
            <div className="sponsor-block">
              <a
                href="#"
                title="LassDive"
                target="_blank"
                rel="nofollow noopener"
              >
                <img
                  src="https://files.123inventatuweb.com/acens227517/image/lassdive-groc100.gif"
                  alt="LassDive"
                />
                <p>
                  LassDive | Centre i escola d'esports aquàtics i activitats
                  d'ventura a la Costa Brava i Barcelona
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
