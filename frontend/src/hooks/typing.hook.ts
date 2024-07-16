"use client";
import { useTypingStore } from "@/src/store/typing.store";
import { useCallback, useEffect, useState } from "react";
import { ContentState, EditorState } from "draft-js";
import useAxios from "./axios.hook";
import { IUser } from "../constants";

let htmlToDraft: any = null;
if (typeof window === "object") {
  htmlToDraft = require("html-to-draftjs").default;
}

export const useTypingHook = ({ content }: { content: string }) => {
  const { fetchData } = useAxios();

  const {
    setData,
    language,
    text,
    typedText,
    setLoading,
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
    (text: string, errCount: number) => {
      // console.log(text);
      // console.log(content.slice(0, text.length));

      // const words =
      //   text.length !== 0
      //     ? content.slice(0, text.length).split(" ").length - 1
      //     : 0;

      const words = text.length / 5;

      const chars = text.length;
      const accuracy = Math.floor(
        (text.length * 100) / (text.length + errCount || 1)
      );
      setData(chars, words, accuracy);
    },
    [content, typedText]
  );

  const handleReplace = useCallback(
    (text: string[], errs: number[]) => {
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

      errs.forEach((index) => {
        if (text[index]) {
          text[index] = replace(index);
        }
      });

      if (text[text.length - 1] !== content[text.length - 1])
        text[text.length - 1] = replace(text.length - 1);

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
    [content, replace]
  );

  const handlePassed = useCallback(
    async (duration: number) => {
      if (!text) return;
      setLoading(true);
      const response = await fetchData(
        "/checkRating",
        "POST",
        {
          text: typedText,
          t: +Number(!language),
          time: duration,
          accuracy,
        },
        {},
        "/fastTyping"
      );
      setLoading(false);

      if (response) {
        setPassed(true);
        setData(chars, response.data.wpm, accuracy);
        setPlace(response.data.place);
        setReadonly(false);
      }
    },
    [text, typedText, language, accuracy]
  );

  const getTopUsers = useCallback(async () => {
    const response = await fetchData("/users", "GET", null, {}, "/fastTyping");

    if (!response) return;

    const users: IUser[] = response.data.kratings.concat(
      response.data.lratings
    );
    // console.log(users);
    setUsers(users);
  }, []);

  const handleSend = useCallback(
    async (name: string) => {
      const res = await fetchData(
        "/saveRating",
        "POST",
        {
          fullName: name,
          type: String(Number(!language)),
          wpm: words,
          accuracy,
          rating: accuracy * words,
        },
        {},
        "/fastTyping"
      );
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
