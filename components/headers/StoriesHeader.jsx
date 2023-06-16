import { useEffect } from "react";
import StoryListing from "../listings/StoryListing";
import ShareBar from "../social/ShareBar";

const Hero = ({ mostRecentStories }) => {
	useEffect(() => {
		const underlinedElement = document.querySelector(".underlined-element");
		if (!underlinedElement) return;

		underlinedElement.classList.add("active");
	});

	return (
		<>
			<section id="hero" className="flex flex-wrap items-stretch">
				<div className="w-full bg-primary-900 flex items-center justify-center verflow-hidden relative pt-10 md:pt-20 pb-20 md:pb-44 px-6 xl:px-20 bg-geo">
					<div className="max-w-sm text-center relative z-10">
						<div className="flex justify-center">
							<ul className="breadcrumb">
								<li className="breadcrumb__item text-white">
									<a
										href="/"
										title="Inici"
										className="breadcrumb__link"
									>
										Inici
									</a>
								</li>
								<li className="breadcrumb__item">
									<span className="breadcrumb__link active text-white">
										Històries
									</span>
								</li>
							</ul>
						</div>
						<h1 className="text-white mt-3 font-normal">
							Històries{" "}
							<span className="underlined-element">
								en parella
							</span>
						</h1>
						<p className="text-white mt-6 mb-0">
							Les nostres històries en parella; històries per
							inspirar, descobrir llocs nous i fer-vos venir ganes
							d'una escapada en parella per recordar!
						</p>
						<div className="flex justify-center mt-5">
							<ShareBar />
						</div>
					</div>
				</div>

				<div className="w-full max-w-[1600px] mx-auto -mt-10 md:-mt-28 rounded-md overflow-hidden px-6">
					<div className="flex flex-wrap items-stretch -mx-2">
						{mostRecentStories.length > 0
							? mostRecentStories.map((story, idx) => (
									<article
										key={idx}
										className="w-full md:w-1/2 lg:w-1/3 px-2 mb-6 lg:mb-0"
									>
										<StoryListing
											story={story}
											index={idx}
										/>
									</article>
							  ))
							: ""}
					</div>
				</div>
			</section>
		</>
	);
};

export default Hero;
