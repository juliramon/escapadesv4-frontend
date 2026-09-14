import "../styles/app.scss";

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

	// El servidor no té accés a localStorage: si l'usuari desat es llegia
	// durant el render, el primer render del client no coincidia amb l'HTML
	// del servidor i React el llençava sencer. Es llegeix després de muntar;
	// fins llavors `userReady` és fals i les pàgines privades no redirigeixen.
	const [state, setState] = useState({
		loggedUser: undefined,
		userReady: false,
	});

	useEffect(() => {
		let storedUser;
		try {
			storedUser = JSON.parse(window.localStorage.getItem("loggedInUser"));
		} catch (error) {
			storedUser = null;
		}
		setState((previous) => ({
			...previous,
			loggedUser: storedUser || undefined,
			userReady: true,
		}));
	}, []);

	// let cookieCreationDate = new Date();
	// let cookieExpirationDate = new Date();
	// cookieExpirationDate.setFullYear(cookieCreationDate.getFullYear() + 1);

	const getLoggedUser = (user) => {
		if (typeof window !== "undefined") {
			setState({ ...state, userFetched: true });
			window.localStorage.setItem("loggedInUser", JSON.stringify(user));
			Router.push("/2i8ZXlkM4cFKUPBrm3-admin-panel");
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
			window.localStorage.setItem(
				"loggedInUser",
				JSON.stringify(updatedUser)
			);
			setState({ ...state, loggedUser: updatedUser });
		}
	};

	return (
		<UserContext.Provider
			value={{
				user: state.loggedUser,
				userReady: state.userReady,
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
