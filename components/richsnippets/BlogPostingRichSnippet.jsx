import JsonLd from "./JsonLd";
import { PUBLISHER } from "./publisher";

const BlogPostingRichSnippet = ({
	headline,
	summary,
	image,
	author,
	publicationDate,
	modificationDate,
}) => (
	<JsonLd
		data={{
			"@context": "https://schema.org",
			"@type": "BlogPosting",
			headline,
			description: summary || undefined,
			image: image || undefined,
			author: author ? { "@type": "Person", name: author } : undefined,
			publisher: PUBLISHER,
			datePublished: publicationDate || undefined,
			dateModified: modificationDate || publicationDate || undefined,
		}}
	/>
);

export default BlogPostingRichSnippet;
