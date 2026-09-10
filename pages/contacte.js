import { useState } from "react";
import Link from "next/link";
import Footer from "../components/global/Footer";
import NavigationBar from "../components/global/NavigationBar";
import GlobalMetas from "../components/head/GlobalMetas";
import EmailService from "../services/emailService";
import BreadcrumbRichSnippet from "../components/richsnippets/BreadcrumbRichSnippet";
import AuthAlert from "../components/auth/AuthAlert";

/**
 * Pàgina de contacte.
 *
 * Hi arriben dos perfils molt diferents —qui té un allotjament o una activitat
 * i vol que en parlem, i qui llegeix el web i té un dubte— i abans se'ls
 * donava el mateix formulari de cinc camps obligatoris. Ara el primer que es
 * tria és el motiu, i el formulari només demana el que fa falta en cada cas:
 * el telèfon i la pàgina web només tenen sentit si hi ha un negoci al darrere.
 *
 * El motiu viatja dins del missatge perquè l'API de correu envia una
 * plantilla amb els camps fixos (nom, telèfon, correu, web i missatge) i no
 * calia tocar-la per una cosa que es llegeix igual de bé al cos.
 */

const CONTACT_EMAIL = "social@escapadesenparella.cat";

const REASONS = [
	{
		id: "collaboracio",
		label: "Col·laborar",
		hint: "Tens un allotjament, una activitat o una marca i vols que en parlem.",
		wantsBusinessFields: true,
	},
	{
		id: "escapada",
		label: "Un dubte d'escapada",
		hint: "No saps on anar o vols que et recomanem alguna cosa a mida.",
		wantsBusinessFields: false,
	},
	{
		id: "premsa",
		label: "Premsa i mitjans",
		hint: "Ens vols entrevistar o fer servir material del web.",
		wantsBusinessFields: false,
	},
	{
		id: "altres",
		label: "Una altra cosa",
		hint: "Qualsevol cosa que no encaixi a les anteriors.",
		wantsBusinessFields: false,
	},
];

