const createNextIntlPlugin = require('next-intl/plugin');
 
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "test.eazifly.com/**"
      },
      {
        protocol: "https",
        hostname: "hudaelnas.eazifly.com/**"
      },
    ]
  }
};

module.exports = withNextIntl(nextConfig);
