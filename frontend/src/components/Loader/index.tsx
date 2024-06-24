import { HashLoader } from "react-spinners";
import styles from "./index.module.css";

export const Loader = () => {
  return (
    <div className={styles.loader}>
      <HashLoader size={50} color={"#123abc"} loading />
    </div>
  );
};
