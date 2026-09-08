import EditorialGrid from "../listings/EditorialGrid";
import ListingGrid from "../listings/ListingGrid";
import SectionHeading from "../homepage/SectionHeading";

/**
 * Bloc de contingut relacionat del peu de les fitxes.
 *
 * És la sortida natural de qui arriba a una fitxa des de cerca i no acaba de
 * decidir-se: sense això, la fitxa és un cul-de-sac. Serveix tant per a
 * escapades (targeta de llistat) com per a històries i llistes (targeta
 * editorial).
 */
const RelatedListings = ({
	eyebrow,
	title,
	description,
	href,
	linkLabel,
	items = [],
	variant = "listing",
	basePath,
	badge,
	limit = 4,
}) => {
	const visibleItems = items.slice(0, limit);
	if (!visibleItems.length) return null;

	return (
		<section className="related-listings">
			<div className="container">
				<div className="related-listings__inner">
					<SectionHeading
						eyebrow={eyebrow}
						title={title}
						description={description}
						href={href}
						linkLabel={linkLabel}
					/>
					<div className="mt-6 md:mt-8">
						{variant === "editorial" ? (
							<EditorialGrid
								items={visibleItems}
								basePath={basePath}
								badge={badge}
								showAds={false}
								eagerCount={0}
							/>
						) : (
							<ListingGrid
								items={visibleItems}
								showAds={false}
								eagerCount={0}
							/>
						)}
					</div>
				</div>
			</div>
		</section>
	);
};

export default RelatedListings;
