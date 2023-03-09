import AdSkyScrapperHoritzontal728x90 from "../ads/AdSkyScrapperHoritzontal728x90";
import SearchBar from "../homepage/SearchBar";

const Hero = () => {
	return (
		<>
			<section id="hero" className="relative pt-8 lg:pt-20 z-40">
				<div className="absolute top-0 left-0 w-full h-full hero__bg opacity-40"></div>
				<div className="container relative z-40">
					<div className="header-col left">
						<h1 className="text-2xl md:text-4xl xl:text-5xl max-w-5xl">
							<span className="text-secondary-500 ">
								Escapadesenparella.cat.{" "}
							</span>
							La vostra propera escapada en parella comença aquí.
						</h1>
						<SearchBar />
						<div className="mt-4 md:mt-8">
							<AdSkyScrapperHoritzontal728x90 />
						</div>
					</div>
				</div>
				<div className="bg-white absolute bottom-0 w-full h-20 z-30 hero__gradient"></div>
			</section>
		</>
	);
};

export default Hero;
