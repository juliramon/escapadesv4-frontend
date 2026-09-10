import Head from "next/head";
import Router from "next/router";
import { useState } from "react";
import ContentService from "../services/contentService";
import AuthService from "../services/authService";
import AuthLayout from "../components/auth/AuthLayout";
import AuthAlert from "../components/auth/AuthAlert";
import { PasswordField } from "../components/auth/AuthField";

/**
 * Canvi de contrasenya des de l'enllaç del correu de recuperació.
 *
 * Respecte de la versió anterior:
 *  - Demanava la contrasenya dues vegades i no les comparava mai: el segon
 *    camp era decoratiu i es podia acabar amb una contrasenya mal escrita.
 *  - Estava feta amb `Form`, `Button` i `Alert` de react-bootstrap i amb
 *    classes de disseny (`signup-col`, `graphic`) d'una versió anterior del
 *    web, sense el CSS de Bootstrap carregat enlloc.
 *  - En acabar redirigia a `/login` sense dir que el canvi havia anat bé.
 */

const MIN_PASSWORD_LENGTH = 7;

const ResetPassword = ({ userData, resetToken }) => {
	const [formData, setFormData] = useState({
		password: "",
		repeatedPassword: "",
	});
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const service = new AuthService();

	const handleChange = (e) =>
		setFormData((previous) => ({
			...previous,
			[e.target.name]: e.target.value,
		}));

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isSubmitting) return;

		setErrorMessage("");

		if (formData.password.length < MIN_PASSWORD_LENGTH) {
			setErrorMessage(
				`La contrasenya ha de tenir com a mínim ${MIN_PASSWORD_LENGTH} caràcters.`,
			);
			return;
		}

		if (formData.password !== formData.repeatedPassword) {
			setErrorMessage("Les dues contrasenyes no coincideixen.");
			return;
		}

		setIsSubmitting(true);

		try {
			// El token surt de la URL: l'API ja no el retorna dins de userData.
			const response = await service.resetPassword(
				userData._id,
				formData.password,
				resetToken,
			);

			if (response.status) {
				setErrorMessage(
					response.message ||
						"No s'ha pogut canviar la contrasenya. Torna-ho a provar.",
				);
				setIsSubmitting(false);
				return;
			}

			setSuccessMessage(
				"Contrasenya actualitzada. Ja pots iniciar sessió.",
			);
			setTimeout(() => Router.push("/login"), 1500);
		} catch (error) {
			console.error(error);
			setErrorMessage(
				"No s'ha pogut connectar amb el servidor. Torna-ho a provar.",
			);
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<Head>
				<title>Canviar la contrasenya - Escapadesenparella.cat</title>
				<meta name="robots" content="noindex, nofollow" />
			</Head>

			<AuthLayout
				title="Canvia la contrasenya"
				subtitle={
					userData && userData.email
						? `Escriu la nova contrasenya del compte ${userData.email}.`
						: "Escriu la nova contrasenya del teu compte."
				}
				altAction={{
					label: "Ja te'n recordes?",
					href: "/login",
					cta: "Inicia sessió",
				}}
			>
				<form onSubmit={handleSubmit} className="form">
					<AuthAlert>{errorMessage}</AuthAlert>
					<AuthAlert tone="success">{successMessage}</AuthAlert>

					<PasswordField
						name="password"
						label="Nova contrasenya"
						value={formData.password}
						onChange={handleChange}
						placeholder={`Mínim ${MIN_PASSWORD_LENGTH} caràcters`}
						autoComplete="new-password"
						required
					/>

					<PasswordField
						name="repeatedPassword"
						label="Repeteix la nova contrasenya"
						value={formData.repeatedPassword}
						onChange={handleChange}
						placeholder="Escriu-la de nou"
						autoComplete="new-password"
						required
					/>

					<div className="form__group">
						<button
							type="submit"
							className="button button__primary button__lg w-full justify-center"
							disabled={isSubmitting || Boolean(successMessage)}
						>
							{isSubmitting ? "Desant…" : "Canviar la contrasenya"}
						</button>
					</div>
				</form>
			</AuthLayout>
		</>
	);
};

export async function getServerSideProps(req) {
	const service = new ContentService();
	const resetToken = req.query.token;

	if (!resetToken) {
		return {
			notFound: true,
		};
	}

	const userData = await service.getUserData(resetToken);

	if (!userData) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			userData: userData,
			resetToken: resetToken,
		},
	};
}

export default ResetPassword;
