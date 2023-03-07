import { useCallback, useState } from "react";
import * as icons from "../utils/icons";
import TextRate from "./rate";

function RightTools({ value }) {
  const [animation, setAnimation] = useState({
    copy: false,
    speaker: false,
  });

  const speakerAnimation = useCallback(
    (e) => {
      e.stopPropagation();
      setAnimation((prev) => ({
        ...prev,
        speaker: !animation.speaker,
      }));
    },
    [animation.speaker]
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
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-5">
        <div className="relative flex items-center">
          {animation.speaker ? (
            <div className="absolute inset-0 flex justify-center items-center -z-10">
              <span className="animate-ping inline-flex p-2.5  rounded-full bg-primary dark:bg-darkPrimary"></span>
            </div>
          ) : null}
          <button
            onClick={speakerAnimation}
            className={`pointer-events-none text-gray-300 dark:text-gray-700 select-none  ${
              animation.speaker
                ? "text-primary dark:text-darkPrimary"
                : "text-[#0D2148] dark:text-darkTernary"
            }`}
          >
            {icons.volume}
          </button>
        </div>
      </div>
      <div className="flex items-center space-x-5">
        <div className="flex items-center">
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
              className={`px-3 space-x-[10px] absolute py-[14px] right-full text-lg bottom-0 mr-2 text-white bg-primary dark:bg-darkPrimary items-center rounded-[4px] ${
                animation.copy ? "flex" : "hidden"
              }`}
            >
              <p className="w-28 dark:text-darkTernary">Nusxa olindi</p>
              <div className="shrink-0 stroke-white dark:stroke-darkTernary">
                {icons.tick}
              </div>
            </div>
          </div>
        </div>
        <TextRate />
      </div>
    </div>
  );
}

export default RightTools;