import Head from "next/head";

const GoogleAnalytics = () => {
  const GATrackingCode = "UA-58771635-10;";
  return (
    <>
      {process.browser ? (
        <Head>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GATrackingCode}`}
          ></script>
          <script
            async
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag("js", new Date());

                gtag("config", '${GATrackingCode}');`,
            }}
          />
        </Head>
      ) : null}
    </>
  );
};

export default GoogleAnalytics;
