import ActivityList, { getActivitiesPageProps } from "../../activitats.js";
import { readPageParam } from "../../../utils/pagination";

/**
 * Tandes 2 i següents del llistat d'activitats (`/activitats/pagina/{n}`).
 * Són l'enllaç del botó «Veure'n més».
 */
export async function getServerSideProps({ params }) {
	const { page, ...outcome } = readPageParam(params.pagina, "/activitats");
	if (!page) return outcome;
	return getActivitiesPageProps(page);
}

export default ActivityList;
