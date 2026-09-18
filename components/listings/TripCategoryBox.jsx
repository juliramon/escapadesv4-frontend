import Link from "next/link";
import React from "react";
import { cloudinaryImage } from "../../utils/cloudinary";

/**
 * Targeta d'una destinació de viatge.
 *
 * Abans partia la targeta en dos —foto a l'esquerra, text a la dreta— dins
 * d'una graella de tres columnes: a partir de tauleta la foto es quedava en
 * una tira de 150 px i cada targeta creixia fins on arribés l'entradeta, o
 * sigui que les d'una mateixa fila no s'acabaven d'alinear.
 *
 * Ara la portada va a sobre amb una proporció fixa, com a la resta de
 * llistats (`EditorialCard`, `PublicSquareBox`), i el país surt a sobre de la
 * foto: es veu la destinació abans de llegir res.
 */
// `priority` només decideix si la portada es baixa de seguida: la prioritat
// alta la demana la foto del destacat, que és la que decideix el LCP.
const TripCategoryBox = ({ image, title, subtitle, slug, country, priority }) => {
	const cover = cloudinaryImage(image, 640, 480);

	return (
		<article className="w-full h-full group">
			<Link href={`/viatges/${slug}`}>
				<a
					title={title}
					className="relative flex flex-col h-full bg-gray-50 rounded-2xl overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-lg"
				>
					<picture className="block aspect-w-4 aspect-h-3 relative overflow-hidden">
						<img
							src={cover.src}
							alt={title}
							width={cover.width}
							height={cover.height}
							className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-in-out"
							loading={priority === "eager" ? "eager" : "lazy"}
							decoding="async"
						/>
					</picture>

					{country ? (
						<span className="absolute top-4 left-4 z-10 inline-flex items-center gap-x-1.5 bg-white/95 text-primary-500 text-13 leading-none rounded-full py-1.5 px-2.5">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width={14}
								height={14}
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							>
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<path d="M7 9a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
								<path d="M5.75 15a8.015 8.015 0 1 0 9.25 -13" />
								<path d="M11 17v4" />
								<path d="M7 21h8" />
							</svg>
							{country}
						</span>
					) : null}

					<div className="flex flex-col flex-1 p-6 md:p-7">
						<h2 className="my-0 h3 font-display group-hover:underline">
							{title}
						</h2>
						{subtitle ? (
							<div
								className="text-block text-block--sm text-grey-400 mt-2 line-clamp-3"
								dangerouslySetInnerHTML={{ __html: subtitle }}
							></div>
						) : null}

						<span className="mt-auto pt-5 border-t border-gray-100 text-15 text-tertiary-800 group-hover:text-tertiary-900 transition-colors duration-300 ease-in-out inline-flex items-center leading-tight">
							Veure el viatge
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="ml-1"
								width={16}
								height={16}
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
						</span>
					</div>
				</a>
			</Link>
		</article>
	);
};

export default TripCategoryBox;
