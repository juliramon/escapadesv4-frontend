import { useEffect, useState } from "react";
import FetchingSpinner from "../../../components/global/FetchingSpinner";
import StoryForm from "../../../components/forms/StoryForm";
import ContentService from "../../../services/contentService";
import useContentFormGuard from "../../../hooks/useContentFormGuard";

/** Editar una història: resol les dades i delega al formulari compartit. */
const EditStory = () => {
	const { loadPage, router } = useContentFormGuard();
	const [story, setStory] = useState(null);

	useEffect(() => {
		if (!router.query.slug) return;

		const service = new ContentService();
		const fetchData = async () => {
			try {
				const details = await service.getStoryDetails(
					router.query.slug
				);
				setStory(details);
			} catch (error) {
				console.error(error);
			}
		};
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.query.slug]);

	if (!loadPage || !story) return <FetchingSpinner />;

	return <StoryForm mode="edit" initialData={story} />;
};

export default EditStory;
