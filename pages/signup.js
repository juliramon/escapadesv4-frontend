import Link from "next/link";
import { useContext, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import AuthService from "../services/authService";
import { useRouter } from "next/router";
import UserContext from "../contexts/UserContext";
import slugify from "slugify";
import EmailService from "../services/emailService";
import GlobalMetas from "../components/head/GlobalMetas";
import Breadcrumb from "../components/richsnippets/Breadcrumb";

const Signup = () => {
  const { user, getNewUser } = useContext(UserContext);
  const router = useRouter();

  const initialState = {
    formData: {
      fullName: "",
      email: "",
      password: "",
    },
    errorMessage: {},
    googleResponse: {
      received: false,
      data: {},
    },
  };
  const [state, setState] = useState(initialState);
  const service = new AuthService();
  const emailService = new EmailService();
  const handleChange = (e) => {
    setState({
      ...state,
      formData: { ...state.formData, [e.target.name]: e.target.value },
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, password } = state.formData;
    const convertNameToSlug = await slugify(state.formData.fullName, {
      remove: /[*+~.,()'"!:@]/g,
      lower: true,
    });
    const randomgNumber = Math.floor(Math.random() * (100000000000 - 1) + 1);
    const slug = `${convertNameToSlug}-${randomgNumber}`;
    service.signup(fullName, email, password, slug).then((res) => {
      if (res.status) {
        setState({
          ...state,
          errorMessage: res,
        });
      } else {
        setState(initialState);
        getNewUser(res);
        emailService.sendConfirmEmail(fullName, email);
      }
    });
  };

  let errorMessage;
  if (state.errorMessage.message) {
    if (
      state.errorMessage.message ===
      "Entra el teu nom complet, correu i contrassenya"
    ) {
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
    } else if (
      state.errorMessage.message ===
      "Aquest correu ja existeix. Tria'n un altre."
    ) {
      errorMessage = (
        <Alert variant="danger">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-at"
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
            <circle cx="12" cy="12" r="4" />
            <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0v-1.5a9 9 0 1 0 -5.5 8.28" />
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
      {/* Browser metas  */}
      <GlobalMetas
        title="Crea el teu compte"
        description="Crea el teu compte gratuït per guardar i planificar la teva propera escapada en parella ideal!"
        url="https://escapadesenparella.cat/signup"
        image="https://res.cloudinary.com/juligoodie/image/upload/v1632416196/getaways-guru/zpdiudqa0bk8sc3wfyue.jpg"
        canonical="https://escapadesenparella.cat/signup"
      />
      {/* Rich snippets */}
      <Breadcrumb
        page1Title="Inici"
        page1Url="https://escapadesenparella.cat"
        page2Title="Crea el teu compte"
        page2Url={`https://escapadesenparella.cat/signup`}
      />
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
              <div className="navlink">
                Ja tens un compte? <Link href="/login">Inicia sessió</Link>
              </div>
              <div className="title-area">
                <h1>Registra't a Escapadesenparella.cat</h1>
                <p className="sub-h1">
                  Crea el teu compte per descobrir, guardar i gaudir de la teva
                  propera escapada en parella.
                </p>
              </div>
              <Form onSubmit={handleSubmit}>
                {errorMessage}
                <div className="d-flex">
                  <Form.Group>
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      onChange={handleChange}
                      placeholder="Escriu el teu nom i cognom"
                    />
                  </Form.Group>
                </div>
                <Form.Group>
                  <Form.Label>Correu electrònic</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    onChange={handleChange}
                    placeholder="Escriu el teu correu electrònic"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Contrassenya</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    onChange={handleChange}
                    placeholder="6+ caràcters"
                  />
                </Form.Group>
                <Button
                  variant="none"
                  type="submit"
                  className="btn btn-m btn-dark"
                >
                  Crear el meu compte
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;
