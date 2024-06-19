"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTextEditorStore } from "../store/translate.store";

interface ITextToSpeech {
  text: string;
}

export const useTTSHook = (props: ITextToSpeech) => {
  const [connected, setConnected] = useState(false);

  const { editorState } = useTextEditorStore();

  useEffect(() => {
    if (!window) return;
    if (
      editorState.getCurrentContent().getPlainText().trim() === "" &&
      audio &&
      audio.current
    ) {
      setConnected(false);
      audio.current.pause();
    }
  }, [editorState]);

  const audio = useRef<HTMLAudioElement | null>(null);

  const handleAudioEnd = () => {
    setConnected(false);
  };

  const handleClick = useCallback(async () => {
    if (!connected && props.text.trim() !== "") {
      if (!window) return;
      setConnected(true);
      const result = await fetchData({ text: props.text });
      if (!result || !result.path) {
        setConnected(false);
        return;
      }
      audio.current = new Audio();
      audio.current.src = `https://oyqiz.airi.uz/${result.path}`;
      audio.current.play();

      audio.current.addEventListener("ended", handleAudioEnd);
    } else {
      setConnected(false);
      audio.current?.pause();
    }
  }, [connected, props.text]);

  const fetchData = useCallback(async (body: { text: string }) => {
    try {
      const data = await fetch("/audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!data.ok) return;
      return await data.json();
    } catch (error) {
      console.log(error);
    }
  }, []);

  return { handleClick, connected };
};
