import SearchBar from "../homepage/SearchBar";

const Hero = () => {
	return (
		<>
			<section id="hero" className="relative py-8 lg:py-20 z-40">
				<div className="absolute top-0 left-0 w-full h-full hero__bg opacity-40"></div>
				<div className="container relative z-40">
					<div className="w-full lg:w-10/12 xl:w-8/12 lg:mx-auto">
						<div className="header-col left">
							<h1 className="text-2xl md:text-4xl max-w-3xl">
								<span className="text-secondary-500 ">
									Escapadesenparella.cat.{" "}
								</span>
								La vostra propera escapada en parella comença aquí.
							</h1>
							<SearchBar />
						</div>
					</div>
				</div>
				<div className="bg-white absolute bottom-0 w-full h-20 z-30 hero__gradient"></div>
			</section>
		</>
	);
};

export default Hero;
