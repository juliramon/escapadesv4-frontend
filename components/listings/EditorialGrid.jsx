import AdSlot from "../ads/AdSlot";
import EditorialCard from "./EditorialCard";

/**
 * Graella per als llistats editorials (històries i llistes).
 *
 * Fa el mateix paper que `ListingGrid` per a experiències i allotjaments:
 * targeta única, esquelet de càrrega i espais publicitaris in-feed. Aquestes
 * són, a més, les pàgines que porten al contingut amb més anuncis, o sigui que
 * val la pena que es vegin igual de bé que la resta.
 */

const DEFAULT_AD_POSITIONS = [4, 12];

const Skeleton = () => (
	<div className="w-full" role="status">
		<div className="aspect-w-4 aspect-h-3">
			<div className="w-full h-full bg-gray-100 rounded-2xl animate-pulse" />
		</div>
		<div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse mt-3" />
		<div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse mt-2" />
		<span className="sr-only">Carregant...</span>
	</div>
);

const EditorialGrid = ({
	items = [],
	basePath,
	badge,
	isLoading = false,
	skeletonCount = 8,
	eagerCount = 4,
	adPositions = DEFAULT_AD_POSITIONS,
	showAds = true,
	className = "",
}) => {
	const gridClassName = `grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5 ${className}`;

	if (isLoading || items.length === 0) {
		return (
			<div className={gridClassName}>
				{Array.from({ length: skeletonCount }).map((_, idx) => (
					<Skeleton key={idx} />
				))}
			</div>
		);
	}

	const cells = [];

	items.forEach((item, index) => {
		cells.push(
			<EditorialCard
				key={item._id || item.slug}
				href={`${basePath}/${item.slug}`}
				cover={item.cover}
				title={item.title}
				subtitle={item.subtitle}
				date={item.createdAt}
				badge={badge}
				eager={index < eagerCount}
			/>
		);

		if (showAds && adPositions.includes(index + 1)) {
			cells.push(
				<AdSlot
					key={`in-feed-${index}`}
					placement="inFeed"
					containerClassName="rounded-2xl bg-gray-50 p-3"
				/>
			);
		}
	});

	return <div className={gridClassName}>{cells}</div>;
};

export default EditorialGrid;
