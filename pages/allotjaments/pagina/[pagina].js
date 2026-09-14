import PlaceList, { getPlacesPageProps } from "../../allotjaments.js";
import { readPageParam } from "../../../utils/pagination";

/**
 * Tandes 2 i següents del llistat d'allotjaments (`/allotjaments/pagina/{n}`).
 * Són l'enllaç del botó «Veure'n més».
 */
export async function getServerSideProps({ params }) {
	const { page, ...outcome } = readPageParam(params.pagina, "/allotjaments");
	if (!page) return outcome;
	return getPlacesPageProps(page);
}

export default PlaceList;
