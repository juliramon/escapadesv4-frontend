import FetchingSpinner from "../components/global/FetchingSpinner";
import StoryForm from "../components/forms/StoryForm";
import useContentFormGuard from "../hooks/useContentFormGuard";

/**
 * Publicar una història. La lògica viu a `StoryForm`, compartida amb la
 * pàgina d'editar.
 */
const NewStory = () => {
	const { loadPage } = useContentFormGuard();

	if (!loadPage) return <FetchingSpinner />;

	return <StoryForm mode="create" />;
};

export default NewStory;
