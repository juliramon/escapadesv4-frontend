import Link from "next/link";
import { cloudinaryImage } from "../../utils/cloudinary";

/**
 * Carril de destinacions.
 *
 * Abans les destinacions es pintaven només com a fotografia, sense títol: no
 * es podia saber quina zona era cadascuna i cinc de les sis no tenen imatge
 * carregada, de manera que sortien buides. Ara sempre hi ha títol, subtítol i
 * un fons de reserva quan no hi ha foto.
 */
const DestinationRail = ({ destinations = [], className = "" }) => {
	if (!destinations.length) return null;

	return (
		<ul className={`destination-rail ${className}`}>
			{destinations.map((destination, index) => {
				const image = cloudinaryImage(destination.image, 520, 690);
				return (
					<li
						key={destination.slug}
						className="destination-rail__item"
					>
						<Link href={`/destinacions/${destination.slug}`}>
							<a
								title={`Escapades a ${destination.title}`}
								className="destination-rail__link group"
							>
								{destination.image ? (
									<picture className="destination-rail__media">
										{image.webp ? (
											<source
												srcSet={image.webp}
												type="image/webp"
											/>
										) : null}
										<img
											src={image.src}
											alt={destination.title}
											width={390}
											height={525}
											loading={
												index < 2 ? "eager" : "lazy"
											}
											className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
										/>
									</picture>
								) : (
									<span className="destination-rail__media destination-rail__media--empty">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth={1}
											strokeLinecap="round"
											strokeLinejoin="round"
											aria-hidden="true"
										>
											<path
												stroke="none"
												d="M0 0h24v24H0z"
												fill="none"
											/>
											<circle cx="12" cy="11" r="3" />
											<path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
										</svg>
									</span>
								)}
								<span className="destination-rail__overlay" />
								<span className="destination-rail__content">
									<span className="destination-rail__title">
										{destination.title}
									</span>
									{destination.subtitle ? (
										<span className="destination-rail__subtitle">
											{destination.subtitle}
										</span>
									) : null}
								</span>
							</a>
						</Link>
					</li>
				);
			})}
		</ul>
	);
};

export default DestinationRail;
