import FetchingSpinner from "../components/global/FetchingSpinner";
import ListForm from "../components/forms/ListForm";
import useContentFormGuard from "../hooks/useContentFormGuard";

/**
 * Crear una llista. Tota la lògica viu a `ListForm`, que comparteix amb la
 * pàgina d'editar.
 */
const NewList = () => {
	const { loadPage } = useContentFormGuard();

	if (!loadPage) return <FetchingSpinner />;

	return <ListForm mode="create" />;
};

export default NewList;
