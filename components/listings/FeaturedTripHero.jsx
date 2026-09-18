import Link from "next/link";
import { cloudinaryImage, cloudinaryResponsive } from "../../utils/cloudinary";

/**
 * Aparador del viatge destacat de `/viatges`.
 *
 * Abans això era un carrusel de Glide que ningú no engegava: el CSS de Glide
 * sí que es carregava, o sigui que el `glide__track` amagava tot el que no fos
 * la primera diapositiva i no hi havia fletxes ni punts per arribar-hi.
 *
 * El que el va substituir tenia el problema contrari: funcionava, però no es
 * distingia prou d'una fitxa de la graella —mateixa foto amb degradat, títol a
 * sobre— i el fet de ser el destacat quedava en una etiqueta petita. Ara el
 * bloc és l'únic fosc de la pàgina, el títol va a l'escala dels h1 i la foto
 * principal es reparteix el mosaic amb dues del carrusel del viatge.
 *
 * La foto principal ocupa dos terços d'una fila sencera, així que es demana
 * per amplades i el mòbil no es baixa la versió d'escriptori.
 */
const MEDIA_WIDTHS = [640, 1024, 1400, 1920];

const FeaturedTripCard = ({ category, isLcp }) => {
	const image = cloudinaryResponsive(category.image, {
		widths: MEDIA_WIDTHS,
		ratio: 3 / 4,
		sizes: "(min-width: 1024px) 40vw, 100vw",
	});

	// Les dues fotos de suport surten del carrusel del viatge. Si no n'hi ha,
	// la principal ocupa tot el mosaic i no es nota que en falten.
	const extras = (category.carouselImages || []).slice(0, 2);
	const hasExtras = extras.length === 2;

	// Sense URL no hi ha res a enllaçar, i sense logo ni claim no hi ha res a
	// ensenyar: val més no pintar la franja que pintar-la buida.
	const isSponsored =
		Boolean(category.isSponsored) &&
		Boolean(category.sponsorURL) &&
		Boolean(category.sponsorLogo || category.sponsorClaim);

	return (
		<article className="featured-trip">
			<Link href={`/viatges/${category.slug}`}>
				<a title={category.title} className="featured-trip__grid">
					<div className="featured-trip__panel">
						<span className="featured-trip__eyebrow">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width={16}
								height={16}
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							>
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z" />
							</svg>
							Viatge destacat
							<span
								className="featured-trip__eyebrow-rule"
								aria-hidden="true"
							></span>
						</span>

						<h2 className="featured-trip__title">
							{category.title}
						</h2>

						{category.seoTextHeader ? (
							<div
								className="featured-trip__text"
								dangerouslySetInnerHTML={{
									__html: category.seoTextHeader,
								}}
							></div>
						) : null}

						<ul className="featured-trip__meta">
							{category.country ? (
								<li className="featured-trip__meta-item">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width={15}
										height={15}
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										fill="none"
										strokeLinecap="round"
										strokeLinejoin="round"
										aria-hidden="true"
									>
										<path
											stroke="none"
											d="M0 0h24v24H0z"
											fill="none"
										/>
										<path d="M7 9a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
										<path d="M5.75 15a8.015 8.015 0 1 0 9.25 -13" />
										<path d="M11 17v4" />
										<path d="M7 21h8" />
									</svg>
									{category.country}
								</li>
							) : null}
							{category.carouselImagesCount ? (
								<li className="featured-trip__meta-item">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width={15}
										height={15}
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										fill="none"
										strokeLinecap="round"
										strokeLinejoin="round"
										aria-hidden="true"
									>
										<path
											stroke="none"
											d="M0 0h24v24H0z"
											fill="none"
										/>
										<path d="M15 8h.01" />
										<path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12z" />
										<path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5" />
										<path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3" />
									</svg>
									{category.carouselImagesCount} fotos
								</li>
							) : null}
						</ul>

						<span className="featured-trip__cta">
							{/* Fosc, no salmó: sobre el crema del bloc el salmó
							    es confon amb el fons i deixa de semblar un botó. */}
							<span className="button button__primary button__med">
								Veure el viatge
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="ml-1.5"
									width={18}
									height={18}
									viewBox="0 0 24 24"
									strokeWidth={2}
									stroke="currentColor"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden="true"
								>
									<path
										stroke="none"
										d="M0 0h24v24H0z"
										fill="none"
									/>
									<path d="M9 6l6 6l-6 6" />
								</svg>
							</span>
						</span>
					</div>

					<div className="featured-trip__media">
						<picture
							className={`featured-trip__media-main${
								hasExtras ? "" : " featured-trip__media-main--solo"
							}`}
						>
							<img
								{...image}
								alt={category.title}
								loading={isLcp ? "eager" : "lazy"}
								fetchpriority={isLcp ? "high" : undefined}
								decoding="async"
							/>
						</picture>
						{hasExtras
							? extras.map((url, idx) => (
									<picture
										key={url || idx}
										className="featured-trip__media-extra"
									>
										<img
											src={cloudinaryImage(url, 480, 360).src}
											alt=""
											width={480}
											height={360}
											loading="lazy"
											decoding="async"
										/>
									</picture>
								))
							: null}
					</div>
				</a>
			</Link>

			{/* El crèdit va fora de l'enllaç del bloc: un `a` no en pot
			    contenir un altre, i el logo del patrocinador ha de portar a la
			    seva pàgina, no a la del viatge. */}
			{isSponsored ? (
				<div className="featured-trip__sponsor">
					<span className="featured-trip__sponsor-label">
						Patrocinat per
					</span>
					<a
						href={category.sponsorURL}
						title={category.sponsorClaim || "Patrocinador"}
						target="_blank"
						// Enllaç pagat: `sponsored` és el que demana Google per
						// no comptar-lo com un vot editorial.
						rel="sponsored noopener noreferrer"
						className="featured-trip__sponsor-link"
					>
						{category.sponsorLogo ? (
							<span className="featured-trip__sponsor-logo">
								<img
									{...cloudinaryImage(
										category.sponsorLogo,
										240,
										120,
										"fit"
									)}
									alt={
										category.sponsorClaim ||
										"Patrocinador"
									}
									loading="lazy"
									decoding="async"
								/>
							</span>
						) : null}
						{category.sponsorClaim ? (
							<span className="featured-trip__sponsor-claim">
								{category.sponsorClaim}
							</span>
						) : null}
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
							<path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6" />
							<path d="M11 13l9 -9" />
							<path d="M15 4h5v5" />
						</svg>
					</a>
				</div>
			) : null}
		</article>
	);
};

const FeaturedTripHero = ({ categories = [] }) => {
	if (!categories.length) return null;

	// Avui només n'hi ha un de destacat. Si mai n'hi ha més, es reparteixen
	// la fila en lloc d'amagar-se darrere un carrusel que no es veu.
	const gridClassName =
		categories.length > 1
			? "grid grid-cols-1 xl:grid-cols-2 gap-5"
			: "grid grid-cols-1";

	return (
		<div className={gridClassName}>
			{categories.map((category, idx) => (
				<FeaturedTripCard
					key={category._id || category.slug}
					category={category}
					isLcp={idx === 0}
				/>
			))}
		</div>
	);
};

export default FeaturedTripHero;
