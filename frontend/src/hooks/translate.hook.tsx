import htmlToDraft from "html-to-draftjs";
import { ContentState, EditorState } from "draft-js";
import { useCallback, useEffect, useState } from "react";
import {
  ITooltipPosition,
  useTextEditorStore,
} from "@/src/store/translate.store";
import { usePathname } from "next/navigation";
import { ITextEditorLink, Links } from "../constants";
import { extractWord } from "../common/Utils";
import { convertFrom, convertTo } from "../common/Textaera/converters";
import { convertToHTML } from "draft-convert";

export const useTranslateHook = () => {
  const {
    setTooltipPosition,
    setSelectedWord,
    editorState,
    selectedWord,
    incorrectWords,
    setEditorState,
    tooltipPosition,
  } = useTextEditorStore();

  const [translatedHtmlContent, setTranslatedHtmlContent] =
    useState<string>("");

  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
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
    return () => window.removeEventListener("click", eventListener);
  }, [pathname, incorrectWords]);

  const replaceToCorrectVersion = (word: string) => {
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

      console.log(linksData);

      linksData.forEach((link: ITextEditorLink) => {
        htmlContent = htmlContent.replace(link.text, gluingWords(link.text));
      });

      let content = renderText(htmlContent, handleChangeColor, incorrectWords);

      linksData.forEach((link) => {
        content = content.replace(gluingWords(link.text), linkRender(link));
      });

      return replaceWords(content);
    },
    [editorState]
  );

  const replaceAt = (
    text: string,
    start: number,
    end: number,
    replacement: string
  ) => {
    return text.substring(0, start) + replacement + text.substring(end);
  };

  const renderText = (text: string, fn: any, ...args: any[]) => {
    let content = `${text}`;

    const plainText = content.replace(/<[^>]+>/g, "");

    const words = plainText.split(/\s+/);

    let fromIndex = 0;

    let i = 0;

    while (i < words.length) {
      const word = words[i];
      const startIndex = content.indexOf(clearWord(word), fromIndex);
      const endIndex =
        startIndex + word.length - (word.length - clearWord(word).length);
      fromIndex = endIndex;

      content = fn(content, startIndex, endIndex, word, ...args);

      i++;
    }

    return content;
  };

  const handleChangeColor = (
    content: string,
    startIndex: number,
    endIndex: number,
    word: string,
    incorrectWords: string[]
  ) => {
    if (incorrectWords.find((w: string) => !!word.includes(w)))
      return replaceAt(content, startIndex, endIndex, wrongWord(word));
    return content;
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
      return replaceAt(content, startIndex, endIndex, replaceMentWord);
    return content;
  };

  const gluingWords = (text: string) => text.split(" ").join("");

  // components

  const linkRender = (link: ITextEditorLink) =>
    `<a style="color:#007bff;text-decoration:underline" href="${link.link}">${link.text}</a>`;

  const wrongWord = (text: string) =>
    `<span style="color:red">${clearWord(text)}</span>`;

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
