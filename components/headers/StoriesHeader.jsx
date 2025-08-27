import ShareBarModal from "../social/ShareBarModal";

const Hero = () => {
	return (
		<section className="lg:mt-6">
			<div className="container">
				{/* Breadcrumb + article header */}
				<ul className="breadcrumb max-w-5xl ">
					<li className="breadcrumb__item">
						<a href="/" title="Inici" className="breadcrumb__link">
							Inici
						</a>
					</li>
					<li className="breadcrumb__item">
						<span className="breadcrumb__link active">
							Històries en parella
						</span>
					</li>
				</ul>

				{/* Article heading + subtitle + meta info */}
				<div className="relative pt-4 md:pt-8">
					<div className="md:max-w-xl lg:max-w-5xl">
						<h1 className="font-display max-w-2xl my-0">
							<span class="text-secondary-500">Històries</span> en
							parella
						</h1>
						<p className="text-block mt-2.5 mb-3 md:mt-3 md:mb-4 max-w-2xl">
							Les històries en parella de l'Andrea i en Juli. Aquí
							trobareu les nostres escapades viscudes de primera
							mà, històries per inspirar, descobrir llocs nous i
							fer-vos venir ganes d'una escapada en parella per
							recordar!
						</p>
						<div className="mt-5">
							<ShareBarModal
								picture={null}
								title={"Històries en parella"}
								rating={null}
								slug={
									"https://escapadesenparella.cat/histories"
								}
								locality={null}
								colorClass={""}
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;
