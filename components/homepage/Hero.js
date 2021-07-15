import { Container, Row, Col } from "react-bootstrap";
import SearchBar from "../homepage/SearchBar";

const Hero = ({ title, subtitle }) => {
  return (
    <section id="hero">
      <div className="overlay"></div>
      <Container className="mw-1200" fluid>
        <Row>
          <Col lg={12}>
            <div className="wrapper d-flex">
              <div className="header-col left">
                <h1 className="header-title">{title}</h1>
                <p className="header-subtitle">{subtitle}</p>
                <SearchBar />
                <div className="credits-bar">
                  <div className="credits-bar-wrapper">
                    <div className="sponsor-block">
                      <span>Amb el suport de:</span>
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
                          LassDive | Centre i escola d'esports aquàtics i
                          activitats d'ventura a la Costa Brava i Barcelona
                        </p>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="header-col right">
                <div className="left">
                  <div className="images-wrapper">
                    <div className="header-image">
                      <img
                        src="https://res.cloudinary.com/juligoodie/image/upload/v1610652281/getaways-guru/static-files/escapadesenparella-comes-rubio_luuish.jpg"
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="images-wrapper">
                    <div className="header-image">
                      <img
                        src="https://res.cloudinary.com/juligoodie/image/upload/v1610652281/getaways-guru/static-files/escapadesenparella-tossa-mar_m2lvdz.jpg"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
                <div className="right">
                  <div className="images-wrapper">
                    <div className="header-image">
                      <img
                        src="https://res.cloudinary.com/juligoodie/image/upload/v1612464648/getaways-guru/static-files/IMGP8453_icqjwe.jpg"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Hero;
