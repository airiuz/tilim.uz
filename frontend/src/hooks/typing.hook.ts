"use client";
import { useTypingStore } from "@/src/store/typing.store";
import { useCallback, useState } from "react";
import { ContentState, EditorState } from "draft-js";
import useAxios from "./axios.hook";
import { IUser } from "../constants";

let htmlToDraft: any = null;
if (typeof window === "object") {
  htmlToDraft = require("html-to-draftjs").default;
}

export const useTypingHook = ({ content }: { content: string }) => {
  const [errors, setErrors] = useState<number[]>([]);

  const { fetchData } = useAxios();

  const {
    setData,
    language,
    text,
    typedText,
    setPassed,
    setPlace,
    setReadonly,
    chars,
    accuracy,
    setUsers,
    place,
    setShow,
    words,
    setTime,
  } = useTypingStore();

  const replace = useCallback(
    (index: number) => {
      if (content[index] === " ")
        return `<span style="background:rgba(244, 129, 129, 0);color:rgba(244, 129, 129, 0);">&nbsp;</span>`;
      return `<span style="color:rgb(236, 89, 77);">${content[index]}</span>`;
    },
    [content]
  );

  const handleAccuracy = useCallback(
    (text: string) => {
      const words =
        text.length !== 0 ? content.slice(0, text.length).split(" ").length : 0;
      const chars = text.length;
      const accuracy = Math.floor(
        ((text.length - errors.length) * 100) / (text.length ? text.length : 1)
      );
      setData(chars, words, accuracy);
    },
    [content, errors]
  );

  const handleReplace = useCallback(
    (text: string[]) => {
      for (let i = 0; i < text.length; i++) {
        if (text[i] !== content[i]) {
          if (
            (content[i] === "‘" || content[i] === "’") &&
            (text[i] === "'" || text[i] === "`")
          )
            text[i] = content[i];
          else text[i] = replace(i);
        }
      }

      errors.forEach((index) => {
        if (text[index]) {
          text[index] = replace(index);
        }
      });

      if (text[text.length - 1] !== content[text.length - 1]) {
        text[text.length - 1] = replace(text.length - 1);
        setErrors((prev) => Array.from(new Set([...prev, text.length - 1])));
      }

      const htmlString =
        text[text.length - 1] === " "
          ? `${text.slice(0, text.length - 1).join("")}&nbsp;`
          : `${text.join("")}`;

      const contentBlock = htmlToDraft(htmlString);
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );

      return EditorState.createWithContent(contentState);
    },
    [content, errors, replace]
  );

  const handlePassed = useCallback(
    async (duration: number) => {
      if (text) {
        const response = await fetchData("typefast/", "POST", {
          text_id: text.text_id,
          text: typedText,
          t: language,
          time: duration,
          accuracy,
        });
        if (response) {
          setPassed(true);
          setData(chars, response.wpm, accuracy);
          setPlace(response.place);
          setReadonly(false);
        }
      }
    },
    [text, typedText, language, accuracy]
  );

  const getTopUsers = useCallback(async () => {
    const users: IUser[] = await fetchData("/topusers/", "GET");
    if (users) setUsers(users);
  }, []);

  const handleSend = useCallback(
    async (name: string) => {
      const res = await fetchData("/topusers/", "POST", {
        place,
        name,
        t: String(language),
        wpm: words,
        percent: accuracy,
      });
      await getTopUsers();
      handleBack();
    },
    [place, language, words, accuracy]
  );

  const handleBack = useCallback(() => {
    setShow(false);
    setPassed(false);
    setData(0, 0, 0);
    setTime(false);
  }, []);

  const handleReply = useCallback(() => {
    setPassed(false);
    setData(0, 0, 0);
    setTime(false);
  }, []);

  return {
    handleReplace,
    handleAccuracy,
    handlePassed,
    getTopUsers,
    handleBack,
    handleSend,
    handleReply,
  };
};
