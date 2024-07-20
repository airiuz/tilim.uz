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
import getBlobDuration from "get-blob-duration";
import { concatenateUint8Arrays, sliceEachWavData } from "../common/Utils";
import { ICache, IIndexData } from "../constants";

export const useTTSHook = () => {
  const { editorState, connected, setConnected, setIndexes } =
    useTextEditorStore();

  const cachedData = useRef<ICache>({});

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
    audio.current?.pause();
    audio.current = null;
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

    const index = audioData.current.length;
    let chunks = [completeChunk];
    const prevChunkValue = cachedData.current[key];
    const pos = indexes.current[index].pos;
    if (prevChunkValue) {
      if (prevChunkValue.pos > pos) return;
      chunks = [...prevChunkValue.chunks, completeChunk];
    }

    console.log(pos);
    cachedData.current[key] = {
      indexes: indexes.current,
      pos,
      chunks,
    };
    audioData.current.push(completeChunk);
  }, []);

  const getFromCacheIfExists = useCallback((key: string) => {
    const cachedAudio = cachedData.current[key];
    if (!cachedAudio) return;

    console.log(cachedAudio.pos, "get");

    const text = key.slice(cachedAudio.pos);

    for (const chunk of cachedAudio.chunks) {
      audioData.current.push(chunk);
    }

    handleAudio(audioData.current[0]);

    return { text, cachedAudio };
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
    if (!started.current) return false;
    if (count.current < audioData.current.length) {
      await pauseIfPlaying(!Boolean(audioData.current[count.current]));
      handleAudio(audioData.current[count.current]);
    } else setStarted(false);
  }, []);

  const handleAudio = useCallback(async (chunks: Uint8Array[]) => {
    if (!started.current) return;
    const blob = new Blob(chunks, { type: "audio/wav" });
    const data = URL.createObjectURL(blob);
    const duration = await getBlobDuration(blob);
    audio.current = new Audio(data);

    await audio.current.play();
    setConnected(true);

    handleDecorateText(indexes.current, count.current, duration);
    count.current++;
    audio.current.addEventListener("ended", handleAudioEnd);
  }, []);

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

          console.log(text);

          const cache = getFromCacheIfExists(text);
          let textForRequest = text;

          if (cache) {
            if (
              cache.cachedAudio.chunks.length ===
              cache.cachedAudio.indexes.length
            )
              return;
            textForRequest = cache.text;
            setIndexes(cache.cachedAudio.indexes);
            indexes.current = cache.cachedAudio.indexes;
          }

          let index = 0;

          let array: Uint8Array = new Uint8Array();

          console.log("open");

          for await (let chunk of streamingFetch({
            text: textForRequest,
            indexes: indexes.current.length === 0,
          })) {
            if (!started) return;
            audios.current.push(chunk);
            array = concatenateUint8Arrays(audios.current);
            const result: any = sliceEachWavData(array, index, false);
            index = result.idx;
            if (result.indexes && indexes.current.length === 0) {
              setIndexes(result.indexes);
              indexes.current = result.indexes;
            }
            if (result.wavData) {
              const completeChunk = [result.wavData];
              if (!audioData.current.length) {
                await handleAudio(completeChunk);
              }
              console.log(4);
              cacheData(text, completeChunk);
            }
          }

          const lastChunk = new Uint8Array(array.buffer.slice(index));
          if (lastChunk) cacheData(text, [lastChunk]);
          if (!count.current) await handleAudio(audioData.current[0]);
        } catch (e) {
          console.log(e);
          error.current = true;
          setDisabled(false);
          setStarted(false);
        }
      } else {
        setStarted(false);
        handleResetDecoration();
        console.log("close");
      }
    },
    [connected, editorState]
  );

  async function* streamingFetch(body: { text: string; indexes: boolean }) {
    const url = "http://localhost:5001/stream/api/tts";
    // const url = "https://oyqiz.airi.uz/stream/api/tts";
    const response = await fetch(url, {
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

  return { handleClick, connected };
};

// const handlePLay = (
//   text: string,
//   callback: (indexes: number[][], count: number, duration: number) => void
// ) => {
//   let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;

//   let audios: Uint8Array[] = [];
//   const audioData: Uint8Array[][] = [];
//   let indexes: number[][] = [];
//   let started = false;
//   let audio = new Audio();
//   let count = 0;

//   // generator function for receiving http stream response
//   async function* streamingFetch(body: { text: string; indexes: boolean }) {
//     const url = "https://oyqiz.airi.uz/stream/api/tts";
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(body),
//     });
//     reader = response.body?.getReader();

//     while (true && reader) {
//       const { done, value } = await reader.read();
//       if (done) break;

//       yield value;
//     }
//   }

//   // function for decoding Uint8Array to json
//   function decodeFromUint8ArrayToJson(data: Uint8Array) {
//     const decoder = new TextDecoder();
//     const jsonString = decoder.decode(data, { stream: true });
//     return JSON.parse(jsonString);
//   }

//   // function for extract each wav data from Uint8Array
//   function sliceEachWavData(
//     array: Uint8Array,
//     index: number,
//     iterated: boolean
//   ) {
//     const riffMarker = "RIFF";
//     let idx = index;
//     let wavData: null | Uint8Array = null;
//     let indexes: null | number[][] = null;

//     for (let i = index; i <= array.length - 4; i++) {
//       if (
//         String.fromCharCode(
//           array[i],
//           array[i + 1],
//           array[i + 2],
//           array[i + 3]
//         ) === riffMarker &&
//         iterated
//       ) {
//         const data = new Uint8Array(array.buffer.slice(index, i));
//         if (
//           data.length >= 4 &&
//           data[0] === 0x52 && // 'R'
//           data[1] === 0x49 && // 'I'
//           data[2] === 0x46 && // 'F'
//           data[3] === 0x46
//         ) {
//           wavData = data;
//         } else indexes = decodeFromUint8ArrayToJson(data);
//         idx = i;
//       }
//       iterated = true;
//     }
//     return { wavData, idx, indexes };
//   }

//   // function for waiting if next audio chunk doesn't exist
//   const pauseIfPlaying = async (condition: boolean): Promise<boolean> => {
//     if (condition) {
//       await delay(100); // function that waits 100 ms
//       return pauseIfPlaying(!Boolean(audios[count]));
//     }
//     return false;
//   };

//   // this function calls when audio ends
//   const handleAudioEnd = async () => {
//     if (count < audioData.length) {
//       await pauseIfPlaying(!Boolean(audioData[count]));
//       handleAudio(audioData[count]);
//     } else {
//       // When audio stops
//     }
//   };

//   // play active audio chunk
//   const handleAudio = async (chunks: Uint8Array[]) => {
//     const blob = new Blob(chunks, { type: "audio/wav" });
//     const duration = await getBlobDuration(blob); //import getBlobDuration from "get-blob-duration";
//     const data = URL.createObjectURL(blob);
//     console.log(blob);
//     audio = new Audio(data);

//     await audio.play();
//     callback(indexes, count, duration);

//     count++;
//     audio.addEventListener("ended", handleAudioEnd);
//   };

//   // start playing audio
//   async function play() {
//     let index = 0;

//     let array: Uint8Array = new Uint8Array();

//     for await (let chunk of streamingFetch({ text, indexes: true })) {
//       audios.push(chunk);
//       array = concatenateUint8Arrays(audios);
//       const result = sliceEachWavData(array, index, false);
//       index = result.idx;
//       if (result.indexes) {
//         indexes = result.indexes;
//       }
//       if (result.wavData) {
//         if (!audioData.length) {
//           await handleAudio([result.wavData]);
//         }
//         audioData.push([result.wavData]);
//       }

//       console.log(chunk);
//     }

//     const lastChunk = new Uint8Array(array.buffer.slice(index));
//     lastChunk && audioData.push([lastChunk]);
//     if (!count) await handleAudio(audioData[0]);
//   }

//   // stop playing audio
//   async function stop() {
//     audio.pause();
//   }

//   return { play, stop };
// };
