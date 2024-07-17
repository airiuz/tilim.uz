import dynamic from "next/dynamic";
import React, { useCallback, useMemo } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import styles from "./index.module.css";
import { Exit } from "@/src/common/Exit";
import { EditorState } from "draft-js";
import { useSttStore } from "@/src/store/stt.store";
import { OrderedSet } from "immutable";
import { useTextEditorStore } from "@/src/store/translate.store";
import { converToHtmlWithStyles, wrapEachNodeSpan } from "../Utils";

const RichTextEditor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

interface ITextEditor {
  editorState: EditorState;
  setEditorState: (newEditorState: EditorState) => void;
  minHeight?: number;
  maxHeight?: number;
  clear?: boolean;
  className?: string;
  style?: object;
  [key: string]: any;
}

export default function TextEditor({
  minHeight,
  maxHeight,
  editorState,
  setEditorState,
  clear,
  className,
  style,
  ...rest
}: ITextEditor) {
  const { setText } = useSttStore();
  const { connected, indexes } = useTextEditorStore();

  const handleEditorChange = useCallback(
    (newState: EditorState) => {
      const text = newState.getCurrentContent().getPlainText();
      const prevText = editorState.getCurrentContent().getPlainText();

      if (text.length > 4999 || connected) return;

      if (prevText !== text) {
        newState = EditorState.setInlineStyleOverride(newState, OrderedSet());
      }

      setEditorState(newState);
    },
    [editorState, connected]
  );

  const handleClear = () => {
    const emptyState = EditorState.createEmpty();
    setEditorState(emptyState);
    setText([]);
  };

  // console.log(converToHtmlWithStyles(editorState.getCurrentContent()));

  const __html = useMemo(
    () =>
      wrapEachNodeSpan(converToHtmlWithStyles(editorState.getCurrentContent())),
    [editorState.getCurrentContent()]
  );

  return (
    <div className={styles.container}>
      {clear &&
        Boolean(editorState.getCurrentContent().getPlainText().length) && (
          <div className={styles.clear} onClick={handleClear}>
            <Exit />
          </div>
        )}
      {!Boolean(indexes.length) && (
        <RichTextEditor
          editorState={editorState}
          handlePastedText={() => !Boolean(clear)}
          onEditorStateChange={handleEditorChange}
          editorStyle={{ minHeight, maxHeight, ...style }}
          editorClassName={`${styles.editor} ${className}`}
          toolbarClassName={styles.editor__toolbar}
          toolbarHidden
          {...rest}
        />
      )}

      {/* {2 && ( */}
      {1 && (
        <div className={styles.wrapper__tts}>
          <div
            dangerouslySetInnerHTML={{
              __html,
            }}
          />
        </div>
      )}
    </div>
  );
}
