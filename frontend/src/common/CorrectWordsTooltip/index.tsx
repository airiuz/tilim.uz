import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTextEditorStore } from "@/src/store/translate.store";
import styles from "./index.module.css";
import { CheckedIcon } from "@/src/common/Utils/icons";
import { useTranslateHook } from "@/src/hooks/translate.hook";
import { createPortal } from "react-dom";
import useAxios from "@/src/hooks/axios.hook";
import Skeleton from "react-loading-skeleton";
import { useThemeStore } from "@/src/store/theme.store";
import { THEME } from "@/src/constants";

export const CorrectWordsTooltip = () => {
  const { tooltipPosition, selectedWord, language } = useTextEditorStore();

  const { theme } = useThemeStore();

  const { replaceToCorrectVersion } = useTranslateHook();

  const skeletonColor = useMemo(
    () =>
      theme === THEME.DARK
        ? {
            baseColor: "#333",
            highlightColor: "#444",
          }
        : { baseColor: "", highlightColor: "" },
    [theme]
  );

  const { loading, fetchData } = useAxios();

  const themeWrapperRef = useRef<HTMLDivElement | null>(null);

  const [words, setWords] = useState([]);

  useEffect(() => {
    const themeWrapper = document.querySelector(".theme__wrapper");
    if (themeWrapper) {
      themeWrapperRef.current = themeWrapper as HTMLDivElement;
    }
    if (selectedWord.trim() !== "") {
      (async function () {
        const result = await fetchData("/fix/", "POST", {
          word: selectedWord,
          type: language,
        });
        const recommended = Array.isArray(result.recommended)
          ? result.recommended
          : [result.recommended];
        setWords(recommended);
      })();
    }
  }, [selectedWord]);
  if (themeWrapperRef && themeWrapperRef.current)
    return createPortal(
      <div
        id="correctWordsTooltip"
        className={`${styles.container} ${loading && styles.loading}`}
        style={{
          top: tooltipPosition.top + "px",
          left: tooltipPosition.left + "px",
          opacity: tooltipPosition.opacity,
          zIndex: tooltipPosition.zIndex,
          transform: tooltipPosition.transform,
        }}
      >
        {loading ? (
          <Skeleton
            baseColor={skeletonColor.baseColor}
            highlightColor={skeletonColor.highlightColor}
            height={"100%"}
            width={"100%"}
          />
        ) : (
          words.map((word, i) => (
            <div
              key={i}
              onClick={() => replaceToCorrectVersion(word)}
              className={styles.item}
            >
              <span>{word}</span>
              <span className={styles.checked}>{CheckedIcon}</span>
            </div>
          ))
        )}
      </div>,
      themeWrapperRef.current
    );

  return <></>;
};
