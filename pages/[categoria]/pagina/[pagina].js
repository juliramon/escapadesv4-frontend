import CategoryPage, { getCategoryPageProps } from "../../[categoria].js";
import { readPageParam } from "../../../utils/pagination";

/**
 * Tandes 2 i següents del llistat d'una categoria (`/{categoria}/pagina/{n}`).
 * Són l'enllaç del botó «Veure'n més»: sense elles, Google només arribava a
 * les fitxes de cada categoria pel sitemap.
 */
export async function getStaticPaths() {
	return { paths: [], fallback: "blocking" };
}

export async function getStaticProps({ params, locale }) {
	const { page, ...outcome } = readPageParam(
		params.pagina,
		`/${params.categoria}`,
	);
	if (!page) return outcome;
	return getCategoryPageProps(params.categoria, page, locale);
}

export default CategoryPage;
