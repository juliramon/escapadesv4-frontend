import React from "react";

const TripCategoryBox = ({ image, title, subtitle, slug }) => {
	return (
		<article className="px-3 w-full md:w-1/3 mb-6">
			<a
				href=""
				title={title}
				className="block bg-[#eeeeee] rounded-lg md:rounded-2xl overflow-hidden group h-full"
			>
				<div className="flex flex-wrap items-stretch h-full">
					<div className="w-full md:w-1/2">
						<picture className="block w-full h-full rounded-lg md:rounded-2xl bg-primary-300 overflow-hidden">
							<img
								src={image}
								alt={title}
								className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-all duration-700 ease-in-out"
								loading="lazy"
							/>
						</picture>
					</div>
					<div className="w-full md:w-1/2 p-10">
						<div className="max-w-xs flex flex-col h-full">
							<div className="flex-1">
								<h2 className="font-headingsCondensed text-2xl">
									{title}
								</h2>
								<div
									className="text-block text-sm mb-0 line-clamp-4"
									dangerouslySetInnerHTML={{
										__html: subtitle,
									}}
								></div>
							</div>
							<span className="inline-block uppercase tracking-widest text-xs mt-8 underline underline-offset-4">
								Llegir-ne més
							</span>
						</div>
					</div>
				</div>
			</a>
		</article>
	);
};

export default TripCategoryBox;
