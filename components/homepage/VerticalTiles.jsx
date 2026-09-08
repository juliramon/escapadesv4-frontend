import Link from "next/link";

const iconProps = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 26,
	height: 26,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 1.5,
	strokeLinecap: "round",
	strokeLinejoin: "round",
};

const tileIcons = {
	experiences: (
		<svg {...iconProps}>
			<path stroke="none" d="M0 0h24v24H0z" fill="none" />
			<circle cx="6" cy="19" r="2" />
			<circle cx="18" cy="5" r="2" />
			<path d="M12 19h4.5a3.5 3.5 0 0 0 0 -7h-8a3.5 3.5 0 0 1 0 -7h3.5" />
		</svg>
	),
	stays: (
		<svg {...iconProps}>
			<path stroke="none" d="M0 0h24v24H0z" fill="none" />
			<path d="M3 7v11m0 -4h18m0 4v-8a2 2 0 0 0 -2 -2h-8v6" />
			<circle cx="7" cy="10" r="1" />
		</svg>
	),
	lists: (
		<svg {...iconProps}>
			<path stroke="none" d="M0 0h24v24H0z" fill="none" />
			<path d="M9 6l11 0" />
			<path d="M9 12l11 0" />
			<path d="M9 18l11 0" />
			<path d="M5 6l0 .01" />
			<path d="M5 12l0 .01" />
			<path d="M5 18l0 .01" />
		</svg>
	),
	stories: (
		<svg {...iconProps}>
			<path stroke="none" d="M0 0h24v24H0z" fill="none" />
			<path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
			<path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
			<path d="M3 6l0 13" />
			<path d="M12 6l0 13" />
			<path d="M21 6l0 13" />
		</svg>
	),
	trips: (
		<svg {...iconProps}>
			<path stroke="none" d="M0 0h24v24H0z" fill="none" />
			<path d="M16 10h4a2 2 0 0 1 0 4h-4l-4 7h-3l2 -7h-4l-2 2h-3l2 -4l-2 -4h3l2 2h4l-2 -7h3z" />
		</svg>
	),
	discounts: (
		<svg {...iconProps}>
			<path stroke="none" d="M0 0h24v24H0z" fill="none" />
			<path d="M17 17m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
			<path d="M7 7m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
			<path d="M6 18l12 -12" />
		</svg>
	),
};

/**
 * Graella dels sis verticals del web.
 *
 * Serveix per respondre en un sol bloc la pregunta "què hi puc trobar, aquí?".
 * Els comptadors venen de `/get-site-stats`, així que són reals i fan de prova
 * social sense haver de mantenir cap número a mà.
 */
const VerticalTiles = ({ totals = {} }) => {
	const plural = (count, singular, pluralWord) =>
		count === 1 ? singular : pluralWord;

	const tiles = [
		{
			href: "/activitats",
			icon: tileIcons.experiences,
			label: "Experiències",
			description:
				"Activitats, rutes i plans per fer plegats arreu de Catalunya.",
			count: totals.activities,
			countLabel: (n) => `${n} ${plural(n, "experiència", "experiències")}`,
		},
		{
			href: "/allotjaments",
			icon: tileIcons.stays,
			label: "Allotjaments",
			description:
				"Hotels amb encant, cases rurals, cabanyes als arbres i refugis.",
			count: totals.places,
			countLabel: (n) => `${n} ${plural(n, "allotjament", "allotjaments")}`,
		},
		{
			href: "/llistes",
			icon: tileIcons.lists,
			label: "Llistes",
			description:
				"Seleccions temàtiques per decidir ràpid on anar aquest cap de setmana.",
			count: totals.lists,
			countLabel: (n) => `${n} ${plural(n, "llista", "llistes")}`,
		},
		{
			href: "/histories",
			icon: tileIcons.stories,
			label: "Històries",
			description:
				"Les escapades que hem fet nosaltres, explicades de primera mà.",
			count: totals.stories,
			countLabel: (n) => `${n} ${plural(n, "història", "històries")}`,
		},
		{
			href: "/viatges",
			icon: tileIcons.trips,
			label: "Viatges",
			description:
				"Escapades més llargues i destinacions fora de Catalunya.",
		},
		{
			href: "/descomptes-viatjar",
			icon: tileIcons.discounts,
			label: "Descomptes",
			description:
				"Codis i ofertes per estalviar en allotjament, activitats i assegurances.",
			highlight: true,
		},
	];

	return (
		<ul className="vertical-tiles">
			{tiles.map((tile) => (
				<li key={tile.href} className="m-0">
					<Link href={tile.href}>
						<a
							className={`vertical-tile${
								tile.highlight ? " is-highlight" : ""
							}`}
						>
							<span className="vertical-tile__icon">
								{tile.icon}
							</span>
							<span className="vertical-tile__body">
								<span className="vertical-tile__label">
									{tile.label}
									{typeof tile.count === "number" &&
									tile.count > 0 ? (
										<span className="vertical-tile__count">
											{tile.countLabel(tile.count)}
										</span>
									) : null}
								</span>
								<span className="vertical-tile__description">
									{tile.description}
								</span>
							</span>
							<span className="vertical-tile__arrow">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width={18}
									height={18}
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth={2}
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path
										stroke="none"
										d="M0 0h24v24H0z"
										fill="none"
									/>
									<path d="M9 6l6 6l-6 6" />
								</svg>
							</span>
						</a>
					</Link>
				</li>
			))}
		</ul>
	);
};

export default VerticalTiles;
