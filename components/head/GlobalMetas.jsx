import Head from "next/head";
import { useRouter } from "next/router";
import {
	SITE_NAME,
	serpDescription,
	serpTitle,
} from "../../utils/pageMeta";
import { LOCALES, LOCALE_LABELS, localePrefix } from "../../utils/i18n";

/** Arrel del web, per poder-hi encaixar el prefix d'idioma. */
const ARREL = "https://escapadesenparella.cat";

/**
 * Imatge de reserva per a les xarxes. Les cinc destinacions sense foto i
 * Sobre nosaltres es compartien sense cap imatge, i l'enllaç hi sortia com
 * una ratlla de text.
 */
const DEFAULT_IMAGE =
	"https://res.cloudinary.com/juligoodie/image/upload/f_auto,q_auto,w_1200,h_630,c_fill/v1662135572/branding/logo-escapades-en-parella_dzg44a.jpg";

const GlobalMetas = ({
	title,
	description,
	url,
	image,
	canonical,
	index = true,
	preload,
	preconnect,
	// Les històries, les llistes i les entrades de viatge són articles; la
	// resta de pàgines, el web en si.
	type = "website",
	// De reserva quan l'entrada no té meta títol o meta descripció escrits.
	fallbackTitle,
	fallbackDescription,
}) => {
	const { asPath, locale } = useRouter();
	// `hreflang`: diu a Google que aquestes dues URL són la mateixa pàgina en
	// dos idiomes, i no contingut duplicat. Han de sortir a totes dues versions
	// i cadascuna s'hi ha d'anomenar a si mateixa, si no Google les ignora.
	//
	// Es construeix a partir d'`asPath` i no de la canònica perquè la canònica
	// d'algunes fitxes apunta a la seva història: el que fa parella aquí és la
	// mateixa pàgina en l'altra llengua, no la pàgina que mana.
	const cami = (asPath || "/").split(/[?#]/)[0];
	// Les pàgines passen la canònica sense idioma, perquè la construeixen amb
	// el domini escrit a mà. Posar-hi el prefix aquí evita haver-ho de recordar
	// a quaranta llocs, i que /es/… es canonicalitzi a la versió catalana, que
	// és com dir-li a Google que la castellana no existeix.
	const prefix = localePrefix(locale);
	const canonicalUrl =
		prefix && canonical && canonical.startsWith(ARREL)
			? `${ARREL}${prefix}${canonical.slice(ARREL.length)}`
			: canonical;
	const pageUrl =
		prefix && url && url.startsWith(ARREL)
			? `${ARREL}${prefix}${url.slice(ARREL.length)}`
			: url;
	const alternate = LOCALES.map((codi) => ({
		codi,
		hreflang: LOCALE_LABELS[codi].htmlLang,
		href: `https://escapadesenparella.cat${localePrefix(codi)}${
			cami === "/" ? "" : cami
		}`,
	}));
	// El títol ja porta la marca quan hi cap: `serpTitle` decideix, i és el
	// mateix que ensenya la previsualització de l'admin.
	const documentTitle = serpTitle({
		metaTitle: title,
		title: fallbackTitle,
	});
	const metaDescription = serpDescription({
		metaDescription: description,
		subtitle: fallbackDescription,
	});
	// A les xarxes la marca ja va a `og:site_name`: repetir-la al títol se'n
	// menja l'espai i el deixa tallat.
	const shareTitle = serpTitle({
		metaTitle: title,
		title: fallbackTitle,
	}).replace(` | ${SITE_NAME}`, "");
	// Les portades de temporada són fitxers del mateix web ("/home-cover-…"):
	// Facebook i Twitter necessiten la URL sencera per poder-les llegir.
	const shareImage = (image || DEFAULT_IMAGE).startsWith("/")
		? `https://escapadesenparella.cat${image || DEFAULT_IMAGE}`
		: image || DEFAULT_IMAGE;
	return (
		<Head>
			<title>{documentTitle}</title>
			<link rel="icon" href="/favicon.ico" />
			<meta http-equiv="X-UA-Compatible" content="IE=edge" />
			<meta name="description" content={metaDescription} />
			<meta
				name="robots"
				content={index == true ? "index, follow" : "noindex, nofollow"}
			/>
			<meta
				name="googlebot"
				content={index == true ? "index, follow" : "noindex, nofollow"}
			/>
			<meta property="og:title" content={shareTitle} />
			<meta property="og:type" content={type} />
			<meta property="og:description" content={metaDescription} />
			<meta property="og:image" content={shareImage} />
			<meta property="og:image:width" content="1200" />
			<meta property="og:image:heigth" content="630" />
			<meta property="og:url" content={pageUrl} />
			<meta property="og:site_name" content="Escapadesenparella.cat" />
			<meta
				property="og:locale"
				content={(LOCALE_LABELS[locale] || LOCALE_LABELS.ca).htmlLang.replace(
					"-",
					"_",
				)}
			/>
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:url" content={pageUrl} />
			<meta name="twitter:site" content="@escapaenparella" />
			<meta name="twitter:creator" content="@escapaenparella" />
			<meta name="twitter:domain" content="https://escapadesenparella.cat" />
			<meta name="twitter:title" content={shareTitle} />
			<meta name="twitter:description" content={metaDescription} />
			<meta name="twitter:image" content={shareImage} />
			<link rel="canonical" href={canonicalUrl} />
			{alternate.map(({ codi, hreflang, href }) => (
				<link key={codi} rel="alternate" hrefLang={hreflang} href={href} />
			))}
			{/* El català és el que serveix qualsevol idioma que no sigui el
			    castellà: és on hi ha tot el contingut. */}
			<link
				rel="alternate"
				hrefLang="x-default"
				href={alternate[0].href}
			/>
			<link href={`https://escapadesenparella.cat`} rel="home" />
			<meta property="fb:pages" content="1725186064424579" />
			<meta
				name="B-verify"
				content="756319ea1956c99d055184c4cac47dbfa3c81808"
			/>
			<meta name='impact-site-verification' value='041455ce-54f0-4bc3-b2ea-2730d637aa2d' />
			{preload ? <link rel="preload" href={preload} as="image" /> : null}
			{preconnect ? <link rel="preconnect" href={preconnect} crossOrigin /> : null}
			{preconnect ? <link rel="dns-prefetch" href={preconnect} /> : null}
		</Head>
	);
};

export default GlobalMetas;
