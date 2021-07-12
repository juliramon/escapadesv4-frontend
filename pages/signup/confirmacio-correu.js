import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import UserContext from "../../contexts/UserContext";
import EmailService from "../../services/emailService";

const ConfirmEmail = () => {
  const { user } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!user || user === "null" || user === undefined) {
      router.push("/login");
    } else {
      if (user) {
        if (user.accountCompleted === false) {
          router.push("/signup/complete-account");
        }
        if (user.hasConfirmedEmail === false) {
          router.push("/signup/confirmacio-correu");
        }
        if (user.userType !== "admin" || !user.userType) {
          router.push("/feed");
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
  return (
    <>
      <Head>
        <title>Confirmació de correu - Escapadesenparella.cat</title>
      </Head>
      <div className="email-confirmation">
        <Container>
          <Row>
            <Col lg={12}>
              <h1>Confirma el teu correu</h1>
              <Button
                variant="none"
                className="btn btn-m btn-dark"
                onClick={resendConfirmEmail}
              >
                Reenviar correu
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default ConfirmEmail;
