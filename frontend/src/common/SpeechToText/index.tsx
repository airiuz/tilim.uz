import {
  CheckedIcon,
  MicrophoneIcon,
  toolTipIcon,
} from "@/src/common/Utils/icons";
import { useEffect, useState } from "react";
import { useSpeechToTextHook } from "@/src/hooks/speechToText.hook";
import { useTextEditorStore } from "@/src/store/translate.store";
import { ContentState, EditorState } from "draft-js";
import styles from "./index.module.css";
import Tooltip from "../Tooltip";
import { useSttStore } from "@/src/store/stt.store";
import { useSttHook } from "@/src/hooks/stt.hook";

export interface IData {
  text: string;
}

export const SpeechToText = ({ className = "" }: { className?: string }) => {
  const { capturing } = useSttStore();
  const [open, setOpen] = useState(false);

  const { switchRecordMicrophone } = useSttHook();

  // const { setEditorState } = useTextEditorStore();

  // const [text, setText] = useState<string[]>([]);

  // const onData = (data: IData) => {
  //   if (data.is_final) {
  //     setText((prev) => [...prev, data.text]);
  //   } else {
  //     setText((prev) => [
  //       ...prev.filter((_, i) => i !== prev.length - 1),
  //       data.text,
  //     ]);
  //   }
  // };

  // const { onClick } = useSpeechToTextHook({
  //   onData,
  // });

  return (
    <div
      title="Speech to text funksiyasi hozirda o'zgartirilmoqda"
      // onClick={switchRecordMicrophone}
      className={`${capturing && className} `}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* <span>{MicrophoneIcon}</span> */}
      {/* <audio className="customaudio" controls></audio> */}
      <Tooltip
        open={open}
        className={styles.tooltip}
        content={
          <div className={styles.tooltip__content}>
            <span>{toolTipIcon}</span>
            <span>
              Mikrafonga ruxsat berish uchun chap tomondagi <br /> “Разрещить”
              tugamasini bosing
            </span>
          </div>
        }
        position="bottom"
      >
        <span data-tooltip-id="my-tooltip" data-tooltip-place={"bottom"}>
          {MicrophoneIcon}
        </span>
        {/* <span className={styles.text}>
          {true && <span>Mikrafonga ruxsat berishingiz kutilmoqda....</span>}
        </span> */}
      </Tooltip>
    </div>
  );
};
