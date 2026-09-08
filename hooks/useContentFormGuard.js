import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import UserContext from "../contexts/UserContext";

/**
 * Control d'accés i preparació de les pàgines de composició de contingut.
 *
 * Aquest bloc —comprovar la sessió, redirigir a login o a completar el compte,
 * i posar la classe de fons al `body`— estava copiat literalment a les deu
 * pàgines de crear i editar publicacions.
 *
 * La llista de rutes que activaven la classe del `body` era, a més, una
 * enumeració a mà que s'oblidava de la meitat de les pàgines (per exemple
 * `nova-llista` hi era a uns fitxers i a d'altres no). Ara la classe es posa
 * sempre que es fa servir aquest hook, que és exactament on toca.
 *
 * @returns {{user: object, loadPage: boolean, router: object}}
 */
const useContentFormGuard = () => {
	const { user } = useContext(UserContext);
	const router = useRouter();
	const [loadPage, setLoadPage] = useState(false);

	useEffect(() => {
		// Depèn de `user`: amb la llista buida només s'avaluava al primer
		// render, quan encara no s'ha resolt la sessió.
		if (user) setLoadPage(true);
	}, [user]);

	useEffect(() => {
		if (!user || user === "null" || user === undefined) {
			router.push("/login");
			return;
		}
		if (user.accountCompleted === false) {
			router.push("/signup/complete-account");
			return;
		}
		if (user.hasConfirmedEmail === false) {
			router.push("/signup/confirmacio-correu");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	useEffect(() => {
		document.querySelector("body").classList.add("bg-primary-100");
		return () => {
			document.querySelector("body").classList.remove("bg-primary-100");
		};
	}, []);

	return { user, loadPage, router };
};

export default useContentFormGuard;
