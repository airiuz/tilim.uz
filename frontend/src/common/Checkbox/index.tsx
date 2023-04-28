import { CheckedIcon } from "@/src/common/Utils/icons";
import styles from "./index.module.css";
import { Dispatch, SetStateAction } from "react";

export const Checkbox = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange?: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className={styles.checkbox__container}>
      {/*<input type={'checkbox'} checked={checked} />*/}
      {checked && <div>{CheckedIcon}</div>}
    </div>
  );
};
