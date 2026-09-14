import CategoryTrip, { getTripCategoryPageProps } from "../../[categoria].jsx";
import { readPageParam } from "../../../../utils/pagination";

/**
 * Tandes 2 i següents de les publicacions d'un viatge
 * (`/viatges/{viatge}/pagina/{n}`). Són l'enllaç del botó «Veure'n més».
 */
export async function getServerSideProps({ params }) {
	const { page, ...outcome } = readPageParam(
		params.pagina,
		`/viatges/${params.categoria}`,
	);
	if (!page) return outcome;
	return getTripCategoryPageProps(params.categoria, page);
}

export default CategoryTrip;
