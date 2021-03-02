import Head from "next/head";
import React from "react";
import { Container, Spinner } from "react-bootstrap";

const FetchingSpinner = () => {
  return (
    <>
      <Head>
        <title>Carregant...</title>
      </Head>
      <Container className="spinner d-flex justify-space-between">
        <Spinner animation="border" role="status" variant="primary">
          <span className="sr-only">Carregant...</span>
        </Spinner>
      </Container>
    </>
  );
};

export default FetchingSpinner;
