import styles from "../index.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { EditorState } from "draft-js";
import TextEditor from "..";
import "./index.css";
import { useTypingStore } from "@/src/store/typing.store";
import { useTypingHook } from "@/src/hooks/typing.hook";

export const TypingDiv = ({
  content,
  setStarted,
}: {
  content: string;
  setStarted: (started: boolean) => void;
}) => {
  const { handleReplace, handleAccuracy } = useTypingHook({ content });

  const ref = useRef<HTMLDivElement | null>(null);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [prevEditorState, setPrevEditorState] = useState(
    EditorState.createEmpty()
  );

  const [step, setStep] = useState(0);

  const { setTime, pause, setTypedText, readonly, setReadonly } =
    useTypingStore();

  useEffect(() => {
    if (!pause || readonly)
      setEditorState(EditorState.moveFocusToEnd(editorState));
  }, [pause, readonly]);

  const handleChange = useCallback(
    (newState: EditorState) => {
      let text = newState.getCurrentContent().getPlainText().split("");

      if (text.length > content.length) text = text.slice(0, content.length);

      const prevText = editorState.getCurrentContent().getPlainText();

      if (text.length < prevText.length) return;

      handleAccuracy(text.join(""));

      const state = handleReplace(text);

      setEditorState(EditorState.moveFocusToEnd(state));

      setTypedText(newState.getCurrentContent().getPlainText());
    },
    [editorState, pause]
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
      setStep((prev) => (prev += w));
    }
    if (text.length === 1) {
      setStarted(true);
      // setTime(true);
    }
  }, [editorState]);

  const handleClick = () => setReadonly(false);

  const handleBLur = () => setReadonly(true);

  return (
    <div className="wrapper" onClick={handleClick}>
      <TextEditor
        className="typingEditor"
        editorState={editorState}
        setEditorState={handleChange}
        readOnly={readonly}
        onBlur={handleBLur}
        style={{
          left: `calc(60.2% - ${step}px)`,
          width: ref && ref.current ? ref.current.offsetWidth : "300%",
        }}
      />
      <div
        className="content"
        ref={ref}
        style={{ left: `calc(60% - ${step}px)` }}
      >
        {content}
      </div>
    </div>
  );
};
