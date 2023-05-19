import { CheckedIcon, CopyIcon } from "@/src/common/Utils/icons";
import { useTextEditorStore } from "@/src/store/translate.store";
import { useState } from "react";
import styles from "./index.module.css";
import Tooltip from "../Tooltip";

export const Copy = () => {
  const { editorState } = useTextEditorStore();
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    const text = editorState.getCurrentContent().getPlainText();
    if (text.trim() !== "") {
      setOpen(true);
      navigator.clipboard.writeText(
        editorState.getCurrentContent().getPlainText()
      );
      setTimeout(() => setOpen(false), 1500);
    }
  };

  return (
    <Tooltip
      open={open}
      content={
        <div className={styles.copied}>
          <span>Nusxa olindi</span>
          <span>{CheckedIcon}</span>
        </div>
      }
      position="top"
    >
      <div onClick={handleClick}>{CopyIcon}</div>
    </Tooltip>
  );
};
