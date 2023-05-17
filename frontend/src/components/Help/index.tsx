"use client";
import styles from "./index.module.css";
import { QuestionIcon } from "@/src/common/Utils/icons";
import { useHelpStore } from "@/src/store/help.store";
import Lottie from "lottie-react";
import DesktopDark from "../../assets/lottier/Web dark.json";
import DesktopLight from "../../assets/lottier/Web light.json";
import MobileDark from "../../assets/lottier/Mobile dark.json";
import MobileLight from "../../assets/lottier/Mobile light.json";
import { useThemeStore } from "@/src/store/theme.store";
import { THEME } from "@/src/constants";
import { Exit } from "@/src/common/Exit";
import { useMemo } from "react";

export const Help = () => {
  const { show, setShow } = useHelpStore();
  const { theme } = useThemeStore();

  const mobile = useMemo(
    () => typeof window !== undefined && window.innerWidth < 1160,
    []
  );

  let lottier =
    theme === THEME.DARK
      ? mobile
        ? MobileDark
        : DesktopDark
      : mobile
      ? MobileLight
      : DesktopLight;

  if (show)
    return (
      <div className={styles.help__wrapper}>
        <div className={styles.help__drawer}>
          <div className={styles.title__wrapper}>
            <h3 className={styles.title}>Yordam</h3>
            <Exit handleClick={() => setShow(false)} />
          </div>
          <div className={styles.description}>
            Lotin - Kiril funksiyasidan foydalanish uchun, Lotin yoki kiril matn
            yozing va qaysinga o’girish kerak bo’lsa, o’sha tugmani bosing.
          </div>
          <div>
            <Lottie animationData={lottier} />
          </div>
        </div>
      </div>
    );
  return <></>;
};

export const HelpButton = () => {
  const { setShow } = useHelpStore();
  return (
    <div className={styles.help__button} onClick={() => setShow(true)}>
      {QuestionIcon}
    </div>
  );
};
