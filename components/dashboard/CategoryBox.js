import { useState } from "react";
import { analyzeListingSeo } from "../../utils/seo";
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

	// Puntuació de SEO de la fila. Les categories no tenen `metaTitle` ni
	// `metaDescription`: la pàgina pública fa servir el títol i el subtítol com
	// a metes, o sigui que és això el que es puntua.
	const seo = analyzeListingSeo({
		title: entity.title,
		subtitle: entity.subtitle,
		metaTitle: entity.title,
		metaDescription: entity.subtitle,
		slug: entity.slug,
		hasCover: Boolean(entity.image),
	});

	const removeItem = () =>
		service.removeCategory(entity.id).then(() => fetchData());

	return (
		<EntityRow
			href={`/${entity.slug}`}
			image={entity.image}
			title={entity.title}
			subtitle={entity.subtitle}
			seo={seo}
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
