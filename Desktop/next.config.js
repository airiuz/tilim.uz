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
      {
        source: "/api",
        destination: "http://127.0.0.1:8000/api",
      },
    ];
  };

  return {
    trailingSlash: true,
    rewrites,
  };
};
