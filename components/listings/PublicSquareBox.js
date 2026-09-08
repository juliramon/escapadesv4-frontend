import Link from "next/link";
import { cloudinaryImage } from "../../utils/cloudinary";
import { listingPath, resolveCategoryRoute } from "../../utils/listingRoutes";


const PLACE_TYPES = [
	{ match: "hotel", label: "Hotel" },
	{ match: "casarural", label: "Casa rural" },
	{ match: "apartament", label: "Apartament" },
	{ match: "carabana", label: "Caravana" },
	{ match: "casaarbre", label: "Casa als arbres" },
	{ match: "refugi", label: "Refugi" },
	{ match: "camping", label: "Càmping" },
];

/** Text pla d'un `location` que pot ser cadena o element de React. */
const extractText = (node) => {
	if (node === null || node === undefined || typeof node === "boolean")
		return "";
	if (typeof node === "string" || typeof node === "number")
		return String(node);
	if (Array.isArray(node)) return node.map(extractText).join("");
	if (node.props) return extractText(node.props.children);
	return "";
};

const PublicSquareBox = ({
	type,
	slug,
	cover,
	placeType,
	title,
	duration,
	isVerified,
	location,
	categoria,
	rating,
	price,
	priority,
}) => {
	const isPlace = type === "place";

	const category = resolveCategoryRoute(categoria);
	const href = listingPath({ slug, type, categories: categoria });

	const placeTypeLabel =
		placeType && placeType.length > 0
			? PLACE_TYPES.find((entry) => placeType[0].includes(entry.match))
					?.label
			: null;

	const image = cloudinaryImage(cover, 457, 343);
	const formattedRating =
		typeof rating === "number" && rating > 0
			? Number.isInteger(rating)
				? `${rating}.0`
				: `${rating}`
			: null;

	// Una sola etiqueta sobre la imatge: amb dues es solapaven amb el segell
	// de "Verificada" en columnes estretes.
	const mediaBadge = isPlace
		? placeTypeLabel || "Allotjament"
		: category?.label || "Activitat";

	// La ubicació pot arribar com a element buit des dels llistats antics.
	const locationText = extractText(location);
	const hasLocation = locationText.trim().length > 0;

	return (
		<article className="listing-card group">
			<Link href={href}>
				<a title={title} className="listing-card__link">
					<div className="listing-card__media">
						<picture className="block w-full h-full aspect-w-4 aspect-h-3">
							{image.webp ? (
								<source srcSet={image.webp} type="image/webp" />
							) : null}
							<img
								src={image.src}
								alt={title}
								className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
								width={457}
								height={343}
								loading={priority === "eager" ? "eager" : "lazy"}
							/>
						</picture>

						<span className="listing-card__badges">
							<span className="listing-card__badge">
								{mediaBadge}
							</span>
						</span>

						{isVerified ? (
							<span className="listing-card__verified">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="text-[#57A1FE]"
									width={16}
									height={16}
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path
										stroke="none"
										d="M0 0h24v24H0z"
										fill="none"
									></path>
									<path
										d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z"
										strokeWidth={0}
										fill="currentColor"
									></path>
								</svg>
								Verificada
							</span>
						) : null}
					</div>

					<div className="listing-card__body">
						<h3 className="listing-card__title">{title}</h3>
						{hasLocation ? (
							<span className="listing-card__location">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width={14}
									height={14}
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth={1.5}
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path
										stroke="none"
										d="M0 0h24v24H0z"
										fill="none"
									/>
									<circle cx="12" cy="11" r="3" />
									<path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
								</svg>
								{location}
								{!isPlace && duration ? (
									<span className="text-grey-300">
										&nbsp;· {duration} h
									</span>
								) : null}
							</span>
						) : null}

						<div className="listing-card__footer">
							{formattedRating ? (
								<span className="listing-card__rating">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="14"
										height="14"
										viewBox="0 0 24 24"
										strokeWidth="1.5"
										stroke="#fbbf24"
										fill="#fbbf24"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path
											stroke="none"
											d="M0 0h24v24H0z"
											fill="none"
										/>
										<path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
									</svg>
									{formattedRating}
									<span className="text-grey-300">/5</span>
								</span>
							) : (
								<span />
							)}

							{price ? (
								<span className="listing-card__price">
									<strong>{price} €</strong>
									<span className="listing-card__price-unit">
										{isPlace
											? "/ persona i nit"
											: "/ persona"}
									</span>
								</span>
							) : (
								<span className="listing-card__more">
									Veure'n més
								</span>
							)}
						</div>
					</div>
				</a>
			</Link>
		</article>
	);
};

export default PublicSquareBox;
