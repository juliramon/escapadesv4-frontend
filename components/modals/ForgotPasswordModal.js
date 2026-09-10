import { useEffect, useState } from "react";
import EmailService from "../../services/emailService";
import AuthAlert from "../auth/AuthAlert";
import { AuthField } from "../auth/AuthField";

/**
 * Diàleg per demanar l'enllaç de recuperació de contrasenya.
 *
 * Respecte de la versió anterior:
 *  - Estava fet amb `Modal`, `Form`, `Button`, `Alert` i `Toast` de
 *    react-bootstrap, i el CSS de Bootstrap no s'importa enlloc del projecte:
 *    el diàleg sortia com un bloc de text sense fons ni posició.
 *  - En enviar-lo, tancava el diàleg i ensenyava un `Toast` que vivia dins del
 *    component que s'acabava d'amagar, amb una imatge `holder.js/20x20` que no
 *    existeix. O sigui que la confirmació no arribava a veure's mai. Ara la
 *    confirmació es queda dins del diàleg, que és on l'usuari està mirant.
 *  - No es podia tancar amb la tecla d'escapada.
 */
const ForgotPasswordModal = ({ visibility, hideModal }) => {
	const [email, setEmail] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [confirmation, setConfirmation] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const emailService = new EmailService();

	useEffect(() => {
		if (!visibility) return undefined;
		const handleKeyDown = (event) => {
			if (event.key === "Escape") hideModal();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [visibility, hideModal]);

	// En reobrir-lo, que no hi quedi el missatge de l'última vegada.
	useEffect(() => {
		if (visibility) return;
		setErrorMessage("");
		setConfirmation("");
		setIsSubmitting(false);
	}, [visibility]);

	if (!visibility) return null;

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isSubmitting) return;

		if (!email.trim()) {
			setErrorMessage("Escriu el teu correu electrònic.");
			return;
		}

		setIsSubmitting(true);
		setErrorMessage("");

		try {
			const response = await emailService.sendResetPasswordEmail(email);
			setConfirmation(
				response && response.message
					? response.message
					: "T'hem enviat un correu amb l'enllaç per recuperar la contrasenya.",
			);
			setEmail("");
		} catch (error) {
			console.error(error);
			setErrorMessage(
				"No s'ha pogut enviar el correu. Torna-ho a provar.",
			);
		}

		setIsSubmitting(false);
	};

	return (
		<div
			className="fixed inset-0 z-[70] flex items-center justify-center p-4"
			role="dialog"
			aria-modal="true"
			aria-labelledby="forgotPasswordTitle"
		>
			<div
				className="absolute inset-0 bg-primary-900 bg-opacity-50"
				onClick={hideModal}
				aria-hidden="true"
			/>

			<div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
				<button
					type="button"
					onClick={hideModal}
					className="absolute top-4 right-4 text-primary-300 hover:text-primary-500"
					aria-label="Tancar"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width={22}
						height={22}
						viewBox="0 0 24 24"
						strokeWidth="2"
						stroke="currentColor"
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<line x1={18} y1={6} x2={6} y2={18} />
						<line x1={6} y1={6} x2={18} y2={18} />
					</svg>
				</button>

				<h2
					id="forgotPasswordTitle"
					className="font-headings text-2xl leading-tight m-0 pr-8"
				>
					Recupera la teva contrasenya
				</h2>

				{confirmation ? (
					<>
						<AuthAlert tone="success">{confirmation}</AuthAlert>
						<p className="text-sm text-primary-400">
							Revisa la safata d&apos;entrada i la carpeta de
							correu brossa.
						</p>
						<button
							type="button"
							className="button button__primary button__med w-full justify-center mt-2"
							onClick={hideModal}
						>
							Entesos
						</button>
					</>
				) : (
					<>
						<p className="text-15 text-primary-400 mt-2 mb-5">
							Escriu el correu electrònic associat al teu compte i
							t&apos;enviarem l&apos;enllaç per recuperar-la.
						</p>

						<form onSubmit={handleSubmit} className="form">
							<AuthAlert>{errorMessage}</AuthAlert>

							<AuthField
								name="forgotPasswordEmail"
								label="Correu electrònic"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Escriu el teu correu electrònic"
								autoComplete="email"
							/>

							<div className="form__group">
								<button
									type="submit"
									className="button button__primary button__med w-full justify-center"
									disabled={isSubmitting}
								>
									{isSubmitting
										? "Enviant…"
										: "Enviar l'enllaç"}
								</button>
							</div>
						</form>
					</>
				)}
			</div>
		</div>
	);
};

export default ForgotPasswordModal;
