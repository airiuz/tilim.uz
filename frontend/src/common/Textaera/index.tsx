import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import styles from "./index.module.css";
import { Exit } from "@/src/common/Exit";
import { ContentState, EditorState } from "draft-js";
import { useSttStore } from "@/src/store/stt.store";

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
  useEffect(() => {
    if (typeof window !== "undefined") {
    }
  }, []);

  const { setText } = useSttStore();

  const handleEditorChange = (newState: EditorState) => {
    const selectionState = newState.getSelection();

    // if (!selectionState.isCollapsed()) return;

    const text = newState.getCurrentContent().getPlainText();
    const maxLength = 5000;

    if (text.length <= maxLength) {
      setEditorState(newState);
    } else {
      const truncatedText = text.slice(0, maxLength);
      const newContentState = ContentState.createFromText(truncatedText);
      const newEditorState = EditorState.createWithContent(newContentState);
      setEditorState(newEditorState);
    }
    setEditorState(newState);
  };

  const handleClear = () => {
    const emptyState = EditorState.createEmpty();
    setEditorState(emptyState);
    setText([]);
  };

  return (
    <div className={styles.container}>
      {clear && (
        <div className={styles.clear} onClick={handleClear}>
          <Exit />
        </div>
      )}

      <RichTextEditor
        editorState={editorState}
        handlePastedText={() => {
          return !Boolean(clear);
        }}
        onEditorStateChange={handleEditorChange}
        editorStyle={{ minHeight, maxHeight, ...style }}
        editorClassName={`${styles.editor} ${className}`}
        toolbarClassName={styles.editor__toolbar}
        toolbarHidden
        {...rest}
      />
    </div>
  );
}
