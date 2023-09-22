import Link from "next/link";
import Footer from "../components/global/Footer";
import NavigationBar from "../components/global/NavigationBar";
import Plans from "../components/global/Plans";
import GlobalMetas from "../components/head/GlobalMetas";
import BreadcrumbRichSnippet from "../components/richsnippets/BreadcrumbRichSnippet";

const Serveis = () => {
	return (
		<>
			{/* Browser metas  */}
			<GlobalMetas
				title="Empreses"
				description="Multiplica la teva presència online... i els teus clients amb Escapadesenparella.cat. Clica per veure com et podem ajudar."
				url="https://escapadesenparella.cat/empreses"
				image="https://res.cloudinary.com/juligoodie/image/upload/v1621536007/getaways-guru/static-files/graphic-plans-3_lrey6s.png"
				canonical="https://escapadesenparella.cat/empreses"
			/>
			{/* Rich snippets */}
			<BreadcrumbRichSnippet
				page1Title="Inici"
				page1Url="https://escapadesenparella.cat"
				page2Title="Empreses"
				page2Url={`https://escapadesenparella.cat/empreses`}
			/>
			<NavigationBar
				logo_url={
					"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
				}
			/>
			<main className="services w-full xl:w-8/12 mx-auto">
				<div className="pt-6">
					<div className="container">
						<ul className="breadcrumb">
							<li className="breadcrumb__item">
								<a
									href="/"
									title="Inici"
									className="breadcrumb__link"
								>
									Inici
								</a>
							</li>
							<li className="breadcrumb__item">
								<span className="breadcrumb__link active">
									Empreses
								</span>
							</li>
						</ul>
					</div>
				</div>
				<section className="py-12 md:pt-24">
					<div className="container">
						<div className="flex flex-wrap items-start">
							<div className="w-full">
								<div className="flex flex-wrap items-center">
									<div className="w-full md:w-1/2">
										<h1 className="mb-4">
											Multiplica la teva presència
											online... i els teus clients
										</h1>
										<p className="text-xl">
											Amplia la visibilitat del teu negoci
											llistant-lo al recomanador
											especialista en escapades en parella
											a Catalunya
										</p>
										<Link
											href={
												"/empreses/registre?step=seleccio-pla"
											}
										>
											<a className="button button__primary button__lg mt-4">
												Publicar el meu negoci{" "}
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="icon icon-tabler icon-tabler-arrow-narrow-right"
													width="20"
													height="20"
													viewBox="0 0 24 24"
													strokeWidth="1.5"
													stroke="#ffffff"
													fill="none"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<path
														stroke="none"
														d="M0 0h24v24H0z"
														fill="none"
													/>
													<line
														x1="5"
														y1="12"
														x2="19"
														y2="12"
													/>
													<line
														x1="15"
														y1="16"
														x2="19"
														y2="12"
													/>
													<line
														x1="15"
														y1="8"
														x2="19"
														y2="12"
													/>
												</svg>
											</a>
										</Link>
									</div>
									<div className="w-full md:w-1/2 mt-5 lg:mt-0">
										<picture>
											<img
												src="https://res.cloudinary.com/juligoodie/image/upload/v1621536007/getaways-guru/static-files/graphic-plans-3_lrey6s.png"
												className="w-full h-full object-cover"
												loading="eager"
											/>
										</picture>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="py-12">
					<div className="container">
						<div className="flex flex-wrap items-start">
							<div className="w-full">
								<h3 className="text-center max-w-lg mx-auto">
									Alguns dels allotjaments i activitats que
									han confiat,
									<br />i confien en nosaltres
								</h3>
								<div className="logos-bar mt-5">
									<img src="https://res.cloudinary.com/juligoodie/image/upload/v1621538629/getaways-guru/static-files/graphic-plans-4_luvtvr.png" />
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="services__signup py-12">
					<div className="container">
						<div className="flex flex-wrap items-start">
							<div className="w-full md:w-1/2">
								<h2 className="">Llista el teu negoci...</h2>
								<p className="max-w-xl">
									El teu negoci es veurà perfecte en qualsevol
									dispositiu.
									<br />
									Et donaràs a conèixer a nous clients, amb
									tota la informació que necessiten, i amb
									accés directe a reservar els teus serveis.
								</p>
								<ul>
									<li>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="icon icon-tabler icon-tabler-circle-check"
											width="22"
											height="22"
											viewBox="0 0 24 24"
											strokeWidth="1.5"
											stroke="#FF8D76"
											fill="none"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path
												stroke="none"
												d="M0 0h24v24H0z"
												fill="none"
											/>
											<circle cx="12" cy="12" r="9" />
											<path d="M9 12l2 2l4 -4" />
										</svg>
										Gal·leria d'imatges
									</li>
									<li>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="icon icon-tabler icon-tabler-circle-check"
											width="22"
											height="22"
											viewBox="0 0 24 24"
											strokeWidth="1.5"
											stroke="#FF8D76"
											fill="none"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path
												stroke="none"
												d="M0 0h24v24H0z"
												fill="none"
											/>
											<circle cx="12" cy="12" r="9" />
											<path d="M9 12l2 2l4 -4" />
										</svg>
										Descripció del negoci
									</li>
									<li>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="icon icon-tabler icon-tabler-circle-check"
											width="22"
											height="22"
											viewBox="0 0 24 24"
											strokeWidth="1.5"
											stroke="#FF8D76"
											fill="none"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path
												stroke="none"
												d="M0 0h24v24H0z"
												fill="none"
											/>
											<circle cx="12" cy="12" r="9" />
											<path d="M9 12l2 2l4 -4" />
										</svg>
										Serveis i preus
									</li>
									<li>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="icon icon-tabler icon-tabler-circle-check"
											width="22"
											height="22"
											viewBox="0 0 24 24"
											strokeWidth="1.5"
											stroke="#FF8D76"
											fill="none"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path
												stroke="none"
												d="M0 0h24v24H0z"
												fill="none"
											/>
											<circle cx="12" cy="12" r="9" />
											<path d="M9 12l2 2l4 -4" />
										</svg>
										Telèfon i mail de contacte
									</li>
									<li>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="icon icon-tabler icon-tabler-circle-check"
											width="22"
											height="22"
											viewBox="0 0 24 24"
											strokeWidth="1.5"
											stroke="#FF8D76"
											fill="none"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path
												stroke="none"
												d="M0 0h24v24H0z"
												fill="none"
											/>
											<circle cx="12" cy="12" r="9" />
											<path d="M9 12l2 2l4 -4" />
										</svg>
										Reserves
									</li>
									<li>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="icon icon-tabler icon-tabler-circle-check"
											width="22"
											height="22"
											viewBox="0 0 24 24"
											strokeWidth="1.5"
											stroke="#FF8D76"
											fill="none"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path
												stroke="none"
												d="M0 0h24v24H0z"
												fill="none"
											/>
											<circle cx="12" cy="12" r="9" />
											<path d="M9 12l2 2l4 -4" />
										</svg>
										Xarxes social
									</li>
								</ul>
							</div>
							<div className="w-full md:w-1/2 mt-5 lg:mt-0">
								<picture>
									<img
										src="https://res.cloudinary.com/juligoodie/image/upload/v1621535038/getaways-guru/static-files/graphic-plans-2_r3ffv2.png"
										className="w-full h-full object-cover"
										loading="lazy"
									/>
								</picture>
							</div>
						</div>
					</div>
				</section>
				<span id="plans"></span>
				<section className="services__plans">
					<Plans />
				</section>
			</main>
			<Footer
				logo_url={
					"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
				}
			/>
		</>
	);
};

export default Serveis;
