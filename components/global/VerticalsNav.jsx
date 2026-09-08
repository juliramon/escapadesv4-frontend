import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
	DESTINATIONS,
	GETAWAY_CATEGORIES,
	STAY_CATEGORIES,
} from "../../utils/siteTaxonomy";

const iconProps = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 19,
	height: 19,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 1.6,
	strokeLinecap: "round",
	strokeLinejoin: "round",
};

const icons = {
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
	destinations: (
		<svg {...iconProps}>
			<path stroke="none" d="M0 0h24v24H0z" fill="none" />
			<circle cx="12" cy="11" r="3" />
			<path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
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
	chevron: (
		<svg {...iconProps} width={15} height={15}>
			<path stroke="none" d="M0 0h24v24H0z" fill="none" />
			<path d="M6 9l6 6l6 -6" />
		</svg>
	),
	arrow: (
		<svg {...iconProps} width={16} height={16}>
			<path stroke="none" d="M0 0h24v24H0z" fill="none" />
			<path d="M9 6l6 6l-6 6" />
		</svg>
	),
};

/**
 * Entrades de la barra de verticals.
 *
 * Les que tenen `panel` desplegen un mega-menu amb les subcategories: es la
 * manera de fer visibles les 16 categories i les 6 destinacions, que fins ara
 * nomes s'arribaven des del desplegable del cercador.
 */
const ITEMS = [
	{
		id: "experiences",
		href: "/activitats",
		label: "Experiències",
		title: "Experiències originals per fer en parella a Catalunya",
		icon: icons.experiences,
		panel: {
			heading: "Per tipus d'escapada",
			seeAll: {
				href: "/activitats",
				label: "Veure totes les experiències",
			},
			links: GETAWAY_CATEGORIES.map((category) => ({
				href: `/${category.slug}`,
				label: category.label,
				hint: category.hint,
			})),
		},
	},
	{
		id: "stays",
		href: "/allotjaments",
		label: "Allotjaments",
		title: "Allotjaments amb encant a Catalunya",
		icon: icons.stays,
		panel: {
			heading: "Per tipus d'allotjament",
			seeAll: {
				href: "/allotjaments",
				label: "Veure tots els allotjaments",
			},
			links: STAY_CATEGORIES.map((category) => ({
				href: `/${category.slug}`,
				label: category.label,
				hint: category.hint,
			})),
		},
	},
	{
		id: "destinations",
		href: "/destinacions",
		label: "Destinacions",
		title: "Destinacions per a escapades en parella",
		icon: icons.destinations,
		panel: {
			heading: "Zones per descobrir",
			seeAll: {
				href: "/destinacions",
				label: "Veure totes les destinacions",
			},
			links: DESTINATIONS.map((destination) => ({
				href: `/destinacions/${destination.slug}`,
				label: destination.label,
			})),
		},
	},
	{
		id: "lists",
		href: "/llistes",
		label: "Llistes",
		title: "Llistes d'idees per a escapades en parella",
		icon: icons.lists,
	},
	{
		id: "stories",
		href: "/histories",
		label: "Històries",
		title: "Històries d'escapades viscudes en parella",
		icon: icons.stories,
	},
	{
		id: "trips",
		href: "/viatges",
		label: "Viatges",
		title: "Viatges en parella arreu del món",
		icon: icons.trips,
	},
	{
		id: "discounts",
		href: "/descomptes-viatjar",
		label: "Descomptes",
		title: "Descomptes per viatjar",
		icon: icons.discounts,
		highlight: true,
	},
];

const VerticalsNav = () => {
	const router = useRouter();
	const [openPanel, setOpenPanel] = useState(null);
	const navRef = useRef(null);

	// Tancar el mega-menu clicant fora o amb Escape.
	useEffect(() => {
		if (!openPanel) return undefined;

		const handleClickOutside = (event) => {
			if (navRef.current && !navRef.current.contains(event.target)) {
				setOpenPanel(null);
			}
		};
		const handleKeyDown = (event) => {
			if (event.key === "Escape") setOpenPanel(null);
		};

		document.addEventListener("click", handleClickOutside);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("click", handleClickOutside);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [openPanel]);

	useEffect(() => {
		const close = () => setOpenPanel(null);
		router.events.on("routeChangeStart", close);
		return () => router.events.off("routeChangeStart", close);
	}, [router.events]);

	const isActive = (item) => {
		const path = router.asPath.split("?")[0];
		if (path === item.href) return true;
		if (path.startsWith(`${item.href}/`)) return true;
		if (item.panel) {
			return item.panel.links.some((link) => link.href === path);
		}
		return false;
	};

	return (
		<div ref={navRef} className="verticals-nav">
			<div className="container !px-0 md:!px-6 relative">
				<ul
					className="verticals-nav__list"
					aria-label="Seccions del web"
				>
					{ITEMS.map((item) => {
						const active = isActive(item);
						const isOpen = openPanel === item.id;
						return (
							<li
								key={item.id}
								className="verticals-nav__item"
								onMouseEnter={() =>
									item.panel ? setOpenPanel(item.id) : null
								}
								onMouseLeave={() =>
									item.panel ? setOpenPanel(null) : null
								}
							>
								<div className="flex items-center">
									<Link href={item.href}>
										<a
											title={item.title}
											className={`verticals-nav__link${
												active ? " is-active" : ""
											}${
												item.highlight
													? " is-highlight"
													: ""
											}`}
										>
											<span className="verticals-nav__icon">
												{item.icon}
											</span>
											{item.label}
										</a>
									</Link>
									{item.panel ? (
										<button
											type="button"
											aria-expanded={isOpen}
											aria-label={`Desplegar ${item.label}`}
											className={`verticals-nav__toggle${
												isOpen ? " is-open" : ""
											}`}
											onClick={() =>
												setOpenPanel(
													isOpen ? null : item.id
												)
											}
										>
											{icons.chevron}
										</button>
									) : null}
								</div>

								{item.panel && isOpen ? (
									<div className="verticals-nav__panel">
										<span className="verticals-nav__panel-heading">
											{item.panel.heading}
										</span>
										<ul className="verticals-nav__panel-list">
											{item.panel.links.map((link) => (
												<li
													key={link.href}
													className="m-0"
												>
													<Link href={link.href}>
														<a className="verticals-nav__panel-link">
															<span className="font-medium">
																{link.label}
															</span>
															{link.hint ? (
																<span className="block text-13 text-grey-300">
																	{link.hint}
																</span>
															) : null}
														</a>
													</Link>
												</li>
											))}
										</ul>
										<Link href={item.panel.seeAll.href}>
											<a className="verticals-nav__panel-all">
												{item.panel.seeAll.label}
												{icons.arrow}
											</a>
										</Link>
									</div>
								) : null}
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
};

export default VerticalsNav;
