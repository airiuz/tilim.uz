import { HashLoader } from "react-spinners";

export const Loader = () => {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "calc(100vh - 92px)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "10000",
        background: "var(--background-layout)",
        color: "var(--text)",
        position: "absolute",
      }}
    >
      {/* loading... */}

      <HashLoader size={50} color={"#123abc"} loading />
    </div>
  );
};
