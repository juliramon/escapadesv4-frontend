import "../styles/globals.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-quill/dist/quill.bubble.css";

import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import UserContext from "../contexts/UserContext";
import AuthService from "../services/authService";

function MyApp({ Component, pageProps }) {
  const [cookies, setCookie, removeCookie] = useCookies("");
  let loggedData;
  if (cookies.loggedInUser && cookies.loggedInUser !== null) {
    loggedData = cookies.loggedInUser;
  }
  const initialState = {
    loggedUser: loggedData,
  };

  const [state, setState] = useState(initialState);

  let cookieCreationDate = new Date();
  let cookieExpirationDate = new Date();
  cookieExpirationDate.setFullYear(cookieCreationDate.getFullYear() + 1);

  const getLoggedUser = (user) => {
    setState({ ...state, userFetched: true });
    setCookie("loggedInUser", user, { expires: cookieExpirationDate });
    Router.push("/feed");
  };

  const getNewUser = (user) => {
    setState({ ...state, userFetched: true });
    setCookie("loggedInUser", user, { expires: cookieExpirationDate });
    Router.push("/signup/complete-account");
  };

  useEffect(() => {
    if (state.userFetched) {
      setState({ ...state, loggedUser: cookies.loggedInUser });
    }
  }, [cookies]);

  const logOut = () => {
    const service = new AuthService();
    service
      .logout()
      .then(() => {
        setCookie("loggedInUser", undefined, { expires: cookieExpirationDate });
        removeCookie("loggedInUser");
        Router.push("/login");
      })
      .catch((err) => console.log(err));
  };

  const refreshUserData = (updatedUser) => {
    console.log("updating user...");
    removeCookie("loggedInUser");
    setCookie("loggedInUser", updatedUser, { expires: cookieExpirationDate });
    setState({ ...state, loggedUser: updatedUser });
  };

  return (
    <UserContext.Provider
      value={{
        user: state.loggedUser,
        saveUserDetails: getLoggedUser,
        getNewUser: getNewUser,
        refreshUserData: refreshUserData,
        logOut: logOut,
      }}
    >
      <Component {...pageProps} />;
    </UserContext.Provider>
  );
}

export default MyApp;
