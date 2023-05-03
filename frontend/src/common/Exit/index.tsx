import styles from "./index.module.css";
import { useThemeStore } from "@/src/store/theme.store";
import { THEME } from "@/src/constants";
import { xMarkDarkTheme, xMark } from "@/src/common/Utils/icons";

export const Exit = ({ handleClick }: { handleClick?: () => void }) => {
  const { theme } = useThemeStore();
  return (
    <div onClick={handleClick} className={styles.close}>
      {theme === THEME.DARK ? xMarkDarkTheme : xMark}
    </div>
  );
};
