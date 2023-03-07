import axios from "axios";
import { useCallback, useState } from "react";
import * as icons from "../utils/icons";
import Microphone from "./microphone";
import Speaker from "./speaker";

function LeftTools({ value, speakValue, editorRef, onMicrophoneData }) {
  const [animation, setAnimation] = useState({
    copy: false,
  });

  const copyText = useCallback(
    (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(value);
      setAnimation((prev) => ({ ...prev, copy: true }));
      setTimeout(() => {
        setAnimation((prev) => ({ ...prev, copy: false }));
      }, 1500);
    },
    [value]
  );

  const toolBar = useCallback(() => {
    editorRef.current.focus();
  }, []);

  return (
    <div
      className="sticky inset-x-0 p-7 border-b dark:border-darkSecondary bg-white dark:bg-darkSecondary z-50 bottom-0 top-24 flex justify-between items-center"
      onClick={toolBar}
    >
      <div className="flex items-center space-x-5">
        <Microphone onData={onMicrophoneData} />
        <Speaker value={speakValue} />
        <div className="relative flex items-center">
          <button
            className={`${
              animation.copy
                ? "text-primary dark:text-darkPrimary"
                : "text-[#0D2148] dark:text-darkTernary"
            } inline-block ${
              value.length > 0
                ? "pointer-events-auto text-[#0D2148] dark:text-darkTernary"
                : "pointer-events-none text-gray-300 dark:text-gray-700"
            } select-none`}
            onClick={copyText}
          >
            {icons.copy}
          </button>
          <div
            className={`px-3 space-x-[10px] absolute left-full bottom-0 ml-2 text-lg text-white dark:text-darkTernary bg-primary dark:bg-darkPrimary py-[14px] items-center rounded-[4px] ${
              animation.copy ? "flex" : "hidden"
            }`}
          >
            <p className="w-28">Nusxa olindi</p>
            <div className="shrink-0 stroke-white dark:stroke-darkTernary">
              {icons.tick}
            </div>
          </div>
        </div>
      </div>
      <p className="text-[16px] font-medium dark:text-darkTernary">
        {value.length > 0 ? value.length : 0}/5000
      </p>
    </div>
  );
}

export default LeftTools;
