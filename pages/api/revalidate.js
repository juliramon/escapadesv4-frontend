import Axios from "axios";

/**
 * Refresc sota demanda de les pàgines públiques.
 *
 * Les pàgines de detall es generen estàticament i es refresquen cada 120
 * segons: després de desar una fitxa des del panell, el canvi triga fins a dos
 * minuts a veure's i la primera visita d'aquesta finestra encara rep la versió
 * antiga. Els formularis criden aquesta ruta just després de desar i el canvi
 * es veu de seguida.
 *
 * Només per a administradors: la petició porta la galeta de sessió, que es
 * comprova contra l'API. Refrescar una pàgina no ensenya res que no sigui
 * públic, però sense la comprovació qualsevol podria fer regenerar pàgines a
 * voluntat.
 */

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_APP_API_URL;

/** Prou per a la pàgina que s'edita i els seus índexs. */
const MAX_PATHS = 12;

const VALID_PATH = /^\/[a-z0-9\-\/]*$/i;

const cleanPaths = (value) => {
	const paths = Array.isArray(value) ? value : [value];
	const unique = new Set();
	for (const item of paths) {
		const path = String(item || "").trim();
		if (!path || path.length > 200 || path.includes("//")) continue;
		if (!VALID_PATH.test(path)) continue;
		unique.add(path.length > 1 ? path.replace(/\/+$/, "") : path);
	}
	return [...unique].slice(0, MAX_PATHS);
};

const isAdmin = async (req) => {
	if (!API_URL) return false;
	try {
		const { data } = await Axios.get(`${API_URL}/auth/loggedin`, {
			headers: { cookie: req.headers.cookie || "" },
			withCredentials: true,
			timeout: 8000,
		});
		return data?.userType === "admin";
	} catch (error) {
		return false;
	}
};

export default async function handler(req, res) {
	if (req.method !== "POST") {
		res.setHeader("Allow", "POST");
		return res.status(405).json({ message: "Mètode no permès." });
	}

	const paths = cleanPaths(req.body?.paths);
	if (!paths.length) {
		return res.status(400).json({ message: "Cap ruta vàlida." });
	}
	if (!(await isAdmin(req))) {
		return res.status(403).json({ message: "Cal ser administrador." });
	}

	const revalidated = [];
	const failed = [];
	for (const path of paths) {
		try {
			await res.revalidate(path);
			revalidated.push(path);
		} catch (error) {
			// Una pàgina que encara no s'ha generat mai no es pot refrescar:
			// es generarà a la primera visita.
			failed.push({ path, message: error.message });
		}
	}
	return res.status(200).json({ revalidated, failed });
}
