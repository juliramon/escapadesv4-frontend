import { useEffect } from "react";

const AdBanner = (props) => {
	useEffect(() => {
		try {
			(window.adsbygoogle = window.adsbygoogle || []).push({});
		} catch (err) {
			console.error(err);
		}
	}, []);

	return (
		<div className="adblock">
			<ins
				className="adsbygoogle adbanner-customize"
				style={{
					display: "block",
				}}
				data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}
				{...props}
			/>
		</div>
	);
};

export default AdBanner;
