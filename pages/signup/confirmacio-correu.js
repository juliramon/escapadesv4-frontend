import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../contexts/UserContext";
import EmailService from "../../services/emailService";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthAlert from "../../components/auth/AuthAlert";

/**
 * Pas de confirmació del correu electrònic.
 *
 * Respecte de la versió anterior:
 *  - Cridava `useState` i un `useEffect` **després** d'un `return` condicional.
 *    Quan la sessió es resolia, el component passava de dos hooks a quatre i
 *    React avortava el render amb "Rendered more hooks than during the
 *    previous render". Ara tots els hooks són abans de qualsevol retorn.
 *  - Estava muntada amb `Container`, `Row`, `Col` i `Button` de react-bootstrap
 *    sense el CSS de Bootstrap, i el botó de reenviar no deia mai si el correu
 *    havia sortit.
 */
const ConfirmEmail = () => {
	const { user } = useContext(UserContext);
	const router = useRouter();

	const [feedback, setFeedback] = useState("");
	const [isSending, setIsSending] = useState(false);

	useEffect(() => {
		if (!user || user === "null" || user === undefined) {
			router.push("/login");
			return;
		}
		if (user.hasConfirmedEmail === true) {
			router.push("/signup/complete-account");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	if (!user) {
		return (
			<Head>
				<title>Carregant… - Escapadesenparella.cat</title>
			</Head>
		);
	}

	const resendConfirmEmail = async () => {
		if (isSending) return;
		setIsSending(true);
		setFeedback("");

		try {
			const emailService = new EmailService();
			await emailService.sendConfirmEmail(user.fullName, user.email);
			setFeedback("Correu reenviat. Revisa la teva bústia.");
		} catch (error) {
			console.error(error);
			setFeedback("No s'ha pogut reenviar el correu. Torna-ho a provar.");
		}

		setIsSending(false);
	};

	return (
		<>
			<Head>
				<title>Confirmació de correu - Escapadesenparella.cat</title>
				<meta name="robots" content="noindex, nofollow" />
			</Head>

			<AuthLayout
				title="Confirma el teu correu"
				subtitle={`Hem enviat un correu a ${user.email} per verificar la teva adreça. Revisa la safata d'entrada i la carpeta de correu brossa.`}
			>
				<img
					src="/email-confirmation.jpg"
					alt=""
					className="w-full max-w-xs rounded-2xl mb-6"
					loading="eager"
				/>

				<AuthAlert
					tone={
						feedback.startsWith("No s'ha") ? "error" : "success"
					}
				>
					{feedback}
				</AuthAlert>

				<button
					type="button"
					className="button button__primary button__lg w-full justify-center"
					onClick={resendConfirmEmail}
					disabled={isSending}
				>
					{isSending ? "Enviant…" : "Reenviar el correu"}
				</button>

				<p className="text-xs text-primary-400 mt-4 mb-0">
					Si el correu no arriba, comprova que l&apos;adreça sigui
					correcta des de la teva configuració de compte.
				</p>
			</AuthLayout>
		</>
	);
};

export default ConfirmEmail;
