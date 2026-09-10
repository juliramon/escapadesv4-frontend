import Link from "next/link";
import { useEffect, useState } from "react";
import ContentService from "../../services/contentService";
import NewsletterCta from "../homepage/NewsletterCta";

const Footer = () => {
	const [state, setState] = useState({
		placeCategories: [],
		activityCategories: [],
	});

	useEffect(() => {
		// El servei es crea aquí dins: fora, es tornava a instanciar a cada
		// render encara que només es faci servir un cop.
		const service = new ContentService();

		const fetchData = async () => {
			try {
				const categories = await service.getCategories();
				if (!Array.isArray(categories)) return;

				// Abans es repartien amb un `filter` que no retornava res i
				// que omplia dos arrays per efecte secundari; i els `setState`
				// escampaven un `state` ranci capturat al primer render.
				setState({
					placeCategories: categories.filter(
						(category) => category.isPlace == true,
					),
					activityCategories: categories.filter(
						(category) => category.isPlace != true,
					),
				});
			} catch (error) {
				console.error(error);
			}
		};

		fetchData();
	}, []);

	let copyrightDate = new Date();
	copyrightDate = copyrightDate.getFullYear();

	return (
		<>
			<NewsletterCta />
			<footer id="footer" className="pt-6 pb-2 lg:pt-8">
				<div className="container">
					<div className="w-full border-b border-primary-50 py-8">
						<div className="flex flex-wrap items-center max-w-md">
							<picture className="inline-block shrink-0">
								<img
									src="/logo-escapades-en-parella.svg"
									alt="Logo Escapadesenparella.cat"
									width={144}
									height={40}
									className="w-36 md:w-44 h-auto"
									loading="lazy"
								/>
							</picture>
							<span className="flex-1 text-sm inline-block mt-4 md:ml-6 border-t md:border-t-0 md:border-l border-primary-50 pt-4 md:pt-0 md:pl-6 opacity-70">
								Escapadesenparella.cat és el recomanador
								especialista d'escapades en parella a Catalunya.
							</span>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 xl:gap-x-12 gap-y-8 py-8">
						<div className="w-full">
							<div className="footer-content">
								<span className="footer-header text-xl mb-2 inline-block">
									Escapades en parella
								</span>
								<ul className="list-none m-0 p-0">
									<li className="py-1.5 text-sm xl:text-15 leading-tight">
										<Link href="/allotjaments">
											<a title="Allotjaments amb encant a Catalunya">
												Allotjaments
											</a>
										</Link>
									</li>
									<li className="py-1.5 text-sm xl:text-15 leading-tight">
										<Link href="/activitats">
											<a title="Experiències en parella">
												Experiències
											</a>
										</Link>
									</li>
									<li className="py-1.5 text-sm xl:text-15 leading-tight">
										<Link href="/histories">
											<a title="Històries en parella">
												Històries en parella
											</a>
										</Link>
									</li>
									<li className="py-1.5 text-sm xl:text-15 leading-tight">
										<Link href="/llistes">
											<a title="Llistes d'escapades en parella">
												Llistes d&apos;escapades
											</a>
										</Link>
									</li>
									<li className="py-1.5 text-sm xl:text-15 leading-tight">
										<Link href="/viatges">
											<a title="Viatges en parella">
												Viatges en parella
											</a>
										</Link>
									</li>
									<li className="py-1.5 text-sm xl:text-15 leading-tight">
										<Link href="/destinacions">
											<a title="Destinacions per a escapades en parella">
												Destinacions
											</a>
										</Link>
									</li>
								</ul>
							</div>
						</div>
						<div className="w-full">
							<div className="footer-content">
								<span className="footer-header text-xl mb-2 inline-block">
									Per tipus d&apos;escapada
								</span>
								<ul className="list-none m-0 p-0">
									{state.activityCategories
										? state.activityCategories.map(
												(category, idx) => (
													<li
														key={idx}
														className="py-1.5 text-sm xl:text-15 leading-tight"
													>
														<Link
															href={
																"/" +
																category.slug
															}
														>
															<a
																title={
																	category.title
																}
															>
																{category.title}
															</a>
														</Link>
													</li>
												),
											)
										: null}
								</ul>
							</div>
						</div>
						<div className="w-full">
							<div className="footer-content">
								<span className="footer-header text-xl mb-2 inline-block">
									Allotjaments amb encant
								</span>
								<ul className="list-none m-0 p-0">
									{state.placeCategories
										? state.placeCategories.map(
												(category, idx) => (
													<li
														key={idx}
														className="py-1.5 text-sm xl:text-15 leading-tight"
													>
														<Link
															href={
																"/" +
																category.slug
															}
														>
															<a
																title={
																	category.title
																}
															>
																{category.title}
															</a>
														</Link>
													</li>
												),
											)
										: null}
								</ul>
							</div>
						</div>
						<div className="w-full">
							<div className="footer-about">
								<span className="footer-header text-xl mb-2 inline-block">
									Nosaltres
								</span>
								<ul className="list-none m-0 p-0">
									<li className="py-1.5 text-sm xl:text-15 leading-tight">
										<Link href="/sobre-nosaltres">
											<a title="Sobre Escapadesenparella.cat">
												Sobre nosaltres
											</a>
										</Link>
									</li>
									<li className="py-1.5 text-sm xl:text-15 leading-tight">
										<Link href="/premsa-i-mitjans">
											<a title="Premsa i mitjans">
												Premsa i mitjans
											</a>
										</Link>
									</li>
									{/* <li className="py-1.5 text-sm xl:text-15 leading-tight">
										<Link href="/empreses">
											<a title="Serveis per a empreses">
												Serveis empreses
											</a>
										</Link>
									</li> */}
									<li className="py-1.5 text-sm xl:text-15 leading-tight">
										<Link href="/descomptes-viatjar">
											<a title="Descomptes per viatjar">
												Descomptes per viatjar
											</a>
										</Link>
									</li>
									<li className="py-1.5 text-sm xl:text-15 leading-tight">
										<Link href="/newsletter">
											<a title="Subscriu-te a la newsletter">
												Subscriu-te a la newsletter
											</a>
										</Link>
									</li>
									<li className="pt-1.5 text-sm xl:text-15 leading-tight">
										<Link href="/contacte">
											<a title="Contacte">Contacte</a>
										</Link>
									</li>
								</ul>
							</div>
						</div>
					</div>

					{/* Xarxes socials, centrades i just abans dels enllaços legals. */}
					<div className="w-full border-y border-primary-50 py-8">
						<div className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-y-3 gap-x-6">
							<p className="m-0 max-w-sm">
								<span className="block text-15 xl:text-16 text-grey-700">
									No et perdis cap escapada en parella
								</span>
								<span className="block text-sm text-grey-400">
									A les xarxes hi publiquem les escapades
									noves, els allotjaments amb encant que
									trobem i els descomptes per viatjar.
								</span>
							</p>
							<ul className="list-none flex items-center justify-center m-0 p-0 space-x-5">
								<li className="py-1 text-sm xl:text-15 leading-tight">
									<a
										href="https://www.instagram.com/escapadesenparella"
										title="Segueix-nos a Instagram"
										aria-label="Segueix-nos a Instagram"
										target="_blank"
										className="flex items-center justify-center"
										rel="noopener noreferrer"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="icon icon-tabler icon-tabler-brand-instagram"
											width="22"
											height="22"
											viewBox="0 0 24 24"
											strokeWidth="1.5"
											stroke="currentColor"
											fill="none"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path
												stroke="none"
												d="M0 0h24v24H0z"
												fill="none"
											/>
											<rect
												x="4"
												y="4"
												width="16"
												height="16"
												rx="4"
											/>
											<circle cx="12" cy="12" r="3" />
											<line
												x1="16.5"
												y1="7.5"
												x2="16.5"
												y2="7.501"
											/>
										</svg>
									</a>
								</li>
								<li className="py-1 text-sm xl:text-15 leading-tight">
									<a
										href="https://twitter.com/escapaenparella"
										title="Segueix-nos a Twitter"
										aria-label="Segueix-nos a Twitter"
										target="_blank"
										className="flex items-center justify-center"
										rel="noopener noreferrer"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="icon icon-tabler icon-tabler-brand-twitter"
											width="22"
											height="22"
											viewBox="0 0 24 24"
											strokeWidth="1.5"
											stroke="currentColor"
											fill="none"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path
												stroke="none"
												d="M0 0h24v24H0z"
											/>
											<path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497 -3.753C20.18 7.773 21.692 5.25 22 4.009z" />
										</svg>
									</a>
								</li>
								<li className="py-1 text-sm xl:text-15 leading-tight">
									<a
										href="https://facebook.com/escapadesenparella"
										title="Segueix-nos a Facebook"
										aria-label="Segueix-nos a Facebook"
										target="_blank"
										className="flex items-center justify-center"
										rel="noopener noreferrer"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="icon icon-tabler icon-tabler-brand-facebook"
											width="22"
											height="22"
											viewBox="0 0 24 24"
											strokeWidth="1.5"
											stroke="currentColor"
											fill="none"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path
												stroke="none"
												d="M0 0h24v24H0z"
												fill="none"
											/>
											<path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" />
										</svg>
									</a>
								</li>
							</ul>
						</div>
					</div>

					<div className="w-full py-8 flex flex-wrap items-center justify-between">
						<div className="opacity-70 text-sm block">
							Copyright © {copyrightDate}. Tots els drets
							reservats. <br />
							Codi i UI/UX:{" "}
							<a
								href="https://github.com/juliramon"
								target="_blank"
								rel="noopener noreferrer nofollow"
							>
								<u>Juli Ramon</u>
							</a>
							<br />
							Il·lustracions i disseny gràfic:{" "}
							<a
								href="https://andreaprat.cat"
								target="_blank"
								rel="noopener noreferrer nofollow"
							>
								<u>Andrea Prat</u>
							</a>
							<br />
							Desenvolupat i gestionat amb{" "}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="icon icon-tabler icon-tabler-heart inline relative -top-0.5"
								width="18"
								height="18"
								viewBox="0 0 24 24"
								strokeWidth="1.5"
								stroke="#00206B"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path stroke="none" d="M0 0h24v24H0z"></path>
								<path
									fill="red"
									stroke="none"
									d="M12 20l-7 -7a4 4 0 0 1 6.5 -6a.9 .9 0 0 0 1 0a4 4 0 0 1 6.5 6l-7 7"
								></path>
							</svg>{" "}
							a Catalunya
						</div>
						<ul className="list-none m-0 p-0 flex flex-col md:flex-row md:items-center gap-x-4 gap-y-2 opacity-70">
							<li className="text-sm xl:text-15">
								<Link href="/politica-privadesa">
									<a>Política de privadesa</a>
								</Link>
							</li>
							<li className="text-sm xl:text-15">
								<Link href="/condicions-us">
									<a>Condicions d'ús</a>
								</Link>
							</li>
							<li className="text-sm xl:text-15">
								<Link href="/politica-privadesa#politicacookies">
									<a>Política de cookies</a>
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</footer>
		</>
	);
};

export default Footer;
