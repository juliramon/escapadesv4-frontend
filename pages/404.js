import Footer from "../components/global/Footer";
import NavigationBar from "../components/global/NavigationBar";
import GlobalMetas from "../components/head/GlobalMetas";

const Error404 = () => {
	return (
		<>
			<GlobalMetas
				title={"Pàgina no trobada"}
				description={`Ho sentim, la pàgina que busques no s'ha trobat. Torna-ho a intentar de nou.`}
			/>
			<NavigationBar />
			<main>
				<section className="py-10 md:py-20 lg:py-36 relative">
					<div className="container relative z-10">
						<div className="flex flex-wrap items-start justify-center -mx-6">
							<div className="w-full md:w-auto flex justify-center px-6">
								<span className="text-primary-600 text-6xl lg:text-8xl font-heading font-bold !leading-none inline-block">
									404
								</span>
							</div>
							<div className="w-full md:max-w-xl px-6 text-center md:text-left mt-5 md:mt-2">
								<div className="max-w-xs mx-auto md:max-w-full">
									<h1 className="mt-0 mb-5">Pàgina no trobada</h1>
									<p className="text-primary-400">
										La pàgina sol·licitada no està disponible, o potser ha
										canviat de direcció, disculpa les molèsties.
									</p>
									<p className="text-primary-400">
										Amb freqüència és degut a un error a l'escriure la direcció
										de la pàgina que estàs intentant accedir. Comprova-ho de nou
										a veure si és correcte.
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
};

export default Error404;
