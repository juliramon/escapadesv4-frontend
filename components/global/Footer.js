import Link from "next/link";
import { useEffect, useState } from "react";
import ContentService from "../../services/contentService";
import NewsletterService from "../../services/newsletterService";

const Footer = () => {
	const service = new ContentService();
	const [state, setState] = useState({
		placeCategories: [],
		activityCategories: [],
	});

	const [newsletterFormData, setNewsletterFormData] = useState({
		name: "",
		email: "",
		serverMessage: "",
		submitted: false,
		error: false,
	});

	const newsletterService = new NewsletterService();

	useEffect(() => {
		const fetchData = async () => {
			setState({ ...state, isFetching: true });
			const categories = await service.getCategories();

			if (categories.length > 0) {
				let placeCategories = [];
				let activityCategories = [];

				categories.filter((el) => {
					if (el.isPlace == true) {
						placeCategories.push(el);
					} else {
						activityCategories.push(el);
					}
				});

				setState({
					...state,
					placeCategories: placeCategories,
					activityCategories: activityCategories,
				});
			}
		};
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	let copyrightDate = new Date();
	copyrightDate = copyrightDate.getFullYear();

	const handleNewsletterFormChange = (e) => {
		setNewsletterFormData({
			...newsletterFormData,
			[e.target.name]: e.target.value,
		});
	};

	const handleNewsletterFormSubmit = (e) => {
		e.preventDefault();
		const { name, email } = newsletterFormData;

		if (name !== "" && email !== "") {
			newsletterService.subscribeToNewsletter(name, email).then((res) => {
				if (res.status === 200) {
					setNewsletterFormData({
						...newsletterFormData,
						serverMessage: res.message,
						submitted: true,
						error: false,
					});
				}
				if (res.status === 400 || res.status === 500) {
					setNewsletterFormData({
						...newsletterFormData,
						serverMessage: res.message,
						error: true,
					});
				}
			});
		}
	};

	return (
		<>
			<section className="py-12 md:py-16 lg:py-20 bg-tertiary-50">
				<div className="container">
					<div className="max-w-5xl mx-auto">
						<div className="relative flex flex-wrap items-center">
							<picture className="block w-64 lg:w-96 h-auto mx-auto mix-blend-multiply">
								<source
									srcSet="/email-confirmation.webp"
									type="image/webp"
								/>
								<img
									src="/email-confirmation.jpg"
									width="256"
									height="170"
									className="w-full h-auto object-contain"
									alt="Subscriu-te a la nostra newsletter"
									loading="lazy"
								/>
							</picture>
							<div className="w-full lg:w-auto flex flex-col lg:flew-row items-center lg:items-start gap-5 pt-6 md:pt-0 lg:pl-16 lg:flex-1 max-w-md lg:max-w-full mx-auto lg:mx-0">
								<div className="w-full mb-3">
									<h2 className="mb-2 text-center md:text-left">
										Subscriu-te a la nostra newsletter
									</h2>
									<p className="mb-0 text-center md:text-left">
										Per rebre les últimes novetats i ofertes
									</p>
								</div>
								{!newsletterFormData.submitted ? (
									<form
										className="form flex flex-wrap items-center flex-1"
										onSubmit={handleNewsletterFormSubmit}
									>
										<fieldset className="form__group w-full md:w-auto">
											<label
												htmlFor="name"
												className="form__label"
											>
												Nom
											</label>
											<input
												type="text"
												id="name"
												name="name"
												onChange={
													handleNewsletterFormChange
												}
												className="form__control bg-white"
											/>
										</fieldset>
										<fieldset className="form__group w-full md:w-auto flex-1">
											<label
												htmlFor="email"
												className="form__label"
											>
												Correu electrònic
											</label>
											<input
												type="email"
												id="email"
												name="email"
												onChange={
													handleNewsletterFormChange
												}
												className="form__control bg-white"
											/>
										</fieldset>
										<fieldset className="form__group w-full lg:w-auto">
											<button
												type="submit"
												className="button button__med button__primary justify-center md:mt-1 lg:mt-5"
											>
												Subscriure'm
											</button>
										</fieldset>
										<span className="block w-full px-1.5 mt-1 form__text_info">
											Al fer clic a "Subscriure'm"
											confirmes haver llegit i estàs
											d'acord amb la{" "}
											<a
												href="/politica-privadesa"
												title="Política de Privacitat"
												className="text-primary-900 underline"
											>
												Política de Privacitat.
											</a>
										</span>
										{newsletterFormData.error ? (
											<span className="px-1.5 inline-flex items-center mt-2.5 text-sm xl:text-15 text-red-500">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="mr-1.5"
													width={24}
													height={24}
													viewBox="0 0 24 24"
													strokeWidth={1.5}
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
													<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
													<path d="M12 8v4" />
													<path d="M12 16h.01" />
												</svg>
												{
													newsletterFormData.serverMessage
												}
											</span>
										) : null}
									</form>
								) : (
									<div className="flex items-center justify-center md:justify-start xl:justify-center flex-1 lg:flex-none xl:flex-1">
										<div className="max-w-[280px] mx-auto md:mx-0 flex items-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="mr-2.5 text-green-500"
												width={32}
												height={32}
												viewBox="0 0 24 24"
												strokeWidth={1.5}
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
												<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
												<path d="M9 12l2 2l4 -4" />
											</svg>
											<span className="inline-block flex-1">
												{
													newsletterFormData.serverMessage
												}
											</span>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</section>
			<footer id="footer" className="pt-12 pb-2 lg:pt-16">
				<div className="container">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
						<div className="w-full mb-6 lg:mb-0 md:pr-5">
							<div className="flex flex-col flex-wrap items-start max-w-xs">
								<picture>
									<img
										src="/logo-escapades-en-parella.svg"
										alt="Logo Escapadesenparella.cat"
										width={144}
										height={40}
										className="w-36 md:w-44 lg:w- h-auto"
										loading="lazy"
									/>
								</picture>
								<span className="text-sm xl:text-15 block mt-5">
									Escapadesenparella.cat és el recomanador
									especialista d'escapades en parella a
									Catalunya. Segueix-nos per estar al dia de
									totes les novetats:
								</span>
								<ul className="list-none flex items-center mx-0 mt-3 mb-4 p-0 space-x-3">
									<li className="py-1 text-sm xl:text-15 leading-tight">
										<a
											href="https://www.instagram.com/escapadesenparella"
											title="Segueix-nos a Instagram"
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
								<span className="opacity-70 text-sm block">
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
									Il·lutracions i disseny gràfic:{" "}
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
										<path
											stroke="none"
											d="M0 0h24v24H0z"
										></path>
										<path
											fill="red"
											stroke="none"
											d="M12 20l-7 -7a4 4 0 0 1 6.5 -6a.9 .9 0 0 0 1 0a4 4 0 0 1 6.5 6l-7 7"
										></path>
									</svg>{" "}
									a Catalunya
								</span>
							</div>
						</div>
						<div className="w-full mb-6 lg:mb-0">
							<div className="footer-content">
								<span className="footer-header text-xl mb-2 inline-block">
									Escapades en parella
								</span>
								<ul className="list-none m-0 p-0">
									{state.activityCategories
										? state.activityCategories.map(
												(category, idx) => (
													<li
														key={idx}
														className="py-1.5 text-sm xl:text-15 leading-tight"
													>
														<a
															href={
																"/" +
																category.slug
															}
															title={
																category.title
															}
														>
															{category.title}
														</a>
													</li>
												)
										  )
										: null}
								</ul>
							</div>
						</div>
						<div className="w-full mb-6 lg:mb-0">
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
														<a
															href={
																"/" +
																category.slug
															}
															title={
																category.title
															}
														>
															{category.title}
														</a>
													</li>
												)
										  )
										: null}
								</ul>
							</div>
						</div>
						<div className="w-full mb-6 lg:mb-0 ">
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
					<div className="w-full mt-8 md:mt-12 border-t border-primary-50 pt-8">
						<ul className="list-none px-0 flex flex-col md:flex-row md:items-center -mx-2">
							<li className="pb-1.5 px-2 text-sm xl:text-15">
								<Link href="/politica-privadesa">
									<a>Política de privadesa</a>
								</Link>
							</li>
							<li className="pb-1.5 px-2 text-sm xl:text-15">
								<Link href="/condicions-us">
									<a>Condicions d'ús</a>
								</Link>
							</li>
							<li className="pb-1.5 px-2 text-sm xl:text-15">
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
