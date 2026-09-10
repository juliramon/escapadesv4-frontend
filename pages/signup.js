import { useContext, useState } from "react";
import slugify from "slugify";
import AuthService from "../services/authService";
import EmailService from "../services/emailService";
import UserContext from "../contexts/UserContext";
import GlobalMetas from "../components/head/GlobalMetas";
import AuthLayout from "../components/auth/AuthLayout";
import AuthAlert from "../components/auth/AuthAlert";
import { AuthField, PasswordField } from "../components/auth/AuthField";

/**
 * Registre de compte.
 *
 * Respecte de la versió anterior:
 *  - Les etiquetes anaven amb `for` en comptes de `htmlFor`, que React
 *    descarta: cap etiqueta estava lligada al seu camp.
 *  - El marcador de posició demanava "6+ caràcters" quan l'API en demana 7 i
 *    rebutja la resta; ara diu el mateix que valida el servidor.
 *  - Els errors sortien amb `Alert` de react-bootstrap, sense el CSS de
 *    Bootstrap carregat.
 *  - El panell de l'esquerra era `bg-primary-300`, un blau-grisós que no surt
 *    enlloc més del web i que no coincidia ni amb el de l'inici de sessió.
 */

/** L'API ja respon en català; només cal recollir-ho. */
const MIN_PASSWORD_LENGTH = 7;

const Signup = () => {
	const { user, getNewUser } = useContext(UserContext);

	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		password: "",
	});
	const [errorMessage, setErrorMessage] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const service = new AuthService();
	const emailService = new EmailService();

	const handleChange = (e) =>
		setFormData((previous) => ({
			...previous,
			[e.target.name]: e.target.value,
		}));

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isSubmitting) return;

		if (formData.password.length < MIN_PASSWORD_LENGTH) {
			setErrorMessage(
				`La contrasenya ha de tenir com a mínim ${MIN_PASSWORD_LENGTH} caràcters.`,
			);
			return;
		}

		setIsSubmitting(true);
		setErrorMessage("");

		try {
			const nameSlug = slugify(formData.fullName, {
				remove: /[*+~.,()'"!:@]/g,
				lower: true,
			});
			const slug = `${nameSlug}-${Math.floor(Math.random() * 100000000000)}`;

			const response = await service.signup(
				formData.fullName,
				formData.email,
				formData.password,
				slug,
			);

			if (response.status) {
				setErrorMessage(
					response.message ||
						"No s'ha pogut crear el compte. Torna-ho a provar.",
				);
				setIsSubmitting(false);
				return;
			}

			getNewUser(response);
			emailService.sendConfirmEmail(formData.fullName, formData.email);
		} catch (error) {
			console.error(error);
			setErrorMessage(
				"No s'ha pogut connectar amb el servidor. Torna-ho a provar.",
			);
			setIsSubmitting(false);
		}
	};

	if (user) return null;

	return (
		<>
			<GlobalMetas
				title="Crea el teu compte"
				description="Crea el teu compte gratuït per guardar i planificar la teva propera escapada en parella ideal!"
				url="https://escapadesenparella.cat/signup"
				image="https://res.cloudinary.com/juligoodie/image/upload/v1632416196/getaways-guru/zpdiudqa0bk8sc3wfyue.jpg"
				canonical="https://escapadesenparella.cat/signup"
			/>

			<AuthLayout
				title="Crea el teu compte"
				subtitle="Guarda les escapades que t'agraden i planifica la vostra propera sortida en parella."
				altAction={{
					label: "Ja tens un compte?",
					href: "/login",
					cta: "Inicia sessió",
				}}
				footer={
					<p className="text-xs text-primary-400 m-0">
						En crear el compte acceptes les{" "}
						<a
							href="/condicions-us"
							className="underline underline-offset-2"
						>
							condicions d&apos;ús
						</a>{" "}
						i la{" "}
						<a
							href="/politica-privadesa"
							className="underline underline-offset-2"
						>
							política de privadesa
						</a>
						.
					</p>
				}
			>
				<form onSubmit={handleSubmit} className="form">
					<AuthAlert>{errorMessage}</AuthAlert>

					<AuthField
						name="fullName"
						label="Nom i cognom"
						value={formData.fullName}
						onChange={handleChange}
						placeholder="Escriu el teu nom i cognom"
						autoComplete="name"
						required
					/>

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
						placeholder={`Mínim ${MIN_PASSWORD_LENGTH} caràcters`}
						autoComplete="new-password"
						hint={`La contrasenya ha de tenir ${MIN_PASSWORD_LENGTH} caràcters o més.`}
						required
					/>

					<div className="form__group">
						<button
							type="submit"
							className="button button__primary button__lg w-full justify-center"
							disabled={isSubmitting}
						>
							{isSubmitting
								? "Creant el compte…"
								: "Crear el meu compte"}
						</button>
					</div>
				</form>
			</AuthLayout>
		</>
	);
};

export default Signup;
