import ListsList, { getListsPageProps } from "../../llistes.jsx";
import { readPageParam } from "../../../utils/pagination";

/**
 * Tandes 2 i següents del llistat de llistes (`/llistes/pagina/{n}`). Són
 * l'enllaç del botó «Veure'n més».
 */
export async function getServerSideProps({ params }) {
	const { page, ...outcome } = readPageParam(params.pagina, "/llistes");
	if (!page) return outcome;
	return getListsPageProps(page);
}

export default ListsList;
