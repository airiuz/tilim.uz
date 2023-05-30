export const Loader = () => {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "calc(100vh - 198px)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "10000",
        background: "#fff",
        position: "absolute",
      }}
    >
      loading...
    </div>
  );
};
