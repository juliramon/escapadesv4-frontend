import Link from "next/link";
import { cloudinaryImage } from "../../utils/cloudinary";

/**
 * Anterior / següent dins d'un viatge.
 *
 * Les publicacions d'un viatge són un diari: «dia 1», «dia 2»... i fins ara
 * cada dia era un cul-de-sac. Qui hi arribava des de cerca havia de tornar
 * enrere fins a la fitxa del viatge per continuar llegint —o marxar, que és el
 * que acaba passant.
 *
 * L'ordre és el de publicació ascendent, que és el del viatge: «Següent» porta
 * al dia següent, no a l'entrada més nova.
 */
const PagerCard = ({ entry, basePath, direction }) => {
	if (!entry) return <div className="hidden md:block" aria-hidden="true"></div>;

	const isPrev = direction === "prev";
	const cover = cloudinaryImage(entry.cover, 200, 200);

	return (
		<Link href={`${basePath}/${entry.slug}`}>
			<a
				title={entry.title}
				rel={isPrev ? "prev" : "next"}
				className={`group flex items-center gap-4 p-4 bg-white rounded-2xl border border-primary-50 hover:border-primary-100 transition-colors duration-300 ease-in-out ${
					isPrev ? "" : "md:flex-row-reverse md:text-right"
				}`}
			>
				<picture className="block shrink-0 w-16 h-16 rounded-xl overflow-hidden">
					<img
						src={cover.src}
						alt=""
						width={80}
						height={80}
						className="w-full h-full object-cover"
						loading="lazy"
						decoding="async"
					/>
				</picture>
				<span className="min-w-0">
					<span
						className={`flex items-center gap-x-1 text-13 uppercase tracking-widest text-tertiary-800 mb-1 ${
							isPrev ? "" : "md:justify-end"
						}`}
					>
						{isPrev ? (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width={14}
								height={14}
								viewBox="0 0 24 24"
								strokeWidth={2}
								stroke="currentColor"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							>
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<path d="M15 6l-6 6l6 6" />
							</svg>
						) : null}
						{isPrev ? "Anterior" : "Següent"}
						{isPrev ? null : (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width={14}
								height={14}
								viewBox="0 0 24 24"
								strokeWidth={2}
								stroke="currentColor"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							>
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<path d="M9 6l6 6l-6 6" />
							</svg>
						)}
					</span>
					<span className="block text-15 leading-snug line-clamp-2 group-hover:underline">
						{entry.title}
					</span>
				</span>
			</a>
		</Link>
	);
};

const TripEntryPager = ({ previousEntry, nextEntry, basePath }) => {
	if (!previousEntry && !nextEntry) return null;

	return (
		<nav
			className="grid grid-cols-1 md:grid-cols-2 gap-4"
			aria-label="Altres dies d'aquest viatge"
		>
			<PagerCard
				entry={previousEntry}
				basePath={basePath}
				direction="prev"
			/>
			<PagerCard entry={nextEntry} basePath={basePath} direction="next" />
		</nav>
	);
};

export default TripEntryPager;
