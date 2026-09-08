import { useState } from "react";
import NewsletterService from "../../services/newsletterService";

/**
 * Captació de subscriptors.
 *
 * N'hi ha d'haver **un de sol per pàgina**. Abans la portada en tenia dos: el
 * que vivia dins del peu (i per tant surt a tot el web) i un altre al mig de
 * la pàgina, amb un disseny i uns textos diferents. Ara tots dos llocs criden
 * aquest component.
 */

const BENEFITS = [
	"Escapades noves cada quinze dies",
	"Descomptes i ofertes que anem trobant",
	"Res de correu brossa: baixa quan vulguis",
];

const NewsletterCta = ({ className = "" }) => {
	const [form, setForm] = useState({ name: "", email: "" });
	const [status, setStatus] = useState({
		message: "",
		submitted: false,
		error: false,
		sending: false,
	});

	const service = new NewsletterService();

	const handleChange = (e) =>
		setForm({ ...form, [e.target.name]: e.target.value });

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!form.name || !form.email || status.sending) return;

		setStatus({ ...status, sending: true, error: false, message: "" });

		try {
			const res = await service.subscribeToNewsletter(
				form.name,
				form.email
			);
			if (res && (res.status === 200 || res.status === undefined)) {
				setStatus({
					message:
						res?.message ||
						"Ja hi sou! Us escriurem amb les properes escapades.",
					submitted: true,
					error: false,
					sending: false,
				});
			} else {
				setStatus({
					message:
						res?.message || "No ha estat possible subscriure-us.",
					submitted: false,
					error: true,
					sending: false,
				});
			}
		} catch (err) {
			setStatus({
				message:
					"No ha estat possible subscriure-us. Torneu-ho a provar en un moment.",
				submitted: false,
				error: true,
				sending: false,
			});
		}
	};

	return (
		<section className={`newsletter-cta ${className}`}>
			<div className="container">
				<div className="newsletter-cta__panel">
					<div className="newsletter-cta__media">
						<picture>
							<source
								srcSet="/email-confirmation.webp"
								type="image/webp"
							/>
							<img
								src="/email-confirmation.jpg"
								width="320"
								height="213"
								className="w-full h-auto object-contain mix-blend-multiply"
								alt=""
								aria-hidden="true"
								loading="lazy"
							/>
						</picture>
					</div>

					<div className="newsletter-cta__body">
						<span className="newsletter-cta__eyebrow">
							Newsletter
						</span>
						<h2 className="newsletter-cta__title">
							Una escapada nova a la bústia
						</h2>

						{status.submitted ? (
							<p className="newsletter-cta__success">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width={22}
									height={22}
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth={1.5}
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
								{status.message}
							</p>
						) : (
							<>
								<ul className="newsletter-cta__benefits">
									{BENEFITS.map((benefit) => (
										<li key={benefit}>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width={17}
												height={17}
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth={2}
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<path
													stroke="none"
													d="M0 0h24v24H0z"
													fill="none"
												/>
												<path d="M5 12l5 5l10 -10" />
											</svg>
											{benefit}
										</li>
									))}
								</ul>

								<form
									className="newsletter-cta__form"
									onSubmit={handleSubmit}
								>
									<label
										htmlFor="newsletter-name"
										className="sr-only"
									>
										Nom
									</label>
									<input
										id="newsletter-name"
										name="name"
										type="text"
										required
										value={form.name}
										onChange={handleChange}
										placeholder="El vostre nom"
										className="newsletter-cta__input"
									/>
									<label
										htmlFor="newsletter-email"
										className="sr-only"
									>
										Correu electrònic
									</label>
									<input
										id="newsletter-email"
										name="email"
										type="email"
										required
										value={form.email}
										onChange={handleChange}
										placeholder="El vostre correu"
										className="newsletter-cta__input"
									/>
									<button
										type="submit"
										disabled={status.sending}
										className="button button__cta button__med newsletter-cta__submit"
									>
										{status.sending
											? "Enviant..."
											: "Subscriure-m'hi"}
									</button>
								</form>

								{status.error ? (
									<p className="newsletter-cta__error">
										{status.message}
									</p>
								) : null}

								<p className="newsletter-cta__legal">
									En subscriure-us accepteu la{" "}
									<a
										href="/politica-privadesa"
										title="Política de privadesa"
									>
										política de privadesa
									</a>
									.
								</p>
							</>
						)}
					</div>
				</div>
			</div>
		</section>
	);
};

export default NewsletterCta;
