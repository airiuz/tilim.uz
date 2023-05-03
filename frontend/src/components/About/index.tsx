import { SocialIcons } from "@/src/common/SocialIcons";
import styles from "./index.module.css";
import { Card } from "@/src/common/Card";
import { MailIcon, PhoneIcon, ScriptIcon } from "@/src/common/Utils/icons";

export const AboutComponent = () => {
  return (
    <section className={styles.section}>
      <div className={styles.about__contact}>
        <div className={styles.about}>
          <h2>Loyiha haqida</h2>
          <div className={styles.about__content}>
            Ushbu loyiha O‘zbek tilini rivojlantirish uchun ishlab chiqilgan.
            Loyiha Raqamli texnologiyalar va sun’iy intellektni rivojlantirish
            ilmiy tadqiqot institutining yosh dasturchilar jamoasi tomonidan
            ishlab chiqildi. Tilim.uzdan hamma istalgan joyda, istalgan vaqtda -
            oson va mutlaqo bepul foydalanishi mumkin.Loyihada Lotin-Kirill va
            Kirill-Lotin o‘girish tizimi, sun’iy intellekt texnologiyasi asosida
            matndagi xatolarni aniqlash va matnning ma’nosiga qarab keyingi
            so‘zlarni aniqlash tizimi va matnli ma’lumotlarni ovozli xabarga va
            ovozli xabarni matnli ma’lumotga aylantirish tizimi joriy qilingan.
          </div>
        </div>
        <div className={styles.contact__wrapper}>
          <Card className={styles.contact}>
            <h3>Biz bilan bog’lanish</h3>
            <div className={styles.contacts}>
              <a href="tel:+998335591818">
                <span>{PhoneIcon}</span>
                <span>+998 (33) 559-18-18</span>
              </a>
              <a href="mailto:Info@airi.uz">
                <span>{MailIcon}</span>
                <span>Info@airi.uz</span>
              </a>
            </div>
          </Card>

          <Card className={styles.social__media}>
            <h3>Ijtimoiy tarmoqlarda kuzating</h3>
            <SocialIcons />
          </Card>
        </div>
      </div>

      <div className={styles.participants}>
        <h2>Loyiha ishtirokchilari</h2>

        <div className={styles.participants__container}>
          <Card className={styles.participant__item}>
            <div className={styles.icon__wrapper}>{ScriptIcon}</div>
            <div className={styles.participant__data}>
              <span className={styles.participant__name}>
                Biyimbetov Azizbek
              </span>
              <span className={styles.participant__role}>Loyiha asoschisi</span>
            </div>
          </Card>

          <Card className={styles.participant__item}>
            <div className={styles.icon__wrapper}>{ScriptIcon}</div>
            <div className={styles.participant__data}>
              <span className={styles.participant__name}>
                Biyimbetov Azizbek
              </span>
              <span className={styles.participant__role}>Loyiha asoschisi</span>
            </div>
          </Card>

          <Card className={styles.participant__item}>
            <div className={styles.icon__wrapper}>{ScriptIcon}</div>
            <div className={styles.participant__data}>
              <span className={styles.participant__name}>
                Biyimbetov Azizbek
              </span>
              <span className={styles.participant__role}>Loyiha asoschisi</span>
            </div>
          </Card>

          <Card className={styles.participant__item}>
            <div className={styles.icon__wrapper}>{ScriptIcon}</div>
            <div className={styles.participant__data}>
              <span className={styles.participant__name}>
                Biyimbetov Azizbek
              </span>
              <span className={styles.participant__role}>Loyiha asoschisi</span>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
