import Head from "next/head";
import React from "react";

const Article = ({
	headline,
	summary,
	image,
	author,
	publicationDate,
	modificationDate,
}) => {
	return (
		<Head>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: `{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "${headline}",
  "description": "${summary}",
  "image": "${image}",  
  "author": {
    "@type": "Person",
    "name": "${author}"
  },  
  "publisher": {
    "@type": "Organization",
    "name": "Escapadesenparella.cat",
    "logo": {
      "@type": "ImageObject",
      "url": "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
    }
  },
  "datePublished": "${publicationDate}",
  "dateModified": "${modificationDate}"
}`,
				}}
			/>
		</Head>
	);
};

export default Article;
