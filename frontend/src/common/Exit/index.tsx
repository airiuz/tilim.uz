import styles from "./index.module.css";
import { xMark } from "@/src/common/Utils/icons";

export const Exit = ({ handleClick }: { handleClick?: () => void }) => {
  return (
    <div onClick={handleClick} className={styles.close}>
      {xMark}
    </div>
  );
};
