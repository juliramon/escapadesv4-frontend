import Link from "next/link";

const PublicSquareBox = ({
	type,
	slug,
	cover,
	placeType,
	title,
	duration,
	location,
	website,
	categoria,
	rating,
}) => {
	let secureWebsite, buttonLight;
	if (website.includes("https://") || website.includes("http://")) {
		secureWebsite = website;
	} else {
		secureWebsite = `https://${website}`;
	}

	let linkPath, tipus, icon;
	if (type === "activity") {
		tipus = "Activitat";
		icon = (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="icon icon-tabler icon-tabler-route"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				strokeWidth="1.5"
				stroke="#00206B"
				fill="none"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<circle cx="6" cy="19" r="2" />
				<circle cx="18" cy="5" r="2" />
				<path d="M12 19h4.5a3.5 3.5 0 0 0 0 -7h-8a3.5 3.5 0 0 1 0 -7h3.5" />
			</svg>
		);
		buttonLight = undefined;
	} else if (type === "place") {
		tipus = "Allotjament";
		icon = (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="icon icon-tabler icon-tabler-bed"
				width="18"
				height="18"
				viewBox="0 0 24 24"
				strokeWidth="1.5"
				stroke="#00206B"
				fill="none"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M3 7v11m0 -4h18m0 4v-8a2 2 0 0 0 -2 -2h-8v6" />
				<circle cx="7" cy="10" r="1" />
			</svg>
		);
		buttonLight = (
			<a
				href={secureWebsite}
				title="Reservar"
				className="button button__secondary button__med w-full justify-center"
				target="_blank"
				rel="nofollow"
			>
				Reservar
			</a>
		);
	}

	let categoryModified;
	if (categoria) {
		if (categoria[0].includes("romantica")) {
			categoryModified = "romàntica";
			linkPath = "escapades-romantiques";
		} else if (categoria[0].includes("gastronomica")) {
			categoryModified = "gastronòmica";
			linkPath = "escapades-gastronomiques";
		} else if (categoria[0].includes("aventura")) {
			categoryModified = `d'aventura`;
			linkPath = "escapades-aventura";
		} else if (categoria[0].includes("relax")) {
			categoryModified = "de relax";
			linkPath = "escapades-de-relax";
		} else if (categoria[0].includes("neu")) {
			categoryModified = "a la neu";
			linkPath = "escapades-a-la-neu";
		} else {
			categoryModified = "culturals";
			linkPath = "escapades-culturals";
		}
	}

	let placeTypeModified;
	if (placeType) {
		if (placeType[0].includes("hotel")) {
			placeTypeModified = "Hotel";
		} else if (placeType[0].includes("casarural")) {
			placeTypeModified = "Casa rural";
		} else if (placeType[0].includes("apartament")) {
			placeTypeModified = "Apartament";
		} else if (placeType[0].includes("carabana")) {
			placeTypeModified = "Carabana";
		} else if (placeType[0].includes("casaarbre")) {
			placeTypeModified = "Casa arbre";
		} else if (placeType[0].includes("refugi")) {
			placeTypeModified = "Refugi";
		} else if (placeType[0].includes("camping")) {
			placeTypeModified = "Càmping";
		}
	}

	let additionalInfoRef;
	if (duration) {
		additionalInfoRef = `${duration} hores`;
	} else {
		additionalInfoRef = placeTypeModified;
	}
	let modRating;
	if (rating && Number.isInteger(rating)) {
		modRating = `${rating.toString()}.0`;
	}

	const coverPath = cover.substring(0, 51);
	const imageId = cover.substring(63);
	const coverImg = `${coverPath}w_400,h_300,c_fill/${imageId}`;

	return (
		<article className="w-full sm:w-1/2 lg:w-1/4 px-1.5 py-2 group">
			<Link href={`/${linkPath}/${slug}`}>
				<a
					title={title}
					className="flex flex-col justify-between h-full rounded-md shadow-md overflow-hidden relative"
				>
					<div className="aspect-w-4 aspect-h-3 relative overflow-hidden">
						<picture className="w-full h-full">
							<source srcSet={coverImg} />
							<img
								src={coverImg}
								data-src={coverImg}
								alt={title}
								className="w-full h-full object-cover object-center scale-1000 hover:scale-105 transition-all duration-300 ease-in-out"
								loading="lazy"
								width="400"
								height="300"
							/>
						</picture>
					</div>
					<div className="flex flex-col justify-between p-4 h-full">
						<div className="">
							<h3 className="text-16 my-0 font-medium line-clamp-1">
								{title}
							</h3>
							<span className="mt-0.5 inline-flex text-15 font-light text-primary-400 line-clamp-1">
								{type == "place"
									? placeTypeModified
									: "Activitat"}{" "}
								{type == "place" ? "amb encant" : ""} a&nbsp;
								<u>{location}</u>
							</span>
						</div>
						<div className="mt-4 flex items-center justify-between">
							<div className="inline-flex items-center justify-center text-sm leading-tight">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="mr-1.5"
									width="15"
									height="15"
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
								{modRating || rating}/5
							</div>
							<span className="text-13 text-tertiary-800 group-hover:text-tertiary-900 transition-all duration-300 ease-in-out inline-flex items-center leading-tight">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="mr-1"
									width={15}
									height={15}
									viewBox="0 0 24 24"
									strokeWidth="2"
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
									<path d="M12 5l0 14"></path>
									<path d="M5 12l14 0"></path>
								</svg>
								Veure'n més
							</span>
						</div>
					</div>
				</a>
			</Link>
		</article>
	);
};

export default PublicSquareBox;
