const withTM = require("next-transpile-modules")(["@fancyapps/ui"]);

module.exports = withTM({
	env: {
		API_URL: process.env.NEXT_PUBLIC_APP_API_URL,
		GOOGLE_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
		GOOGLE_ANALYTICS_TAG: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS,
		STRIPE_API_KEY: process.env.NEXT_PUBLIC_STRIPE_API_KEY,
	},
	async redirects() {
		return [
			{
				source: "/festivals-de-musica-a-catalunya",
				destination: "/llistes/festivals-musica-catalunya",
				permanent: true,
			},
			{
				source: "/llistes/[slug]",
				destination: "/llistes",
				permanent: true,
			},
			{
				source: "/escapades-culturals/2017/pastorets-de-mataro",
				destination: "/escapades-culturals",
				permanent: true,
			},
			{
				source: "/categories-escapades/escapades-culturals/",
				destination: "/escapades-culturals",
				permanent: true,
			},
			{
				source: "/listing-region/barcelona/\?search_keywords=&search_region=178&search_categories[]=&filter_job_type[]=",
				destination: "/escapades-catalunya/escapades-barcelona",
				permanent: true,
			},
			{
				source: "/escapades-tarragona",
				destination: "/escapades-catalunya/escapades-tarragona",
				permanent: true,
			},
			{
				source: "/listing-type/refugi\?search_keywords=&search_region=178&search_categories[]=179&filter_job_type[]=refugi",
				destination: "/refugis",
				permanent: true,
			},
			{
				source: "/listing-type/refugi/\?search_keywords=&search_region=182&search_categories[]=&filter_job_type[]=refugi",
				destination: "/refugis",
				permanent: true,
			},
			{
				source: "/tag/aventura/",
				destination: "/escapades-aventura",
				permanent: true,
			},
		];
	},
});
