import JsonLd from "./JsonLd";
import { SITE_NAME, SITE_URL } from "./publisher";

/**
 * Qui hi ha darrere del web i on trobar-lo.
 *
 * Va amb `WebSite` al mateix graf: sense `WebSite`, Google no sap quin nom té
 * el lloc ni que hi ha un cercador intern.
 */
const LocalBusinessRichSnippet = () => (
	<JsonLd
		data={{
			"@context": "https://schema.org",
			"@graph": [
				{
					"@type": "Organization",
					"@id": `${SITE_URL}#organization`,
					name: SITE_NAME,
					alternateName: "escapadesenparella",
					url: SITE_URL,
					logo: "https://res.cloudinary.com/juligoodie/image/upload/v1662135572/branding/logo-escapades-en-parella_dzg44a.jpg",
					contactPoint: {
						"@type": "ContactPoint",
						telephone: "633178499",
						contactType: "customer service",
						contactOption: "TollFree",
						areaServed: "ES",
						availableLanguage: ["Catalan", "es", "en"],
					},
					sameAs: [
						"https://www.facebook.com/escapadesenparella",
						"https://twitter.com/escapaenparella",
						"https://www.instagram.com/escapadesenparella",
						"https://www.linkedin.com/company/escapadesenparella",
					],
				},
				{
					"@type": "WebSite",
					"@id": `${SITE_URL}#website`,
					name: SITE_NAME,
					url: SITE_URL,
					inLanguage: "ca",
					publisher: { "@id": `${SITE_URL}#organization` },
					potentialAction: {
						"@type": "SearchAction",
						target: {
							"@type": "EntryPoint",
							urlTemplate: `${SITE_URL}/search?query={search_term_string}`,
						},
						"query-input": "required name=search_term_string",
					},
				},
			],
		}}
	/>
);

export default LocalBusinessRichSnippet;