const Contacte = ({ user }) => {
	const initialState = {
		name: "",
		email: "",
		phone: "",
		website: "",
		message: "",
	};

	const [reasonId, setReasonId] = useState(REASONS[0].id);
	const [formData, setFormData] = useState(initialState);
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [isSending, setIsSending] = useState(false);

	const reason = REASONS.find((item) => item.id === reasonId) || REASONS[0];
	const emailService = new EmailService();

	const handleChange = (e) =>
		setFormData((previous) => ({
			...previous,
			[e.target.name]: e.target.value,
		}));

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isSending) return;

		setErrorMessage("");
		setSuccessMessage("");

		if (
			!formData.name.trim() ||
			!formData.email.trim() ||
			!formData.message.trim()
		) {
			setErrorMessage(
				"Cal el teu nom, el correu electrònic i el missatge per poder-te respondre.",
			);
			return;
		}

		setIsSending(true);

		try {
			const response = await emailService.sendContactFormEmail(
				formData.name,
				reason.wantsBusinessFields ? formData.phone : "",
				formData.email,
				reason.wantsBusinessFields ? formData.website : "",
				`Motiu: ${reason.label}\n\n${formData.message}`,
			);

			if (response && response.status === 200) {
				setSuccessMessage(
					response.message ||
						"Missatge enviat correctament. Et respondrem tan aviat com puguem.",
				);
				setFormData(initialState);
			} else {
				setErrorMessage(
					(response && response.message) ||
						"No s'ha pogut enviar el missatge. Torna-ho a provar.",
				);
			}
		} catch (error) {
			console.error(error);
			setErrorMessage(
				`No s'ha pogut connectar amb el servidor. Escriu-nos a ${CONTACT_EMAIL} si el problema continua.`,
			);
		}

		setIsSending(false);
	};

	return (
		<>
			{/* Browser metas  */}
			<GlobalMetas
				title="Contacte"
				description="Vols que col·laborem per donar a conèixer el teu allotjament o activitat? Tens dubtes? No saps on escapar-te? Contacta'ns!"
				url="https://escapadesenparella.cat/contacte"
				image="https://res.cloudinary.com/juligoodie/image/upload/v1651513521/getaways-guru/contacta-amb-nosaltres_sg47zn.jpg"
				canonical="https://escapadesenparella.cat/contacte"
			/>
			{/* Rich snippets */}
			<BreadcrumbRichSnippet
				page1Title="Inici"
				page1Url="https://escapadesenparella.cat"
				page2Title="Contacte"
				page2Url={`https://escapadesenparella.cat/contacte`}
			/>
			<main>
				<NavigationBar
					logo_url={
						"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
					}
					user={user}
				/>

				<section className="pt-6 pb-10 md:pb-16 lg:pb-20">
					<div className="container">
						<ul className="breadcrumb">
							<li className="breadcrumb__item">
								<Link href="/">
									<a
										title="Inici"
										className="breadcrumb__link"
									>
										Inici
									</a>
								</Link>
							</li>
							<li className="breadcrumb__item">
								<span className="breadcrumb__link active">
									Contacte
								</span>
							</li>
						</ul>

						<div className="max-w-2xl mt-6 md:mt-10">
							<span className="block text-13 uppercase tracking-widest text-tertiary-800 mb-2">
								Contacte
							</span>
							<h1 className="mt-0 mb-3 text-balance">
								Parlem d&apos;escapades en parella
							</h1>
							<p className="m-0 text-block text-grey-400">
								Escriu-nos i et responem. Digue&apos;ns primer
								de què va i t&apos;estalviem els camps que no
								calen.
							</p>
						</div>

						<div className="mt-8 md:mt-10 rounded-2xl border border-primary-50 overflow-hidden">
							<div className="grid grid-cols-1 lg:grid-cols-12">
								<div className="lg:col-span-7 p-6 md:p-8 lg:p-10">
									<form onSubmit={handleSubmit} className="form">
										<AuthAlert>{errorMessage}</AuthAlert>
										<AuthAlert tone="success">
											{successMessage}
										</AuthAlert>

										<div className="form__group">
											<span
												className="form__label"
												id="reason-label"
											>
												De què vols parlar?
											</span>
											<div
												className="flex flex-wrap gap-2 mt-1"
												role="radiogroup"
												aria-labelledby="reason-label"
											>
												{REASONS.map((item) => {
													const isActive =
														item.id === reasonId;
													return (
														<button
															key={item.id}
															type="button"
															role="radio"
															aria-checked={
																isActive
															}
															onClick={() =>
																setReasonId(
																	item.id,
																)
															}
															className={`rounded-full border px-4 py-2 text-sm transition-colors ${
																isActive
																	? "bg-primary-500 border-primary-500 text-white"
																	: "bg-white border-primary-50 text-primary-500 hover:border-primary-200"
															}`}
														>
															{item.label}
														</button>
													);
												})}
											</div>
											<span className="form__text_info">
												{reason.hint}
											</span>
										</div>

										<div className="flex flex-wrap -mx-1.5">
											<div className="w-full md:w-1/2 px-1.5">
												<div className="form__group">
													<label
														htmlFor="name"
														className="form__label"
													>
														Nom i cognom
													</label>
													<input
														type="text"
														id="name"
														name="name"
														placeholder="Com et dius?"
														className="form__control py-3 text-15"
														onChange={handleChange}
														value={formData.name}
														autoComplete="name"
														required
													/>
												</div>
											</div>
											<div className="w-full md:w-1/2 px-1.5">
												<div className="form__group">
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
														placeholder="On t'escrivim?"
														className="form__control py-3 text-15"
														onChange={handleChange}
														value={formData.email}
														autoComplete="email"
														required
													/>
												</div>
											</div>
										</div>

										{/*
										 * El telèfon i la pàgina web només
										 * surten quan hi ha un negoci al
										 * darrere: abans es demanaven sempre i,
										 * a més, eren obligatoris.
										 */}
										{reason.wantsBusinessFields ? (
											<div className="flex flex-wrap -mx-1.5">
												<div className="w-full md:w-1/2 px-1.5">
													<div className="form__group">
														<label
															htmlFor="website"
															className="form__label"
														>
															Pàgina web{" "}
															<span className="text-primary-300 font-normal">
																(opcional)
															</span>
														</label>
														<input
															type="url"
															id="website"
															name="website"
															placeholder="https://..."
															className="form__control py-3 text-15"
															onChange={
																handleChange
															}
															value={
																formData.website
															}
															autoComplete="url"
														/>
													</div>
												</div>
												<div className="w-full md:w-1/2 px-1.5">
													<div className="form__group">
														<label
															htmlFor="phone"
															className="form__label"
														>
															Telèfon{" "}
															<span className="text-primary-300 font-normal">
																(opcional)
															</span>
														</label>
														<input
															type="tel"
															id="phone"
															name="phone"
															placeholder="Per si va més ràpid parlar-ne"
															className="form__control py-3 text-15"
															onChange={
																handleChange
															}
															value={
																formData.phone
															}
															autoComplete="tel"
														/>
													</div>
												</div>
											</div>
										) : null}

										<div className="form__group">
											<label
												htmlFor="message"
												className="form__label"
											>
												Missatge
											</label>
											<textarea
												id="message"
												name="message"
												rows={6}
												placeholder={
													reason.wantsBusinessFields
														? "Explica'ns qui sou i què teniu en ment."
														: "En què et podem ajudar?"
												}
												className="form__control py-3 text-15"
												onChange={handleChange}
												value={formData.message}
												required
											/>
										</div>

										<div className="form__group mt-2 flex-row flex-wrap items-center gap-x-4 gap-y-2">
											<button
												type="submit"
												className="button button__primary button__med w-auto justify-center px-10"
												disabled={isSending}
											>
												{isSending
													? "Enviant…"
													: "Enviar el missatge"}
											</button>
											<span className="text-13 text-grey-400">
												Et responem en un dia o dos
												feiners.
											</span>
										</div>
									</form>
								</div>

								<aside className="lg:col-span-5 bg-gray-50 p-6 md:p-8 lg:p-10 flex flex-col gap-y-6">
									<figure className="m-0 rounded-2xl overflow-hidden relative">
										<img
											src="https://res.cloudinary.com/juligoodie/image/upload/v1651513521/getaways-guru/contacta-amb-nosaltres_sg47zn.jpg"
											alt="L'Andrea i en Juli a la platja d'Itzurun, Zumaia, País Basc"
											className="w-full aspect-[4/3] object-cover"
											width={400}
											height={300}
											loading="lazy"
										/>
										<figcaption className="absolute bottom-2 left-3 right-3 text-xs text-white">
											Andrea i Juli, platja
											d&apos;Itzurun (País Basc)
										</figcaption>
									</figure>

									<div>
										<h2 className="text-xl mt-0 mb-1">
											Som dues persones, no un formulari
										</h2>
										<p className="m-0 text-15 text-grey-400">
											Llegim tots els missatges nosaltres
											mateixos. Si prefereixes els camins
											de sempre, també ens tens aquí:
										</p>
									</div>

									<ul className="list-none m-0 p-0 space-y-4">
										<li>
											<span className="block text-13 uppercase tracking-widest text-tertiary-800">
												Correu
											</span>
											<a
												href={`mailto:${CONTACT_EMAIL}`}
												className="text-15 underline underline-offset-2"
											>
												{CONTACT_EMAIL}
											</a>
										</li>
										<li>
											<span className="block text-13 uppercase tracking-widest text-tertiary-800">
												Instagram
											</span>
											<a
												href="https://www.instagram.com/escapadesenparella"
												target="_blank"
												rel="noopener noreferrer"
												className="text-15 underline underline-offset-2"
											>
												@escapadesenparella
											</a>
										</li>
										<li>
											<span className="block text-13 uppercase tracking-widest text-tertiary-800">
												Per a empreses
											</span>
											<Link href="/empreses">
												<a className="text-15 underline underline-offset-2">
													Com col·laborem amb
													allotjaments i activitats
												</a>
											</Link>
										</li>
									</ul>
								</aside>
							</div>
						</div>
					</div>
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

export default Contacte;
