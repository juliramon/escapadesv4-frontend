import Router, { useRouter } from "next/router";
import { useContext, useState } from "react";
import { Navbar, Nav, Container, Form, Dropdown } from "react-bootstrap";
import ContentBar from "../homepage/ContentBar";
import Link from "next/link";
import UserContext from "../../contexts/UserContext";

const NavigationBar = ({ logo_url, path }) => {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const initialState = {
    searchQuery: "",
    isResponsiveMenuOpen: false,
  };
  const [state, setState] = useState(initialState);

  const notLoggedHeader = {
    boxShadow: "none",
    borderBottom: "1px solid #e8e8e8",
  };
  const handleKeyPress = (e) => {
    let searchQuery = e.target.value;
    setState({ ...state, searchQuery: searchQuery });
    if (e.keyCode === 13) {
      e.preventDefault();
      Router.push(`/search?query=${searchQuery}`);
    }
  };

  const handleResponsiveMenu = () => {
    if (!state.isResponsiveMenuOpen) {
      setState({ ...state, isResponsiveMenuOpen: true });
    } else {
      setState({ ...state, isResponsiveMenuOpen: false });
    }
  };

  let isAdmin;
  if (user) {
    if (user.userType && user.userType === "admin") {
      isAdmin = (
        <li>
          <Link href="/admin-panel">
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-adjustments-alt"
                width="44"
                height="44"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#00206B"
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
              </svg>{" "}
              Admin Panel
            </a>
          </Link>
        </li>
      );
    }
  }

  let styledHeader = user === "null" || !user ? notLoggedHeader : undefined;
  let logoLink = user === "null" || !user || user === undefined ? "/" : "/feed";
  let navRight = undefined;

  if (!user || user === "null") {
    navRight = (
      <Nav>
        <Link href="/login">
          <a>Inicia sessió</a>
        </Link>
        <Link href="/signup">
          <a className="btn btn-dark">Registra't</a>
        </Link>
      </Nav>
    );
  } else {
    navRight = (
      <Nav>
        <Dropdown id="logged-user">
          <Dropdown.Toggle variant="none" id="dropdown-basic">
            <div className="avatar avatar-nav">
              <img src={user.avatar} alt={user.fullName} />
            </div>
            <div className="user-meta">
              {user.fullName}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-chevron-down"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#00206B"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <ul>
              <li>
                <Link href={`/dashboard`}>
                  <a>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-layout-list"
                      width="44"
                      height="44"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#00206B"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" />
                      <rect x="4" y="4" width="16" height="6" rx="2" />
                      <rect x="4" y="14" width="16" height="6" rx="2" />
                    </svg>
                    Gestor
                  </a>
                </Link>
              </li>
              <li>
                <Link href={`/usuaris/${user._id}`}>
                  <a>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-user"
                      width="44"
                      height="44"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#00206B"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" />
                      <circle cx="12" cy="7" r="4" />
                      <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                    </svg>
                    Perfil
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/bookmarks">
                  <a>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-bookmark"
                      width="44"
                      height="44"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#00206B"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" />
                      <path d="M9 4h6a2 2 0 0 1 2 2v14l-5-3l-5 3v-14a2 2 0 0 1 2 -2" />
                    </svg>{" "}
                    Desats
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/configuracio">
                  <a>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-settings"
                      width="44"
                      height="44"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#00206B"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>{" "}
                    Configuració
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/empreses">
                  <a>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-building-store"
                      width="44"
                      height="44"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#00206B"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <line x1="3" y1="21" x2="21" y2="21" />
                      <path d="M3 7v1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1h-18l2 -4h14l2 4" />
                      <line x1="5" y1="21" x2="5" y2="10.85" />
                      <line x1="19" y1="21" x2="19" y2="10.85" />
                      <path d="M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4" />
                    </svg>
                    Serveis per empreses
                  </a>
                </Link>
              </li>
              {isAdmin}
              <li>
                <Link href="/logout">
                  <a>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-power"
                      width="44"
                      height="44"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#00206B"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" />
                      <path d="M7 6a7.75 7.75 0 1 0 10 0" />
                      <line x1="12" y1="4" x2="12" y2="12" />
                    </svg>{" "}
                    Tancar sessió
                  </a>
                </Link>
              </li>
            </ul>
          </Dropdown.Menu>
        </Dropdown>
      </Nav>
    );
  }

  const responsiveMenu = (
    <>
      <div className="nav-responsive-wrapper">
        <Nav className="search-box">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-search"
            width="44"
            height="44"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#00206B"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" />
            <circle cx="10" cy="10" r="7" />
            <line x1="21" y1="21" x2="15" y2="15" />
          </svg>
          <Form>
            <Form.Control
              onKeyDown={handleKeyPress}
              type="text"
              placeholder="Cerca la vostra propera escapada..."
            />

            <span className="search-helper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-corner-down-left"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#00206B"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <path d="M18 6v6a3 3 0 0 1 -3 3h-10l5 -5m0 10l-5 -5" />
              </svg>
              Prem "Enter" per cercar
            </span>
          </Form>
        </Nav>
        <Nav>
          <Link href="/activitats">
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-route"
                width="44"
                height="44"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#00206B"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <circle cx="6" cy="19" r="2" />
                <circle cx="18" cy="5" r="2" />
                <path d="M12 19h4.5a3.5 3.5 0 0 0 0 -7h-8a3.5 3.5 0 0 1 0 -7h3.5" />
              </svg>
              Activitats
            </a>
          </Link>
          <Link href="/allotjaments">
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-bed"
                width="44"
                height="44"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#00206B"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <path d="M3 7v11m0 -4h18m0 4v-8a2 2 0 0 0 -2 -2h-8v6" />
                <circle cx="7" cy="10" r="1" />
              </svg>
              Allotjaments
            </a>
          </Link>
          <Link href="/histories">
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-notebook"
                width="44"
                height="44"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#00206B"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-11a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1m3 0v18" />
                <line x1="13" y1="8" x2="15" y2="8" />
                <line x1="13" y1="12" x2="15" y2="12" />
              </svg>
              Històries
            </a>
          </Link>
        </Nav>
        {navRight}
      </div>
    </>
  );

  let navBar;
  if (
    router.pathname === "/nova-activitat" ||
    router.pathname === "/nou-allotjament" ||
    router.pathname === "/nova-activitat?step=publicacio-fitxa" ||
    router.pathname === "/nou-allotjament?step=publicacio-fitxa" ||
    router.pathname === "/nova-historia"
  ) {
    navBar = (
      <header style={styledHeader}>
        <Navbar>
          <Container fluid className="align-items-center">
            <div className="nav-col left d-flex">
              <Link href={logoLink}>
                <a className="navbar-brand">
                  <img src={logo_url} alt="Logo Getaways.guru" />
                </a>
              </Link>
            </div>
            <div className="nav-col right d-flex simple-nav">{navRight}</div>
          </Container>
        </Navbar>
      </header>
    );
  } else if (path === "/signup/complete-account") {
    navBar = (
      <header style={styledHeader}>
        <Navbar>
          <Container fluid className="align-items-center">
            <div className="nav-col left d-flex">
              <Link href={logoLink}>
                <a className="navbar-brand">
                  <img src={logo_url} alt="Logo Getaways.guru" />
                </a>
              </Link>
            </div>
            <div className="nav-col right d-flex">
              <Nav className="logged-user">
                <Dropdown>
                  <Dropdown.Toggle variant="none" id="dropdown-basic">
                    <div className="avatar avatar-nav">
                      <img src={user.avatar} alt={user.fullName} />
                    </div>
                    <div className="user-meta">
                      {user.fullName}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-chevron-down"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="#00206B"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <ul>
                      <li>
                        <Link href="/logout">
                          <a>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="icon icon-tabler icon-tabler-power"
                              width="44"
                              height="44"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="#00206B"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path stroke="none" d="M0 0h24v24H0z" />
                              <path d="M7 6a7.75 7.75 0 1 0 10 0" />
                              <line x1="12" y1="4" x2="12" y2="12" />
                            </svg>{" "}
                            Logout
                          </a>
                        </Link>
                      </li>
                    </ul>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
            </div>
          </Container>
        </Navbar>
        <ContentBar user={user} />
      </header>
    );
  } else {
    navBar = (
      <header style={styledHeader}>
        <Navbar>
          <Container fluid className="align-items-center">
            <div className="nav-col left d-flex">
              <Link href={logoLink}>
                <a className="navbar-brand">
                  <img src={logo_url} alt="Logo Getaways.guru" />
                </a>
              </Link>
            </div>
            <div className="nav-col right d-flex">
              <div className="nav-col-right-wrapper">
                <Nav className="search-box">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-search"
                    width="44"
                    height="44"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="#00206B"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <circle cx="10" cy="10" r="7" />
                    <line x1="21" y1="21" x2="15" y2="15" />
                  </svg>
                  <Form>
                    <Form.Control
                      onKeyDown={handleKeyPress}
                      type="text"
                      placeholder="Cerca la vostra propera escapada..."
                    />

                    <span className="search-helper">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-corner-down-left"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="#00206B"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <path d="M18 6v6a3 3 0 0 1 -3 3h-10l5 -5m0 10l-5 -5" />
                      </svg>
                      Prem "Enter" per cercar
                    </span>
                  </Form>
                </Nav>
                <Nav>
                  <Link href="/activitats">
                    <a>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-route"
                        width="44"
                        height="44"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="#00206B"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <circle cx="6" cy="19" r="2" />
                        <circle cx="18" cy="5" r="2" />
                        <path d="M12 19h4.5a3.5 3.5 0 0 0 0 -7h-8a3.5 3.5 0 0 1 0 -7h3.5" />
                      </svg>
                      Activitats
                    </a>
                  </Link>
                  <Link href="/allotjaments">
                    <a>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-bed"
                        width="44"
                        height="44"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="#00206B"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <path d="M3 7v11m0 -4h18m0 4v-8a2 2 0 0 0 -2 -2h-8v6" />
                        <circle cx="7" cy="10" r="1" />
                      </svg>
                      Allotjaments
                    </a>
                  </Link>
                  <Link href="/histories">
                    <a>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-notebook"
                        width="44"
                        height="44"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="#00206B"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-11a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1m3 0v18" />
                        <line x1="13" y1="8" x2="15" y2="8" />
                        <line x1="13" y1="12" x2="15" y2="12" />
                      </svg>
                      Històries
                    </a>
                  </Link>
                </Nav>
                {navRight}
              </div>
              <div className="nav-col-right-responsive">
                <button
                  className="hamb-btn"
                  onClick={() => handleResponsiveMenu()}
                >
                  {state.isResponsiveMenuOpen ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-x"
                      width="44"
                      height="44"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#00206B"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-menu-2"
                      width="50"
                      height="50"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#00206B"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <line x1="4" y1="6" x2="20" y2="6" />
                      <line x1="4" y1="12" x2="20" y2="12" />
                      <line x1="4" y1="18" x2="20" y2="18" />
                    </svg>
                  )}
                </button>
                {state.isResponsiveMenuOpen ? responsiveMenu : null}
              </div>
            </div>
          </Container>
        </Navbar>
        <ContentBar />
      </header>
    );
  }

  return navBar;
};

export default NavigationBar;
