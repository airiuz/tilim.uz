"use client";
import { AudioIcon, CopyIcon, MicrophoneIcon } from "@/src/common/Utils/icons";
import { TextEditor } from "@/src/common/Textaera";
import styles from "./index.module.css";
import Markdown from "@/src/common/Markdown";
import {
  ArrowForTranslator,
  KirilForTranslator,
  LotinForTranslator,
  TranslatorButton,
} from "@/src/common/Button";

export const Translator = () => {
  return (
    <div className={styles.translator__container}>
      <div className={styles.translator__header}>
        <Markdown />
        <TranslatorButton
          animation
          firstChild={
            <>
              <LotinForTranslator />
              <ArrowForTranslator />
              <KirilForTranslator />
            </>
          }
          secondChild={
            <>
              <KirilForTranslator />
              <ArrowForTranslator />
              <LotinForTranslator />
            </>
          }
          width="401px"
        />
      </div>
      <div className={styles.translator__textarea__container}>
        <TextEditor maxHeight={304} placeholder="Matnni kiriting" />
      </div>
      <div className={styles.translator__footer}>
        <div className={styles.translator__footer__icons__container}>
          <div>{MicrophoneIcon}</div>
          <div>{AudioIcon}</div>
          <div>{CopyIcon}</div>
        </div>
        <div>19/5000</div>
      </div>
    </div>
  );
};
