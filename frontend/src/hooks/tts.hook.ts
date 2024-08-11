"use client";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useTextEditorStore } from "../store/translate.store";
import { delay } from "../util/audio-worklet";
import {
  concatenateUint8Arrays,
  getWavDuration,
  sliceEachWavData,
} from "../common/Utils";
import { ICache, IIndexData } from "../constants";
import useAxios from "./axios.hook";

const baseUrl = "https://oyqiz.airi.uz/api/v1";
// const baseUrl = "http://localhost:5001/dev/api/v1";

export const useTTSHook = () => {
  const { editorState, connected, setConnected, setIndexes } =
    useTextEditorStore();

  const { fetchData } = useAxios();

  const cachedData = useRef<ICache>({});

  const audioEnded = useRef(true);

  const audio = useRef<HTMLAudioElement | null>(null);
  const audios = useRef<Uint8Array[]>([]);
  const audioData = useRef<Uint8Array[][]>([]);
  const indexes = useRef<IIndexData[]>([]);
  const started = useRef(false);
  const count = useRef(0);
  const error = useRef(false);

  const reader = useRef<
    ReadableStreamDefaultReader<Uint8Array> | undefined | null
  >(null);

  useEffect(() => {
    return reset;
  }, []);

  useEffect(() => {
    if (!window) return;
    if (
      editorState.getCurrentContent().getPlainText().trim() === "" &&
      audio &&
      audio.current
    )
      reset();
  }, [editorState]);

  useEffect(() => {
    if (!connected) reset();
  }, [connected]);

  const reset = useCallback(() => {
    error.current = false;
    count.current = 0;
    started.current = false;
    indexes.current = [];
    audioData.current = [];
    audios.current = [];
    reader.current?.cancel();
    reader.current = null;
    if (audio.current) {
      audio.current.removeEventListener("ended", handleAudioEnd);
      audio.current.removeEventListener("pause", handleAudioPaused);
      audio.current?.pause();
      audio.current = null;
    }
    setIndexes([]);
    handleResetDecoration();
  }, []);

  const setStarted = useCallback((value: boolean) => {
    started.current = value;
    if (!value) {
      setConnected(false);
      reader.current?.cancel();
      if (audio.current) {
        audio.current.pause();
      }
      reset();
    }
  }, []);

  const cacheData = useCallback((key: string, completeChunk: Uint8Array[]) => {
    if (!started.current || indexes.current.length === 0) return;

    key = key.trim();

    const chachedTexts = Object.keys(cachedData.current);
    const candidates = chachedTexts.filter((item) =>
      key.startsWith(item + " ")
    );
    let candidate = "";
    if (candidates.length) {
      const biggestTextLength = Math.max(...candidates.map((t) => t.length));
      candidate = candidates.find((t) => t.length === biggestTextLength)!;
    }
    const shortVersionOfThisText = cachedData.current[candidate];
    const index = audioData.current.length;
    let chunks = [completeChunk];
    let pos = indexes.current[index].pos;
    let indexesTemp = indexes.current;

    const prevChunkValue = cachedData.current[key];

    if (prevChunkValue) {
      if (prevChunkValue.pos > pos) return;
      chunks = [...prevChunkValue.chunks, completeChunk];
    } else if (shortVersionOfThisText) {
      chunks = [...shortVersionOfThisText.chunks, completeChunk];
    }

    cachedData.current[key] = {
      indexes: indexesTemp,
      pos,
      chunks,
    };
    audioData.current.push(completeChunk);
  }, []);

  const getFromCacheIfExists = useCallback((key: string) => {
    key = key.trim();

    let cachedAudio = cachedData.current[key];
    let concatenationIndexes = true;
    if (!cachedAudio) {
      const chachedTexts = Object.keys(cachedData.current);
      const candidates = chachedTexts.filter((item) =>
        key.startsWith(item + " ")
      );
      if (!candidates.length) return;
      const biggestTextLength = Math.max(...candidates.map((t) => t.length));
      const candidate = candidates.find((t) => t.length === biggestTextLength);

      cachedAudio = cachedData.current[candidate!];
      concatenationIndexes = true;
    }

    const text = Array.from(key).slice(cachedAudio.pos).join("");
    for (const chunk of cachedAudio.chunks) {
      audioData.current.push(chunk);
    }

    setIndexes(cachedAudio.indexes);
    indexes.current = cachedAudio.indexes;

    handleAudio(audioData.current[0]);

    return { text, cachedAudio, concatenationIndexes };
  }, []);

  const calculationAnimationTime = useCallback(
    (indexData: IIndexData, duration: number) => {
      const charRatio = 100;
      const spaceRatio = 1;
      const amountOfChars = indexData.lengths.reduce(
        (sum, element) => (sum += element),
        0
      );
      const amountOfSpaces = indexData.lengths.length - 1;

      const unitWaitTime =
        duration / (charRatio * amountOfChars + spaceRatio * amountOfSpaces);

      return { unitWaitTime, charRatio };
    },
    []
  );

  const handleDecorateText = useCallback(
    async (indexes: IIndexData[], count: number, duration: number) => {
      const activeChunkIndexData = indexes[count];

      const { unitWaitTime, charRatio } = calculationAnimationTime(
        indexes[count],
        duration
      );

      const prevChunksLength = indexes
        .filter((_, i) => i < count)
        .reduce((sum, value) => sum + value.lengths.length, 0);

      for (
        let index = 0;
        index < activeChunkIndexData.lengths.length;
        index++
      ) {
        const spans: any[] = Array.from(
          document.querySelectorAll(`span.char_${index + prevChunksLength}`)
        );
        const contentLength = spans.reduce(
          (sum, value) => (sum += value.textContent?.length || 0),
          0
        );
        const spaces: any[] = Array.from(
          document.querySelectorAll(`span.space_${index + prevChunksLength}`)
        );
        const contentLengthOfSpaces = spans.reduce(
          (sum, value) => (sum += value.textContent?.length || 0),
          0
        );

        const charAnimationTime =
          unitWaitTime * activeChunkIndexData.lengths[index] * charRatio;

        for (const span of spans) {
          const waitingTime =
            ((span.textContent?.length || 0) / (contentLength || 1)) *
            charAnimationTime;

          span.classList.add("background");
          span.style.animation = `backgroundMove ${waitingTime}s linear`;
          await delay(1000 * waitingTime);
        }

        if (index !== activeChunkIndexData.lengths.length - 1) {
          for (const space of spaces) {
            const waitingTime =
              (unitWaitTime * (space.textContent?.length || 0)) /
              (contentLengthOfSpaces || 1);

            space.classList.add("background");
            space.style.animation = `backgroundMove ${waitingTime}s linear`;
            await delay(1000 * waitingTime);
          }
        }
      }
    },
    [editorState]
  );

  const handleResetDecoration = useCallback(() => {
    const spanNodes = Array.from(document.querySelectorAll(".index__shower"));
    for (const node of spanNodes) {
      node.classList.remove("background");
    }
  }, []);

  const pauseIfPlaying = useCallback(
    async (condition: boolean): Promise<boolean> => {
      if (!started.current || error.current) return false;
      if (condition) {
        await delay(100);
        return pauseIfPlaying(!Boolean(audios.current[count.current]));
      }
      return false;
    },
    []
  );

  const handleAudioEnd = useCallback(async () => {
    audioEnded.current = true;
    if (!started.current) return false;
    if (count.current < audioData.current.length) {
      await pauseIfPlaying(!Boolean(audioData.current[count.current]));
      setTimeout(() => {
        audioEnded.current = false;
      }, 200);
      handleAudio(audioData.current[count.current]);
    } else setStarted(false);
  }, []);

  const handleAudioPaused = useCallback(async () => {
    setTimeout(() => {
      if (!audioEnded.current) {
        setConnected(false);
        reset();
      }
    }, 200);
  }, []);

  const handleAudio = useCallback(async (chunks: Uint8Array[]) => {
    if (!started.current) return;

    const blob = new Blob(chunks, { type: "audio/wav" });
    const data = URL.createObjectURL(blob);
    const duration = (await getWavDuration(blob)) - 0.75;
    audio.current = new Audio(data);

    if (!indexes.current.length) {
      setConnected(false);
      return;
    }

    await audio.current.play();
    await delay(200);
    setConnected(true);

    handleDecorateText(indexes.current, count.current, duration);
    count.current++;

    audio.current.addEventListener("ended", handleAudioEnd);
    audio.current.addEventListener("pause", handleAudioPaused);
  }, []);

  const playFirstChunk = useCallback(async (text: string) => {
    const firstChunk = await getFirstChunk(text);

    const completeChunk = [new Uint8Array(firstChunk.audioBuffer.data)];

    indexes.current = [firstChunk.data];
    setIndexes(indexes.current);

    handleAudio(completeChunk);
    cacheData(text, completeChunk);

    setConnected(true);

    return firstChunk.requestId;
  }, []);

  const getFirstChunk = useCallback(async (text: string) => {
    const url = baseUrl + "/tts-short";

    const data = await fetchData(url, "POST", { text, indexes: true });

    if (!data) throw new Error();

    return data;
  }, []);

  const playRestOfChunks = useCallback(
    async (
      text: string,
      requestId: string | null,
      textForRequest: string | null
    ) => {
      let index = 0;

      let array: Uint8Array = new Uint8Array();

      console.log("open");

      const body = {
        requestId,
        indexes: true,
        text: textForRequest || undefined,
      };

      for await (let chunk of streamingFetch(body)) {
        if (!started) return;
        audios.current.push(chunk);
        array = concatenateUint8Arrays(audios.current);
        const result: any = sliceEachWavData(array, index, false);
        index = result.idx;
        if (result.indexes) {
          setIndexes(result.indexes);
          const lastPos = indexes.current[audioData.current.length - 1].pos;
          indexes.current = indexes.current
            .slice(0, audioData.current.length)
            .concat(
              result.indexes.map((item: IIndexData) => ({
                ...item,
                pos: lastPos + item.pos,
              }))
            );
        }
        if (result.wavData) cacheData(text, [result.wavData]);
      }

      const lastChunk = new Uint8Array(array.buffer.slice(index));
      if (lastChunk) cacheData(text, [lastChunk]);
      if (!count.current) await handleAudio(audioData.current[0]);
    },
    []
  );

  async function* streamingFetch(body: {
    text?: string;
    indexes: boolean;
    requestId: string | null;
  }) {
    const completeUrl =
      baseUrl + (body.requestId ? "/tts-continue" : "/tts-stream");
    if (body.requestId) delete body.text;
    const response = await fetch(completeUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    reader.current = response.body?.getReader();

    while (true && reader.current) {
      const { done, value } = await reader.current.read();
      if (done) break;

      yield value;
    }
  }

  const handleClick = useCallback(
    async (setDisabled: Dispatch<SetStateAction<boolean>>) => {
      if (!window) return;

      const text = editorState.getCurrentContent().getPlainText();

      if (text.length > 100 && !text.includes(" ")) return;

      if (!Boolean(text.trim())) return;
      setDisabled(true);

      if (!started.current) {
        try {
          setStarted(true);

          const cache = getFromCacheIfExists(text);
          let textForRequest = text;
          let requestId = null;

          if (cache) {
            if (!Boolean(cache.text.trim())) return;
            textForRequest = cache.text;
          } else {
            requestId = await playFirstChunk(text);

            if (!requestId) return;

            textForRequest = "";
          }

          if (!requestId && !Boolean(textForRequest.trim())) return;

          await playRestOfChunks(text, requestId, textForRequest);
        } catch (e) {
          setConnected(false);
          error.current = true;

          console.log("errro", e);
          setDisabled(false);
          setStarted(false);
        }
      } else {
        setStarted(false);
        handleResetDecoration();
        console.log("close");
      }
    },
    [connected, editorState.getCurrentContent().getPlainText()]
  );

  return { handleClick, connected };
};
