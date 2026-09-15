/** Qui publica, igual a totes les dades estructurades del web. */
const SITE_NAME = "Escapadesenparella.cat";
const SITE_URL = "https://escapadesenparella.cat";
const SITE_LOGO =
	"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg";

const PUBLISHER = {
	"@type": "Organization",
	name: SITE_NAME,
	logo: { "@type": "ImageObject", url: SITE_LOGO },
};

export { SITE_NAME, SITE_URL, SITE_LOGO, PUBLISHER };
