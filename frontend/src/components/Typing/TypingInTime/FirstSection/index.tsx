"use client";
import styles from "./index.module.css";
import { Button } from "@/src/common/Button";
import { PauseIcon, StopTextingIcon } from "@/src/common/Utils/icons";
import { Card } from "@/src/common/Card";
import { TypingDiv } from "@/src/common/Textaera/typing/typing";
import { useTypingStore } from "@/src/store/typing.store";
import { CountDown } from "@/src/common/CountDown";
import { useEffect, useState } from "react";
import { useTypingHook } from "@/src/hooks/typing.hook";
import { DURATION } from "@/src/constants";

export const FirstSection = () => {
  const {
    words,
    chars,
    accuracy,
    setPause,
    setTime,
    setShow,
    time,
    text,
    typedText,
    setReadonly,
  } = useTypingStore();

  const { handlePassed } = useTypingHook({ content: "" });

  const [started, setStarted] = useState(false);

  useEffect(() => {
    // window.onblur = handlePause;
  }, [typedText]);

  const handlePause = () => {
    if (typedText === "") return;
    setReadonly(true);
    setPause("Orqaga qaytish");
    setTime(false);
  };

  const handleStop = () => {
    if (!time) return setShow(false);

    handlePassed(DURATION);
    setTime(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.buttons__container}>
          <Button
            className={styles.stop__button}
            // disabled={!started}
            onClick={handleStop}
          >
            <span>{StopTextingIcon}</span>
            <span>Yakunlash</span>
          </Button>
          <Button
            className={styles.pause__button}
            disabled={!started}
            onClick={handlePause}
          >
            <span>{PauseIcon}</span>
            <span>Pauza</span>
          </Button>
        </div>
        <div className={styles.buttons__container}>
          <div className={styles.child__section}>
            <CountDown />

            <Card className={styles.mark}>
              <span>{chars}</span>
              <span>belgilar/daqiqa</span>
            </Card>
          </div>

          <div className={styles.child__section}>
            <Card className={styles.mark}>
              <span>{words}</span>
              <span>so'zlar/daqiqa</span>
            </Card>
            <Card className={styles.mark}>
              <span>{accuracy}</span>
              <span>% aniqlik</span>
            </Card>
          </div>
        </div>
      </div>

      <div className={styles.text__wrapper}>
        <div className={styles.text__editor__wrapper}>
          <TypingDiv
            content={text?.text || "Something went wrong"}
            setStarted={setStarted}
          />
        </div>
      </div>
    </div>
  );
};
