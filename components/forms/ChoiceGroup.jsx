/**
 * Grup d'opcions marcables, de selecció única (`radio`) o múltiple (`checkbox`).
 *
 * Categories, estacions, destinacions, tipus d'allotjament i característiques
 * estaven escrits a mà, opció per opció, a les quatre pàgines de fitxes: unes
 * 900 línies de marcatge idèntic tret de l'etiqueta.
 */
const ChoiceGroup = ({
	name,
	label,
	options,
	value,
	onChange,
	multiple = false,
	className = "",
	emptyMessage = null,
}) => {
	const selected = multiple
		? (Array.isArray(value) ? value : []).map(String)
		: [String(value ?? "")];

	const isChecked = (optionValue) => selected.includes(String(optionValue));

	const toggle = (optionValue) => {
		if (!multiple) {
			onChange(optionValue);
			return;
		}
		const next = isChecked(optionValue)
			? selected.filter((item) => item !== String(optionValue))
			: [...selected, String(optionValue)];
		onChange(next);
	};

	return (
		<div className={`form__group ${className}`}>
			<span className="form__label">{label}</span>
			{options.length === 0 && emptyMessage ? (
				<p className="form__text_info">{emptyMessage}</p>
			) : null}
			<div className="flex flex-wrap gap-x-6 gap-y-1">
				{options.map((option) => (
					<label
						key={option.value}
						htmlFor={`${name}-${option.value}`}
						className="form__label flex items-center mb-0"
					>
						<input
							type={multiple ? "checkbox" : "radio"}
							name={name}
							id={`${name}-${option.value}`}
							className="mr-2"
							checked={isChecked(option.value)}
							onChange={() => toggle(option.value)}
						/>
						{option.icon ? (
							<span
								className="w-6 h-6 mr-1.5"
								dangerouslySetInnerHTML={{
									__html: option.icon,
								}}
							/>
						) : null}
						{option.label}
					</label>
				))}
			</div>
		</div>
	);
};

export default ChoiceGroup;
