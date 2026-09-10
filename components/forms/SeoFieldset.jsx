import { SEO_LIMITS, SITE_URL, buildSlug, serpPreview } from "../../utils/seo";
import LengthMeter from "./LengthMeter";
import { SeoCheckList, SeoScoreDial } from "./SeoScore";

/**
 * Pestanya de SEO de les pàgines de composició.
 *
 * Abans eren tres camps de text amb una frase d'ajuda repetida a totes les
 * publicacions i cap manera de saber si el que s'hi escrivia servia de res.
 * Ara, a més dels camps, hi ha:
 *  - la llargada de cada camp amb la franja recomanada,
 *  - com quedarà el resultat a Google,
 *  - el slug generat des del títol, amb avís si té accents o majúscules,
 *  - una paraula clau objectiu, que es comprova al títol, a la descripció, al
 *    slug i a l'entrada del text (només viu al navegador: no es desa a la
 *    fitxa perquè el model no té cap camp on posar-la),
 *  - la llista de comprovacions i la puntuació que en surt.
 */
const SeoFieldset = ({
	values,
	onChange,
	onFieldChange,
	analysis,
	keyword = "",
	onKeywordChange,
	previewPath = "",
}) => {
	const preview = serpPreview({
		metaTitle: values.metaTitle,
		title: values.title,
		metaDescription: values.metaDescription,
		subtitle: values.subtitle,
		path: previewPath,
	});

	const cleanSlug = buildSlug(values.slug);
	const slugNeedsFix = Boolean(values.slug) && values.slug !== cleanSlug;

	return (
		<div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
			<div className="lg:col-span-3 form__wrapper">
				<form className="form" onSubmit={(e) => e.preventDefault()}>
					<div className="form__group">
						<div className="flex items-baseline justify-between gap-3">
							<label htmlFor="metaTitle" className="form__label">
								Meta títol
							</label>
							{values.title &&
							values.metaTitle !== values.title ? (
								<button
									type="button"
									className="text-xs text-blue-600 underline"
									onClick={() =>
										onFieldChange("metaTitle", values.title)
									}
								>
									Fer servir el títol
								</button>
							) : null}
						</div>
						<input
							type="text"
							id="metaTitle"
							name="metaTitle"
							placeholder="Com vols que es llegeixi a Google"
							className="form__control"
							value={values.metaTitle || ""}
							onChange={onChange}
						/>
						<LengthMeter
							value={values.metaTitle}
							limits={SEO_LIMITS.metaTitle}
						/>
					</div>

					<div className="form__group">
						<div className="flex items-baseline justify-between gap-3">
							<label
								htmlFor="metaDescription"
								className="form__label"
							>
								Meta descripció
							</label>
							{values.subtitle &&
							values.metaDescription !== values.subtitle ? (
								<button
									type="button"
									className="text-xs text-blue-600 underline"
									onClick={() =>
										onFieldChange(
											"metaDescription",
											values.subtitle,
										)
									}
								>
									Fer servir el subtítol
								</button>
							) : null}
						</div>
						<textarea
							id="metaDescription"
							name="metaDescription"
							rows={3}
							placeholder="Resum que convidi a fer clic al resultat"
							className="form__control"
							value={values.metaDescription || ""}
							onChange={onChange}
						/>
						<LengthMeter
							value={values.metaDescription}
							limits={SEO_LIMITS.metaDescription}
						/>
					</div>

					<div className="form__group">
						<div className="flex items-baseline justify-between gap-3">
							<label htmlFor="slug" className="form__label">
								Slug
							</label>
							{values.title ? (
								<button
									type="button"
									className="text-xs text-blue-600 underline"
									onClick={() =>
										onFieldChange(
											"slug",
											buildSlug(values.title),
										)
									}
								>
									Generar des del títol
								</button>
							) : null}
						</div>
						<div className="flex items-stretch">
							<span className="hidden sm:flex items-center rounded-l-md border border-r-0 border-primary-50 bg-gray-50 px-2.5 text-xs text-primary-400 whitespace-nowrap">
								{SITE_URL.replace("https://", "")}
								{previewPath.replace(/[^/]*$/, "")}
							</span>
							<input
								type="text"
								id="slug"
								name="slug"
								placeholder="slug-de-la-publicacio"
								className="form__control sm:rounded-l-none"
								value={values.slug || ""}
								onChange={onChange}
							/>
						</div>
						{slugNeedsFix ? (
							<p className="m-0 mt-1.5 text-xs text-amber-700">
								Hauria de ser{" "}
								<strong className="font-medium">
									{cleanSlug}
								</strong>
								.{" "}
								<button
									type="button"
									className="text-blue-600 underline"
									onClick={() =>
										onFieldChange("slug", cleanSlug)
									}
								>
									Corregir-ho
								</button>
							</p>
						) : (
							<span className="form__text_info">
								Canviar-lo en una publicació ja indexada en
								trenca els enllaços.
							</span>
						)}
					</div>

					<div className="form__group">
						<label htmlFor="seoKeyword" className="form__label">
							Paraula clau objectiu
						</label>
						<input
							type="text"
							id="seoKeyword"
							name="seoKeyword"
							placeholder="p. ex. escapada romàntica a la Cerdanya"
							className="form__control"
							value={keyword}
							onChange={(e) => onKeywordChange(e.target.value)}
						/>
						<span className="form__text_info">
							Serveix per comprovar on surt. Es queda en aquest
							navegador i no es desa a la publicació.
						</span>
					</div>
				</form>
			</div>

			<div
				className="lg:col-span-2 lg:sticky space-y-4"
				style={{ top: "var(--composer-toolbar-offset, 8rem)" }}
			>
				<div className="form__wrapper">
					<p className="form__label mb-2">Com es veurà a Google</p>
					<div className="rounded-md border border-primary-50 p-3">
						<p className="m-0 text-xs text-primary-400 truncate">
							{preview.url}
						</p>
						<p className="m-0 text-[18px] leading-tight text-[#1a0dab]">
							{preview.title}
						</p>
						<p className="m-0 mt-1 text-[13px] leading-snug text-primary-400">
							{preview.description}
						</p>
					</div>
				</div>

				<div className="form__wrapper">
					<SeoScoreDial
						score={analysis.score}
						level={analysis.level}
					/>
					<div className="mt-4 border-t border-primary-50 pt-4">
						<SeoCheckList checks={analysis.checks} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default SeoFieldset;
