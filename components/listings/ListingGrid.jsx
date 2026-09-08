import AdSlot from "../ads/AdSlot";
import PublicSquareBox from "./PublicSquareBox";
import { firstDefined } from "../../utils/listingProps";

/**
 * Graella de fitxes compartida per tots els llistats.
 *
 * Abans cada pàgina repetia la mateixa graella, el mateix esquelet de càrrega
 * i la seva pròpia manera de calcular la ubicació. Unificar-ho permet que
 * qualsevol millora de la targeta arribi de cop a experiències, allotjaments,
 * categories, destinacions i cerca.
 *
 * Els anuncis in-feed ocupen una cel·la de la graella (no una fila sencera):
 * així no trenquen el ritme de lectura i, si AdSense no els omple, la graella
 * es tanca sola perquè `AdSlot` s'amaga.
 */

/** Després de la primera i de la tercera fila en escriptori (4 columnes). */
const DEFAULT_AD_POSITIONS = [4, 12];

const resolveLocation = (item) => {
	if (item.type === "place") {
		return firstDefined(
			item.place_locality,
			item.place_province,
			item.place_state,
			item.place_country
		);
	}
	return firstDefined(
		item.activity_locality,
		item.activity_state,
		item.activity_province,
		item.activity_country
	);
};

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

const ListingGrid = ({
	items = [],
	isLoading = false,
	skeletonCount = 8,
	eagerCount = 4,
	adPositions = DEFAULT_AD_POSITIONS,
	showAds = true,
	className = "",
	// Algunes pàgines ja tenen la seva pròpia graella amb estats buits i botó
	// de "carregar-ne més" a dins; allà només cal que hi posem les cel·les.
	cellsOnly = false,
}) => {
	const gridClassName = `grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5 ${className}`;
	const wrap = (children) =>
		cellsOnly ? <>{children}</> : <div className={gridClassName}>{children}</div>;

	if (isLoading || items.length === 0) {
		return wrap(
			Array.from({ length: skeletonCount }).map((_, idx) => (
				<Skeleton key={idx} />
			))
		);
	}

	const cells = [];

	items.forEach((item, index) => {
		cells.push(
			<PublicSquareBox
				key={item._id || item.slug}
				type={item.type}
				slug={item.slug}
				cover={item.cover}
				title={item.title}
				rating={item.activity_rating || item.place_rating}
				price={item.price}
				placeType={item.placeType}
				categoria={item.categories}
				duration={item.duration}
				location={resolveLocation(item)}
				isVerified={item.isVerified}
				priority={index < eagerCount ? "eager" : "lazy"}
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

	return wrap(cells);
};

export default ListingGrid;
