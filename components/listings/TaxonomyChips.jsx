import Link from "next/link";

/**
 * Fila d'enllaços a categories o destinacions germanes.
 *
 * Compleix dues funcions alhora: donar a l'usuari una sortida quan el llistat
 * que està mirant no acaba de convèncer-lo (retenció) i enllaçar totes les
 * pàgines de taxonomia entre elles (SEO intern), que és el que avui falta
 * perquè només s'hi arriba des del menú.
 */
const TaxonomyChips = ({
	heading,
	items = [],
	prefix = "/",
	activeSlug,
	className = "",
}) => {
	const visibleItems = items.filter((item) => item.slug !== activeSlug);
	if (!visibleItems.length) return null;

	return (
		<div className={className}>
			{heading ? (
				<span className="block text-13 uppercase tracking-wider text-grey-300 mb-2.5">
					{heading}
				</span>
			) : null}
			<ul className="taxonomy-chips">
				{visibleItems.map((item) => (
					<li key={item.slug} className="m-0 shrink-0">
						<Link href={`${prefix}${item.slug}`}>
							<a className="taxonomy-chips__link">{item.label}</a>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default TaxonomyChips;
