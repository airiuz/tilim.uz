import { useTypingStore } from "@/src/store/typing.store";
import { useState } from "react";
import htmlToDraft from "html-to-draftjs";
import { ContentState, EditorState } from "draft-js";
import useAxios from "./axios.hook";

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
  } = useTypingStore();

  const replace = (index: number) => {
    if (content[index] === " ")
      return `<span style="background:rgba(244, 129, 129, 0.1);color:rgba(244, 129, 129, 0.1);">-</span>`;
    return `<span style="color:rgb(236, 89, 77);">${content[index]}</span>`;
  };

  const handleAccuracy = (text: string) => {
    const words =
      text.length !== 0 ? content.slice(0, text.length).split(" ").length : 0;
    const chars = text.length;
    const accuracy = Math.floor(
      ((text.length - errors.length) * 100) / (text.length ? text.length : 1)
    );
    setData(chars, words, accuracy);
  };

  const handleReplace = (text: string[]) => {
    for (let i = 0; i < text.length; i++) {
      if (text[i] !== content[i]) {
        text[i] = replace(i);
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

    const contentBlock = htmlToDraft(`<span>${text.join("")}</span>`);
    const contentState = ContentState.createFromBlockArray(
      contentBlock.contentBlocks
    );

    return EditorState.createWithContent(contentState);
  };

  const handlePassed = async () => {
    if (text) {
      const response = await fetchData("typefast/", "POST", {
        text_id: text.text_id,
        text: typedText,
        t: language,
      });
      if (response) {
        setPassed(true);
        setPlace(response.place);
        setReadonly(false);
      }
    }
  };

  return { handleReplace, handleAccuracy, handlePassed };
};
