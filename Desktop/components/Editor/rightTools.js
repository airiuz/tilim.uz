import axios from "axios";
import { useCallback, useState } from "react";
import * as icons from "../utils/icons";
import TextRate from "./rate";
import Speaker from "./speaker";

function RightTools({ value, speakValue }) {
  const [animation, setAnimation] = useState({
    copy: false,
    speaker: false,
  });

  const postText = useCallback(
    (e) => {
      e.stopPropagation();
      setAnimation((prev) => ({
        ...prev,
        speaker: !animation.speaker,
      }));
      axios.post("/send", { text: value });
    },
    [animation.speaker, value]
  );

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
  return (
    <div className="sticky inset-x-0 p-7 bg-[#F4F7FC] dark:bg-[#232831] border-b dark:border-[#232831] z-50 bottom-0 top-24 flex justify-between items-center">
      <Speaker value={speakValue} />
      <div className="flex items-center space-x-5">
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
            className={`px-3 space-x-[10px] absolute right-full text-lg bottom-0 mr-2 text-white bg-primary dark:bg-darkPrimary py-[14px] items-center rounded-[4px] ${
              animation.copy ? "flex" : "hidden"
            }`}
          >
            <p className="w-28 dark:text-darkTernary">Nusxa olindi</p>
            <div className="shrink-0 stroke-white dark:stroke-darkTernary">
              {icons.tick}
            </div>
          </div>
        </div>

        <TextRate value={value} />
      </div>
    </div>
  );
}

export default RightTools;
