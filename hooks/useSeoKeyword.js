import { useCallback, useEffect, useState } from "react";

/**
 * Paraula clau objectiu d'una publicació.
 *
 * Serveix per comprovar on surt —títol, meta descripció, slug i entrada del
 * text— i es queda al navegador: el model de dades no té cap camp on desar-la
 * i no val la pena inventar-se'n un només per a una comprovació d'edició.
 *
 * @param {string|null} key identificador de la publicació ("story:<id>")
 * @returns {[string, (value: string) => void]}
 */
const STORAGE_PREFIX = "escapades:seo-keyword:";

const useSeoKeyword = (key) => {
	const [keyword, setKeyword] = useState("");

	useEffect(() => {
		if (!key || typeof window === "undefined") return;
		try {
			setKeyword(window.localStorage.getItem(STORAGE_PREFIX + key) || "");
		} catch (error) {
			console.error(error);
		}
	}, [key]);

	const updateKeyword = useCallback(
		(value) => {
			setKeyword(value);
			if (!key || typeof window === "undefined") return;
			try {
				if (value) {
					window.localStorage.setItem(STORAGE_PREFIX + key, value);
				} else {
					window.localStorage.removeItem(STORAGE_PREFIX + key);
				}
			} catch (error) {
				console.error(error);
			}
		},
		[key],
	);

	return [keyword, updateKeyword];
};

export default useSeoKeyword;
