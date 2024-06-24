const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    optimizeCss: true,
  },
  reactStrictMode: false,
  trailingSlash: true,
  rewrites: () => {
    return [
      {
        source: "/audio",
        destination: "https://oyqiz.airi.uz/api/audio",
      },
      {
        source: "/wavdata",
        destination: "https://oyqiz.airi.uz/wavdata",
      },
      {
        source: "/api/:path*/",
        destination: "https://tilimuz.airi.uz/api/:path*/",
      },

      {
        source: "/files/:path*",
        destination: "https://tilimuz.airi.uz/files/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
