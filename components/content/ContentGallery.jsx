import FancyboxUtil from "../../utils/FancyboxUtils";

/**
 * Galeria d'imatges dins del cos d'una publicació.
 *
 * Fins ara, per posar imatges enmig del text calia pujar-les totes a "imatges
 * adjuntes" i després escriure a mà `post_images(3, 6)`, o sigui comptar la
 * posició que ocupaven dins d'una llista que no es veia mentre s'escrivia. Amb
 * el bloc de galeria, les imatges es trien allà on han de sortir i el cos de
 * la publicació ja les porta a dins.
 *
 * La graella imita la que ja feien servir les històries: dues columnes al
 * mòbil, tres a partir de tauleta, i totes obren la lupa.
 */

/** Amb una sola imatge no cal graella: es veu a tota l'amplada. */
const columnsFor = (total) => {
	if (total === 1) return "w-full";
	if (total === 2) return "w-1/2";
	return "w-1/2 md:w-1/3";
};

const ContentGallery = ({ images = [], title = "" }) => {
	const gallery = images.filter(Boolean);
	if (gallery.length === 0) return null;

	// Cada galeria té el seu grup a la lupa: així les fletxes es mouen només
	// entre les imatges d'aquest bloc i no entre totes les de la pàgina.
	const groupName = `gallery-${gallery[0].slice(-24)}`;
	const width = columnsFor(gallery.length);

	return (
		<FancyboxUtil options={{ infinite: true }}>
			<div className="flex flex-wrap -mx-1 my-6 cursor-pointer">
				{gallery.map((image, idx) => (
					<div
						className={`${width} px-1 mb-2 flex-auto`}
						data-fancybox={groupName}
						data-src={image}
						key={`${image}-${idx}`}
					>
						<picture
							className={`block rounded-2xl overflow-hidden relative ${
								gallery.length === 1 ? "aspect-[16/9]" : "aspect-1"
							}`}
						>
							<img
								src={image}
								alt={
									title
										? `${title} - ${idx + 1}`
										: `Imatge ${idx + 1}`
								}
								className="w-full h-full object-cover"
								width={400}
								height={300}
								loading="lazy"
							/>
						</picture>
					</div>
				))}
			</div>
		</FancyboxUtil>
	);
};

export default ContentGallery;
