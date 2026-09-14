/**
 * Paginació enllaçable dels llistats.
 *
 * El botó «Veure'n més» només carregava la tanda següent per JavaScript: les
 * entrades que no sortien a la primera no tenien cap enllaç que Google pogués
 * seguir, i només les coneixia pel sitemap. Ara cada tanda té la seva URL. La
 * primera és la del llistat i la resta, `{llistat}/pagina/{n}`; el botó és un
 * enllaç a la següent i, amb JavaScript, continua afegint resultats sense
 * canviar de pàgina (`LoadMoreLink`).
 *
 * A l'URL les pàgines comencen per 1; a l'API, per 0.
 */

const PAGE_SEGMENT = "pagina";

/** Camí de la pàgina `page` d'un llistat. La 1 és el mateix llistat. */
const pagePath = (basePath, page) =>
	page > 1 ? `${basePath}/${PAGE_SEGMENT}/${page}` : basePath;

/** Títol de la pàgina `page`, perquè no se'n repeteixi cap entre tandes. */
const pageTitle = (title, page) =>
	page > 1 ? `${title} · Pàgina ${page}` : title;

/**
 * Número de pàgina del segment d'URL, o la resposta que ha de donar la ruta:
 * `/pagina/1` redirigeix al llistat, que és la URL canònica d'aquesta tanda, i
 * tot el que no sigui un enter positiu dona 404.
 *
 * @returns {{page: number} | {redirect: object} | {notFound: true}}
 */
const readPageParam = (value, basePath) => {
	const raw = String(value ?? "");
	if (!/^[1-9]\d*$/.test(raw)) return { notFound: true };
	const page = Number(raw);
	if (page === 1) {
		return { redirect: { destination: basePath, permanent: true } };
	}
	return { page };
};

export { pagePath, pageTitle, readPageParam };
