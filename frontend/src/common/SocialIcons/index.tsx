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
      <div>
        <a href="https://www.facebook.com/ai.uzbekistan" target="_blank">
          {FacebookIcon}
        </a>
      </div>
      <div>
        <a href="https://github.com/airiuz" target="_blank">
          {GithubIcon}
        </a>
      </div>
      <div>
        <a href="https://t.me/tilim_uz" target="_blank">
          {TelegramIcon}
        </a>
      </div>
      <div>
        <a href="https://www.instagram.com/airi.uz/" target="_blank">
          {InstagramIcon}
        </a>
      </div>
    </div>
  );
};
