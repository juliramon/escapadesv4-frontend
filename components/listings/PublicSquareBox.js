import Link from "next/link";

const PublicSquareBox = ({
	id,
	type,
	cover_url,
	title,
	subtitle,
	rating,
	location,
}) => {
	let shortenedSubtitle = subtitle.slice(0, 70);
	let linkPath;
	if (type === "activity") {
		linkPath = "activitats";
	} else if (type === "place") {
		linkPath = "allotjaments";
	}
	return (
		<div id="listingSquareBox">
			<Link href={`/${linkPath}/${id}`}>
				<a className="listing-box-wrapper">
					<div
						className="listing-cover"
						style={{backgroundImage: `url('${cover_url}')`}}
					></div>
					<div className="listing-rating-wrapper">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="icon icon-tabler icon-tabler-star"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							strokeWidth="1.5"
							stroke="#2c3e50"
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path stroke="none" d="M0 0h24v24H0z" />
							<path
								fill="#abc3f4"
								stroke="none"
								d="M12 17.75l-6.172 3.245 1.179-6.873-4.993-4.867 6.9-1.002L12 2l3.086 6.253 6.9 1.002-4.993 4.867 1.179 6.873z"
							/>
						</svg>
						<span className="listing-rating">{rating}</span>
					</div>
					<h3 className="listing-title">{title}</h3>
					<p className="listing-subtitle">{shortenedSubtitle}...</p>
					{location}
				</a>
			</Link>
		</div>
	);
};

export default PublicSquareBox;
