import "../styles/globals.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-quill/dist/quill.bubble.css";
import "react-photoswipe/lib/photoswipe.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
  if (typeof window !== "undefined") {
    let getLoggedUser = JSON.parse(window.localStorage.getItem("loggedInUser"));
    if (getLoggedUser && getLoggedUser !== null) {
      loggedData = getLoggedUser;
    }
  }

  const initialState = {
    loggedUser: loggedData,
  };

  const [state, setState] = useState(initialState);

  // let cookieCreationDate = new Date();
  // let cookieExpirationDate = new Date();
  // cookieExpirationDate.setFullYear(cookieCreationDate.getFullYear() + 1);

  const getLoggedUser = (user) => {
    if (typeof window !== "undefined") {
      setState({ ...state, userFetched: true });
      window.localStorage.setItem("loggedInUser", JSON.stringify(user));
      Router.push("/feed");
    }
  };

  const getNewUser = (user) => {
    if (typeof window !== "undefined") {
      setState({ ...state, userFetched: true });
      window.localStorage.setItem("loggedInUser", JSON.stringify(user));
      if (user !== undefined || user !== "null") {
        if (router.components["/empreses/registre"]) {
          router.push("/empreses/registre?step=informacio-empresa");
        }
        router.push("/signup/confirmacio-correu");
      }
    }
  };

  useEffect(() => {
    if (state.userFetched) {
      let loggedInUser = JSON.parse(
        window.localStorage.getItem("loggedInUser")
      );
      setState({
        ...state,
        loggedUser: loggedInUser,
        userFetched: false,
      });
    }
  }, [state]);

  const logOut = () => {
    if (typeof window !== "undefined") {
      const service = new AuthService();
      service
        .logout()
        .then(() => {
          setState({ ...state, loggedUser: undefined });
          window.localStorage.removeItem("loggedInUser");
          Router.push("/login");
        })
        .catch((err) => console.error(err));
    }
  };

  const refreshUserData = (updatedUser) => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("loggedInUser");
      window.localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
      setState({ ...state, loggedUser: updatedUser });
    }
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
