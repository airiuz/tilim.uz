"use client";
import { useCallback, useEffect, useRef } from "react";
import { useTextEditorStore } from "../store/translate.store";
import { delay } from "../util/audio-worklet";
import getBlobDuration from "get-blob-duration";
import { concatenateUint8Arrays, sliceEachWavData } from "../common/Utils";

export const useTTSHook = () => {
  const { editorState, connected, setConnected, setIndexes } =
    useTextEditorStore();

  const audio = useRef<HTMLAudioElement | null>(null);

  const reader = useRef<
    ReadableStreamDefaultReader<Uint8Array> | undefined | null
  >(null);

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

  const calculationSpeed = useCallback((text: string, duration: number) => {
    // space, ",',`, ...-> x
    // .,?!;: -> 1.5x
    // a-zA-Z -> 2x
    // - -> 3x
    // digits -> 4x
    const speedOfEachChar = [];

    const punctuationRegex = /[.,?!;:]/g;
    const hyphenRegex = /-/g;
    const letterRegex = /[a-zA-Z]/g;
    const digitRegex = /\d/g;

    const otherSpeed = 1;
    const punctuationSpeed = 1.5;
    const letterSpeed = 2;
    const hypenSpeed = 3;
    const digitSpeed = 4;

    const punctuationCount = (text.match(punctuationRegex) || []).length;
    const hyphenCount = (text.match(hyphenRegex) || []).length;
    const letterCount = (text.match(letterRegex) || []).length;
    const digitCount = (text.match(digitRegex) || []).length;
    const otherCount =
      text.length - punctuationCount - hyphenCount - letterCount - digitCount;

    const unitSpeed =
      duration /
      (otherSpeed + punctuationSpeed + letterSpeed + hypenSpeed + digitSpeed);

    for (let char of text) {
      if (punctuationRegex.test(char)) {
        speedOfEachChar.push((punctuationSpeed * unitSpeed) / punctuationCount);
      } else if (letterRegex.test(char)) {
        speedOfEachChar.push((letterSpeed * unitSpeed) / letterCount);
      } else if (hyphenRegex.test(char)) {
        speedOfEachChar.push((hypenSpeed * unitSpeed) / hyphenCount);
      } else if (digitRegex.test(char)) {
        speedOfEachChar.push((digitSpeed * unitSpeed) / digitCount);
      } else {
        speedOfEachChar.push((otherSpeed * unitSpeed) / otherCount);
      }
    }

    const sum = speedOfEachChar.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);

    console.log(text);

    console.log(sum, duration);

    return speedOfEachChar;
  }, []);

  const handleDecorateText = useCallback(
    async (indexes: number[], count: number, duration: number) => {
      const spanNodes = Array.from(document.querySelectorAll(".index__shower"));
      const start = !count ? 0 : indexes[count - 1];
      const end = count !== indexes.length ? indexes[count] : spanNodes.length;

      const text = editorState.getCurrentContent().getPlainText();

      const waitingTime =
        duration /
        (count
          ? count === indexes.length
            ? spanNodes.length - indexes[count - 1]
            : indexes[count] - indexes[count - 1]
          : indexes[count]);

      // const speed = calculationSpeed(text.slice(start, end), duration);

      for (let i = start; i < end; i++) {
        const span = spanNodes[i];
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

  const handleClick = useCallback(async () => {
    if (!window) return;

    let audios: Uint8Array[] = [];
    const audioData: Uint8Array[][] = [];
    let indexes: number[] = [];
    let started = false;

    function setStarted(value: boolean) {
      started = value;
      setConnected(value);
      if (!value) reader.current?.cancel();
    }

    const text = editorState.getCurrentContent().getPlainText();

    if (!Boolean(text.trim())) return;

    if (!connected) {
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

      const pauseIfPlaying = async (condition: boolean): Promise<boolean> => {
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
            handleAudio([result.wavData]);
          }
          audioData.push([result.wavData]);
        }
      }

      const lastChunk = new Uint8Array(array.buffer.slice(index));
      lastChunk && audioData.push([lastChunk]);
      if (!count) handleAudio(audioData[0]);
    } else {
      setStarted(false);
      handleResetDecoration();
    }
  }, [connected, editorState]);

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
