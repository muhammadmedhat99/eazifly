/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "hossam.mallahsoft.com/**"
    }]
  }
};

module.exports = nextConfig;
