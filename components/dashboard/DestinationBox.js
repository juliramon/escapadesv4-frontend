import { useState } from "react";
import ContentService from "../../services/contentService";
import DestinationModal from "../modals/DestinationModal";
import EntityRow from "../admin/EntityRow";

/**
 * Fila d'la destinació al panell d'administració.
 *
 * Tota la presentació viu a `EntityRow`; aquí només hi ha què s'esborra i
 * quin modal d'edició s'obre.
 */
const DestinationBox = ({ fetchData, ...entity }) => {
	const service = new ContentService();
	const [isEditOpen, setIsEditOpen] = useState(false);

	const removeItem = () =>
		service.removeDestination(entity.id).then(() => fetchData());

	return (
		<EntityRow
			href={`/destinacions/${entity.slug}`}
			image={entity.image}
			title={entity.title}
			subtitle={entity.subtitle}
			onEdit={() => setIsEditOpen(true)}
			onRemove={removeItem}
			editModal={
				<DestinationModal
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

export default DestinationBox;
