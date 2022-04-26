import Head from "next/head";
import Link from "next/link";
import { useContext } from "react";
import { Col, Container, Row } from "react-bootstrap";
import UserContext from "../../contexts/UserContext";
import NavigationBar from "./NavigationBar";

const Error404 = () => {
  const { user } = useContext(UserContext);
  let button;
  if (!user) {
    button = (
      <Link href="/">
        <a className="btn btn-m btn-dark">Tornar al començament</a>
      </Link>
    );
  } else {
    button = (
      <Link href="/feed">
        <a className="btn btn-m btn-dark">Tornar al feed</a>
      </Link>
    );
  }
  return (
    <>
      <Head>
        <title>404 | Escapadesenparella.cat</title>
        <meta name="robots" content="noindex">
      </Head>
      <div>
        <NavigationBar
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
          }
          user={user}
        />
        <main className="error-page">
          <Container>
            <Row>
              <Col lg="12">
                <h1>404</h1>
                <p>Ep! Aquesta pàgina no existeix...</p>
                {button}
              </Col>
            </Row>
          </Container>
        </main>
      </div>
    </>
  );
};

export default Error404;
