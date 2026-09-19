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
 *
 * L'`<a>` hi va escrita: aquest projecte fa servir el `Link` antic de Next 12,
 * que espera l'àncora com a filla i no accepta `className` ni `href` a sobre.
 * Sense ella no es genera cap enllaç i només en queda el text solt.
 */
const LanguageSwitcher = ({ className = "" }) => {
	const { asPath, locale } = useRouter();
	const t = useT();
	const cami = (asPath || "/").split(/[?#]/)[0];

	return (
		<nav
			className={`language-switcher ${className}`.trim()}
			aria-label={t("nav.language")}
		>
			{LOCALES.map((codi) => {
				const actual = codi === locale;
				return (
					<Link key={codi} href={cami} locale={codi}>
						<a
							hrefLang={LOCALE_LABELS[codi].htmlLang}
							title={LOCALE_LABELS[codi].name}
							className={`language-switcher__item${
								actual ? " is-current" : ""
							}`}
							aria-current={actual ? "true" : undefined}
						>
							{LOCALE_LABELS[codi].short}
						</a>
					</Link>
				);
			})}
		</nav>
	);
};

export default LanguageSwitcher;
