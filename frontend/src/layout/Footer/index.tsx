"use client";
import {
  DocumentIcon,
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  RocketIcon,
  TelegramIcon,
  TranslatorIcon,
} from "@/src/common/Utils/icons";
import styles from "./index.module.css";
import { Links } from "@/src/constants";
import Link from "next/link";
import { useActiveLink } from "@/src/hooks/activeLinks.hook";
import { Logo } from "@/src/common/Logo";
import { CopyRightText } from "@/src/common/CopyRightText";
import { SocialIcons } from "@/src/common/SocialIcons";

export default function Footer() {
  const activeLink = useActiveLink();
  return (
    <footer className={styles.footer}>
      <div className={styles.mobile__footer}>
        <Link
          href={Links.HOME}
          className={`${styles.icon__wrapper} ${activeLink(
            Links.HOME,
            styles.active
          )}`}
        >
          <span>{TranslatorIcon}</span>
          <span>Lotin-kiril</span>
        </Link>
        <Link
          href={Links.DOCUMENT}
          className={`${styles.icon__wrapper} ${activeLink(
            Links.DOCUMENT,
            styles.active
          )}`}
        >
          <span>{DocumentIcon}</span>
          <span>Xujjatlar bilan ishlash</span>
        </Link>
        <Link
          href={Links.TYPING}
          className={`${styles.icon__wrapper} ${activeLink(
            Links.TYPING,
            styles.active
          )}`}
        >
          <span>{RocketIcon}</span>
          <span>Tez yozish</span>
        </Link>
      </div>
      <div className={styles.footer__wrapper}>
        <div>
          <div className={styles.footer__logo}>
            <Logo />
            <div className={styles.footer__logo__text}>Beta v1.0</div>
          </div>
        </div>
        <div>
          <div className={styles.footer__text__wrapper}>
            <div className={styles.footer__text}>Xavfsizlik siyosat</div>
            <div className={styles.footer__text}>Foydalanuvchi siyosati</div>
            <div className={styles.footer__text}>Qoidalar</div>
          </div>
          <CopyRightText />
        </div>
        <div>
          <SocialIcons />
        </div>
      </div>
    </footer>
  );
}
