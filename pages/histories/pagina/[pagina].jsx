import StoriesList, { getStoriesPageProps } from "../../histories.jsx";
import { readPageParam } from "../../../utils/pagination";

/**
 * Tandes 2 i següents del llistat d'històries (`/histories/pagina/{n}`). Són
 * l'enllaç del botó «Veure'n més».
 */
export async function getServerSideProps({ params }) {
	const { page, ...outcome } = readPageParam(params.pagina, "/histories");
	if (!page) return outcome;
	return getStoriesPageProps(page);
}

export default StoriesList;
