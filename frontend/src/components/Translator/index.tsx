"use client";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toolTipIcon } from "@/src/common/Utils/icons";
import styles from "./index.module.css";
import Markdown from "@/src/common/Markdown";
import {
  ArrowForTranslator,
  KirilForTranslator,
  LotinForTranslator,
  TranslatorButton,
} from "@/src/common/Button";
import { useTextEditorStore } from "@/src/store/translate.store";
import {
  convertFrom,
  convertTo,
  getEditorText,
} from "@/src/common/Textaera/converters";
import useAxios from "@/src/hooks/axios.hook";
import { TextToSpeech } from "@/src/common/TextToSpeech";
import { SpeechToText } from "@/src/common/SpeechToText";
import { Rate } from "@/src/common/Rate";
import { Copy } from "@/src/common/Copy";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { EditorState } from "draft-js";
import { useTranslateHook } from "@/src/hooks/translate.hook";
import { CorrectWordsTooltip } from "@/src/common/CorrectWordsTooltip";
import { convertToHTML } from "draft-convert";

import TextEditor from "@/src/common/Textaera";

// const TextEditor = React.lazy(() => import("@/src/common/Textaera"));

export const Translator = () => {
  const [minHeight, setMinHeight] = useState(219);
  const { editorState, setEditorState, setIncorrectWords, setLanguage } =
    useTextEditorStore();
  const footer = useRef<HTMLDivElement | null>(null);

  const { findWords, clearWord } = useTranslateHook();

  const { fetchData, loading, error } = useAxios();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setMinHeight(window.innerHeight - 517);
      setEditorState(EditorState.moveFocusToEnd(editorState));
    }
  }, []);

  const count = useMemo(
    () => editorState.getCurrentContent().getPlainText().length,
    [editorState]
  );

  const handleSubmit = useCallback(
    async (first: boolean) => {
      const [html, links] = convertTo(editorState.getCurrentContent());

      const result = await fetchData("change/", "POST", {
        data: html.slice(0, html.length - 1),
        type: String(Number(first)),
      });

      setLanguage(String(Number(first)));

      if (result) {
        const incorrectWords = result.incorrect_words.map((word: string) =>
          clearWord(word)
        );
        setIncorrectWords(incorrectWords);
        const newCurrentContent = convertFrom(result.text, links);
        findWords(
          convertToHTML(newCurrentContent),
          result.text,
          links,
          incorrectWords
        );
      }
    },
    [editorState]
  );

  const handleScroll = (e: React.KeyboardEvent<HTMLImageElement>) => {
    if (e.key === "Enter" && footer && footer.current)
      footer.current?.scrollIntoView();
  };

  return (
    <section className={styles.section}>
      <Suspense
        fallback={
          <div className={styles.skeleton__wrapper}>
            <Skeleton height={"100%"} width={"100%"} />
          </div>
        }
      >
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
              onClick={handleSubmit}
            />
          </div>
          <div
            className={styles.translator__textarea__container}
            onKeyUp={handleScroll}
          >
            <TextEditor
              editorState={editorState}
              setEditorState={setEditorState}
              clear
              minHeight={minHeight}
              className={`${styles.translator__body} ${styles.initialStyles}`}
              placeholder="Matnni kiriting"
            />
          </div>
          <div ref={footer} className={styles.translator__footer}>
            <div className={styles.translator__footer__icons__container}>
              <SpeechToText className={styles.active} />
              <TextToSpeech
                text={getEditorText(editorState.getCurrentContent()).trim()}
                className={styles.active}
              />
              <Copy />
            </div>
            <div className={styles.footer__icons__container}>
              <Rate />
              <Tooltip
                isOpen={count >= 5000}
                className={styles.tooltip}
                classNameArrow={styles.custom__arrow}
                id="my-tooltip-limit"
                place={"bottom"}
              >
                <div className={styles.tooltip__content}>
                  <span>{toolTipIcon}</span>
                  <span>
                    Mikrafonga ruxsat berish uchun chap tomondagi <br />{" "}
                    “Разрещить” tugamasini bosing
                  </span>
                </div>
              </Tooltip>
              <span
                data-tooltip-id="my-tooltip-limit"
                className={`${count >= 5000 && styles.red}`}
              >
                {count}
                /5000
              </span>
            </div>
          </div>
        </div>
      </Suspense>
      <CorrectWordsTooltip />
    </section>
  );
};
