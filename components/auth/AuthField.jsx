import { useState } from "react";

/**
 * Camps dels formularis d'autenticació.
 *
 * Fan servir les mateixes classes (`form__group`, `form__label`,
 * `form__control`) que la resta de formularis del web, de manera que
 * qualsevol canvi de paleta els arriba sol.
 *
 * Respecte del que hi havia: les etiquetes van lligades al camp amb `htmlFor`
 * —al registre estava escrit `for`, que React ignora— i els camps porten
 * `autoComplete`, que és el que fa que el gestor de contrasenyes del navegador
 * ofereixi omplir-los.
 */

const AuthField = ({
	name,
	label,
	type = "text",
	value,
	onChange,
	placeholder,
	autoComplete,
	required = false,
	hint = null,
	children = null,
}) => (
	<div className="form__group">
		<label htmlFor={name} className="form__label">
			{label}
		</label>
		<input
			type={type}
			id={name}
			name={name}
			value={value}
			onChange={onChange}
			placeholder={placeholder}
			autoComplete={autoComplete}
			required={required}
			className="form__control py-3 text-15"
		/>
		{hint ? <span className="form__text_info">{hint}</span> : null}
		{children}
	</div>
);

const EyeIcon = ({ crossed }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={18}
		height={18}
		viewBox="0 0 24 24"
		strokeWidth="1.8"
		stroke="currentColor"
		fill="none"
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden="true"
	>
		<path stroke="none" d="M0 0h24v24H0z" fill="none" />
		<circle cx="12" cy="12" r="2" />
		<path d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7" />
		{crossed ? <path d="M3 3l18 18" /> : null}
	</svg>
);

/** Camp de contrasenya amb botó per veure-la: evita meitat dels errors d'accés. */
const PasswordField = ({
	name = "password",
	label = "Contrasenya",
	value,
	onChange,
	placeholder = "Escriu la teva contrasenya",
	autoComplete = "current-password",
	required = false,
	hint = null,
}) => {
	const [isVisible, setIsVisible] = useState(false);

	return (
		<div className="form__group">
			<label htmlFor={name} className="form__label">
				{label}
			</label>
			<div className="relative">
				<input
					type={isVisible ? "text" : "password"}
					id={name}
					name={name}
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					autoComplete={autoComplete}
					required={required}
					className="form__control py-3 pr-11 text-15"
				/>
				<button
					type="button"
					onClick={() => setIsVisible((visible) => !visible)}
					className="absolute inset-y-0 right-0 px-3 flex items-center text-primary-300 hover:text-primary-500"
					aria-label={
						isVisible ? "Amagar la contrasenya" : "Veure la contrasenya"
					}
					aria-pressed={isVisible}
				>
					<EyeIcon crossed={isVisible} />
				</button>
			</div>
			{hint ? <span className="form__text_info">{hint}</span> : null}
		</div>
	);
};

export { AuthField, PasswordField };
