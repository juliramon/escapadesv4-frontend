/**
 * Camp de càrrega d'imatge amb previsualització.
 *
 * Aquest bloc —etiqueta, input amagat, icona de càmera i safata de previsualització—
 * estava repetit tres cops dins de cada modal de crear i d'editar: vint-i-quatre
 * còpies del mateix marcatge.
 */
const CameraIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="mr-2"
		width="22"
		height="22"
		viewBox="0 0 24 24"
		strokeWidth="1.5"
		stroke="#0d1f44"
		fill="none"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path stroke="none" d="M0 0h24v24H0z" fill="none" />
		<circle cx="12" cy="13" r="3" />
		<path d="M5 7h2a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h2m9 7v7a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
		<line x1="15" y1="6" x2="21" y2="6" />
		<line x1="18" y1="3" x2="18" y2="9" />
	</svg>
);

const ImageUploadField = ({
	label,
	name,
	onChange,
	hasImage,
	preview,
	multiple = false,
	accept = "image/*",
}) => {
	return (
		<div className="form__group">
			<span className="form__label">{label}</span>
			<div className="flex items-center flex-col max-w-full mb-4">
				<div className="bg-white border border-primary-100 rounded-tl-md rounded-tr-md w-full">
					<div className="bg-white border-none h-auto p-4 justify-start">
						<label className="form__label m-0 bg-white rounded-md shadow py-3 px-5 inline-flex items-center cursor-pointer">
							<input
								type="file"
								className="hidden"
								name={name}
								accept={accept}
								multiple={multiple}
								onChange={onChange}
							/>
							<CameraIcon />
							{hasImage ? "Canviar imatge" : "Seleccionar imatge"}
						</label>
					</div>
				</div>
				<div className="w-full border border-primary-100 rounded-br-md rounded-bl-md -mt-px p-4 flex">
					<div className="-m-2.5 flex flex-wrap items-center">
						{preview}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ImageUploadField;
