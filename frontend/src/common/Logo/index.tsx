import { LogoIcon } from "@/src/common/Utils/icons";
import styles from "./index.module.css";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={styles.header__logo}>
      {LogoIcon}
      <span>TILIM.UZ</span>
    </div>
  );
};
