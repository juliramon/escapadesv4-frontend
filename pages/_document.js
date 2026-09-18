import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx);
		return { ...initialProps };
	}

	render() {
		// `locale` el posa Next a partir de la ruta: sense això, les pàgines de
		// sota /es es declararien en català i els lectors de pantalla —i
		// Google— es creurien l'etiqueta abans que el text.
		const lang = this.props.__NEXT_DATA__?.locale || "ca";
		return (
			<Html lang={lang}>
				<Head>
					<Script
						src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TAG}`}
						strategy="afterInteractive"
					/>
					<Script id="google-analytics" strategy="afterInteractive">
						{`
							window.dataLayer = window.dataLayer || [];
							function gtag(){dataLayer.push(arguments);}
							gtag('js', new Date());
	
							gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TAG}');
						`}
					</Script>
					<Script
						async
						src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}`}
						strategy="lazyOnload"
						crossOrigin="anonymous"
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
