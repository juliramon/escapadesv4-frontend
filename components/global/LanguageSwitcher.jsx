import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { LOCALES, LOCALE_LABELS } from "../../utils/i18n";
import { useT } from "../../i18n/strings";

/**
 * Tria d'idioma.
 *
 * Un desplegable com el del menú: el botó ensenya l'idioma actual i la llista
 * s'obre a sota. Els idiomes són enllaços de debò i la llista és sempre al
 * DOM —s'amaga amb opacitat, com `menu-dropdown`— perquè Googlebot els
 * segueixi i trobi la versió castellana tot sol, que és mitja feina de
 * posicionar-la. Si s'obrís pintant-la amb JavaScript, no la veuria.
 *
 * Per sota de `lg` el botó no es pinta i els dos idiomes queden a la vista:
 * dins del menú del mòbil ja hi ha prou coses per obrir.
 *
 * L'`<a>` hi va escrita: aquest projecte fa servir el `Link` antic de Next 12,
 * que espera l'àncora com a filla i no accepta `className` ni `href` a sobre.
 */
const LanguageSwitcher = ({ className = "" }) => {
	const { asPath, locale } = useRouter();
	const t = useT();
	const [obert, setObert] = useState(false);
	const arrel = useRef(null);
	const cami = (asPath || "/").split(/[?#]/)[0];
	const actual = LOCALE_LABELS[locale] || LOCALE_LABELS.ca;

	// Tancar clicant a fora o amb Escape, com fa el menú.
	useEffect(() => {
		if (!obert) return undefined;
		const clicAFora = (event) => {
			if (arrel.current && !arrel.current.contains(event.target)) {
				setObert(false);
			}
		};
		const tecla = (event) => {
			if (event.key === "Escape") setObert(false);
		};
		document.addEventListener("click", clicAFora);
		document.addEventListener("keydown", tecla);
		return () => {
			document.removeEventListener("click", clicAFora);
			document.removeEventListener("keydown", tecla);
		};
	}, [obert]);

	// I tancar-lo en canviar d'idioma. El canvi és una navegació del client i
	// el component no es torna a muntar: sense això el panell es quedava obert
	// a sobre de la pàgina nova.
	useEffect(() => {
		setObert(false);
	}, [locale, cami]);

	return (
		<div
			ref={arrel}
			className={`language-switcher ${obert ? "open" : ""} ${className}`.trim()}
		>
			<button
				type="button"
				className="language-switcher__button"
				onClick={() => setObert((previ) => !previ)}
				aria-haspopup="true"
				aria-expanded={obert}
				aria-label={t("nav.language")}
			>
				<span className="language-switcher__current">
					{actual.short}
				</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width={16}
					height={16}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth={2}
					strokeLinecap="round"
					strokeLinejoin="round"
					className="language-switcher__chevron"
					aria-hidden="true"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<path d="M6 9l6 6l6 -6" />
				</svg>
			</button>
			<ul
				className={`language-switcher__list${obert ? " is-open" : ""}`}
				aria-label={t("nav.language")}
			>
				{LOCALES.map((codi) => {
					const esActual = codi === locale;
					return (
						<li key={codi} className="m-0">
							<Link href={cami} locale={codi}>
								<a
									hrefLang={LOCALE_LABELS[codi].htmlLang}
									className={`language-switcher__item${
										esActual ? " is-current" : ""
									}`}
									aria-current={esActual ? "true" : undefined}
									onClick={() => setObert(false)}
								>
									<span className="language-switcher__code">
										{LOCALE_LABELS[codi].short}
									</span>
									<span className="language-switcher__name">
										{LOCALE_LABELS[codi].name}
									</span>
								</a>
							</Link>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default LanguageSwitcher;
