import Link from "next/link";
import { cloudinaryImage } from "../../utils/cloudinary";

/**
 * Targeta editorial per a històries i llistes.
 *
 * Aquest és el contingut que reté l'usuari i on hi ha els blocs publicitaris,
 * de manera que a la portada ha de tenir el mateix pes visual que les fitxes
 * d'experiències i allotjaments.
 */
const EditorialCard = ({
	href,
	cover,
	title,
	subtitle,
	badge,
	date,
	index = 0,
	// Les primeres targetes visibles es carreguen immediatament; la resta,
	// mandrosament. Es pot forçar amb `eager` quan qui crida ja sap la posició.
	eager,
}) => {
	const isEager = eager !== undefined ? eager : index < 3;
	const image = cloudinaryImage(cover, 520, 390);
	const publicationDate = date
		? new Date(date).toLocaleDateString("ca-ES", {
				year: "numeric",
				month: "short",
				day: "numeric",
		  })
		: null;

	return (
		<article className="w-full group">
			<Link href={href}>
				<a title={title} className="block">
					<picture className="block aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden relative">
						{image.webp ? (
							<source srcSet={image.webp} type="image/webp" />
						) : null}
						<img
							src={image.src}
							alt={title}
							width={520}
							height={390}
							loading={isEager ? "eager" : "lazy"}
							className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
						/>
					</picture>
					<div className="pt-3 pb-1">
						<div className="flex items-center gap-x-2 mb-1.5">
							{badge ? (
								<span className="inline-flex items-center rounded-full bg-tertiary-100 text-tertiary-800 text-13 px-2.5 py-1">
									{badge}
								</span>
							) : null}
							{publicationDate ? (
								<span className="text-13 text-grey-300">
									{publicationDate}
								</span>
							) : null}
						</div>
						{/* Mateixa mida que el títol de `PublicSquareBox`: les dues
						    targetes conviuen a la portada i als llistats. */}
						<h3 className="my-0 text-base leading-snug line-clamp-2 group-hover:underline">
							{title}
						</h3>
						{subtitle ? (
							<p className="mt-1.5 !mb-0 text-15 text-grey-400 line-clamp-2">
								{subtitle}
							</p>
						) : null}
					</div>
				</a>
			</Link>
		</article>
	);
};

export default EditorialCard;
