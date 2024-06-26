"use client";
import { ContentState, EditorState } from "draft-js";
import { useCallback, useEffect, useState } from "react";
import { useTextEditorStore } from "@/src/store/translate.store";
import { usePathname } from "next/navigation";
import {
  BOLD_WORD_TAG,
  ITextEditorLink,
  Links,
  SPLIT_REGEX,
  TAG_REGEX,
  WRONG_CLOSE_TAG,
  WRONG_OPEN_TAG,
  WRONG_WORD_TAG,
} from "../constants";
import { convertTo } from "../common/Textaera/converters";
import { convertToHTML } from "draft-convert";

let htmlToDraft: any = null;
if (typeof window === "object") {
  htmlToDraft = require("html-to-draftjs").default;
}

export const useTranslateHook = () => {
  const {
    setTooltipPosition,
    setSelectedWord,
    editorState,
    selectedWord,
    incorrectWords,
    setEditorState,
    tooltipPosition,
    connected,
  } = useTextEditorStore();

  let pathname = "";

  if (typeof window !== "undefined") pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      let eventListener: any;
      if (pathname === Links.HOME) {
        const position = {
          top: 0,
          left: 0,
        };
        eventListener = window.addEventListener("click", (e: MouseEvent) => {
          const tooltip: HTMLElement | null = document.getElementById(
            "correctWordsTooltip"
          );
          const target = e.target as HTMLElement;

          if (tooltip && tooltip !== target && !tooltip.contains(target)) {
            const opacity = Number(
              !!(
                incorrectWords.find((word) =>
                  Boolean(target.innerText)
                    ? clearWord(target.innerText) === clearWord(word)
                    : false
                ) &&
                target.parentElement?.nodeName === "SPAN" &&
                target.parentElement?.getAttribute("data-offset-key")
              )
            );
            if (opacity) {
              position.top = e.clientY + 20;
              position.left = e.clientX - 60;
              setTooltipPosition({
                top: e.clientY + 20,
                left: e.clientX - 60,
                opacity,
                zIndex: "10000",
                transform: "translateY(0px)",
              });
              setSelectedWord(target.innerText);
            } else {
              setTooltipPosition({
                top: position.top,
                left: position.left,
                opacity,
                zIndex: "-1",
                transform: "translateY(10px)",
              });
              setSelectedWord("");
            }
          }
        });
      } else window.removeEventListener("click", eventListener);
      return () => {
        if (typeof window !== "undefined")
          return window.removeEventListener("click", eventListener);
      };
    }
  }, [pathname, incorrectWords]);

  const replaceToCorrectVersion = (word: string) => {
    if (connected) return;
    const contentState = editorState.getCurrentContent();

    const [markdown, links] = convertTo(contentState);

    findWords(
      convertToHTML(contentState),
      markdown,
      links,
      incorrectWords,
      word
    );

    setTooltipPosition({ ...tooltipPosition, opacity: 0, zIndex: "-1" });
  };

  const replaceWords = (text: string) => {
    const contentBlock = htmlToDraft(text).contentBlocks;
    const contentState = ContentState.createFromBlockArray(contentBlock);
    const state = EditorState.createWithContent(contentState);
    setEditorState(EditorState.moveFocusToEnd(state));
  };

  const replaceLinks = (text: string, links: any) => {
    const linksData: ITextEditorLink[] = [];

    const regex = /\s*\[(.*?)\]\(\s*(\d+)\s*\)\s*/g;

    text.replace(regex, (match: string, text: string, index: string) => {
      const linkItem: ITextEditorLink = {
        link: links[index] as string,
        text: clearWord(text),
      };
      linksData.push(linkItem);
      return linkRender(linkItem);
    });

    return { linksData };
  };

  const findWords = useCallback(
    (
      htmlContent: string,
      markdownContent: string,
      links: string[],
      incorrectWords: string[],
      replaceMentWord?: string
    ) => {
      if (replaceMentWord) {
        htmlContent = renderText(
          htmlContent,
          handleReplace,
          incorrectWords,
          selectedWord,
          replaceMentWord
        );
      }

      const { linksData } = replaceLinks(markdownContent, links);

      linksData.forEach((link: ITextEditorLink) => {
        htmlContent = htmlContent.replace(link.text, gluingWords(link.text));
      });

      let content = renderText(htmlContent, handleChangeColor, incorrectWords);

      linksData.forEach((link) => {
        content = content.replace(gluingWords(link.text), linkRender(link));
      });

      // console.log(content);
      // return;
      content = fixNestedTags(content);

      return replaceWords(content);
    },
    [editorState]
  );

  const fixNestedTags = useCallback((htmlString: string) => {
    let updatedHtml = htmlString.replaceAll(WRONG_WORD_TAG, (match: string) =>
      match.replaceAll(/<\/?(strong|u|em)>/g, "")
    );

    updatedHtml = updatedHtml.replaceAll(BOLD_WORD_TAG, (match: string) =>
      match.replaceAll(/<\/?(strong|u|em)>/g, "")
    );

    return updatedHtml;
  }, []);

  const renderText = (text: string, fn: any, ...args: any[]) => {
    let content = `${text}`;

    const plainText = content.replace(TAG_REGEX, "");

    const words = plainText.split(SPLIT_REGEX);

    let fromIndex = 0;

    let i = 0;

    while (i < words.length) {
      const word = words[i];
      const startIndex = content.indexOf(clearWord(word), fromIndex);
      const endIndex =
        startIndex + word.length - (word.length - clearWord(word).length);

      const result = fn(content, startIndex, endIndex, word, ...args);

      content = result.content;

      fromIndex = startIndex + result.wordLength;

      i++;
    }

    return content;
  };

  const replaceAt = (
    text: string,
    start: number,
    end: number,
    replacement: string
  ) => text.substring(0, start) + replacement + text.substring(end);

  const handleChangeColor = (
    content: string,
    startIndex: number,
    endIndex: number,
    word: string,
    incorrectWords: string[]
  ) => {
    if (incorrectWords.find((w: string) => word === w)) {
      return {
        content: replaceAt(content, startIndex, endIndex, wrongWord(word)),
        wordLength: wrongWord(word).length,
      };
    }
    return { content, wordLength: word.length };
  };

  const handleReplace = (
    content: string,
    startIndex: number,
    endIndex: number,
    word: string,
    _: string,
    incorrectWord: string,
    replaceMentWord: string
  ) => {
    if (word === incorrectWord)
      return {
        content: replaceAt(content, startIndex, endIndex, replaceMentWord),
        wordLength: replaceMentWord.length,
      };
    return { content, wordLength: word.length };
  };

  const gluingWords = (text: string) => text.split(" ").join("");

  const linkRender = (link: ITextEditorLink) =>
    `<a style="color:#007bff;text-decoration:underline" href="${link.link}">${link.text}</a>`;

  const wrongWord = (text: string) =>
    `${WRONG_OPEN_TAG}${clearWord(text)}${WRONG_CLOSE_TAG}`;

  const clearWord = (word: string) =>
    word
      .replace("<p>", "")
      .replace("</p>", "")
      .replace(".", "")
      .replace(",", "")
      .replace(")", "")
      .replace("(", "")
      .replace("[", "")
      .replace("]", "")
      .replace("?", "")
      .replace("!", "")
      .replace(":", "")
      .replaceAll("+", "")
      .replaceAll("_", "")
      .replaceAll("*", "")
      .replaceAll("</li>", "")
      .replaceAll("</ol>", "")
      .replaceAll("</ul>", "")
      .replaceAll("</li></ol>", "")
      .replaceAll("</li></ul>", "");

  return {
    findWords,
    replaceWords,
    replaceToCorrectVersion,
    replaceLinks,
    clearWord,
  };
};
