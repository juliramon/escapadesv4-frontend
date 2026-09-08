import FetchingSpinner from "../components/global/FetchingSpinner";
import TripEntryForm from "../components/forms/TripEntryForm";
import useContentFormGuard from "../hooks/useContentFormGuard";

/**
 * Crear una entrada de viatge. Tota la lògica viu a `TripEntryForm`, que
 * comparteix amb la pàgina d'editar.
 */
const NewTripEntry = () => {
	const { loadPage } = useContentFormGuard();

	if (!loadPage) return <FetchingSpinner />;

	return <TripEntryForm mode="create" />;
};

export default NewTripEntry;
