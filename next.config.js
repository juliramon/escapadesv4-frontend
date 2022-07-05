const withTM = require("next-transpile-modules")(["@fancyapps/ui"]);

const nextConfig = {
  env: {
    API_URL: process.env.NEXT_PUBLIC_APP_API_URL,
    GOOGLE_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    GOOGLE_ANALYTICS_TAG: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS,
    STRIPE_API_KEY: process.env.NEXT_PUBLIC_STRIPE_API_KEY,
  },
};

module.exports = withTM(nextConfig);
