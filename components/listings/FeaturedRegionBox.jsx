import React from "react";

const FeaturedRegionBox = ({ image, title, slug }) => {
	return (
		<div className="w-full px-1.5 py-2 border-none">
			<a
				href={`escapades-catalunya/${slug}`}
				className="block w-full h-full rounded-md overflow-hidden group"
				title={title}
			>
				<div className="relative w-full h-full aspect-w-3 aspect-h-4 scale-100 group-hover:scale-110 transition-all duration-500 ease-in-out">
					<picture>
						<img
							src={image}
							alt={title}
							className="w-full h-full object-cover"
							width="300"
							height="400"
							loading="lazy"
						/>
					</picture>
				</div>
			</a>
		</div>
	);
};

export default FeaturedRegionBox;
