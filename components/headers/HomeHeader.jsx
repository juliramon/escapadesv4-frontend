import Glide from "@glidejs/glide";
import Link from "next/link";
import { useEffect } from "react";
import { getPicturesBySeason } from "../../utils/helpers";
import Image from "next/image";

const Hero = () => {
	const firstSlidePictures = {
		spring: {},
		summer: {
			picture_webp: "/home-cover-estiu.webp",
			picture_raw: "/home-cover-estiu.jpg",
			picture_webp_mob: "/home-cover-estiu-m.webp",
			picture_raw_mob: "/home-cover-estiu-m.jpg",
		},
		autumn: {
			picture_webp: "/home-cover-tardor.webp",
			picture_raw: "/home-cover-tardor.jpg",
			picture_webp_mob: "/home-cover-tardor-m.webp",
			picture_raw_mob: "/home-cover-tardor-m.jpg",
		},
		winter: {
			picture_webp: "/home-cover-hivern.webp",
			picture_raw: "/home-cover-hivern.jpg",
			picture_webp_mob: "/home-cover-hivern-m.webp",
			picture_raw_mob: "/home-cover-hivern-m.jpg",
		},
	};

	const currentDate = new Date();
	const slideImage = getPicturesBySeason(currentDate, firstSlidePictures);

	const slides = [
		{
			picture_webp: slideImage.picture_webp,
			picture_raw: slideImage.picture_raw,
			picture_webp_mob: slideImage.picture_webp_mob,
			picture_raw_mob: slideImage.picture_raw_mob,
			picture_alt: "La vostra propera escapada en parella a Catalunya comença aquí",
			tagline: "Escapadesenparella.cat",
			title: `La vostra propera escapada
			en parella a Catalunya
			<span class="underlined-element">
				comença aquí
			</span>`,
			button_link_1: "/activitats",
			button_text_1: "Veure experiències",
			button_title_1: "Veure experiències originals a Catalunya",
			button_link_2: "/allotjaments",
			button_text_2: "Veure allotjaments",
			button_title_2: "Veure allotjaments amb encant a Catalunya",
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
					className={`glide ${slides.length > 1 ? "js-glide-homeCover" : null
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
												<div className="w-full md:w-1/2 bg-primary-300">
													<picture className="block w-full h-full aspect-w-4 aspect-h-3 md:aspect-w-16 md:aspect-h-9 relative">
														<Image src={slide.picture_raw} alt={slide.picture_alt} layout="fill" objectFit="cover" priority={true} loading="eager" />
													</picture>
												</div>
												<div className="w-full md:w-1/2">
													<div className="bg-primary-900 relative pt-8 pb-8 md:pt-24 md:pb-32 px-6 xl:px-20 h-full w-full overflow-hidden after:bg-geo after:opacity-50 after:w-full after:h-full after:absolute after:inset-0 flex items-center justify-center">
														<div className="relative z-10 md:min-h-[150px] lg:min-h-[300px] flex items-center justify-center">
															<div className="max-w-md ">
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
																<div className="flex flex-wrap items-center md:-mx-2.5 md:-mb-2.5 mt-9 md:mt-12">
																	<div className="w-full md:w-auto mb-2.5 md:mb-0 md:p-2.5">
																		<Link
																			href={
																				slide.button_link_1
																			}
																		>
																			<a
																				title={
																					slide.button_title_1
																				}
																				className="button border border-white text-white button__lg w-full md:w-auto justify-center text-sm hover:bg-white hover:text-primary-500 transition-all duration-300 ease-in-out"
																			>
																				{
																					slide.button_text_1
																				}
																			</a>
																		</Link>
																	</div>
																	<div className="w-full md:w-auto md:p-2.5">
																		<Link
																			href={
																				slide.button_link_2
																			}
																		>
																			<a
																				title={
																					slide.button_title_2
																				}
																				className="button bg-white border border-white text-primary-500 button__lg w-full md:w-auto justify-center text-sm hover:bg-secondary-600 hover:border-secondary-600 hover:text-white transition-all duration-300 ease-in-out"
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
