import { useState } from "react";
import { analyzeListingSeo } from "../../utils/seo";
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

	// Puntuació de SEO de la fila. Les categories de viatge no tenen
	// `metaTitle` ni `metaDescription`, i tampoc subtítol: la pàgina pública
	// fa servir el títol i el text SEO de capçalera com a metes.
	const seo = analyzeListingSeo({
		title: entity.title,
		subtitle: entity.subtitle,
		metaTitle: entity.title,
		metaDescription: entity.seoTextHeader,
		slug: entity.slug,
		hasCover: Boolean(entity.image),
	});

	const removeItem = () =>
		service.removeTripCategory(entity.id).then(() => fetchData());

	return (
		<EntityRow
			href={`/viatges/${entity.slug}`}
			image={entity.image}
			title={entity.title}
			subtitle={entity.subtitle}
			seo={seo}
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
