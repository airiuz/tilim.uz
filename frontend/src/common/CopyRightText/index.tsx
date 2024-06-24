import styles from "./index.module.css";

export const CopyRightText = () => {
  return (
    <div className={styles.copyright__text}>
      2022-{new Date().getFullYear()}. Barcha huquqlar himoyalangan.
    </div>
  );
};
