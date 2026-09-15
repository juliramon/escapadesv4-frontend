import React from "react";
import Link from "next/link";
import { formatDateTimeToISODate } from "../../utils/helpers";
import { cloudinaryImage, cloudinaryResponsive } from "../../utils/cloudinary";

const FeaturedListBox = ({
	slug,
	cover,
	title,
	subtitle,
	avatar,
	owner,
	date,
}) => {
	let shortenedSubtitle = subtitle.slice(0, 120);
	let publicationDate = formatDateTimeToISODate(date);
	// Ocupa tot l'ample del bloc destacat: cal una imatge per amplada de
	// pantalla, no l'original de dos o tres mega.
	const coverImage = cloudinaryResponsive(cover, {
		widths: [480, 768, 1024, 1400],
		ratio: 9 / 16,
	});
	const avatarImage = cloudinaryImage(avatar, 40, 40);
	return (
		<Link href={`/llistes/${slug}`}>
			<a
				title={title}
				className="block relative rounded-md overflow-hidden pt-14 px-8 pb-8 text-white"
			>
				<div className="bg-primary-500 bg-opacity-40 absolute top-0 left-0 w-full h-full z-40"></div>
				<div className="absolute top-0 left-0 w-full h-full">
					<picture>
						<img
							src={coverImage.src}
							srcSet={coverImage.srcSet}
							sizes={coverImage.sizes}
							width={coverImage.width}
							height={coverImage.height}
							alt={title}
							className="w-full h-full object-cover"
							loading="eager"
							fetchpriority="high"
						/>
					</picture>
				</div>

				<div className="relative z-40 w-full max-w-md">
					<div className="mb-4">
						<h3 className="text-xl md:text-2xl text-white">
							{title}
						</h3>
						<div className="mt-2 text-white font-light line-clamp-2">
							{shortenedSubtitle}...
						</div>
					</div>
					<div className="flex items-center border-t border-primary-200 pt-4">
						<div className="w-10 h-10 mr-4 rounded-full overflow-hidden">
							<picture>
								<img
									src={avatarImage.src}
									alt={owner}
									width="40"
									height="40"
									className="w-full h-full object-cover object-center rounded-full"
									loading="lazy"
								/>
							</picture>
						</div>
						<div className="flex flex-wrap items-center">
							<span className="text-sm inline-block">
								{owner}
							</span>
							<span className="mx-2 inline-block">–</span>
							<span className="text-sm inline-block">
								{publicationDate}
							</span>
						</div>
					</div>
				</div>
			</a>
		</Link>
	);
};

export default FeaturedListBox;
