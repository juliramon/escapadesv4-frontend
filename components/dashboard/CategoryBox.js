import { useState } from "react";
import ContentService from "../../services/contentService";
import TaxonomyModal from "../modals/TaxonomyModal";
import EntityRow from "../admin/EntityRow";

/**
 * Fila d'la categoria al panell d'administració.
 *
 * Tota la presentació viu a `EntityRow`; aquí només hi ha què s'esborra i
 * quin modal d'edició s'obre.
 */
const CategoryBox = ({ fetchData, ...entity }) => {
	const service = new ContentService();
	const [isEditOpen, setIsEditOpen] = useState(false);

	const removeItem = () =>
		service.removeCategory(entity.id).then(() => fetchData());

	return (
		<EntityRow
			href={`/${entity.slug}`}
			image={entity.image}
			title={entity.title}
			subtitle={entity.subtitle}
			onEdit={() => setIsEditOpen(true)}
			onRemove={removeItem}
			editModal={
				<TaxonomyModal
					entity="category"
					mode="edit"
					visibility={isEditOpen}
					hideModal={() => setIsEditOpen(false)}
					fetchData={fetchData}
					{...entity}
				/>
			}
		/>
	);
};

export default CategoryBox;
