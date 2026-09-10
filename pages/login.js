import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import AuthService from "../services/authService";
import UserContext from "../contexts/UserContext";
import ForgotPasswordModal from "../components/modals/ForgotPasswordModal";
import GlobalMetas from "../components/head/GlobalMetas";
import AuthLayout from "../components/auth/AuthLayout";
import AuthAlert from "../components/auth/AuthAlert";
import { AuthField, PasswordField } from "../components/auth/AuthField";

/**
 * Inici de sessió.
 *
 * Respecte de la versió anterior:
 *  - El camp de contrasenya tenia l'etiqueta "Correu electrònic": el formulari
 *    semblava demanar dues vegades el correu.
 *  - Els tres possibles errors de l'API es pintaven amb `Alert` de
 *    react-bootstrap, i el CSS de Bootstrap no es carrega enlloc del projecte.
 *    Ara són missatges en català, amb l'estil del web.
 *  - El botó no deia res mentre s'estava comprovant la sessió i es podia
 *    prémer dues vegades.
 */

/** L'API respon en anglès i amb el detall de quin camp falla. */
const ERROR_MESSAGES = {
	"Missing credentials": "Cal omplir el correu i la contrasenya.",
	"Incorrect email": "No hi ha cap compte amb aquest correu electrònic.",
	"Incorrect password": "La contrasenya no és correcta.",
};

const Login = () => {
	const { user, saveUserDetails } = useContext(UserContext);
	const router = useRouter();

	const [formData, setFormData] = useState({ email: "", password: "" });
	const [errorMessage, setErrorMessage] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [modalVisibility, setModalVisibility] = useState(false);

	const service = new AuthService();

	const handleChange = (e) =>
		setFormData((previous) => ({
			...previous,
			[e.target.name]: e.target.value,
		}));

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isSubmitting) return;

		setIsSubmitting(true);
		setErrorMessage("");

		try {
			const response = await service.login(
				formData.email,
				formData.password,
			);

			if (response.status) {
				setErrorMessage(
					ERROR_MESSAGES[response.message] ||
						"No s'ha pogut iniciar la sessió. Torna-ho a provar.",
				);
				setIsSubmitting(false);
				return;
			}

			saveUserDetails(response);
		} catch (error) {
			console.error(error);
			setErrorMessage(
				"No s'ha pogut connectar amb el servidor. Torna-ho a provar.",
			);
			setIsSubmitting(false);
		}
	};

	useEffect(() => {
		if (!user) return;
		if (router.components["/empreses/registre"]) {
			router.push("/empreses/registre?step=seleccio-pla");
		} else {
			router.push("/2i8ZXlkM4cFKUPBrm3-admin-panel");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	if (user) return null;

	return (
		<>
			<GlobalMetas
				title="Inicia sessió"
				description="Accedeix al teu compte per cercar, descobrir i gaudir de la teva propera escapada en parella."
				url="https://escapadesenparella.cat/login"
				image="https://res.cloudinary.com/juligoodie/image/upload/v1632416196/getaways-guru/zpdiudqa0bk8sc3wfyue.jpg"
				canonical="https://escapadesenparella.cat/login"
			/>

			<AuthLayout
				title="Inicia sessió"
				subtitle="Accedeix al teu compte per cercar, descobrir i gaudir de la teva propera escapada en parella."
				altAction={{
					label: "Encara no tens un compte?",
					href: "/signup",
					cta: "Registra't",
				}}
			>
				<form onSubmit={handleSubmit} className="form">
					<AuthAlert>{errorMessage}</AuthAlert>

					<AuthField
						name="email"
						label="Correu electrònic"
						type="email"
						value={formData.email}
						onChange={handleChange}
						placeholder="Escriu el teu correu electrònic"
						autoComplete="email"
						required
					/>

					<PasswordField
						value={formData.password}
						onChange={handleChange}
						autoComplete="current-password"
						required
					/>

					<div className="form__group">
						<button
							type="submit"
							className="button button__primary button__lg w-full justify-center"
							disabled={isSubmitting}
						>
							{isSubmitting ? "Entrant…" : "Iniciar sessió"}
						</button>
					</div>

					<div className="form__group items-center">
						<button
							type="button"
							className="text-sm text-primary-400 underline underline-offset-2 hover:text-primary-500"
							onClick={() => setModalVisibility(true)}
						>
							He oblidat la contrasenya
						</button>
					</div>
				</form>
			</AuthLayout>

			<ForgotPasswordModal
				visibility={modalVisibility}
				hideModal={() => setModalVisibility(false)}
			/>
		</>
	);
};

export default Login;
