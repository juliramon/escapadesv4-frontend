import Glide from "@glidejs/glide";
import Link from "next/link";
import { useEffect } from "react";

const Hero = () => {
	const slides = [
		{
			picture_webp: "home-cover-1.webp",
			picture_raw: "home-cover-1.jpg",
			picture_webp_mob: "home-cover-1-m.webp",
			picture_raw_mob: "home-cover-1-m.jpg",
			picture_alt: "La vostra propera escapada en parella comença aquí",
			tagline: "Escapadesenparella.cat",
			title: `La vostra propera escapada
			en parella
			<span class="underlined-element">
				comença aquí
			</span>`,
			button_link_1: "/activitats",
			button_text_1: "Veure activitats",
			button_link_2: "/allotjaments",
			button_text_2: "Veure allotjaments",
		},
	];

	useEffect(() => {
		const underlinedElement = document.querySelector(".underlined-element");
		if (!underlinedElement) return;

		underlinedElement.classList.add("active");

		const sliderSelector = ".js-glide-homeCover";
		const sliderElement = document.querySelector(sliderSelector);

		if (!sliderElement) return;

		new Glide(sliderSelector, {
			type: "carousel",
			startAt: 0,
			focusAt: "center",
			gap: 12,
			perView: 1,
			autoplay: false,
			animationDuration: 800,
			animationTimingFunc: "ease-in-out",
			breakpoints: {
				1024: {
					perView: 1,
				},
			},
		}).mount();
	});

	return (
		<>
			<section id="hero" className="flex items-stretch">
				<div
					className={`glide ${
						slides.length > 1 ? "js-glide-homeCover" : null
					} overflow-hidden`}
				>
					<div className="glide__track" data-glide-el="track">
						<div className="glide__slides">
							{slides.length > 0
								? slides.map((slide) => {
										return (
											<div
												key={slide.title}
												className="glide__slide"
											>
												<div className="flex flex-wrap items-stretch justify-center overflow-hidden">
													<div className="w-full md:w-1/2 bg-primary-300 hidden md:block">
														<picture className="block w-full h-full aspect-w-4 aspect-h-3">
															<source
																media="(max-width: 768px)"
																srcSet={
																	slide.picture_webp_mob
																}
																type="image/webp"
															/>
															<source
																media="(max-width: 768px)"
																srcSet={
																	slide.picture_raw_mob
																}
															/>
															<source
																media="(min-width: 768px)"
																srcSet={
																	slide.picture_webp
																}
																type="image/webp"
															/>
															<source
																media="(min-width: 768px)"
																srcSet={
																	slide.picture_raw
																}
															/>
															<img
																src={
																	slide.picture_raw
																}
																alt={
																	slide.picture_alt
																}
																className="w-full h-full object-cover"
																loading="eager"
																fetchpriority="high"
															/>
														</picture>
													</div>
													<div className="w-full md:w-1/2">
														<div className="bg-primary-900 relative pt-16 pb-20 md:pt-24 md:pb-32 px-6 xl:px-20 h-full w-full overflow-hidden after:bg-geo after:opacity-50 after:w-full after:h-full after:absolute after:inset-0 flex items-center justify-center rounded-lg md:rounded-none">
															<div className="relative z-10 md:min-h-[150px] lg:min-h-[300px] flex items-center justify-center">
																<div className="max-w-sm text-center ">
																	<span className="uppercase text-sm text-white tracking-wider">
																		{
																			slide.tagline
																		}
																	</span>
																	<h1
																		className="text-white mt-3 font-normal"
																		dangerouslySetInnerHTML={{
																			__html: slide.title,
																		}}
																	></h1>
																	<div className="flex flex-wrap items-center justify-center -mx-2.5 -mb-2.5 mt-12">
																		<div className="p-2.5">
																			<Link
																				href={
																					slide.button_link_1
																				}
																			>
																				<a
																					title={
																						slide.button_text_1
																					}
																					className="button border border-white text-white button__lg text-sm hover:bg-white hover:text-primary-500 transition-all duration-300 ease-in-out"
																				>
																					{
																						slide.button_text_1
																					}
																				</a>
																			</Link>
																		</div>
																		<div className="p-2.5">
																			<Link
																				href={
																					slide.button_link_2
																				}
																			>
																				<a
																					title={
																						slide.button_text_2
																					}
																					className="button bg-white border border-white text-primary-500 button__lg text-sm hover:bg-secondary-600 hover:border-secondary-600 hover:text-white transition-all duration-300 ease-in-out"
																				>
																					{
																						slide.button_text_2
																					}
																				</a>
																			</Link>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										);
								  })
								: null}
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default Hero;
