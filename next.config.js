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
        source: "/listing-region/barcelona/",
        destination: "/escapades-catalunya/escapades-barcelona",
        permanent: true,
      },
      {
        source: "/escapades-tarragona",
        destination: "/escapades-catalunya/escapades-tarragona",
        permanent: true,
      },
      {
        source: "/escapades-girona",
        destination: "/escapades-catalunya/escapades-girona",
        permanent: true,
      },
      {
        source: "/listing-region/girona",
        destination: "/escapades-catalunya/escapades-girona",
        permanent: true,
      },
      {
        source: "/listing-type/refugi",
        destination: "/refugis",
        permanent: true,
      },
      {
        source: "/tag/aventura/",
        destination: "/escapades-aventura",
        permanent: true,
      },
      {
        source: "/assets/documents/escapadesdespresconfinament.pdf",
        destination: "/",
        permanent: true,
      },
      {
        source: "/hotels",
        destination: "/hotels-amb-encant",
        permanent: true,
      },
      {
        source: "/restaurants",
        destination: "/escapades-gastronomiques",
        permanent: true,
      },
      {
        source: "/escapades-culturals/972 75 19 10",
        destination: "/",
        permanent: true,
      },
      {
        source: "/category/escapades-estranger/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/escapades/hotel-rural-vinyes-de-lemporda/",
        destination: "/escapades-romantiques/hotel-rural-vinyes-emporda",
        permanent: true,
      },
      {
        source: "/escapades-aventura/2017/sant-joan-de-lerm-raquetes-de-neu/",
        destination: "/histories/sant-joan-de-lerm-raquetes-de-neu",
        permanent: true,
      },
      {
        source: "/[categoria]",
        destination: "/",
        permanent: true,
      },
      {
        source: "/escapades-gastronomiques/la-terra-a-girona",
        destination: "/escapades-gastronomiques/local-la-terra-girona",
        permanent: true,
      },
      {
        source: "/carabanes",
        destination: "/caravanes",
        permanent: true,
      },
      {
        source: "/escapades/hotel-can-casi/",
        destination: "/escapades-romantiques/hotel-can-casi-adults-only",
        permanent: true,
      },
      {
        source: "/escapades-culturals/querforadat-cadi",
        destination: "/escapades-romantiques/prats-de-cadi-des-d-estana",
        permanent: true,
      },
      {
        source:
          "/escapades-aventura/2016/escapada-moto-de-neu-a-grau-roig-andorra",
        destination: "/escapades-aventura/moto-de-neu-andorra-ruta-grau-roig",
        permanent: true,
      },
      {
        source: "/escapades-aventura/2017/vol-en-globus-garrotxa/",
        destination:
          "/escapades-romantiques/vol-en-globus-vol-de-coloms-garrotxa",
        permanent: true,
      },
      {
        source:
          "/escapades-gastronomiques/2016/restaurant-orquestra-dargentona/",
        destination: "/escapades-gastronomiques",
        permanent: true,
      },
      {
        source: "/activitats/restaurant-maria-de-cadaques",
        destination: "/escapades-gastronomiques/restaurant-maria-de-cadaques",
        permanent: true,
      },
      {
        source: "/escapades-romantiques/2017/apartament-parellada",
        destination: "/escapades-romantiques/apartament-spa-parellada",
        permanent: true,
      },
      {
        source: "/escapades-pirineus",
        destination: "/escapades-catalunya/escapades-pirineus",
        permanent: true,
      },
      {
        source: "/escapades-romantiques/hotel-lazure-lloret-de-mar",
        destination:
          "/escapades-romantiques/lazure-hotel-lloret-de-mar-costa-brava",
        permanent: true,
      },
      {
        source: "/escapades-romantiques/lazure-hotel-llore-de-mar-costa-brava",
        destination:
          "/escapades-romantiques/lazure-hotel-lloret-de-mar-costa-brava",
        permanent: true,
      },
    ];
  },
});
