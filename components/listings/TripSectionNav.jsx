import { useEffect, useState } from "react";

/**
 * Sub-navegació de la fitxa d'un viatge.
 *
 * Abans eren tres botons on el primer sempre anava pintat de primari i els
 * altres dos de secundari, tant si eres a dalt de tot com al final: semblava
 * un estat actiu que no ho era. Ara el que es marca és la secció que s'està
 * llegint.
 *
 * Amb `scroll-margin-top` a les seccions (`layout-tripCategory.sass`) els
 * salts no queden amagats sota la barra fixa.
 */
const TripSectionNav = ({ sections = [] }) => {
	const [activeId, setActiveId] = useState(sections[0]?.id);
	// `sections` es recalcula a cada renderitzat del pare: sense una clau
	// estable, l'observador es desmuntaria i es tornaria a muntar cada vegada.
	const sectionIds = sections.map(({ id }) => id).join(",");

	useEffect(() => {
		const nodes = sections
			.map(({ id }) => document.getElementById(id))
			.filter(Boolean);

		if (!nodes.length || typeof IntersectionObserver === "undefined") {
			return undefined;
		}

		// La franja activa és el terç superior de la finestra: és on mira qui
		// llegeix, i evita que la secció canviï quan només se'n veu la cua.
		//
		// L'observador només informa de les seccions que `han canviat`, no de
		// totes: si es mira només l'últim avís, en entrar-hi la secció de sota
		// es marcava aquesta encara que la de sobre continués ocupant la
		// franja. Per això es guarda quines hi són i, de totes, es marca la
		// que va més amunt.
		const visibleIds = new Set();
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) visibleIds.add(entry.target.id);
					else visibleIds.delete(entry.target.id);
				});

				const topmost = nodes
					.filter((node) => visibleIds.has(node.id))
					.sort(
						(a, b) =>
							a.getBoundingClientRect().top -
							b.getBoundingClientRect().top
					)[0];

				if (topmost) setActiveId(topmost.id);
			},
			{ rootMargin: "-140px 0px -60% 0px", threshold: 0 }
		);

		nodes.forEach((node) => observer.observe(node));
		return () => observer.disconnect();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sectionIds]);

	if (!sections.length) return null;

	return (
		<div className="border-y border-gray-100 bg-white mt-10 md:sticky md:top-[130px] z-40">
			<nav
				className="container flex items-center gap-2 py-3 md:py-4 overflow-x-auto no-scrollbar"
				aria-label="Seccions del viatge"
			>
				{sections.map(({ id, label }) => {
					const isActive = id === activeId;
					return (
						<a
							key={id}
							href={`#${id}`}
							title={label}
							aria-current={isActive ? "true" : undefined}
							className={`shrink-0 rounded-full py-2 px-4 md:px-5 text-15 leading-tight transition-colors duration-200 ease-in-out ${
								isActive
									? "bg-primary-500 text-white"
									: "bg-gray-50 text-grey-500 hover:bg-gray-100 hover:text-grey-700"
							}`}
						>
							{label}
						</a>
					);
				})}
			</nav>
		</div>
	);
};

export default TripSectionNav;
