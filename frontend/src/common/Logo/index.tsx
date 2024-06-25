import { LogoIcon } from "@/src/common/Utils/icons";
import styles from "./index.module.css";
import Link from "next/link";
import { Links } from "@/src/constants";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href={Links.HOME} className={styles.header__logo}>
      {LogoIcon}
      <span>TILIM.UZ</span>
    </Link>
  );
};
