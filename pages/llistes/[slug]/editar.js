import { useEffect, useState } from "react";
import FetchingSpinner from "../../../components/global/FetchingSpinner";
import ListForm from "../../../components/forms/ListForm";
import ContentService from "../../../services/contentService";
import useContentFormGuard from "../../../hooks/useContentFormGuard";

/**
 * Editar una llista. Només resol les dades; el formulari és el mateix que fa
 * servir la pàgina de crear.
 */
const EditList = () => {
	const { loadPage, router } = useContentFormGuard();
	const [list, setList] = useState(null);

	useEffect(() => {
		if (!router.query.slug) return;

		const service = new ContentService();
		const fetchData = async () => {
			try {
				const details = await service.getListDetails(router.query.slug);
				setList(details);
			} catch (error) {
				console.error(error);
			}
		};
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.query.slug]);

	if (!loadPage || !list) return <FetchingSpinner />;

	return <ListForm mode="edit" initialData={list} />;
};

export default EditList;
