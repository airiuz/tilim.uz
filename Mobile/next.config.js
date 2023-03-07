module.exports = () => {
  const rewrites = () => {
    return [
      {
        source: "/api/:path*/",
        destination: "https://tilimuz.airi.uz/api/:path*/",
      },
      {
        source: "/files/:path*",
        destination: "https://tilimuz.airi.uz/files/:path*",
      },
    ];
  };

  return {
    trailingSlash: true,
    rewrites,
  };
};
