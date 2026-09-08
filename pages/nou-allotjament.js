import FetchingSpinner from "../components/global/FetchingSpinner";
import ListingForm from "../components/forms/ListingForm";
import useContentFormGuard from "../hooks/useContentFormGuard";

/**
 * Crear un allotjament. Tota la lògica viu a `ListingForm`, que comparteix
 * amb la pàgina d'editar i amb les fitxes d'experiència.
 */
const NewPlace = () => {
	const { loadPage } = useContentFormGuard();

	if (!loadPage) return <FetchingSpinner />;

	return <ListingForm variant="place" mode="create" />;
};

export default NewPlace;
