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
import { IIndexData } from "../constants";

export const useTTSHook = () => {
  const { editorState, connected, setConnected, setIndexes } =
    useTextEditorStore();

  const audio = useRef<HTMLAudioElement | null>(null);

  const reader = useRef<
    ReadableStreamDefaultReader<Uint8Array> | undefined | null
  >(null);

  useEffect(() => {
    audio.current?.addEventListener("play", () => {
      console.log(3);
    });
  }, []);

  useEffect(() => {
    return () => {
      setConnected(false);
      audio.current?.pause();
      handleResetDecoration();
    };
  }, []);

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

  useEffect(() => {
    if (!connected) {
      audio.current?.pause();
      audio.current = null;
      handleResetDecoration();
    }
  }, [connected]);

  const calculationSpeed = useCallback(
    (text: string, indexData: IIndexData, duration: number) => {
      const animationChars: number[] = [];
      const amountOfChars = indexData.lengths.reduce(
        (sum, element) => (sum += element),
        0
      );
      const amountOfSpaces = indexData.lengths.length - 1;

      const charRatio = 2;
      const spaceRatio = 1;

      let words = text.split(" ").filter((word) => Boolean(word.trim()));
      if (words.length !== indexData.lengths.length) {
        for (let index = 0; index < words.length; index++) {
          // console.log(words[index].match(/\d+/g), index);
          if (words[index].match(/^\d+$/g)) {
            let helper = words[index];
            let i = index + 1;

            while (i < words.length) {
              if (words[i].match(/^\d+$/g)) {
                console.log(words[i], i);
                words[index] += words[i];
                helper += " " + words[i];
                words = [...words.slice(0, i), ...words.slice(i + 1)];
                i = i - 1;
              } else {
                words[index] = helper;
                break;
              }
              i++;
            }
          }
        }
      }

      const unitWaitTime =
        duration / (charRatio * amountOfChars + spaceRatio * amountOfSpaces);

      for (let index = 0; index < words.length; index++) {
        for (const char of words[index]) {
          animationChars.push(
            (unitWaitTime * indexData.lengths[index] * charRatio) /
              words[index].length
          );
        }
        if (index !== words.length - 1)
          animationChars.push(spaceRatio * unitWaitTime);
      }

      return animationChars;
    },
    []
  );

  const handleDecorateText = useCallback(
    async (indexes: IIndexData[], count: number, duration: number) => {
      const spanNodes = Array.from(document.querySelectorAll(".index__shower"));
      const start = !count ? 0 : indexes[count - 1].pos;
      const end =
        count !== indexes.length ? indexes[count].pos : spanNodes.length;

      const text = editorState.getCurrentContent().getPlainText();

      let waitingTime =
        duration /
        (count
          ? count === indexes.length
            ? spanNodes.length - indexes[count - 1].pos
            : indexes[count].pos - indexes[count - 1].pos
          : indexes[count].pos);

      const animationChars = calculationSpeed(
        text.slice(start, end),
        indexes[count],
        duration
      );

      for (let i = start; i < end; i++) {
        const span = spanNodes[i];

        waitingTime = animationChars[i - start];

        if (!span) {
          handleResetDecoration();
          return;
        }
        span.classList.add("background");
        (
          span as any
        ).style.animation = `backgroundMove ${waitingTime}s linear `;
        await delay(waitingTime * 1000);
      }
    },
    [editorState]
  );

  const handleResetDecoration = useCallback(() => {
    const spanNodes = Array.from(document.querySelectorAll(".index__shower"));
    for (const node of spanNodes) {
      node.classList.remove("background");
    }
    setIndexes([]);
  }, []);

  // const memoizationOfTags = useCallback(
  //   (html: string) =>
  //     html.replace(TAG_REGEX, (match, i) => {
  //       return Array.from({ length: match.length })
  //         .map((_) => "_")
  //         .join("");
  //     }),
  //   []
  // );

  // const handleDecorateText = useCallback(
  //   (state: EditorState, start: number = 0, end: number = 0) => {
  //     if (start === 0 && end === 0) {
  //       return setEditorState(state);
  //     }
  //     const backgroundColor = theme === THEME.DARK ? "#000" : "#ccc";
  //     const html = converToHtmlWithStyles(state.getCurrentContent());
  //     const openTag = `<span style="background:${backgroundColor};">`;
  //     const closeTag = `</span>`;
  //     const openParagraph = "<p>";
  //     const closeParagraph = "</p>";
  //     let currentChunk = html.slice(start, end);
  //     let activeChunk = openTag + currentChunk + closeTag;

  //     if (currentChunk.startsWith(closeParagraph + openParagraph)) {
  //       activeChunk =
  //         closeParagraph +
  //         openParagraph +
  //         openTag +
  //         html.slice(
  //           start + closeParagraph.length + openParagraph.length,
  //           end
  //         ) +
  //         closeTag;
  //     }

  //     activeChunk =
  //       se(openParagraph).start +
  //       openTag +
  //       html.slice(
  //         start + se(openParagraph).start.length,
  //         end - se(closeParagraph).end.length
  //       ) +
  //       closeTag +
  //       se(closeParagraph).end;

  //     function se(tag: string) {
  //       return {
  //         start: currentChunk.startsWith(tag) ? tag : "",
  //         end: currentChunk.endsWith(tag) ? tag : "",
  //       };
  //     }

  //     const htmlString = html.slice(0, start) + activeChunk + html.slice(end);

  //     const contentBlock = htmlToDraft(htmlString);
  //     const contentState = ContentState.createFromBlockArray(
  //       contentBlock.contentBlocks
  //     );

  //     setEditorState(EditorState.createWithContent(contentState));
  //   },
  //   [theme]
  // );

  // const splitByLastSpace = useCallback(
  //   (text: string, maxSymbols: number, prevIndex: number) => {
  //     const chunks = [];
  //     let start = 0;
  //     let end = 0;
  //     let index = 0;
  //     let count = 0;
  //     let lastSpaceIndex = 0;

  //     while (index < text.length) {
  //       const lastPart = text.substring(start);

  //       if (lastPart.replaceAll("_", "").length <= maxSymbols) {
  //         chunks.push({
  //           substring: text.substring(start),
  //           start: start + prevIndex,
  //           end: text.length + prevIndex,
  //         });
  //         index = text.length;
  //       }

  //       if (text[index] === " ") lastSpaceIndex = index;

  //       if (count === maxSymbols) {
  //         if (lastSpaceIndex !== 0) end = lastSpaceIndex;
  //         else end = index;

  //         const substring = text.substring(start, end);

  //         chunks.push({
  //           substring,
  //           start: start + prevIndex,
  //           end: end + prevIndex,
  //         });

  //         start = end + 1;

  //         count = 0;
  //       }

  //       if (text[index] !== "_") count++;

  //       index++;
  //     }

  //     return chunks;
  //   },
  //   []
  // );

  // const splitByCommas = useCallback(
  //   (text: string, maxSymbols: number, prevIndex: number) => {
  //     let chunks = [];
  //     let subRegex = /[,](?=\s)/g;
  //     let match;
  //     let lastIndex = 0;

  //     while ((match = subRegex.exec(text)) !== null) {
  //       let endIndex = match.index + 1;
  //       let substring = text.substring(lastIndex, endIndex);

  //       if (substring.trim().length) {
  //         const count = (substring.match(/_/g) || []).length;

  //         if (substring.length - count > maxSymbols) {
  //           let subChunks = splitByLastSpace(
  //             substring,
  //             maxSymbols,
  //             prevIndex + lastIndex
  //           );
  //           subChunks.forEach((subChunk) => chunks.push(subChunk));
  //         } else {
  //           chunks.push({
  //             substring: substring,
  //             start: lastIndex + prevIndex,
  //             end: endIndex + prevIndex,
  //           });
  //         }
  //       }

  //       lastIndex = endIndex + 1;
  //     }

  //     if (lastIndex < text.length) {
  //       let substring = text.substring(lastIndex);

  //       if (substring.trim().length) {
  //         if (substring.length > maxSymbols) {
  //           let subChunks = splitByLastSpace(
  //             substring,
  //             maxSymbols,
  //             prevIndex + lastIndex
  //           );
  //           subChunks.forEach((subChunk) => chunks.push(subChunk));
  //         } else {
  //           chunks.push({
  //             substring,
  //             start: lastIndex + prevIndex,
  //             end: text.length + prevIndex,
  //           });
  //         }
  //       }
  //     }

  //     return chunks;
  //   },
  //   []
  // );

  // const splitHtml = useCallback((htmlString: string) => {
  //   const chunks: ReturnType<typeof generateChunks> = [];
  //   let start = 0;
  //   const paragraphRegex = /(<p>.*?<\/p>)/gs;
  //   const listItemRegex = /(<li>.*?<\/li>)/gs;
  //   const paragraphs = htmlString.split(paragraphRegex).filter(Boolean);
  //   paragraphs.forEach((item) => {
  //     const listItems = item.split(listItemRegex).filter(Boolean);
  //     if (listItems.length) {
  //       listItems.forEach((listItem) => {
  //         const htmlPlaceholders = memoizationOfTags(listItem);
  //         chunks.push(...generateChunks(htmlPlaceholders, start));
  //         start += listItem.length;
  //       });
  //     } else {
  //       const htmlPlaceholders = memoizationOfTags(item);
  //       chunks.push(...generateChunks(htmlPlaceholders, start));
  //       start += item.length;
  //     }
  //   });
  //   return chunks;
  // }, []);

  // const generateChunks = useCallback((text: string, startIndex: number) => {
  //   let chunks = [];
  //   let regex = /[.!?](?=\s)/g;
  //   // let regex = /[.!?]/g;

  //   let match;
  //   let lastIndex = 0;

  //   function checkChunkForEmtiness(word: string) {
  //     return word.replaceAll("_", "").trim() !== "";
  //   }

  //   while ((match = regex.exec(text)) !== null) {
  //     let endIndex = match.index + 1;
  //     let substring = text.substring(lastIndex, endIndex);
  //     if (substring.trim().length && checkChunkForEmtiness(substring)) {
  //       if (substring.length > MAX_SYMBOLS_TTS) {
  //         let subStrings = splitByCommas(
  //           substring,
  //           MAX_SYMBOLS_TTS,
  //           lastIndex + startIndex
  //         ).filter((ch) => checkChunkForEmtiness(ch.substring));
  //         subStrings.forEach((subStr) => chunks.push(subStr));
  //       } else {
  //         chunks.push({
  //           substring,
  //           start: lastIndex + startIndex,
  //           end: endIndex + startIndex,
  //         });
  //       }
  //     }
  //     lastIndex = endIndex;
  //   }

  //   if (lastIndex < text.length) {
  //     const substring = text.substring(lastIndex);
  //     if (substring.trim().length && checkChunkForEmtiness(substring)) {
  //       if (substring.length > MAX_SYMBOLS_TTS) {
  //         let subStrings = splitByCommas(
  //           substring,
  //           MAX_SYMBOLS_TTS,
  //           lastIndex + startIndex
  //         ).filter((ch) => checkChunkForEmtiness(ch.substring));
  //         subStrings.forEach((subStr) => chunks.push(subStr));
  //       } else {
  //         chunks.push({
  //           substring,
  //           start: lastIndex + startIndex,
  //           end: text.length + startIndex,
  //         });
  //       }
  //     }
  //   }

  //   return chunks;
  // }, []);

  const handleClick = useCallback(
    async (setDisabled: Dispatch<SetStateAction<boolean>>) => {
      if (!window) return;

      let audios: Uint8Array[] = [];
      const audioData: Uint8Array[][] = [];
      let indexes: IIndexData[] = [];
      let started = false;

      function setStarted(value: boolean) {
        started = value;
        !value && setConnected(value);
        if (!value) reader.current?.cancel();
        if (audio.current) audio.current.pause();
      }

      const text = editorState.getCurrentContent().getPlainText();

      if (!Boolean(text.trim())) return;
      setDisabled(true);

      if (!connected) {
        try {
          let count = 0;
          let error = false;

          const handleAudioEnd = async () => {
            if (!started) return false;
            if (count < audioData.length) {
              await pauseIfPlaying(!Boolean(audioData[count]));
              handleAudio(audioData[count]);
            } else {
              setStarted(false);
            }
          };

          const pauseIfPlaying = async (
            condition: boolean
          ): Promise<boolean> => {
            if (!started || error) return false;
            if (condition) {
              await delay(100);
              return pauseIfPlaying(!Boolean(audios[count]));
            }
            return false;
          };

          const handleAudio = async (chunks: Uint8Array[]) => {
            if (!started) return;
            const blob = new Blob(chunks, { type: "audio/wav" });
            const duration = await getBlobDuration(blob);
            const data = URL.createObjectURL(blob);
            audio.current = new Audio(data);

            await audio.current.play();
            setConnected(true);

            handleDecorateText(indexes, count, duration);
            count++;
            audio.current.addEventListener("ended", handleAudioEnd);
          };

          setStarted(true);

          let index = 0;

          let array: Uint8Array = new Uint8Array();

          for await (let chunk of streamingFetch({ text, indexes: true })) {
            if (!started) return;

            audios.push(chunk);
            array = concatenateUint8Arrays(audios);
            const result = sliceEachWavData(array, index, false);
            index = result.idx;
            if (result.indexes) {
              setIndexes(result.indexes);
              indexes = result.indexes;
            }
            if (result.wavData) {
              if (!audioData.length) {
                await handleAudio([result.wavData]);
              }
              audioData.push([result.wavData]);
            }
          }

          const lastChunk = new Uint8Array(array.buffer.slice(index));
          lastChunk && audioData.push([lastChunk]);
          if (!count) await handleAudio(audioData[0]);
        } catch (e) {
          console.log(e);
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
    // const url = "http://localhost:5001/stream/api/tts";
    const url = "https://oyqiz.airi.uz/stream/api/tts";
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
