import Link from "next/link";

/**
 * Capçalera de secció reutilitzable.
 *
 * Cada bloc de la portada ha de dir en una línia què és i on porta: és el que
 * fa que l'usuari entengui els verticals sense haver de fer scroll a cegues.
 */
const SectionHeading = ({
	eyebrow,
	title,
	description,
	href,
	linkLabel = "Veure-ho tot",
	titleTag: TitleTag = "h2",
	className = "",
}) => {
	return (
		<div
			className={`flex flex-wrap items-end justify-between gap-x-6 gap-y-3 ${className}`}
		>
			<div className="max-w-2xl">
				{eyebrow ? (
					<span className="block text-13 uppercase tracking-widest text-tertiary-800 mb-2">
						{eyebrow}
					</span>
				) : null}
				<TitleTag className="my-0 text-balance">{title}</TitleTag>
				{description ? (
					<p className="mt-2.5 !mb-0 text-block text-grey-400 max-w-[60ch]">
						{description}
					</p>
				) : null}
			</div>
			{href ? (
				<Link href={href}>
					<a className="section-heading__link">
						{linkLabel}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width={16}
							height={16}
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth={2}
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<path d="M9 6l6 6l-6 6" />
						</svg>
					</a>
				</Link>
			) : null}
		</div>
	);
};

export default SectionHeading;
