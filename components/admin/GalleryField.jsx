import ImageUploadField from "./ImageUploadField";

/**
 * Galeria d'imatges amb previsualització i botó d'esborrar per element.
 *
 * La fan servir les històries i les entrades de viatge, que tenien el mateix
 * marcatge duplicat a les seves pàgines de crear i d'editar.
 */
const GalleryField = ({ label, name = "images", previews, onChange, onRemove }) => (
	<ImageUploadField
		label={label}
		name={name}
		multiple
		onChange={onChange}
		hasImage={previews.length > 0}
		preview={previews.map((src, idx) => (
			<div
				key={`${src}-${idx}`}
				className="m-2 relative w-48 h-auto overflow-hidden rounded-md border-8 border-white shadow"
			>
				<button
					type="button"
					onClick={() => onRemove(idx)}
					aria-label="Esborrar imatge"
					className="w-7 h-7 bg-black bg-opacity-70 text-white hover:bg-opacity-100 transition-all duration-300 ease-in-out absolute top-2 right-2 rounded-full flex items-center justify-center"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width={16}
						height={16}
						viewBox="0 0 24 24"
						strokeWidth="2"
						stroke="currentColor"
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path d="M4 7l16 0" />
						<path d="M10 11l0 6" />
						<path d="M14 11l0 6" />
						<path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
						<path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
					</svg>
				</button>
				<img src={src} alt="" />
			</div>
		))}
	/>
);

export default GalleryField;
