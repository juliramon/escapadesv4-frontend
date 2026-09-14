import DestinationPage, {
	getDestinationPageProps,
} from "../../[destination].js";
import { readPageParam } from "../../../../utils/pagination";

/**
 * Tandes 2 i següents del llistat d'una destinació
 * (`/destinacions/{destinacio}/pagina/{n}`). Són l'enllaç del botó
 * «Veure'n més».
 */
export async function getStaticPaths() {
	return { paths: [], fallback: "blocking" };
}

export async function getStaticProps({ params }) {
	const { page, ...outcome } = readPageParam(
		params.pagina,
		`/destinacions/${params.destination}`,
	);
	if (!page) return outcome;
	return getDestinationPageProps(params.destination, page);
}

export default DestinationPage;
