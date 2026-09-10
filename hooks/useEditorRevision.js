import { useEffect, useState } from "react";

/**
 * Comptador que avança quan es toca qualsevol editor de text ric.
 *
 * TipTap guarda el contingut dins seu i no a l'estat de React: escriure al cos
 * d'una publicació no provoca cap render. Sense això, ni l'autoguardat ni els
 * indicadors de SEO s'assabentarien mai que el text ha canviat.
 *
 * El comptador va endarrerit uns quants centenars de mil·lisegons perquè
 * teclejar no faci un render per pulsació.
 *
 * @param {Array<object|null>} editors editors de TipTap, poden ser null al primer render
 * @param {number} [delay] espera abans de comptar el canvi
 * @returns {number}
 */
const useEditorRevision = (editors, delay = 600) => {
	const [revision, setRevision] = useState(0);
	// Les instàncies d'editor arriben després del primer render; el que ens
	// interessa és tornar a subscriure'ns quan passen de null a instància.
	const signature = editors.map((editor) => (editor ? "1" : "0")).join("");

	useEffect(() => {
		const active = editors.filter(Boolean);
		if (!active.length) return undefined;

		let timer = null;
		const bump = () => {
			if (timer) clearTimeout(timer);
			timer = setTimeout(() => setRevision((value) => value + 1), delay);
		};

		active.forEach((editor) => editor.on("update", bump));
		return () => {
			if (timer) clearTimeout(timer);
			active.forEach((editor) => editor.off("update", bump));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [signature, delay]);

	return revision;
};

export default useEditorRevision;
