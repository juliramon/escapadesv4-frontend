import Head from "next/head";

/**
 * Bloc JSON-LD.
 *
 * Fins ara cada component escrivia el JSON a mà, amb el títol i la descripció
 * interpolats dins d'una cadena: n'hi havia prou amb unes cometes dobles a un
 * títol perquè el JSON quedés trencat i Google no en llegís res (passava, per
 * exemple, a la fitxa del Mas Farner). Aquí es construeix un objecte i el
 * serialitza `JSON.stringify`, que escapa el que calgui.
 *
 * `<` es codifica perquè un "</script>" dins d'un text no pugui tancar
 * l'etiqueta abans d'hora.
 */
const JsonLd = ({ data }) => {
	if (!data) return null;

	return (
		<Head>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(data).replace(/</g, "\\u003c"),
				}}
			/>
		</Head>
	);
};

export default JsonLd;
