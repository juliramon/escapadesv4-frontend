import { useEffect, useState } from "react";
import FetchingSpinner from "../../../components/global/FetchingSpinner";
import ListingForm from "../../../components/forms/ListingForm";
import ContentService from "../../../services/contentService";
import useContentFormGuard from "../../../hooks/useContentFormGuard";

/**
 * Editar un allotjament. Només resol les dades; el formulari és el mateix
 * que fa servir la pàgina de crear.
 */
const EditPlace = () => {
	const { loadPage, router } = useContentFormGuard();
	const [place, setPlace] = useState(null);

	useEffect(() => {
		if (!router.query.slug) return;

		const service = new ContentService();
		const fetchData = async () => {
			try {
				const details = await service.getPlaceDetails(
					router.query.slug,
				);
				setPlace(details);
			} catch (error) {
				console.error(error);
			}
		};
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.query.slug]);

	if (!loadPage || !place) return <FetchingSpinner />;

	return <ListingForm variant="place" mode="edit" initialData={place} />;
};

export default EditPlace;
