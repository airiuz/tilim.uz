import { HashLoader } from "react-spinners";

export const Loader = () => {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "calc(100vh - 94px - 104px)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "10000",
        background: "var(--background-layout)",
        color: "var(--text)",
        position: "absolute",
      }}
    >
      <HashLoader size={50} color={"#123abc"} loading />
    </div>
  );
};
