import FetchingSpinner from "../components/global/FetchingSpinner";
import ListingForm from "../components/forms/ListingForm";
import useContentFormGuard from "../hooks/useContentFormGuard";

/**
 * Crear una experiència. Tota la lògica viu a `ListingForm`, que comparteix
 * amb la pàgina d'editar i amb les fitxes d'allotjament.
 */
const NewActivity = () => {
	const { loadPage } = useContentFormGuard();

	if (!loadPage) return <FetchingSpinner />;

	return <ListingForm variant="activity" mode="create" />;
};

export default NewActivity;
