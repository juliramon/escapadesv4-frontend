import { TextField } from "../admin/FormFields";

/**
 * Pestanya SEO de les pàgines de composició.
 *
 * Els tres camps —meta títol, meta descripció i slug— amb els seus textos
 * d'ajuda estaven repetits a les deu pàgines de crear i editar.
 */
const SeoFieldset = ({ values, onChange }) => (
	<div className="form__wrapper">
		<form className="form" onSubmit={(e) => e.preventDefault()}>
			<div className="form__group">
				<label htmlFor="metaTitle" className="form__label">
					Meta títol
				</label>
				<input
					type="text"
					id="metaTitle"
					name="metaTitle"
					placeholder="Meta títol"
					className="form__control"
					value={values.metaTitle || ""}
					onChange={onChange}
				/>
				<span className="form__text_info">
					Cada publicació hauria de tenir un meta títol únic,
					idealment de menys de 60 caràcters de llargada
				</span>
			</div>

			<div className="form__group">
				<label htmlFor="metaDescription" className="form__label">
					Meta descripció
				</label>
				<input
					type="text"
					id="metaDescription"
					name="metaDescription"
					placeholder="Meta descripció"
					className="form__control"
					value={values.metaDescription || ""}
					onChange={onChange}
				/>
				<span className="form__text_info">
					Cada publicació hauria de tenir una meta descripció única,
					idealment de menys de 160 caràcters de llargada
				</span>
			</div>

			<TextField
				name="slug"
				label="Slug"
				placeholder="Slug de la publicació"
				value={values.slug}
				onChange={onChange}
			/>
		</form>
	</div>
);

export default SeoFieldset;
