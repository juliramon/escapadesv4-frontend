import JsonLd from "./JsonLd";

const BreadcrumbRichSnippet = ({
	page1Title,
	page1Url,
	page2Title,
	page2Url,
	page3Title,
	page3Url,
}) => {
	const pages = [
		{ title: page1Title, url: page1Url },
		{ title: page2Title, url: page2Url },
		{ title: page3Title, url: page3Url },
	].filter((page) => page.title && page.url);

	if (!pages.length) return null;

	return (
		<JsonLd
			data={{
				"@context": "https://schema.org",
				"@type": "BreadcrumbList",
				itemListElement: pages.map((page, index) => ({
					"@type": "ListItem",
					position: index + 1,
					name: page.title,
					item: page.url,
				})),
			}}
		/>
	);
};

export default BreadcrumbRichSnippet;
