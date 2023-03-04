import AdSense from "react-adsense";

const FooterLinksInterest = () => {
	return (
		<section className="py-12 md:pt-16 md:pb-24">
			<div className="container">
				<div className="w-full lg:w-10/12 mx-auto">
					<h2>Enllaços d'interès</h2>
					<div className="mt-5">
						<AdSense.Google
							client="ca-pub-6252269250624547"
							slot="9222117584"
							style={{ display: "block" }}
							format="auto"
							responsive="true"
							layoutKey="-gw-1+2a-9x+5c"
						/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default FooterLinksInterest;
