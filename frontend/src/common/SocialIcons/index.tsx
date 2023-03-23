import styles from "./index.module.css";
import {
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  TelegramIcon,
} from "@/src/common/Utils/icons";

export const SocialIcons = () => {
  return (
    <div className={styles.footer__icon__wrapper}>
      <div>{FacebookIcon}</div>
      <div>{GithubIcon}</div>
      <div>{TelegramIcon}</div>
      <div>{InstagramIcon}</div>
    </div>
  );
};
