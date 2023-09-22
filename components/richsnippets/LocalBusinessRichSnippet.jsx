import Head from "next/head";
import React from "react";

const LocalBusinessRichSnippet = () => {
	return (
		<Head>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: `
	{
		"@context": "https://schema.org",
		"@type": "Organization",
		"name": "Escapadesenparella.cat",
		"alternateName": "escapadesenparella",
		"url": "https://escapadesenparella.cat",
		"logo": "https://res.cloudinary.com/juligoodie/image/upload/v1662135572/branding/logo-escapades-en-parella_dzg44a.jpg",
		"contactPoint": {
			"@type": "ContactPoint",
			"telephone": "633178499",
			"contactType": "customer service",
			"contactOption": "TollFree",
			"areaServed": "ES",
			"availableLanguage": ["Catalan","es","en"]
		},
		"sameAs": [
			"https://www.facebook.com/escapadesenparella",
			"https://twitter.com/escapaenparella",
			"https://www.instagram.com/escapadesenparella",
			"https://www.linkedin.com/company/escapadesenparella",
			"https://escapadesenparella.cat"
		]
	}
	`,
				}}
			></script>
		</Head>
	);
};

export default LocalBusinessRichSnippet;
