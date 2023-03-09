import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import UserContext from "../../contexts/UserContext";
import EmailService from "../../services/emailService";
import NavigationBar from "../../components/global/NavigationBar";

const ConfirmEmail = () => {
  const { user } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!user || user === "null" || user === undefined) {
      router.push("/login");
    } else {
      if (user) {
        if (user.hasConfirmedEmail === true) {
          router.push("/signup/complete-account");
        }
      }
    }
  }, [user]);

  if (!user) {
    return (
      <Head>
        <title>Carregant...</title>
      </Head>
    );
  }

  const emailService = new EmailService();
  const resendConfirmEmail = () =>
    emailService.sendConfirmEmail(user.fullName, user.email);

  const [queryId, setQueryId] = useState(null);
  useEffect(() => {
    if (router && router.route) {
      setQueryId(router.route);
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>Confirmació de correu - Escapadesenparella.cat</title>
      </Head>
      <section id="emailConfirmation">
        <NavigationBar
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
          }
          user={user}
          path={queryId}
        />
        <Container fluid className="mw-1600">
          <Row>
            <Col lg={12}>
              <div className="content-wrapper">
                <img
                  src="https://res.cloudinary.com/juligoodie/image/upload/v1626446634/getaways-guru/static-files/email-confirmation_lu3qbp.jpg"
                  alt=""
                />
                <h1>Confirma el teu correu</h1>
                <p className="sub-h1 text-center">
                  Hem enviat un correu a {user.email} per verificar la teva
                  direcció de correu. <br />
                  Revisa la teva bústia d'entrada i la carpeta d'spam.
                </p>
                <Button
                  variant="none"
                  className="btn btn-m btn-dark"
                  onClick={resendConfirmEmail}
                >
                  Reenviar correu
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default ConfirmEmail;
