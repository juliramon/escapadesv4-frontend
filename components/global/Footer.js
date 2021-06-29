import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";

const Footer = ({ logo_url }) => {
  let copyrightDate = new Date();
  copyrightDate = copyrightDate.getFullYear();
  return (
    <section id="footer">
      <Container className="mw-1200">
        <Row>
          <Col lg={4}>
            <div className="footer-intro">
              <img
                src={logo_url}
                alt="Getawaysy.guru logo"
                className="footer-logo"
              />
              <span>
                Escapadesenparella.cat és el recomanador especialista en
                escapades en parella a Catalunya. Registra't per gaudir de tots
                els beneficis de la comunitat.
              </span>
              <span className="footer-copyright-timestamp">
                Copyright © {copyrightDate}. Tots els drets reservats. <br />
                Codi i UI/UX:{" "}
                <a
                  href="https://github.com/juliramon"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <u>Juli Ramon</u>
                </a>
                <br />
                Il·lutracions i diseny gràfic:{" "}
                <a
                  href="https://andreaprat.cat"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <u>Andrea Prat</u>
                </a>
                <br />
                Desenvolupat i gestionat amb{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-heart"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#00206B"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z"></path>
                  <path
                    fill="red"
                    stroke="none"
                    d="M12 20l-7 -7a4 4 0 0 1 6.5 -6a.9 .9 0 0 0 1 0a4 4 0 0 1 6.5 6l-7 7"
                  ></path>
                </svg>{" "}
                a Catalunya
              </span>
            </div>
          </Col>
          <Col lg={2}>
            <div className="footer-content">
              <h4 className="footer-header">Continguts</h4>
              <ul>
                <li>
                  <Link href="#">Escapades romàntiques</Link>
                </li>
                <li>
                  <Link href="#">Escapades culturals</Link>
                </li>
                <li>
                  <Link href="#">Escapades gastronòmiques</Link>
                </li>
                <li>
                  <Link href="#">Escapades d'aventura</Link>
                </li>
                <li>
                  <Link href="#">Escapades de relax</Link>
                </li>
                <li>
                  <Link href="#">Escapades a la neu</Link>
                </li>
                <li>
                  <Link href="#">Escapades d'estiu</Link>
                </li>
                <li>
                  <Link href="#">Escapades de cap de setmana</Link>
                </li>
              </ul>
            </div>
          </Col>
          <Col lg={2}>
            <div className="footer-about">
              <h4 className="footer-header">Nosaltres</h4>
              <ul>
                <li>
                  <Link href="/histories">Històries en parella</Link>
                </li>
                <li>
                  <Link href="/empreses">Serveis empreses</Link>
                </li>
                <li className="disabled">
                  <Link href="#">Qui som?</Link>
                </li>
                <li className="disabled">
                  <Link href="#">Què fem?</Link>
                </li>
              </ul>
            </div>
          </Col>
          <Col lg={2}>
            <div className="footer-support">
              <h4 className="footer-header">Ajuda</h4>
              <ul>
                <li>
                  <Link href="/politica-privadesa">Política de privadesa</Link>
                </li>
                <li>
                  <Link href="/condicions-us">Condicions d'ús</Link>
                </li>
                <li>
                  <Link href="/politica-privadesa#politicacookies">
                    Política de cookies
                  </Link>
                </li>
              </ul>
            </div>
          </Col>
          <Col lg={2}>
            <div className="footer-connect">
              <h4 className="footer-header">Contacta'ns</h4>
              <ul>
                <li>
                  <a
                    href="mailto:social@escapadesenparella.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-mailbox"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#00206B"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M10 21v-6.5a3.5 3.5 0 0 0 -7 0v6.5h18v-6a4 4 0 0 0 -4 -4h-10.5" />
                      <path d="M12 11v-8h4l2 2l-2 2h-4" />
                      <path d="M6 15h1" />
                    </svg>
                    Correu
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/escapadesenparella"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-brand-instagram"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#00206B"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <rect x="4" y="4" width="16" height="16" rx="4" />
                      <circle cx="12" cy="12" r="3" />
                      <line x1="16.5" y1="7.5" x2="16.5" y2="7.501" />
                    </svg>
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com/escapaenparella"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-brand-twitter"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#00206B"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" />
                      <path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497 -3.753C20.18 7.773 21.692 5.25 22 4.009z" />
                    </svg>
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://facebook.com/escapadesenparella"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-brand-facebook"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#00206B"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" />
                    </svg>
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="tel:633178499"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-brand-whatsapp"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#00206B"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
                      <path d="M9 10a0.5 .5 0 0 0 1 0v-1a0.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a0.5 .5 0 0 0 0 -1h-1a0.5 .5 0 0 0 0 1" />
                    </svg>
                    Telèfon
                  </a>
                </li>
              </ul>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Footer;
