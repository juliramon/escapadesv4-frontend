import "../styles/globals.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-quill/dist/quill.bubble.css";
import "react-photoswipe/lib/photoswipe.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
// import { useCookies } from "react-cookie";
import Cookies from "js-cookie";
import UserContext from "../contexts/UserContext";
import AuthService from "../services/authService";
import * as ga from "../lib/ga";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  // const [cookies, setCookie, removeCookie] = useCookies("");
  let loggedData;
  if (Cookies.get("loggedInUser") && Cookies.get("loggedInUser") !== null) {
    loggedData = Cookies.get("loggedInUser");
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
    Cookies.set("loggedInUser", JSON.parse(user), {
      expires: cookieExpirationDate,
    });
    Router.push("/feed");
  };

  const getNewUser = (user) => {
    setState({ ...state, userFetched: true });
    Cookies.set("loggedInUser", user, { expires: cookieExpirationDate });
    if (user !== undefined || user !== "null") {
      if (router.components["/empreses/registre"]) {
        router.push("/empreses/registre?step=informacio-empresa");
      }
      router.push("/signup/confirmacio-correu");
    }
  };

  useEffect(() => {
    if (state.userFetched) {
      setState({
        ...state,
        loggedUser: JSON.parse(Cookies.get("loggedInUser")),
      });
    }
  }, [Cookies]);

  const logOut = () => {
    const service = new AuthService();
    service
      .logout()
      .then(() => {
        // setCookie("loggedInUser", undefined, { expires: cookieExpirationDate });
        setState({ ...state, loggedUser: undefined });
        Cookies.remove("loggedInUser");
        Router.push("/login");
      })
      .catch((err) => console.error(err));
  };

  const refreshUserData = (updatedUser) => {
    console.log("REFERSHING USER DATA =>", updatedUser);
    Cookies.remove("loggedInUser");
    Cookies.set("loggedInUser", updatedUser, { expires: cookieExpirationDate });
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
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}

export default MyApp;
