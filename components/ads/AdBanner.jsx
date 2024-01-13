import { useEffect } from "react";

const AdBanner = (props) => {
	useEffect(() => {
		try {
			(window.adsbygoogle = window.adsbygoogle || []).push({});
		} catch (err) {
			console.error(err);
		}
	}, []);

	const sizes = props.customstyles ? props.customstyles : "";

	return (
		<div className={`adblock ${sizes}`}>
			<ins
				className="adsbygoogle adbanner-customize"
				style={{
					display: "block",
					overflow: "hidden",
				}}
				data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}
				{...props}
			/>
		</div>
	);
};

export default AdBanner;
