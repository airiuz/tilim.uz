import styles from "./index.module.css";
import { Button } from "@/src/common/Button";
import { BackIcon, GroupIcon, ReIcon } from "@/src/common/Utils/icons";
import { Card } from "@/src/common/Card";
import { useTypingStore } from "@/src/store/typing.store";
import { ChangeEvent, useCallback, useMemo, useState } from "react";

import four from "../../../../assets/images/4.png";
import three from "../../../../assets/images/3.png";
import two from "../../../../assets/images/2.png";
import one from "../../../../assets/images/1.png";
import oneMobile from "../../../../assets/images/1_mobile.png";
import Image from "next/image";
import useAxios from "@/src/hooks/axios.hook";
import { useTypingHook } from "@/src/hooks/typing.hook";

// Toshbaqadan sal tezroq > 50
// Quyondan qolishmaysiz 50 > x > 25
// Xavas qilguday tez 25 > x > 10
// “Flash”dan xam tezroq x < 10

export const Result = () => {
  const { chars, words, accuracy, place } = useTypingStore();

  const { handleSend, handleReply, handleBack } = useTypingHook({
    content: "",
  });

  const [name, setName] = useState("");

  const mobile = useMemo(() => {
    if (typeof window !== "undefined") return window.innerWidth < 768;
    return false;
  }, []);

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const placeData = useMemo(() => {
    if (place < 20 && place > 10)
      return { title: "Xavas qilguday tez", src: three };
    if (place <= 10 && place > 3)
      return { title: "Quyondan qolishmaysiz", src: two, form: true };
    if (place <= 3)
      return {
        title: "“Chaqmoq”dan xam tezroq",
        src: mobile ? oneMobile : one,
        form: true,
      };
    return { title: "Internet tezligmizdan tezroqsiz", src: four };
  }, [place]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSend(name);
  };

  return (
    <div className={styles.container}>
      <Button onClick={handleBack} className={styles.back}>
        <span>{BackIcon}</span>
        <span>Orqaga qaytish</span>
      </Button>
      <div className={styles.card}>
        <div className={styles.title}>{placeData.title}</div>
        <div className={styles.result}>
          <span>{GroupIcon}</span>
          <span>{place}- o’rindasiz </span>
        </div>
        <div className={styles.card__wrapper}>
          <div className={styles.cart_wrapper__1}>
            <Card className={styles.card__container}>
              <span>{chars}</span>
              <span>belgilar/daqiqa</span>
            </Card>
            <Card className={styles.card__container}>
              <span>{words}</span>
              <span>so'zlar/daqiqa</span>
            </Card>
          </div>
          <div className={styles.cart_wrapper__1}>
            <Card className={styles.card__container}>
              <span>{accuracy}</span>
              <span>% aniqlik</span>
            </Card>
            {/* <Button onClick={handleReply} className={styles.mobile__reply}>
              <span>{ReIcon}</span>
              <span>Qayta urinish</span>
            </Button> */}
          </div>
        </div>
        <div className={styles.image}>
          <Image src={placeData.src} alt="img" />
        </div>
        {placeData.form ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            <span>
              Ismingizni yozib qoldiring va o’zingizni kuchlilar reytingida
              ko’ring!
            </span>
            <input
              placeholder="Ism va familiya"
              value={name}
              onChange={handleInput}
            />
            <div className={styles.form__buttons__container}>
              <Button
                onClick={handleReply}
                type="button"
                className={styles.reIcon}
              >
                {ReIcon}
              </Button>
              <Button className={styles.save__button} type="submit">
                Saqlash
              </Button>
            </div>
          </form>
        ) : (
          <Button onClick={handleReply} className={styles.reply}>
            <span>Qayta urinish</span>
            <span>{ReIcon}</span>
          </Button>
        )}
      </div>
    </div>
  );
};
