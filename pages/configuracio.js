import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Toast } from "react-bootstrap";
import NavigationBar from "../components/global/NavigationBar";
import UserContext from "../contexts/UserContext";
import ContentService from "../services/contentService";

const configuracio = () => {
  const { user, refreshUserData } = useContext(UserContext);

  let initialState;
  useState(() => {
    if (user) {
      let formatedBirthDate;
      if (user.birthDate) {
        const birthDate = new Date(user.birthDate);
        let year, month, date;
        year = birthDate.getFullYear();
        month = birthDate.getMonth() + 1;
        if (month < 10) {
          month = `0${month}`;
        }
        date = birthDate.getUTCDate();
        if (date < 10) {
          date = `0${date}`;
        }
        formatedBirthDate = `${year}-${month}-${date}`;
      }
      initialState = {
        activeTab: "compte",
        isUpdated: false,
        availableUsername: true,
        availableEmail: true,
        serverMessage: "",
        isPasswordSubmittable: false,
        formData: {
          avatar: user.avatar,
          fullName: user.fullName,
          username: user.username,
          gender: user.gender,
          email: user.email,
          birthDate: formatedBirthDate,
          phoneNumber: user.phoneNumber,
          password: "",
          newPassword: "",
          verifyNewPassword: "",
          slug: "",
        },
      };
    }
  }, [user]);
  const [state, setState] = useState(initialState);
  const service = new ContentService();

  const handleChange = (e) => {
    setState({
      ...state,
      formData: { ...state.formData, [e.target.name]: e.target.value },
    });
  };

  const updateBasicInfo = async () => {
    const { _id } = user;
    const { fullName, gender, birthDate, phoneNumber } = state.formData;
    const updatedUser = await service.editAccountSettings(
      _id,
      fullName,
      gender,
      birthDate,
      phoneNumber
    );
    if (updatedUser.data.message) {
      setState({ ...state, serverMessage: updatedUser.data.message });
    }
    setState({ ...state, isUpdated: true, updatedUser: updatedUser.data });
  };

  const updateUserName = async () => {
    const { _id } = user;
    const { username, slug } = state.formData;
    const updatedUser = await service.editUserName(_id, username);
    if (updatedUser.data.message) {
      setState({
        ...state,
        availableUsername: false,
        availableEmail: true,
        serverMessage: updatedUser.data.message,
      });
    } else {
      setState({ ...state, isUpdated: true, updatedUser: updatedUser.data });
    }
  };

  const updateEmailAddress = async () => {
    const { _id } = user;
    const { email } = state.formData;
    const updatedUser = await service.editEmailAddress(_id, email);
    if (updatedUser.data.message) {
      setState({
        ...state,
        availableEmail: false,
        availableUsername: true,
        serverMessage: updatedUser.data.message,
      });
    } else {
      setState({ ...state, isUpdated: true, updatedUser: updatedUser.data });
    }
  };

  const updatedPassword = async () => {
    const { _id } = user;
    const { password, newPassword } = state.formData;
    const updatedPassword = await service.editPassword(
      _id,
      password,
      newPassword
    );
    if (updatedPassword.data.message) {
      setState({
        ...state,
        availableEmail: false,
        availableUsername: false,
        serverMessage: updatedPassword.data.message,
      });
    } else {
      setState({
        ...state,
        isUpdated: true,
        updatedUser: updatedPassword.data,
      });
    }
  };

  useEffect(() => {
    if (state.isUpdated) {
      refreshUserData(state.updatedUser);
    }
  }, [state]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (state.activeTab === "compte") {
      updateBasicInfo();
    }
    if (state.activeTab === "username") {
      updateUserName();
    }
    if (state.activeTab === "email") {
      updateEmailAddress();
    }
    if (state.activeTab === "contrassenya") {
      updatedPassword();
    }
  };

  const activeTab = {
    backgroundColor: "#abc3f4",
    borderRadius: "8px",
    cursor: "pointer",
    color: "#0d1f44",
  };

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  if (!user) {
    return (
      <Head>
        <title>Carregant...</title>
      </Head>
    );
  }

  let errorInput = {
    background: "red",
    border: "inset 0 0 0 3px red !important",
    color: "red",
  };

  useEffect(() => {
    if (
      state.formData.newPassword !== "" &&
      state.formData.verifyNewPassword !== ""
    ) {
      if (state.formData.newPassword === state.formData.verifyNewPassword) {
        setState({ ...state, isPasswordSubmittable: true });
      } else {
        setState({ ...state, isPasswordSubmittable: false });
      }
    } else {
      setState({ ...state, isPasswordSubmittable: false });
    }
  }, [state.formData]);

  let inputValidator;

  if (state.isPasswordSubmittable) {
    inputValidator = (
      <div className="inputValidator">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-circle-check"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="#32cd32"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <circle cx="12" cy="12" r="9" />
          <path d="M9 12l2 2l4 -4" />
        </svg>
      </div>
    );
  } else if (
    state.formData.newPassword !== "" &&
    state.formData.verifyNewPassword !== ""
  ) {
    if (!state.isPasswordSubmittable) {
      inputValidator = (
        <div className="inputValidator">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-circle-x"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#f53e3e"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <circle cx="12" cy="12" r="9" />
            <path d="M10 10l4 4m0 -4l-4 4" />
          </svg>
        </div>
      );
    }
  }

  let panel;

  if (state.activeTab === "compte") {
    panel = (
      <div className="wrapper">
        <div className="col left">
          <h2>Informació Personal</h2>
          <Form>
            <Form.Group>
              <Form.Label>Nom i cognoms</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nom i cognoms"
                name="fullName"
                value={state.formData.fullName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Gènere</Form.Label>
              <Form.Control
                as="select"
                name="gender"
                value={state.formData.gender}
                onChange={handleChange}
              >
                <option>Selecciona una opció</option>
                <option value="Dona">Dona</option>
                <option value="Home">Home</option>
                <option value="Un altre">Un altre</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Data de naixement</Form.Label>
              <Form.Control
                type="date"
                placeholder="Data de naixement"
                name="birthDate"
                value={state.formData.birthDate}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Número de telèfon</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Número de telèfon"
                name="phoneNumber"
                value={state.formData.phoneNumber}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
          <hr />
          <div className="buttons">
            <Button className="btn">Cancel·lar</Button>
            <Button
              className="btn btn-primary"
              type="submit"
              onClick={handleSubmit}
            >
              Guardar canvis
            </Button>
          </div>
        </div>
        <div className="col right">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-id"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#58708D"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <rect x="3" y="4" width="18" height="16" rx="3" />
            <circle cx="9" cy="10" r="2" />
            <line x1="15" y1="8" x2="17" y2="8" />
            <line x1="15" y1="12" x2="17" y2="12" />
            <line x1="7" y1="16" x2="17" y2="16" />
          </svg>
          <h3>Quina informació es comparteix amb altres persones?</h3>
          <p>
            Escapadesenparella.cat només proporciona les teves dades de contacte
            als propietaris d'allotjaments o activitats una vegada efectuada una
            reserva.
          </p>
        </div>
      </div>
    );
  }
  if (state.activeTab === "username") {
    panel = (
      <div className="wrapper">
        <div className="col left">
          <h2>Detalls d'usuari</h2>
          <Form>
            <Form.Group>
              <Form.Label>Nom d'usuari</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nom d'usuari"
                name="username"
                value={state.formData.username}
                onChange={handleChange}
                style={state.availableUsername === "false" ? errorInput : null}
              />
              {!state.availableUsername ? (
                <p style={{ color: "red" }}>{state.serverMessage}</p>
              ) : null}
            </Form.Group>
            <Form.Group>
              <Form.Label>URL del perfil</Form.Label>
              <Form.Control
                type="text"
                placeholder="URL del perfil"
                name="slug"
                value={state.formData.slug}
                onChange={handleChange}
              />
              {!state.availableUsername ? (
                <p style={{ color: "red" }}>{state.serverMessage}</p>
              ) : null}
            </Form.Group>
          </Form>
          <hr />
          <div className="buttons">
            <Button className="btn">Cancel·lar</Button>
            <Button
              className="btn btn-primary"
              type="submit"
              onClick={handleSubmit}
            >
              Guardar canvis
            </Button>
          </div>
        </div>
        <div className="col right">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-id"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#58708D"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <rect x="3" y="4" width="18" height="16" rx="3" />
            <circle cx="9" cy="10" r="2" />
            <line x1="15" y1="8" x2="17" y2="8" />
            <line x1="15" y1="12" x2="17" y2="12" />
            <line x1="7" y1="16" x2="17" y2="16" />
          </svg>
          <h3>Quina informació es comparteix amb altres persones?</h3>
          <p>
            Escapadesenparella.cat només proporciona les teves dades de contacte
            als propietaris d'allotjaments o activitats una vegada efectuada una
            reserva.
          </p>
        </div>
      </div>
    );
  }
  if (state.activeTab === "email") {
    panel = (
      <div className="wrapper">
        <div className="col left">
          <h2>Adreça electrònica</h2>
          <Form>
            <Form.Group>
              <Form.Label>Adreça electrònica</Form.Label>
              <Form.Control
                type="email"
                placeholder="Adreça electrònica"
                name="email"
                value={state.formData.email}
                onChange={handleChange}
                style={
                  state.availableEmail === "false" ? "background: red" : null
                }
              />
              {!state.availableEmail ? (
                <p style={{ color: "red" }}>{state.serverMessage}</p>
              ) : null}
            </Form.Group>
          </Form>
          <hr />
          <div className="buttons">
            <Button className="btn">Cancel·lar</Button>
            <Button
              className="btn btn-primary"
              type="submit"
              onClick={handleSubmit}
            >
              Guardar canvis
            </Button>
          </div>
        </div>
        <div className="col right">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-id"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#58708D"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <rect x="3" y="4" width="18" height="16" rx="3" />
            <circle cx="9" cy="10" r="2" />
            <line x1="15" y1="8" x2="17" y2="8" />
            <line x1="15" y1="12" x2="17" y2="12" />
            <line x1="7" y1="16" x2="17" y2="16" />
          </svg>
          <h3>Quina informació es comparteix amb altres persones?</h3>
          <p>
            Escapadesenparella.cat només proporciona les teves dades de contacte
            als propietaris d'allotjaments o activitats una vegada efectuada una
            reserva.
          </p>
        </div>
      </div>
    );
  }
  if (state.activeTab === "contrassenya") {
    panel = (
      <div className="wrapper">
        <div className="col left">
          <h2>Contrassenya</h2>
          <Form>
            <Form.Group>
              <Form.Label>Contrassenya actual</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Escriu la contrassenya actual"
                onChange={handleChange}
                value={state.formData.password}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Nova contrassenya</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                placeholder="Escriu una nova contrassenya"
                onChange={handleChange}
                value={state.formData.newPassword}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Repeteix la contrassenya</Form.Label>
              <Form.Control
                type="password"
                name="verifyNewPassword"
                placeholder="Repeteix la nova contrassenya"
                onChange={handleChange}
                value={state.formData.verifyNewPassword}
              />
              {inputValidator}
            </Form.Group>
          </Form>
          <hr />
          <div className="buttons">
            <Button className="btn">Cancel·lar</Button>
            <Button
              className="btn btn-primary"
              type="submit"
              onClick={handleSubmit}
            >
              Guardar canvis
            </Button>
          </div>
        </div>
        <div className="col right">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-shield-check"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#58708D"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M9 12l2 2l4 -4" />
            <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" />
          </svg>
          <h3>Fem que el teu compte sigui més segur</h3>
          <p>
            Treballem constantment per millorar la seguretat de la nostra
            comunitat. Per aquest motiu, comprovemt tots els comptes i ens
            assegurem que siguin segurs.
          </p>
        </div>
      </div>
    );
  }
  if (state.activeTab === "privacitat") {
    panel = (
      <div className="wrapper">
        <div className="col left">
          <h2>Privacitat</h2>
          <Form className="privacy">
            <Form.Group controlId="formBasicCheckbox">
              <label className="form-label">
                <div className="left">
                  <p>Inclou el meu perfil d'usuari als cercadors</p>
                  <span>
                    Si actives aquesta opció, els motors de cerca, com ara
                    Google, mostraran el teu perfil d'usuari als resultats de
                    cerca
                  </span>
                </div>
                <div className="right">
                  <input type="checkbox" id="browsers_checkbox" />
                </div>
              </label>
            </Form.Group>
            <hr />
            <Form.Group controlId="formBasicCheckbox">
              <label className="form-label">
                <div className="left">
                  <p>Inclou les meves escapades als cercadors</p>
                  <span>
                    Si actives aquesta opció, els motors de cerca, com ara
                    Google, mostraran les teves escapades als resultats de cerca
                  </span>
                </div>
                <div className="right">
                  <input type="checkbox" id="browsers_checkbox" />
                </div>
              </label>
            </Form.Group>
            <hr />
            <Form.Group controlId="formBasicCheckbox">
              <label className="form-label">
                <div className="left">
                  <p>Permet que altres usuaris vegin el meu perfil</p>
                  <span>
                    Si actives aquesta opció el teu perfil d'usuari serà visible
                    per la resta d'usuaris de la comunitat
                    d'Escapadesenparella.cat
                  </span>
                </div>
                <div className="right">
                  <input type="checkbox" id="browsers_checkbox" />
                </div>
              </label>
            </Form.Group>
            <hr />
            <Form.Group controlId="formBasicCheckbox">
              <label className="form-label">
                <div className="left">
                  <p>Permet que altres usuaris em puguin seguir</p>
                  <span>
                    Si actives aquesta opció alters usuaris de la comunitat
                    d'Escapadesenparella.cat podran ser seguidors teus. Del
                    contrari, rebràs una notificació per aprobar o no la
                    sol·licitut de seguiment
                  </span>
                </div>
                <div className="right">
                  <input type="checkbox" id="browsers_checkbox" />
                </div>
              </label>
            </Form.Group>
          </Form>
          <hr />
          <div className="buttons">
            <Button className="btn">Cancel·lar</Button>
            <Button className="btn btn-primary">Guardar canvis</Button>
          </div>
        </div>
        <div className="col right">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-adjustments-alt"
            width="44"
            height="44"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#58708D"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <rect x="4" y="8" width="4" height="4" />
            <line x1="6" y1="4" x2="6" y2="8" />
            <line x1="6" y1="12" x2="6" y2="20" />
            <rect x="10" y="14" width="4" height="4" />
            <line x1="12" y1="4" x2="12" y2="14" />
            <line x1="12" y1="18" x2="12" y2="20" />
            <rect x="16" y="5" width="4" height="4" />
            <line x1="18" y1="4" x2="18" y2="5" />
            <line x1="18" y1="9" x2="18" y2="20" />
          </svg>
          <h3>Tria què comparteixes</h3>
          <p>
            Escapadesenparella.cat es preocupa per la teva privacitat. Utilitza
            aquesta pantalla per configurar la teva activitat i triar com vols
            compartir la teva activitat.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Configuració - Escapadesenparella.cat</title>
      </Head>
      <div id="settings">
        <NavigationBar
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
          }
        />
        <main>
          <Container fluid className="top-nav mw-1600">
            <div className="top-nav-wrapper">
              <h1 className="top-nav-title db mw-1600">Configuració</h1>
            </div>
          </Container>
          <Container fluid className="mw-1600">
            <Row>
              <div className="box d-flex">
                <div className="col left">
                  <div className="user-meta">
                    <div className="user-meta-wrapper">
                      <div className="avatar avatar-s">
                        <img src={user.avatar} title={user.fullName} />
                      </div>
                      <div className="user-text">
                        <h3>{user.fullName}</h3>
                        <p>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-at"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="#2c3e50"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <circle cx="12" cy="12" r="4" />
                            <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0v-1.5a9 9 0 1 0 -5.5 8.28" />
                          </svg>
                          {user.username}
                        </p>
                      </div>
                    </div>
                  </div>
                  <ul className="settings-options">
                    <li
                      className="list-item"
                      style={state.activeTab === "compte" ? activeTab : null}
                      onClick={() =>
                        setState({ ...state, activeTab: "compte" })
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-clipboard-list"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="#2c3e50"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                        <rect x="9" y="3" width="6" height="4" rx="2" />
                        <line x1="9" y1="12" x2="9.01" y2="12" />
                        <line x1="13" y1="12" x2="15" y2="12" />
                        <line x1="9" y1="16" x2="9.01" y2="16" />
                        <line x1="13" y1="16" x2="15" y2="16" />
                      </svg>{" "}
                      Informació bàsica
                    </li>
                    <li
                      className="list-item"
                      style={state.activeTab === "username" ? activeTab : null}
                      onClick={() =>
                        setState({ ...state, activeTab: "username" })
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-user"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="#2c3e50"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <circle cx="12" cy="7" r="4" />
                        <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                      </svg>{" "}
                      Detalls d'usuari
                    </li>
                    <li
                      className="list-item"
                      style={state.activeTab === "email" ? activeTab : null}
                      onClick={() => setState({ ...state, activeTab: "email" })}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-at"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="#2c3e50"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <circle cx="12" cy="12" r="4" />
                        <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0v-1.5a9 9 0 1 0 -5.5 8.28" />
                      </svg>{" "}
                      Adreça electrònica
                    </li>
                    <li
                      className="list-item"
                      style={
                        state.activeTab === "contrassenya" ? activeTab : null
                      }
                      onClick={() =>
                        setState({ ...state, activeTab: "contrassenya" })
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-key"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="#2c3e50"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <circle cx="8" cy="15" r="4" />
                        <line x1="10.85" y1="12.15" x2="19" y2="4" />
                        <line x1="18" y1="5" x2="20" y2="7" />
                        <line x1="15" y1="8" x2="17" y2="10" />
                      </svg>{" "}
                      Contrassenya
                    </li>
                    {/* <li
											className="list-item"
											style={
												state.activeTab === "privacitat" ? activeTab : null
											}
											onClick={() =>
												setState({...state, activeTab: "privacitat"})
											}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="icon icon-tabler icon-tabler-shield-lock"
												width="28"
												height="28"
												viewBox="0 0 24 24"
												strokeWidth="1.5"
												stroke="#2c3e50"
												fill="none"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<path stroke="none" d="M0 0h24v24H0z" fill="none" />
												<path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" />
												<circle cx="12" cy="11" r="1" />
												<line x1="12" y1="12" x2="12" y2="14.5" />
											</svg>{" "}
											Privacitat
										</li> */}
                  </ul>
                </div>
                <div className="col right">{panel}</div>
              </div>
            </Row>
          </Container>
        </main>
      </div>
    </>
  );
};

export default configuracio;
