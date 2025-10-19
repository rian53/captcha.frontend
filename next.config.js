const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  compress: false,
  serverRuntimeConfig: {
    secret: process.env.NEXT_SECRET,
  },
  publicRuntimeConfig: {
    apiUrl: process.env.API_URL,
    supportPhone: process.env.SUPPORT_PHONE
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg")
    );

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

module.exports = nextConfig;
