import styles from "../index.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { ContentState, EditorState } from "draft-js";
import TextEditor from "..";
import "./index.css";
import { useTypingStore } from "@/src/store/typing.store";
import { useTypingHook } from "@/src/hooks/typing.hook";
import { EXCEPTION_SYMOBLS } from "@/src/constants";

interface ITypingDiv {
  content: string;
  setStarted: (started: boolean) => void;
}

export const TypingDiv: React.FC<ITypingDiv> = ({ content, setStarted }) => {
  const { handleAccuracy, handlePassed } = useTypingHook({ content });
  const {
    setTime,
    typedText,
    pause,
    setData,
    setTypedText,
    readonly,
    setPause,
    setReadonly,
    duration,
  } = useTypingStore();

  const ref = useRef<HTMLDivElement | null>(null);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [prevEditorState, setPrevEditorState] = useState(
    EditorState.createEmpty()
  );

  const [step, setStep] = useState(0);

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!pause || readonly) {
      setEditorState(EditorState.moveFocusToEnd(editorState));
    }
  }, [pause, readonly]);

  useEffect(() => {
    setData(0, 0, 0);
    setTypedText("");
    setPause(null);
    return () => {
      errIdxs.current = [];
    };
  }, []);

  const errIdxs = useRef<number[]>([]);

  const [errIdx, setErrIdx] = useState(-1);

  const time = useRef<null | NodeJS.Timeout>(null);

  const changeColor = useCallback(
    (char: string, index: number) => {
      // if (char === " ")
      //   return {
      //     backgroundColor: index === errIdx ? "red" : "",
      //   };

      return {
        backgroundColor: index === errIdx ? "red" : "",
        color: index === errIdx ? "white" : "",
      };
    },
    [errIdx]
  );

  const handleChange = useCallback(
    (newState: EditorState) => {
      let text = newState.getCurrentContent().getPlainText();

      if (text.length === content.length) {
        handlePassed(duration);
        return;
      }
      const prevText = editorState.getCurrentContent().getPlainText();

      if (text.length - prevText.length > 1) {
        text = prevText + " ";
      }

      if (text.length < prevText.length) {
        // const state = handleReplace(prevText.split(""), []);
        setEditorState(
          EditorState.moveFocusToEnd(
            EditorState.createWithContent(ContentState.createFromText(prevText))
          )
        );
        return;
      }
      if (
        EXCEPTION_SYMOBLS.includes(content[text.length - 1]) &&
        EXCEPTION_SYMOBLS.includes(text[text.length - 1])
      )
        text = prevText + content[text.length - 1];

      if (content[text.length - 1] !== text[text.length - 1]) {
        if (text.length - 1) {
          time.current && clearTimeout(time.current);
          setErrIdx(text.length - 1);
          time.current = setTimeout(() => setErrIdx(-1), 500);
          errIdxs.current = Array.from(
            new Set([...errIdxs.current, text.length - 1])
          );
        }
        text = prevText;
      }
      const userTypedText =
        (typedText + (text[text.length - 1] || "") || "").slice(
          0,
          text.length
        ) || "";

      handleAccuracy(userTypedText, errIdxs.current.length);

      // const state = handleReplace(text.split(""), []);

      setEditorState(
        EditorState.moveFocusToEnd(
          EditorState.createWithContent(ContentState.createFromText(text))
        )
      );

      setTypedText(userTypedText);
    },
    [editorState, pause, count, typedText]
  );

  useEffect(() => {
    setPrevEditorState(editorState);
  }, [editorState]);

  useEffect(() => {
    const text = editorState.getCurrentContent().getPlainText();
    const prevText = prevEditorState.getCurrentContent().getPlainText();
    if (
      editorState.getCurrentContent().hasText() &&
      ref &&
      ref.current &&
      text.length !== content.length &&
      prevText !== text
    ) {
      const w = ref.current?.offsetWidth / content.length;
      setStep(text.length * w);
      setCount(text.length);
    }
    if (Boolean(text.trim())) {
      setStarted(true);
      setTime(true);
    }
  }, [editorState]);

  const handleClick = () => setReadonly(false);

  const handleBLur = () => {
    // setReadonly(true);
  };

  return (
    <div className="wrapper" onClick={handleClick}>
      <TextEditor
        className="typingEditor"
        editorState={editorState}
        setEditorState={handleChange}
        readOnly={readonly || pause}
        onBlur={handleBLur}
        style={{
          left: `calc(60.2% - ${step}px)`,
          // color: "var(--correct-text-color)",
          width: ref && ref.current ? ref.current.offsetWidth : "300%",
        }}
      />
      <div
        className="content"
        ref={ref}
        style={{ left: `calc(60.2% - ${step}px)` }}
      >
        {/* {content} */}
        {content.split("").map((char, i) => (
          <span
            key={i}
            className="character"
            style={{
              opacity: i < count ? 0 : 1,
              ...changeColor(char, i),
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
};
