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
      // {
      //   source: "/audio",
      //   destination: "https://oyqiz.airi.uz/api/audio",
      // },
      // {
      //   source: "/wavdata",
      //   destination: "https://oyqiz.airi.uz/wavdata",
      // },
      // {
      //   source: "/fastTyping/users",
      //   destination: "http://10.10.0.78:8080/api/ratings/top20",
      // },
      // {
      //   source: "/fastTyping/randomText",
      //   destination: "http://10.10.0.78:8080/api/texts/randomText",
      //   has: [{ type: "query", key: "type" }],
      // },
      // {
      //   source: "/fastTyping/checkRating",
      //   destination: "http://10.10.0.78:8080/api/ratings/checkRating",
      // },
      // {
      //   source: "/fastTyping/saveRating",
      //   destination: "http://10.10.0.78:8080/api/ratings/saveRating",
      // },
      // {
      //   source: "/api/:path*/",
      //   destination: "https://tilimuz.airi.uz/api/:path*/",
      // },
      // {
      //   source: "/files/:path*",
      //   destination: "https://tilimuz.airi.uz/files/:path*",
      // },
    ];
  },
};

module.exports = nextConfig;
