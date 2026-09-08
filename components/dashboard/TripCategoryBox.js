import { useState } from "react";
import ContentService from "../../services/contentService";
import TripCategoryModal from "../modals/TripCategoryModal";
import EntityRow from "../admin/EntityRow";

/**
 * Fila d'la categoria de viatge al panell d'administració.
 *
 * Tota la presentació viu a `EntityRow`; aquí només hi ha què s'esborra i
 * quin modal d'edició s'obre.
 */
const TripCategoryBox = ({ fetchData, ...entity }) => {
	const service = new ContentService();
	const [isEditOpen, setIsEditOpen] = useState(false);

	const removeItem = () =>
		service.removeTripCategory(entity.id).then(() => fetchData());

	return (
		<EntityRow
			href={`/viatges/${entity.slug}`}
			image={entity.image}
			title={entity.title}
			subtitle={entity.subtitle}
			onEdit={() => setIsEditOpen(true)}
			onRemove={removeItem}
			editModal={
				<TripCategoryModal
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

export default TripCategoryBox;
