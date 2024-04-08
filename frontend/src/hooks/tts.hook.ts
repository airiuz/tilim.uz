"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTextEditorStore } from "../store/translate.store";
import axios from "axios";

interface ITextToSpeech {
  text: string;
}

export const useTTSHook = (props: ITextToSpeech) => {
  const [connected, setConnected] = useState(false);

  const { editorState } = useTextEditorStore();

  useEffect(() => {
    if (!window) return;
    if (editorState.getCurrentContent().getPlainText().trim() === "") {
      setConnected(false);
      audio.current.pause();
    }
  }, [editorState]);

  const audio = useRef(new Audio());

  const handleAudioEnd = () => {
    setConnected(false);
  };

  const handleClick = useCallback(() => {
    if (!connected && props.text.trim() !== "") {
      setConnected(true);
      audio.current.src =
        "https://file-examples.com/storage/fe0e2ce82f660c1579f31b4/2017/11/file_example_WAV_1MG.wav";
      audio.current.play();

      audio.current.addEventListener("ended", handleAudioEnd);
    } else {
      setConnected(false);
      audio.current.pause();
    }
  }, [connected, props.text]);

  const fetchData = useCallback(async (body: { text: string }) => {
    try {
      const data = await axios.post("https://oyqiz.airi.uz/wavdata", body);
      return data.data.text;
    } catch (error) {
      console.log(error);
    }
  }, []);

  return { handleClick, connected };
};
