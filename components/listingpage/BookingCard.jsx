import ListingDiscount from "./ListingDiscount";
import { hasLink, resolveAffiliate } from "../../utils/affiliate";

/**
 * Bloc de reserva de la fitxa d'allotjament i d'activitat.
 *
 * Abans el botó quedava al final d'una targeta llarga, després de la història
 * relacionada i de la graella de dades, i deia només "Reservar". Aquí puja a
 * dalt de tot de la columna, amb el preu, la valoració i el destí real de
 * l'enllaç, que és el que fa que la gent hi cliqui.
 *
 * A mòbil es repeteix com a barra fixa a peu de pantalla, amb el preu a
 * l'esquerra i el botó a la dreta.
 */

const GlobeIcon = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={20}
		height={20}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={1.5}
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<path stroke="none" d="M0 0h24v24H0z" fill="none" />
		<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
		<path d="M3.6 9h16.8" />
		<path d="M3.6 15h16.8" />
		<path d="M11.5 3a17 17 0 0 0 0 18" />
		<path d="M12.5 3a17 17 0 0 1 0 18" />
	</svg>
);

const PhoneIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="mr-1.5"
		width={20}
		height={20}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={1.5}
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path stroke="none" d="M0 0h24v24H0z" fill="none" />
		<path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
	</svg>
);

const BookingCard = ({
	type,
	price,
	rating,
	isVerified,
	website,
	phone,
	discountCode,
	discountInfo,
}) => {
	const isPlace = type === "place";
	const affiliate = resolveAffiliate(website);
	const showWebsite = hasLink(website);
	const showPhone = hasLink(phone);

	if (!showWebsite && !showPhone) return null;

	const ctaLabel = affiliate
		? `${isPlace ? "Veure preus a" : "Reservar a"} ${affiliate.label}`
		: isPlace
		? "Veure disponibilitat"
		: "Anar a la web oficial";

	const ctaNote = affiliate
		? `S'obre ${affiliate.label} en una pestanya nova. Hi veureu el preu final i la disponibilitat de les vostres dates.`
		: isPlace
		? "S'obre la web de l'allotjament en una pestanya nova."
		: "S'obre la web oficial en una pestanya nova.";

	const priceUnit = isPlace ? "per persona i nit" : "per persona";

	const priceBlock = price ? (
		<div className="booking-card__price">
			<span className="booking-card__price-label">Des de</span>
			<span className="booking-card__price-value">{price} €</span>
			<span className="booking-card__price-unit">{priceUnit}</span>
		</div>
	) : null;

	const trustRow =
		rating || isVerified ? (
			<div className="booking-card__trust">
				{rating ? (
					<span className="booking-card__rating">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width={16}
							height={16}
							viewBox="0 0 24 24"
							strokeWidth="1.5"
							stroke="#fbbf24"
							fill="#fbbf24"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
						</svg>
						{rating}
						<span className="text-grey-300">/5</span>
					</span>
				) : null}
				{isVerified ? (
					<span className="booking-card__verified">
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
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<path
								d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z"
								strokeWidth={0}
								fill="currentColor"
							/>
						</svg>
						Verificada
					</span>
				) : null}
			</div>
		) : null;

	const ctaButton = showWebsite ? (
		<a
			href={website}
			className="button button__cta button__med w-full justify-center"
			title={ctaLabel}
			target="_blank"
			rel="nofollow noreferrer"
		>
			<GlobeIcon className="mr-2 shrink-0" />
			{ctaLabel}
		</a>
	) : null;

	return (
		<>
			{/* Targeta de la columna lateral (escriptori) */}
			<div className="booking-card">
				{priceBlock}
				{trustRow}

				<div className="booking-card__actions">
					{ctaButton}
					{showPhone ? (
						<a
							href={`tel:${phone}`}
							className="button button__ghost button__med w-full justify-center"
							title="Trucar"
							rel="nofollow noreferrer"
						>
							<PhoneIcon />
							Trucar
						</a>
					) : null}
				</div>

				{showWebsite ? (
					<p className="booking-card__note">{ctaNote}</p>
				) : null}

				{price ? (
					<p className="booking-card__disclaimer">
						Preu orientatiu calculat per nosaltres. Pot variar
						segons les dates i no sempre està actualitzat.
					</p>
				) : null}

				{discountCode ? (
					<ListingDiscount
						discountCode={discountCode}
						discountInfo={discountInfo}
					/>
				) : null}
			</div>

			{/* Barra fixa (mòbil) */}
			{ctaButton ? (
				<div className="booking-bar">
					{price ? (
						<div className="booking-bar__price">
							<span className="booking-bar__price-value">
								{price} €
							</span>
							<span className="booking-bar__price-unit">
								{priceUnit}
							</span>
						</div>
					) : null}
					<div className="booking-bar__action">
						<a
							href={website}
							className="button button__cta button__med w-full justify-center"
							title={ctaLabel}
							target="_blank"
							rel="nofollow noreferrer"
						>
							{affiliate
								? `Veure a ${affiliate.label}`
								: isPlace
								? "Veure disponibilitat"
								: "Anar a la web"}
						</a>
					</div>
				</div>
			) : null}
		</>
	);
};

export default BookingCard;
