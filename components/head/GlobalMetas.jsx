import Head from "next/head";
import {
	SITE_NAME,
	serpDescription,
	serpTitle,
} from "../../utils/pageMeta";

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
			<meta property="og:url" content={url} />
			<meta property="og:site_name" content="Escapadesenparella.cat" />
			<meta property="og:locale" content="ca_ES" />
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:url" content={url} />
			<meta name="twitter:site" content="@escapaenparella" />
			<meta name="twitter:creator" content="@escapaenparella" />
			<meta name="twitter:domain" content="https://escapadesenparella.cat" />
			<meta name="twitter:title" content={shareTitle} />
			<meta name="twitter:description" content={metaDescription} />
			<meta name="twitter:image" content={shareImage} />
			<link rel="canonical" href={canonical} />
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
