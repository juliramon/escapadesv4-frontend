import Link from "next/link";
import { cloudinaryImage } from "../../utils/cloudinary";

/**
 * Carril horitzontal de categories.
 *
 * És el primer punt d'entrada després de la capçalera: deixa clar, d'un cop
 * d'ull, quins tipus d'escapada i d'allotjament hi ha al web. A mòbil llisca
 * lateralment; a partir de lg hi caben totes en una fila.
 */
const CategoryRail = ({ categories = [], prefix = "/" }) => {
	if (!categories.length) return null;

	return (
		<ul className="category-rail">
			{categories.map((category, index) => {
				const image = cloudinaryImage(category.image, 320, 320);
				return (
					<li key={category.slug} className="category-rail__item">
						<Link href={`${prefix}${category.slug}`}>
							<a
								title={category.title || category.label}
								className="category-rail__link group"
							>
								<span className="category-rail__media">
									{category.image ? (
										<picture>
											{image.webp ? (
												<source
													srcSet={image.webp}
													type="image/webp"
												/>
											) : null}
											<img
												src={image.src}
												alt={category.label}
												width={160}
												height={160}
												loading={
													index < 4 ? "eager" : "lazy"
												}
												className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
											/>
										</picture>
									) : (
										<span className="category-rail__placeholder" />
									)}
								</span>
								<span className="category-rail__label">
									{category.label}
								</span>
							</a>
						</Link>
					</li>
				);
			})}
		</ul>
	);
};

export default CategoryRail;
