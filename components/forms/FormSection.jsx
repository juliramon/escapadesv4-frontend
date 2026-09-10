/**
 * Bloc de camps amb títol i explicació.
 *
 * Les fitxes eren una tirallonga de trenta camps seguits dins d'una sola
 * caixa blanca, sense cap separació entre el que és el contingut, el que és la
 * classificació i el que és informació pràctica. Amb els blocs, cada cosa
 * queda al seu lloc i es pot trobar d'un cop d'ull.
 */
const FormSection = ({ title, description, children, className = "" }) => (
	<section className={`form__wrapper mb-4 ${className}`}>
		{title ? (
			<header className="mb-4 border-b border-primary-50 pb-3">
				<h2 className="m-0 text-base font-medium text-primary-500">
					{title}
				</h2>
				{description ? (
					<p className="m-0 mt-0.5 text-xs text-primary-400">
						{description}
					</p>
				) : null}
			</header>
		) : null}
		{children}
	</section>
);

export default FormSection;
