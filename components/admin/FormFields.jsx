/**
 * Camps de formulari de l'àrea d'administració.
 *
 * El bloc `form__group` + `form__label` + `form__control` estava escrit a mà
 * desenes de vegades a cada modal. Aquí queda un cop.
 *
 * Els camps accepten, a més, tres coses que abans s'havien d'escriure a part a
 * cada formulari: un text d'ajuda, la marca de camp obligatori i un comptador
 * de caràcters amb el màxim recomanat.
 */

/** Etiqueta, ajuda, comptador i error: el que envolta qualsevol camp. */
const FieldShell = ({
	name,
	label,
	hint,
	required,
	error,
	counter,
	className = "",
	children,
}) => (
	<div className={`form__group ${className}`}>
		{label ? (
			<div className="flex items-baseline justify-between gap-3">
				<label htmlFor={name} className="form__label">
					{label}
					{required ? (
						<span className="text-red-500" aria-hidden="true">
							{" "}
							*
						</span>
					) : null}
				</label>
				{counter ? (
					<span
						className={`text-xs ${
							counter.length > counter.max
								? "text-red-600"
								: "text-primary-400"
						}`}
					>
						{counter.length}/{counter.max}
					</span>
				) : null}
			</div>
		) : null}
		{children}
		{error ? (
			<span className="mt-1 text-xs text-red-600" role="alert">
				{error}
			</span>
		) : null}
		{hint && !error ? <span className="form__text_info">{hint}</span> : null}
	</div>
);

const TextField = ({
	name,
	label,
	value,
	onChange,
	onBlur,
	placeholder,
	type = "text",
	hint,
	required = false,
	error,
	maxLength,
	className = "",
}) => (
	<FieldShell
		name={name}
		label={label}
		hint={hint}
		required={required}
		error={error}
		className={className}
		counter={
			maxLength
				? { length: String(value || "").length, max: maxLength }
				: null
		}
	>
		<input
			type={type}
			id={name}
			name={name}
			placeholder={placeholder}
			className="form__control"
			value={value || ""}
			onChange={onChange}
			onBlur={onBlur}
			aria-invalid={error ? "true" : undefined}
		/>
	</FieldShell>
);

const TextAreaField = ({
	name,
	label,
	value,
	onChange,
	onBlur,
	placeholder,
	rows = 4,
	hint,
	required = false,
	error,
	maxLength,
	className = "",
}) => (
	<FieldShell
		name={name}
		label={label}
		hint={hint}
		required={required}
		error={error}
		className={className}
		counter={
			maxLength
				? { length: String(value || "").length, max: maxLength }
				: null
		}
	>
		<textarea
			id={name}
			name={name}
			rows={rows}
			placeholder={placeholder}
			className="form__control"
			value={value || ""}
			onChange={onChange}
			onBlur={onBlur}
			aria-invalid={error ? "true" : undefined}
		/>
	</FieldShell>
);

/**
 * Casella de verificació.
 *
 * Va dins d'una caixa clicable sencera: la casella tota sola és un objectiu
 * de 16 píxels, i amb el ratolí a mig camí no passava res.
 */
const CheckboxField = ({ name, label, checked, onChange, hint }) => (
	<div className="form__group">
		<label
			htmlFor={name}
			className="flex items-start gap-2.5 cursor-pointer rounded-md border border-primary-50 bg-gray-50 p-3 hover:border-primary-100 transition-colors"
		>
			<input
				type="checkbox"
				id={name}
				name={name}
				className="mt-0.5"
				checked={Boolean(checked)}
				onChange={onChange}
			/>
			<span>
				<span className="block text-sm text-primary-500">{label}</span>
				{hint ? (
					<span className="block text-xs text-primary-400">
						{hint}
					</span>
				) : null}
			</span>
		</label>
	</div>
);

const SelectField = ({
	name,
	label,
	value,
	onChange,
	options,
	placeholder,
	hint,
	required = false,
	error,
}) => (
	<FieldShell
		name={name}
		label={label}
		hint={hint}
		required={required}
		error={error}
	>
		<select
			id={name}
			name={name}
			className="form__control"
			value={value || ""}
			onChange={onChange}
			aria-invalid={error ? "true" : undefined}
		>
			<option value="">{placeholder || "Selecciona una opció"}</option>
			{options.map((option) => (
				<option key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</select>
	</FieldShell>
);

/** Previsualització d'una imatge: la nova si se n'ha triat una, o la desada. */
const ImagePreview = ({ blob, current }) => {
	const src = blob || current;
	if (!src || typeof src !== "string") return null;
	return (
		<div className="m-2 relative w-48 h-auto overflow-hidden rounded-md border-8 border-white shadow">
			<img src={src} alt="" />
		</div>
	);
};

export {
	FieldShell,
	TextField,
	TextAreaField,
	CheckboxField,
	SelectField,
	ImagePreview,
};
