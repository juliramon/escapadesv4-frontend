import Head from "next/head";
import Link from "next/link";
import ContentService from "../services/contentService";
import { useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import AuthService from "../services/authService";
import Router from "next/router";
import Error404 from "../components/global/Error404";

const ResetPassword = ({ userData }) => {
  if (!userData) {
    return <Error404 />;
  }
  const initialState = {
    formData: {
      password: "",
      newPassword: "",
    },
    userData: userData,

    errorMessage: {},
  };
  const [state, setState] = useState(initialState);
  const service = new AuthService();
  const handleChange = (e) => {
    setState({
      ...state,
      formData: { ...state.formData, [e.target.name]: e.target.value },
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password } = state.formData;
    service
      .resetPassword(userData._id, password, userData.resetPasswordToken)
      .then((res) => {
        if (res.status) {
          setState({
            ...state,
            errorMessage: res,
          });
        } else {
          setState(initialState);
          Router.push("/login");
        }
      });
  };

  let errorMessage;
  if (state.errorMessage.message) {
    if (state.errorMessage.message === "Escriu una nova contrassenya") {
      errorMessage = (
        <Alert variant="danger">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-shield-x"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#fff"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" />
            <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" />
            <path d="M10 10l4 4m0 -4l-4 4" />
          </svg>
          {state.errorMessage.message}
        </Alert>
      );
    } else if (
      state.errorMessage.message ===
      "La contrassenya ha de ser de com a mínim 7 caràcters"
    ) {
      errorMessage = (
        <Alert variant="danger">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-key"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#ffffff"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" />
            <circle cx="8" cy="15" r="4" />
            <line x1="10.85" y1="12.15" x2="19" y2="4" />
            <line x1="18" y1="5" x2="20" y2="7" />
            <line x1="15" y1="8" x2="17" y2="10" />
          </svg>
          {state.errorMessage.message}
        </Alert>
      );
    }
  } else {
    errorMessage = null;
  }

  return (
    <>
      <Head>
        <title>Recuperar contrassenya - Escapadesenparella.cat</title>
      </Head>
      <section id="signup">
        <div className="d-flex">
          <div className="signup-col left">
            <div className="title-area">
              <Link href="/">
                <img
                  src="https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
                  alt=""
                />
              </Link>
              <h2>Descobreix les millors escapades en parella a Catalunya.</h2>
            </div>
            <div className="graphic">
              <img src="../../signup-graphic.svg" alt="" />
            </div>
          </div>
          <div className="signup-col right">
            <div className="signup-col-wrapper right">
              <div className="title-area">
                <h1>Canviar contrassenya</h1>
              </div>
              <Form onSubmit={handleSubmit}>
                {errorMessage}
                <Form.Group>
                  <Form.Label>Nova contrassenya</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    onChange={handleChange}
                    placeholder="Escriu la nova contrassenya"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Repetir nova contrassenya</Form.Label>
                  <Form.Control
                    type="password"
                    name="newPassword"
                    onChange={handleChange}
                    placeholder="Escriu de nou la nova contrassenya"
                  />
                </Form.Group>
                <div className="d-flex justify-content-between">
                  <Button
                    variant="none"
                    type="submit"
                    className="btn btn-m btn-dark btn-no-flex"
                  >
                    Canviar contrassenya
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export async function getServerSideProps(req) {
  const service = new ContentService();
  const userData = await service.getUserData(req.query.token);
  return {
    props: {
      userData: userData,
    },
  };
}

export default ResetPassword;
