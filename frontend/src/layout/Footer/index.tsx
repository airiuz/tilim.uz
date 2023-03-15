import {FacebookIcon, FooterLogoIcon, GithubIcon, InstagramIcon, TelegramIcon} from "@/src/common/Utils/icons";
import styles from './index.module.css'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footer__wrapper}>
                <div>
                    <div className={styles.footer__logo}>
                        <div>
                            {FooterLogoIcon}
                        </div>
                        <div className={styles.footer__logo__text} >
                            TILIM.UZ
                        </div>
                        <div className={styles.footer__logo__text}>
                            Beta v1.0
                        </div>
                    </div>
                </div>
                <div>
                    <div className={styles.footer__text__wrapper}>
                        <div className={styles.footer__text}>
                            Xavfsizlik siyosat
                        </div>
                        <div className={styles.footer__text}>
                            Foydalanuvchi siyosati
                        </div>
                        <div className={styles.footer__text}>
                            Qoidalar
                        </div>
                    </div>
                    <div className={styles.copyright__text} >
                        Copyright © 2022 AIRI Group Co., Ltd. All rights reserved.
                    </div>
                </div>
                <div>
                    <div className={styles.footer__icon__wrapper}>
                        <div>{FacebookIcon}</div>
                        <div>{GithubIcon}</div>
                        <div>{TelegramIcon}</div>
                        <div>{InstagramIcon}</div>
                    </div>
                </div>
            </div>
        </footer>
    )
}