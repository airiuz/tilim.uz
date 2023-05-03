"use client";
import {
  AboutIcon,
  BurgerIcon,
  DarkModeBtn,
  DocumentIcon,
  LightModeBtn,
  QuestionIcon,
  RocketIcon,
  TranslatorIcon,
} from "@/src/common/Utils/icons";
import styles from "./index.module.css";
import { usePathname } from "next/navigation";
import { Links, localStorageThemeKey, THEME } from "@/src/constants";
import { useThemeStore } from "@/src/store/theme.store";
import { useActiveLink } from "@/src/hooks/activeLinks.hook";
import { Logo } from "@/src/common/Logo";
import { MobileMenu } from "@/src/layout/MobileMenu";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useHelpStore } from "@/src/store/help.store";

export default function Header() {
  const pathname = usePathname();

  const { setShow } = useHelpStore();

  const [open, setOpen] = useState(false);

  const { theme, setTheme } = useThemeStore();

  const handleOpen = () => setOpen((prev) => !prev);

  const switchTheme = () =>
    setTheme(theme === THEME.DARK ? THEME.LIGHT : THEME.DARK);

  const activeLink = useActiveLink();

  useEffect(() => {
    const currentTheme = localStorage.getItem(localStorageThemeKey);
    if (currentTheme === THEME.DARK || currentTheme === THEME.LIGHT)
      setTheme(currentTheme as THEME);
    else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    )
      setTheme(THEME.DARK);
    else setTheme(THEME.LIGHT);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <div className={styles.header__logo__container}>
          <div onClick={handleOpen} className={styles.mobile__burger}>
            {BurgerIcon}
          </div>
          <Logo />
        </div>
        <div className={styles.header__links__container}>
          <div className={styles.header__links__wrapper}>
            <Link
              href={Links.HOME}
              className={activeLink(Links.HOME, styles.active)}
            >
              <div>
                <div className={styles.icon__wrapper}>{TranslatorIcon}</div>
                <span>Lotin-kiril</span>
              </div>
              <div></div>
            </Link>
            <Link
              href={Links.DOCUMENT}
              className={activeLink(Links.DOCUMENT, styles.active)}
            >
              <div>
                <div className={styles.icon__wrapper}>{DocumentIcon}</div>
                <span>Xujjatlar bilan ishlash</span>
              </div>
              <div></div>
            </Link>

            <Link
              href={Links.TYPING}
              className={activeLink(Links.TYPING, styles.active)}
            >
              <div>
                <div className={styles.icon__wrapper}>{RocketIcon}</div>
                <span>Tez yozishni sinash</span>
              </div>
              <div></div>
            </Link>

            <Link
              href={Links.ABOUT}
              className={activeLink(Links.ABOUT, styles.active)}
            >
              <div>
                <div className={styles.icon__wrapper}>{AboutIcon}</div>
                <span>Loyiha haqida</span>
              </div>
              <div></div>
            </Link>
          </div>
        </div>
        <div className={styles.theme__switcher__container}>
          <div
            onClick={() => setShow(true)}
            className={styles.header__question__button}
          >
            {QuestionIcon}
          </div>
          <div onClick={switchTheme}>
            {theme === THEME.LIGHT ? DarkModeBtn : LightModeBtn}
          </div>
        </div>
      </div>
      <MobileMenu show={open} handleClose={handleOpen} />
    </header>
  );
}
