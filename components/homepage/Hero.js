import SearchBar from "../homepage/SearchBar";

const Hero = ({ background_url, title, subtitle }) => {
	return (
		<>
			<section id="hero" className="relative pt-8 lg:pt-12">
				<div className="absolute top-0 left-0 w-full h-full hero__bg opacity-40"></div>
				<div className="container relative z-40">
					<div className="w-full lg:w-10/12 xl:w-8/12 lg:mx-auto">
						<div className="pb-14">
							<div className="relative z-30 w-full md:w-10/12 md:mx-auto">
								<div className="rounded-lg bg-red-100 px-8 py-7 flex flex-wrap items-center justify-center ">
									<span className="opacity-70 tracking-widest uppercase block w-full text-center text-sm">
										Anunci
									</span>
									<span class="w-full block font-bold text-xl text-center">
										Banner a la pàgina principal
									</span>
								</div>
								<span className="absolute right-0 -bottom-5 text-xs">
									Anuncia't
								</span>
							</div>
						</div>
						<div className="header-col left">
							<h1 className="text-2xl leading-tight md:leading-1.1 md:text-5xl">
								<span className="text-secondary-500 ">
									Escapadesenparella.cat.{" "}
								</span>
								{title}
							</h1>
							<SearchBar />
						</div>
					</div>
				</div>
				<div className="bg-white absolute bottom-0 w-full h-20 z-30 hero__gradient"></div>
				<div
					id="animate-area"
					style={{ backgroundImage: `url(${background_url})` }}
				></div>
			</section>
		</>
	);
};

export default Hero;
