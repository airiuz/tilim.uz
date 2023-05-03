import { CheckedIcon, CopyIcon } from "@/src/common/Utils/icons";
import { useTextEditorStore } from "@/src/store/translate.store";
import { Tooltip } from "react-tooltip";
import { useState } from "react";
import styles from "./index.module.css";

export const Copy = () => {
  const [open, setOpen] = useState(false);
  const { editorState } = useTextEditorStore();
  const handleClick = () => {
    setOpen(true);
    navigator.clipboard.writeText(
      editorState.getCurrentContent().getPlainText()
    );
    setTimeout(() => setOpen(false), 1500);
  };
  return (
    <>
      <Tooltip
        isOpen={open}
        className={styles.tooltip}
        id="my-tooltip-copy"
        place={"top"}
      >
        <div className={styles.copied}>
          <span>Nusxa olindi</span>
          <span>{CheckedIcon}</span>
        </div>
      </Tooltip>
      <div data-tooltip-id="my-tooltip-copy" onClick={handleClick}>
        {CopyIcon}
      </div>
    </>
  );
};
