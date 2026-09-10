import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * Autoguardat local dels formularis de composició.
 *
 * Fins ara, tot el que s'escrivia en un formulari vivia només a la memòria de
 * la pestanya: un refresc sense voler, una sessió caducada o un error de
 * l'API i el text es perdia sencer.
 *
 * Aquest hook desa una còpia de l'esborrany al navegador cada cop que es
 * deixa d'escriure, i al tornar a obrir el formulari ofereix recuperar-la.
 * No toca el servidor: una publicació ja publicada no s'ha de sobreescriure
 * amb una frase a mitges (el desat al servidor el mana el botó de desar, que
 * és sempre a la vista).
 *
 * @param {object} options
 * @param {string|null} options.key identificador de l'esborrany ("story:new", "story:<id>"…)
 * @param {object} options.snapshot dades serialitzables del formulari
 * @param {boolean} [options.enabled] fals mentre el formulari encara es carrega
 * @param {number} [options.delay] espera sense escriure abans de desar
 */
const STORAGE_PREFIX = "escapades:draft:";

const storageKeyFor = (key) => `${STORAGE_PREFIX}${key}`;

const readStoredDraft = (key) => {
	if (typeof window === "undefined") return null;
	try {
		const raw = window.localStorage.getItem(storageKeyFor(key));
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (!parsed || typeof parsed !== "object" || !parsed.data) return null;
		return parsed;
	} catch (error) {
		console.error(error);
		return null;
	}
};

const removeStoredDraft = (key) => {
	if (typeof window === "undefined" || !key) return;
	try {
		window.localStorage.removeItem(storageKeyFor(key));
	} catch (error) {
		console.error(error);
	}
};

const useAutosaveDraft = ({ key, snapshot, enabled = true, delay = 1200 }) => {
	const [status, setStatus] = useState("idle");
	const [savedAt, setSavedAt] = useState(null);
	const [storedDraft, setStoredDraft] = useState(null);
	const [isDirty, setIsDirty] = useState(false);

	// Estat del formulari l'últim cop que es va desar de debò (al carregar-lo
	// o en desar al servidor). És contra això que es mesura si hi ha canvis.
	const baseline = useRef(null);
	const written = useRef(null);
	const serializedRef = useRef(null);
	// Còpia immediata de `isDirty`. L'avís de "tens canvis sense desar" es
	// consulta des d'un gestor d'esdeveniments, que no pot esperar el render
	// següent: en desar i redirigir, el ball d'estats encara no ha arribat i
	// l'avís sortiria just després d'haver desat.
	const dirtyRef = useRef(false);

	const setDirty = useCallback((value) => {
		dirtyRef.current = value;
		setIsDirty(value);
	}, []);

	const serialized = useMemo(() => {
		try {
			return JSON.stringify(snapshot);
		} catch (error) {
			console.error(error);
			return null;
		}
	}, [snapshot]);

	useEffect(() => {
		serializedRef.current = serialized;
	}, [serialized]);

	// La referència es pren al primer render en què el formulari ja té les
	// dades carregades; abans d'això qualsevol comparació donaria "brut".
	useEffect(() => {
		if (!enabled || serialized === null) return;
		if (baseline.current !== null) return;
		baseline.current = serialized;
	}, [enabled, serialized]);

	useEffect(() => {
		if (!key) return;
		setStoredDraft(readStoredDraft(key));
	}, [key]);

	// Un esborrany idèntic al que ja s'ha carregat no és res per recuperar.
	useEffect(() => {
		if (!storedDraft || !enabled || baseline.current === null) return;
		try {
			if (JSON.stringify(storedDraft.data) === baseline.current) {
				removeStoredDraft(key);
				setStoredDraft(null);
			}
		} catch (error) {
			console.error(error);
		}
	}, [storedDraft, enabled, key]);

	useEffect(() => {
		if (!enabled || !key || serialized === null) return undefined;
		if (baseline.current === null) return undefined;

		if (serialized === baseline.current) {
			setDirty(false);
			return undefined;
		}

		setDirty(true);
		if (serialized === written.current) return undefined;

		setStatus("pending");
		const timer = setTimeout(() => {
			try {
				window.localStorage.setItem(
					storageKeyFor(key),
					`{"savedAt":${Date.now()},"data":${serialized}}`,
				);
				written.current = serialized;
				setSavedAt(Date.now());
				setStatus("saved");
			} catch (error) {
				// Passa amb la quota plena o amb l'emmagatzematge bloquejat.
				console.error(error);
				setStatus("error");
			}
		}, delay);

		return () => clearTimeout(timer);
	}, [serialized, enabled, key, delay, setDirty]);

	/** Després de desar al servidor: el que hi ha a la pantalla passa a ser la referència. */
	const markSaved = useCallback(() => {
		baseline.current = serializedRef.current;
		written.current = null;
		setDirty(false);
		setStatus("idle");
		setSavedAt(null);
		removeStoredDraft(key);
		setStoredDraft(null);
	}, [key, setDirty]);

	const discardDraft = useCallback(() => {
		removeStoredDraft(key);
		setStoredDraft(null);
	}, [key]);

	/** Torna les dades de l'esborrany i amaga l'avís; qui el crida les aplica. */
	const restoreDraft = useCallback(() => {
		const data = storedDraft ? storedDraft.data : null;
		setStoredDraft(null);
		return data;
	}, [storedDraft]);

	return {
		status,
		savedAt,
		isDirty,
		dirtyRef,
		storedDraft,
		markSaved,
		discardDraft,
		restoreDraft,
	};
};

export default useAutosaveDraft;
export { STORAGE_PREFIX, readStoredDraft, removeStoredDraft };
