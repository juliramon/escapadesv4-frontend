import Link from "next/link";
import { cloudinaryUrl } from "../../utils/cloudinary";
import React from "react";

const RegularTripEntryBox = ({
	slug,
	trip,
	cover,
	title,
	subtitle,
	avatar,
	owner,
	date,
}) => {
	let publicationDate = new Date(date).toLocaleDateString("ca-es", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
	const coverImg = cloudinaryUrl(cover, "w_475,h_318,c_fill");

	const avatarImg = cloudinaryUrl(avatar, "w_32,h_32,c_fill");
	return (
		<article className="w-full group">
			<Link href={`/viatges/${trip}/${slug}`}>
				<a title={title} className="relative">
					<picture className="block aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden">
						<img
							src={coverImg}
							alt={title}
							width="240"
							height="240"
							className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-all duration-500 ease-in-out"
							loading="lazy"
						/>
					</picture>
					<div className="w-full pt-3 pb-4">
						<h3 className="text-block font-normal my-0 pr-10">
							{title}
						</h3>
						<p className="text-block text-block--sm line-clamp-2 mt-1.5">
							{subtitle}
						</p>

						<div className="flex items-center mt-2 md:mt-3">
							<div className="w-6 h-6 mr-2 rounded-full overflow-hidden">
								<picture>
									<img
										src={avatarImg}
										alt={owner}
										width="32"
										height="32"
										className="w-full h-full object-cover"
										loading="lazy"
									/>
								</picture>
							</div>
							<div className="flex items-center justify-center">
								<span className="text-15 font-light inline-block text-grey-700">
									{owner}
								</span>
								<span className="mx-1.5 font-light inline-block text-grey-700">
									–
								</span>
								<span className="text-15 font-light inline-block text-grey-700">
									{publicationDate}
								</span>
							</div>
						</div>
					</div>
				</a>
			</Link>
		</article>
	);
};

export default RegularTripEntryBox;
