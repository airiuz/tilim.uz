import styles from "./index.module.css";
import {
  Button,
  KirilForTranslator,
  LotinForTranslator,
  TranslatorButton,
} from "@/src/common/Button";
import { RocketIcon } from "@/src/common/Utils/icons";
import KeyboardImage from "../../../../assets/images/keyboard.png";
import Image from "next/image";
import { useShowStore } from "@/src/components/Typing/index.store";

export const Dashboard = () => {
  const { setShow } = useShowStore();
  return (
    <div className={styles.dashboard__container}>
      <div className={styles.text__1}>TEZ YOZISHNI SINASH</div>
      <div className={styles.text__2}>
        Matn yozish qobiliyatingizni{" "}
        <span className={styles.blue}>sinab ko'ring</span>
      </div>
      <div className={styles.description}>
        Ushbu funksiya, 60 soniya ichida nechta belgi, nechta so’z va qanday
        aniqlikda yoza olishingizni tekshirib beradi.
      </div>
      <div className={styles.text__3}>Yozuv turini tanlang:</div>
      <TranslatorButton
        animation={false}
        firstChild={<LotinForTranslator />}
        secondChild={<KirilForTranslator />}
        width="331px"
      />
      <div className={styles.start} onClick={() => setShow(true)}>
        <Button className={""}>Boshlash {RocketIcon}</Button>
      </div>
      <div className={styles.image__container}>
        <Image src={KeyboardImage} alt={"keyboard"} width={387} height={183} />
      </div>
    </div>
  );
};
