import Link from "next/link";
import { useRouter } from "next/router";
import { LOCALES, LOCALE_LABELS } from "../../utils/i18n";
import { useT } from "../../i18n/strings";

/**
 * Tria d'idioma.
 *
 * Són dos enllaços de debò i no un `<select>` amb un salt per JavaScript:
 * així Googlebot els segueix i troba la versió castellana tot sol, que és
 * mitja feina de posicionar-la. `next/link` amb `locale` manté el mateix camí
 * i només en canvia el prefix.
 */
const LanguageSwitcher = ({ className = "" }) => {
	const { asPath, locale } = useRouter();
	const t = useT();
	const cami = (asPath || "/").split(/[?#]/)[0];

	return (
		<nav className={`language-switcher ${className}`} aria-label={t("nav.language")}>
			{LOCALES.map((codi) => {
				const actual = codi === locale;
				return (
					<Link
						key={codi}
						href={cami}
						locale={codi}
						hrefLang={LOCALE_LABELS[codi].htmlLang}
						className={`language-switcher__item${
							actual ? " is-current" : ""
						}`}
						aria-current={actual ? "true" : undefined}
					>
						<abbr title={LOCALE_LABELS[codi].name}>
							{LOCALE_LABELS[codi].short}
						</abbr>
					</Link>
				);
			})}
		</nav>
	);
};

export default LanguageSwitcher;
