"use client";
import styles from "./index.module.css";
import { Button } from "@/src/common/Button";
import { PauseIcon, StopTextingIcon, xMark } from "@/src/common/Utils/icons";
import { Card } from "@/src/common/Card";
import { TextEditor } from "@/src/common/Textaera";
import { useEffect, useRef, useState } from "react";

export const FirstSection = () => {
  const [height, setHeight] = useState<number>(110);
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wrapper && wrapper.current) setHeight(wrapper.current.clientHeight);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.buttons__container}>
          <Button className={styles.stop__button}>
            <span>{StopTextingIcon}</span>
            <span>Yakunlash</span>
          </Button>
          <Button className={styles.pause__button}>
            <span>{PauseIcon}</span>
            <span>Pauza</span>
          </Button>
        </div>
        <div className={styles.buttons__container}>
          <div className={styles.child__section}>
            <div className={styles.time__container}>
              <div className={styles.time}>
                <span>60</span>
                <span>soniya</span>
              </div>
            </div>
            <Card className={styles.mark}>
              <span>0</span>
              <span>belgilar/daqiqa</span>
            </Card>
          </div>

          <div className={styles.child__section}>
            <Card className={styles.mark}>
              <span>0</span>
              <span>so'zlar/daqiqa</span>
            </Card>
            <Card className={styles.mark}>
              <span>0</span>
              <span>% aniqlik</span>
            </Card>
          </div>
        </div>
      </div>
      <div className={styles.text__wrapper}>
        <div className={styles.text__editor__wrapper} ref={wrapper}>
          <TextEditor maxHeight={height} placeholder={""} />
        </div>
      </div>
    </div>
  );
};
