/**
 * Camps de formulari de l'àrea d'administració.
 *
 * El bloc `form__group` + `form__label` + `form__control` estava escrit a mà
 * desenes de vegades a cada modal. Aquí queda un cop.
 */

const TextField = ({
	name,
	label,
	value,
	onChange,
	placeholder,
	type = "text",
}) => (
	<div className="form__group">
		<label htmlFor={name} className="form__label">
			{label}
		</label>
		<input
			type={type}
			id={name}
			name={name}
			placeholder={placeholder}
			className="form__control"
			value={value || ""}
			onChange={onChange}
		/>
	</div>
);

const TextAreaField = ({
	name,
	label,
	value,
	onChange,
	placeholder,
	rows = 4,
}) => (
	<div className="form__group">
		<label htmlFor={name} className="form__label">
			{label}
		</label>
		<textarea
			id={name}
			name={name}
			rows={rows}
			placeholder={placeholder}
			className="form__control"
			value={value || ""}
			onChange={onChange}
		/>
	</div>
);

const CheckboxField = ({ name, label, checked, onChange }) => (
	<div className="form__group">
		<label htmlFor={name} className="form__label flex items-center">
			<input
				type="checkbox"
				id={name}
				name={name}
				className="mr-2"
				checked={Boolean(checked)}
				onChange={onChange}
			/>
			{label}
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
}) => (
	<div className="form__group">
		<label htmlFor={name} className="form__label">
			{label}
		</label>
		<select
			id={name}
			name={name}
			className="form__control"
			value={value || ""}
			onChange={onChange}
		>
			<option value="">{placeholder || "Selecciona una opció"}</option>
			{options.map((option) => (
				<option key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</select>
	</div>
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

export { TextField, TextAreaField, CheckboxField, SelectField, ImagePreview };
