import Head from "next/head";
import React, { useContext } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import UserContext from "../../contexts/UserContext";
import EmailService from "../../services/emailService";

const ConfirmEmail = () => {
  const { user } = useContext(UserContext);
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
