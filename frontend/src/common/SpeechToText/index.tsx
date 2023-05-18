import {
  CheckedIcon,
  MicrophoneIcon,
  toolTipIcon,
} from "@/src/common/Utils/icons";
import { useEffect, useState } from "react";
import { useSpeechToTextHook } from "@/src/hooks/speechToText.hook";
import { useTextEditorStore } from "@/src/store/translate.store";
import { ContentState, EditorState } from "draft-js";
// import { Tooltip } from "react-tooltip";
import styles from "./index.module.css";

export const SpeechToText = ({ className = "" }: { className?: string }) => {
  const [capturing, setCapturing] = useState(false);

  const [open, setOpen] = useState(false);

  const { setEditorState } = useTextEditorStore();

  const [text, setText] = useState<string[]>([]);

  const onData = (data: { text: string; is_final: boolean }) => {
    if (data.is_final) {
      setText((prev) => [...prev, data.text]);
    } else {
      setText((prev) => [
        ...prev.filter((_, i) => i !== prev.length - 1),
        data.text,
      ]);
    }
  };

  useEffect(() => {
    setEditorState(
      EditorState.createWithContent(ContentState.createFromText(text.join(" ")))
    );
  }, [text]);

  const { onClick } = useSpeechToTextHook({
    capturing,
    setCapturing,
    onData,
    setOpen,
  });

  return (
    <div
      onClick={onClick}
      className={`${capturing && className} ${styles.microphone} ${
        open && styles.mute
      }`}
    >
      {/* <Tooltip
        isOpen={open}
        className={styles.tooltip}
        id="my-tooltip"
        classNameArrow={styles.custom__arrow}
        place={"bottom"}
      >
        <div className={styles.tooltip__content}>
          <span>{toolTipIcon}</span>
          <span>
            Mikrafonga ruxsat berish uchun chap tomondagi <br /> “Разрещить”
            tugamasini bosing
          </span>
        </div>
      </Tooltip> */}
      <span data-tooltip-id="my-tooltip" data-tooltip-place={"bottom"}>
        {MicrophoneIcon}
      </span>
      <span className={styles.text}>
        {open && <span>Mikrafonga ruxsat berishingiz kutilmoqda....</span>}
      </span>
    </div>
  );
};
