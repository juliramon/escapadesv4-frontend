import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Capçalera dels llistats.
 *
 * Abans ocupava mitja pantalla: 80px de coixí superior, un H1 centrat de fins
 * a 72px i un paràgraf de SEO sencer a 20px. En un portàtil, la primera fila
 * de fitxes quedava per sota del plec i el llistat —que és el que ve a buscar
 * l'usuari— no es veia.
 *
 * Ara el títol va alineat a l'esquerra i a una escala pròpia de llistat, la
 * descripció es retalla a dues línies amb un desplegable (el text continua al
 * DOM, o sigui que no es perd res de cara al SEO) i els botons de filtre
 * comparteixen fila amb el títol en escriptori.
 */
const ListingHeader = ({
	title,
	subtitle,
	textHeader,
	sponsorData,
	breadcrumbLevel1,
	breadcrumbLevel2,
	actions,
}) => {
	const descriptionRef = useRef(null);
	const [isExpanded, setIsExpanded] = useState(false);
	const [isClamped, setIsClamped] = useState(false);

	const hasDescription = Boolean(subtitle || textHeader);

	// Només té sentit oferir "Llegir-ne més" si el text realment no hi cap.
	const measure = useCallback(() => {
		const node = descriptionRef.current;
		if (!node) return;
		if (isExpanded) return;
		setIsClamped(node.scrollHeight > node.clientHeight + 1);
	}, [isExpanded]);

	useEffect(() => {
		measure();
		window.addEventListener("resize", measure);
		return () => window.removeEventListener("resize", measure);
	}, [measure]);

	return (
		<section className="pt-4 md:pt-6 lg:pt-8">
			<div className="container">
				<ul className="breadcrumb">
					<li className="breadcrumb__item">
						<a href="/" title="Inici" className="breadcrumb__link">
							Inici
						</a>
					</li>
					{breadcrumbLevel1 ? (
						<li className="breadcrumb__item">
							<span className="breadcrumb__link active">
								{breadcrumbLevel1}
							</span>
						</li>
					) : null}
					{breadcrumbLevel2 ? (
						<li className="breadcrumb__item">
							<span className="breadcrumb__link active">
								{breadcrumbLevel2}
							</span>
						</li>
					) : null}
				</ul>

				<div className="mt-3.5 flex flex-col gap-y-4 lg:flex-row lg:items-end lg:justify-between lg:gap-x-10">
					<div className="lg:max-w-3xl">
						<h1
							className="my-0 text-balance"
							dangerouslySetInnerHTML={{ __html: title }}
						></h1>

						{hasDescription ? (
							<>
								<div
									ref={descriptionRef}
									className={`mt-2.5 text-block text-grey-400 [&>p]:inline [&>p]:mb-0 [&>strong]:text-grey-700 ${
										isExpanded ? "" : "line-clamp-2"
									}`}
									dangerouslySetInnerHTML={{
										__html: `${subtitle || ""}${
											textHeader ? ` ${textHeader}` : ""
										}`,
									}}
								></div>
								{isClamped ? (
									<button
										type="button"
										onClick={() =>
											setIsExpanded(!isExpanded)
										}
										className="mt-1.5 text-15 text-tertiary-800 hover:text-tertiary-900 underline transition-colors duration-200 ease-in-out"
									>
										{isExpanded
											? "Mostrar-ne menys"
											: "Llegir-ne més"}
									</button>
								) : null}
							</>
						) : null}
					</div>

					{actions ? (
						<div className="shrink-0 lg:pb-1">{actions}</div>
					) : null}
				</div>

				{sponsorData ? <div className="mt-5">{sponsorData}</div> : null}
			</div>
		</section>
	);
};

export default ListingHeader;
