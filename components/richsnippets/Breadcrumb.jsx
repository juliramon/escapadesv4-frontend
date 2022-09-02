import Head from "next/head";

const Breadcrumb = ({ page1Title, page1Url, page2Title, page2Url }) => {
  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: `
		{
			"@context": "https://schema.org/", 
			"@type": "BreadcrumbList", 
			"itemListElement": [{
				"@type": "ListItem", 
				"position": 1, 
				"name": "${page1Title}",
				"item": "${page1Url}"  
			},{
				"@type": "ListItem", 
				"position": 2, 
				"name": "${page2Title}",
				"item": "${page2Url}"  
			}]
			}
	`,
        }}
      ></script>
    </Head>
  );
};

export default Breadcrumb;
