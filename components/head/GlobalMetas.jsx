import Head from "next/head";

const GlobalMetas = ({
	title,
	description,
	url,
	image,
	canonical,
	index = true,
}) => {
	return (
		<Head>
			<title>{title} - Escapadesenparella.cat</title>
			<link rel="icon" href="/favicon.ico" />
			<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
			<meta name="description" content={description} />
			<meta
				name="robots"
				content={index == true ? "index, follow" : "noindex, nofollow"}
			/>
			<meta
				name="googlebot"
				content={index == true ? "index, follow" : "noindex, nofollow"}
			/>
			<meta property="og:type" content="website" />
			<meta
				property="og:title"
				content={`${title} - Escapadesenparella.cat `}
			/>
			<meta property="og:description" content={description} />
			<meta property="url" content={url} />
			<meta property="og:site_name" content="Escapadesenparella.cat" />
			<meta property="og:locale" content="ca_ES" />
			<meta name="twitter:card" content="summary_large_image" />
			<meta
				name="twitter:title"
				content={`${title} - Escapadesenparella.cat `}
			/>
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={image} />
			<meta property="og:image" content={image} />
			<meta property="og:image:width" content="1200" />
			<meta property="og:image:heigth" content="1200" />
			{/* <link rel="canonical" href={canonical} /> */}
			<link href={`https://escapadesenparella.cat`} rel="home" />
			<meta property="fb:pages" content="1725186064424579" />
			<meta
				name="B-verify"
				content="756319ea1956c99d055184c4cac47dbfa3c81808"
			/>
		</Head>
	);
};

export default GlobalMetas;
