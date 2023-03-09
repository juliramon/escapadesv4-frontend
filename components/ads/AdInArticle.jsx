import AdSense from "react-adsense";

const AdInArticle = () => {
	return (
		<AdSense.Google
			client="ca-pub-6252269250624547"
			slot="7638377836"
			style={{ display: "block" }}
			layout="in-article"
			format="fluid"
		/>
	);
};

export default AdInArticle;
