import Link from "next/link";
import { useEffect } from "react";

const Hero = ({ totals }) => {
	useEffect(() => {
		const underlinedElement = document.querySelector(".underlined-element");
		if (!underlinedElement) return;

		underlinedElement.classList.add("active");
	});

	const { activities, places, lists, stories } = totals;

	return (
		<>
			<section id="hero" className="flex items-stretch">
				<div className="flex-1 hidden md:block">
					<div className="bg-primary-100 rounded-br-lg overflow-hidden w-full h-full">
						<picture>
							<source
								srcset="../../home-portada-left.webp"
								type="image/webp"
							/>
							<img
								src="../../home-portada-left.jpg"
								alt=""
								className="w-full h-full object-cover"
								loading="eager"
								fetchpriority="high"
							/>
						</picture>
					</div>
				</div>
				<div className="w-full md:w-8/12 2xl:container px-3 flex items-center justify-center">
					<div className="bg-primary-900 bg-geo pt-24 pb-32 px-6 xl:px-20 h-full w-full overflow-hidden md:rounded-b-lg">
						<div className="relative z-10 md:min-h-[150px] lg:min-h-[300px] flex items-center justify-center">
							<div className="max-w-sm text-center ">
								<span className="uppercase text-sm text-white tracking-wider">
									escapadesenparella.cat
								</span>
								<h1 className="text-white mt-3 font-normal">
									La vostra propera escapada en parella{" "}
									<span className="underlined-element">
										comença aquí
									</span>
								</h1>
								<div className="flex flex-wrap items-center justify-center -mx-2.5 -mb-2.5 mt-12">
									<div className="p-2.5">
										<a
											href="/activitats"
											title="Activitats en parella"
											className="button border border-white text-white button__lg text-sm hover:bg-white hover:text-primary-500 transition-all duration-300 ease-in-out
										"
										>
											Veure activitats
										</a>
									</div>
									<div className="p-2.5">
										<a
											href="/allotjaments"
											title="Allotjaments amb encant Catalunya"
											className="button bg-white border border-white text-primary-500 button__lg text-sm hover:bg-secondary-600 hover:border-secondary-600 hover:text-white transition-all duration-300 ease-in-out
										"
										>
											Veure allotjaments
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="flex-1 hidden md:block">
					<div className="bg-primary-100 rounded-bl-lg overflow-hidden w-full h-full">
						<picture>
							<source
								srcset="../../home-portada-right.webp"
								type="image/webp"
							/>
							<img
								src="../../home-portada-right.jpg"
								alt=""
								className="w-full h-full object-cover"
								loading="eager"
								fetchpriority="high"
							/>
						</picture>
					</div>
				</div>

				{/* <div className="container -mt-16">
					<div className="flex justify-center">
						<div className="w-full lg:w-8/12 flex flex-wrap items-stretch justify-center bg-tertiary-200 rounded-md">
							<div className="w-full md:w-1/4 ">
								<div className="px-6 py-8 flex flex-col items-center">
									<span className="block text-2xl">
										+{activities}
									</span>
									<span className="block font-light text-primary-400 mt-0.5">
										activitats
									</span>
								</div>
							</div>
							<div className="w-full md:w-1/4 ">
								<div className="px-6 py-8 flex flex-col items-center">
									<span className="block text-2xl">
										+{places}
									</span>
									<Link href="/allotjaments">
										<a className="block font-light text-primary-400 mt-0.5">
											allotjaments
										</a>
									</Link>
								</div>
							</div>
							<div className="w-full md:w-1/4 ">
								<div className="px-6 py-8 flex flex-col items-center">
									<span className="block text-2xl">
										+{stories}
									</span>
									<span className="block font-light text-primary-400 mt-0.5">
										històries
									</span>
								</div>
							</div>
							<div className="w-full md:w-1/4 ">
								<div className="px-6 py-8 flex flex-col items-center">
									<span className="block text-2xl">
										+{lists}
									</span>
									<span className="block font-light text-primary-400 mt-0.5">
										llistes
									</span>
								</div>
							</div>
						</div>
					</div>
				</div> */}
			</section>
		</>
	);
};

export default Hero;
