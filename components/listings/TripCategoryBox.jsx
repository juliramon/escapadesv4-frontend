import Link from "next/link";
import React from "react";

const TripCategoryBox = ({ image, title, subtitle, slug, country }) => {
	return (
		<article className="px-3 w-full lg:w-1/2 xl:w-1/3 mb-6">
			<Link href={`/viatges/${slug}`}>
				<a
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
									<h2 className="text-xl my-0 font-medium">
										{title}
									</h2>
									<div
										className="text-block mt-1.5 text-15 text-primary-400 line-clamp-4"
										dangerouslySetInnerHTML={{
											__html: subtitle,
										}}
									></div>
								</div>
								<div class="mt-6 flex items-center justify-between">
									<div class="inline-flex items-center justify-center text-sm leading-tight">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="icon icon-tabler icon-tabler-globe mr-1.5"
											width={15}
											height={15}
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											fill="none"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path
												stroke="none"
												d="M0 0h24v24H0z"
												fill="none"
											></path>
											<path d="M7 9a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
											<path d="M5.75 15a8.015 8.015 0 1 0 9.25 -13"></path>
											<path d="M11 17v4"></path>
											<path d="M7 21h8"></path>
										</svg>

										{country}
									</div>
									<span class="text-13 text-tertiary-800 group-hover:text-tertiary-900 transition-all duration-300 ease-in-out inline-flex items-center leading-tight">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="mr-1"
											width="15"
											height="15"
											viewBox="0 0 24 24"
											strokeWidth="2"
											stroke="currentColor"
											fill="none"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<path
												stroke="none"
												d="M0 0h24v24H0z"
												fill="none"
											></path>
											<path d="M12 5l0 14"></path>
											<path d="M5 12l14 0"></path>
										</svg>
										Veure'n més
									</span>
								</div>
							</div>
						</div>
					</div>
				</a>
			</Link>
		</article>
	);
};

export default TripCategoryBox;
