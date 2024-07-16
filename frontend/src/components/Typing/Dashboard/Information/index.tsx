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
import { useTypingStore } from "@/src/store/typing.store";
import useAxios from "@/src/hooks/axios.hook";
import { useCallback, useEffect } from "react";
import axios from "axios";

export const Dashboard = () => {
  const { setShow, setLanguage, setLoading, language, setText, loading } =
    useTypingStore();

  const { fetchData } = useAxios();

  const handleClick = (first: boolean) => {
    setLanguage(Number(!first));
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleStart = useCallback(async () => {
    setLoading(true);

    const result = await fetchData(
      `/randomText?type=${Number(!language)}`,
      "POST",
      null,
      {},
      "/fastTyping"
    );

    setLoading(false);
    setShow(true);
    if (result) setText(result.data);
  }, [language]);

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
        animation={Boolean(language)}
        secondBtnActive={Boolean(language)}
        firstChild={<LotinForTranslator />}
        secondChild={<KirilForTranslator />}
        key={language}
        width="331px"
        onClick={handleClick}
      />
      <div className={styles.start} onClick={handleStart}>
        <Button disabled={loading} className={""}>
          Boshlash {RocketIcon}
        </Button>
      </div>
      <div className={styles.image__container}>
        <Image src={KeyboardImage} alt={"keyboard"} width={387} height={183} />
      </div>
    </div>
  );
};
