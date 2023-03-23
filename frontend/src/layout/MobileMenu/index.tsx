import styles from "./index.module.css";
import { Logo } from "@/src/common/Logo";
import { Exit } from "@/src/common/Exit";
import { ArrowRightIcon } from "@/src/common/Utils/icons";
import { Links } from "@/src/constants";
import Link from "next/link";
import { SocialIcons } from "@/src/common/SocialIcons";
import { CopyRightText } from "@/src/common/CopyRightText";

export const MobileMenu = ({
  show,
  handleClose,
}: {
  show: boolean;
  handleClose: () => void;
}) => {
  return (
    <div className={`${styles.container} ${show && styles.active}`}>
      <div className={styles.mobile__menu}>
        <div className={styles.mobile__menu__header}>
          <Logo />
          <Exit handleClick={handleClose} />
        </div>
        <div className={styles.mobile__menu__body}>
          <div>
            <Link href={Links.HOME} className={styles.mobile__menu__item}>
              <span>Loyiha haqida</span>
              <span>{ArrowRightIcon}</span>
            </Link>
            <Link href={Links.ABOUT} className={styles.mobile__menu__item}>
              <span>Foydalanish huquqlari</span>
              <span>{ArrowRightIcon}</span>
            </Link>
            <Link href={Links.ABOUT} className={styles.mobile__menu__item}>
              <span>Xavfsizlik</span>
              <span>{ArrowRightIcon}</span>
            </Link>
            <Link href={Links.ABOUT} className={styles.mobile__menu__item}>
              <span>Qoidalar</span>
              <span>{ArrowRightIcon}</span>
            </Link>
          </div>
          <div className={styles.social__icons__wrapper}>
            <SocialIcons />
            <CopyRightText />
          </div>
        </div>
      </div>
    </div>
  );
};
