import { useCallback, useEffect, useRef, useState } from "react";
import TaxonomyChips from "./TaxonomyChips";

/**
 * Bloc de text SEO del peu dels llistats.
 *
 * Abans era un mur de text pla, sense jerarquia tipogràfica i sense cap
 * enllaç: molt contingut, poc llegit i sense repartir autoritat cap a la
 * resta del web.
 *
 * Ara el text té una escala pròpia (`.seo-block`), es plega a una alçada
 * raonable amb un desplegable —el contingut es queda sencer al DOM, o sigui
 * que Google el segueix veient igual— i pot acabar amb una fila d'enllaços
 * interns cap a les categories o destinacions relacionades.
 */
const ListingsTextareaFooter = ({
	textareaFooter,
	heading,
	relatedLinks,
	relatedLinksHeading,
	relatedLinksPrefix = "/",
	activeSlug,
	collapsible = true,
	className = "",
}) => {
	const contentRef = useRef(null);
	const [isExpanded, setIsExpanded] = useState(false);
	const [isOverflowing, setIsOverflowing] = useState(false);

	const measure = useCallback(() => {
		const node = contentRef.current;
		if (!node || !collapsible || isExpanded) return;
		setIsOverflowing(node.scrollHeight > node.clientHeight + 8);
	}, [collapsible, isExpanded]);

	useEffect(() => {
		measure();
		window.addEventListener("resize", measure);
		return () => window.removeEventListener("resize", measure);
	}, [measure]);

	if (!textareaFooter) return null;

	const isCollapsed = collapsible && !isExpanded;

	return (
		<section className={`seo-block ${className}`}>
			<div className="container">
				<div className="seo-block__inner">
					{heading ? (
						<h2 className="seo-block__heading">{heading}</h2>
					) : null}

					<div
						className={`seo-block__body ${
							isCollapsed ? "is-collapsed" : ""
						}`}
					>
						<div
							ref={contentRef}
							className={`seo-block__content ${
								isCollapsed ? "seo-block__content--clamped" : ""
							}`}
							dangerouslySetInnerHTML={{ __html: textareaFooter }}
						></div>
						{isCollapsed && isOverflowing ? (
							<span
								className="seo-block__fade"
								aria-hidden="true"
							/>
						) : null}
					</div>

					{collapsible && isOverflowing ? (
						<button
							type="button"
							onClick={() => setIsExpanded(!isExpanded)}
							className="seo-block__toggle"
							aria-expanded={isExpanded}
						>
							{isExpanded ? "Mostrar-ne menys" : "Llegir-ho tot"}
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
								className={`transition-transform duration-300 ease-in-out ${
									isExpanded ? "rotate-180" : ""
								}`}
							>
								<path
									stroke="none"
									d="M0 0h24v24H0z"
									fill="none"
								/>
								<path d="M6 9l6 6l6 -6" />
							</svg>
						</button>
					) : null}

					{relatedLinks && relatedLinks.length ? (
						<div className="seo-block__links">
							<TaxonomyChips
								heading={
									relatedLinksHeading || "Seguiu descobrint"
								}
								items={relatedLinks}
								prefix={relatedLinksPrefix}
								activeSlug={activeSlug}
							/>
						</div>
					) : null}
				</div>
			</div>
		</section>
	);
};

export default ListingsTextareaFooter;
