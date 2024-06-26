"use client";
import { useCallback, useEffect, useRef } from "react";
import { useTextEditorStore } from "../store/translate.store";
import { delay } from "../util/audio-worklet";
import { TAG_REGEX, THEME } from "../constants";
import { ContentState, EditorState } from "draft-js";
import { useThemeStore } from "../store/theme.store";
import { converToHtmlWithStyles } from "../common/Utils";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
let htmlToDraft: any = null;
if (typeof window === "object") {
  htmlToDraft = require("html-to-draftjs").default;
}

export const useTTSHook = () => {
  const { theme } = useThemeStore();

  const { editorState, setEditorState, connected, setConnected } =
    useTextEditorStore();

  const editorStateRef = useRef<EditorState | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      setConnected(false);
      audio.current?.pause();
      editorStateRef.current && handleDecorateText(editorStateRef.current);
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
      editorStateRef.current && handleDecorateText(editorStateRef.current);
    }
  }, [connected]);

  const memoizationOfTags = useCallback(
    (html: string) =>
      html.replace(TAG_REGEX, (match, i) => {
        return Array.from({ length: match.length })
          .map((_) => "_")
          .join("");
      }),
    []
  );

  const handleDecorateText = useCallback(
    (state: EditorState, start: number = 0, end: number = 0) => {
      if (start === 0 && end === 0) {
        return setEditorState(state);
      }
      const backgroundColor = theme === THEME.DARK ? "#000" : "#ccc";
      const html = converToHtmlWithStyles(state.getCurrentContent());
      const openTag = `<span style="background:${backgroundColor};">`;
      const closeTag = `</span>`;
      const openParagraph = "<p>";
      const closeParagraph = "</p>";
      let currentChunk = html.slice(start, end);
      let activeChunk = openTag + currentChunk + closeTag;

      if (currentChunk.startsWith(closeParagraph + openParagraph)) {
        activeChunk =
          closeParagraph +
          openParagraph +
          openTag +
          html.slice(
            start + closeParagraph.length + openParagraph.length,
            end
          ) +
          closeTag;
      }

      activeChunk =
        se(openParagraph).start +
        openTag +
        html.slice(
          start + se(openParagraph).start.length,
          end - se(closeParagraph).end.length
        ) +
        closeTag +
        se(closeParagraph).end;

      function se(tag: string) {
        return {
          start: currentChunk.startsWith(tag) ? tag : "",
          end: currentChunk.endsWith(tag) ? tag : "",
        };
      }

      const htmlString = html.slice(0, start) + activeChunk + html.slice(end);

      const contentBlock = htmlToDraft(htmlString);
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );

      setEditorState(EditorState.createWithContent(contentState));
    },
    [theme]
  );

  const splitByLastSpace = useCallback(
    (text: string, maxSymbols: number, prevIndex: number) => {
      const chunks = [];
      let start = 0;
      let end = 0;
      let index = 0;
      let count = 0;
      let lastSpaceIndex = 0;

      while (index < text.length) {
        const lastPart = text.substring(start);

        if (lastPart.replaceAll("_", "").length <= maxSymbols) {
          chunks.push({
            substring: text.substring(start),
            start: start + prevIndex,
            end: text.length + prevIndex,
          });
          index = text.length;
        }

        if (text[index] === " ") lastSpaceIndex = index;

        if (count === maxSymbols) {
          if (lastSpaceIndex !== 0) end = lastSpaceIndex;
          else end = index;

          const substring = text.substring(start, end);

          chunks.push({
            substring,
            start: start + prevIndex,
            end: end + prevIndex,
          });

          start = end + 1;

          count = 0;
        }

        if (text[index] !== "_") count++;

        index++;
      }

      return chunks;
    },
    []
  );

  const splitByCommas = useCallback(
    (text: string, maxSymbols: number, prevIndex: number) => {
      let chunks = [];
      let subRegex = /[,]/g;
      let match;
      let lastIndex = 0;

      while ((match = subRegex.exec(text)) !== null) {
        let endIndex = match.index + 1;
        let substring = text.substring(lastIndex, endIndex);

        if (substring.trim().length) {
          const count = (substring.match(/_/g) || []).length;

          if (substring.length - count > maxSymbols) {
            let subChunks = splitByLastSpace(
              substring,
              maxSymbols,
              prevIndex + lastIndex
            );
            subChunks.forEach((subChunk) => chunks.push(subChunk));
          } else {
            chunks.push({
              substring: substring,
              start: lastIndex + prevIndex,
              end: endIndex + prevIndex,
            });
          }
        }

        lastIndex = endIndex + 1;
      }

      if (lastIndex < text.length) {
        let substring = text.substring(lastIndex);

        if (substring.trim().length) {
          if (substring.length > maxSymbols) {
            let subChunks = splitByLastSpace(
              substring,
              maxSymbols,
              prevIndex + lastIndex
            );
            subChunks.forEach((subChunk) => chunks.push(subChunk));
          } else {
            chunks.push({
              substring,
              start: lastIndex + prevIndex,
              end: text.length + prevIndex,
            });
          }
        }
      }

      return chunks;
    },
    []
  );

  const generateChunks = useCallback((text: string, startIndex: number) => {
    let chunks = [];
    let regex = /[.!?]/g;
    let match;
    let lastIndex = 0;

    const MAX_SYMBOLS_TTS = 100;

    function checkChunkForEmtiness(word: string) {
      return word.replaceAll("_", "").trim() !== "";
    }

    while ((match = regex.exec(text)) !== null) {
      let endIndex = match.index + 1;
      let substring = text.substring(lastIndex, endIndex);
      if (substring.trim().length && checkChunkForEmtiness(substring)) {
        if (substring.length > MAX_SYMBOLS_TTS) {
          let subStrings = splitByCommas(
            substring,
            MAX_SYMBOLS_TTS,
            lastIndex + startIndex
          ).filter((ch) => checkChunkForEmtiness(ch.substring));
          subStrings.forEach((subStr) => chunks.push(subStr));
        } else {
          chunks.push({
            substring,
            start: lastIndex + startIndex,
            end: endIndex + startIndex,
          });
        }
      }
      lastIndex = endIndex;
    }

    if (lastIndex < text.length) {
      const substring = text.substring(lastIndex);
      if (substring.trim().length && checkChunkForEmtiness(substring)) {
        if (substring.length > MAX_SYMBOLS_TTS) {
          let subStrings = splitByCommas(
            substring,
            MAX_SYMBOLS_TTS,
            lastIndex + startIndex
          ).filter((ch) => checkChunkForEmtiness(ch.substring));
          subStrings.forEach((subStr) => chunks.push(subStr));
        } else {
          chunks.push({
            substring,
            start: lastIndex + startIndex,
            end: text.length + startIndex,
          });
        }
      }
    }

    return chunks;
  }, []);

  const splitHtml = useCallback((htmlString: string) => {
    const chunks: ReturnType<typeof generateChunks> = [];
    let start = 0;
    const paragraphRegex = /(<p>.*?<\/p>)/gs;
    const listItemRegex = /(<li>.*?<\/li>)/gs;
    const paragraphs = htmlString.split(paragraphRegex).filter(Boolean);
    paragraphs.forEach((item) => {
      const listItems = item.split(listItemRegex).filter(Boolean);
      if (listItems.length) {
        listItems.forEach((listItem) => {
          const htmlPlaceholders = memoizationOfTags(listItem);
          chunks.push(...generateChunks(htmlPlaceholders, start));
          start += listItem.length;
        });
      } else {
        const htmlPlaceholders = memoizationOfTags(item);
        chunks.push(...generateChunks(htmlPlaceholders, start));
        start += item.length;
      }
    });
    return chunks;
  }, []);

  const handleClick = useCallback(async () => {
    const audios: string[] = [];
    let started = false;

    function setStarted(value: boolean) {
      started = value;
      setConnected(value);
    }

    const html = converToHtmlWithStyles(editorState.getCurrentContent());

    const chunks = splitHtml(html);

    // console.log(chunks);
    // return;

    // return;

    if (!window) return;
    if (!connected && chunks.length) {
      let count = 0;
      let error = false;

      editorStateRef.current = editorState;

      const handleAudioEnd = async () => {
        if (!started) return false;

        if (count < chunks.length) {
          await pauseIfPlaying(!Boolean(audios[count]));
          handleAudio(audios[count]);
        } else {
          setStarted(false);
          editorStateRef.current && handleDecorateText(editorStateRef.current);
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

      const handleAudio = async (data: string) => {
        if (!started) return;

        audio.current = new Audio(data);
        audio.current.play();
        editorStateRef.current &&
          handleDecorateText(
            editorStateRef.current,
            chunks[count].start,
            chunks[count].end
          );
        count++;
        audio.current.addEventListener("ended", handleAudioEnd);
      };

      const handleFetch = async () => {
        let i = 0;
        while (i < chunks.length && started) {
          let text = chunks[i].substring.replaceAll("_", "");
          const data = await fetchData({ text });
          if (!data) {
            setStarted(false);
            error = true;
            editorStateRef.current &&
              handleDecorateText(editorStateRef.current);
            break;
          }
          audios.push(data);
          if (i === 0) handleAudio(data);
          i++;
        }
      };

      setStarted(true);

      await handleFetch();
    } else {
      setStarted(false);
      // audio.current?.pause();
      // audio.current = null;
      // editorStateRef.current && handleDecorateText(editorStateRef.current);
    }
  }, [connected, editorState, handleDecorateText, memoizationOfTags]);

  const fetchData = useCallback(async (body: { text: string }) => {
    try {
      const result = await fetch("https://oyqiz.airi.uz/api/v1/tts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!result.ok) return false;

      const response = await result.blob();
      return URL.createObjectURL(response);
    } catch (error) {
      return false;
    }
  }, []);

  return { handleClick, connected };
};
