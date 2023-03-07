import { useCallback, useState } from "react";
import * as icons from "../utils/icons";

function LeftTools({ textLength, value, editorRef }) {
  const [animation, setAnimation] = useState({
    micro: false,
    copy: false,
    speaker: false,
  });

  const microAnimation = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault;
      setAnimation((prev) => ({ ...prev, micro: true }));
      setTimeout(() => {
        setAnimation((prev) => ({ ...prev, micro: false }));
      }, 2000);
    },
    [animation.micro]
  );

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

  const toolBar = useCallback(() => {
    console.log(editorRef.current);
    editorRef.current.focus();
  }, []);

  return (
    <div className="flex justify-between items-center flex-1" onClick={toolBar}>
      <div className="flex items-center space-x-5">
        <div className="relative flex items-center z-50">
          <button
            className={`${
              animation.micro
                ? "text-primary dark:text-darkPrimary stroke-primary fill-primary"
                : "text-[#0D2148] dark:text-darkTernary"
            }`}
            onClick={microAnimation}
          >
            {icons.microphone}
          </button>
          <div
            className={`flex absolute top-full left-0 px-4 overflow-hidden space-x-[10px] text-white mt-5  bg-primary dark:bg-darkPrimary h-[74px] items-center rounded-[4px] ${
              animation.micro
                ? "w-[300px] transition-all duration-700 visible opacity-100"
                : "w-[70px] ease-linear duration-700 delay-300 invisible opacity-0"
            }`}
          >
            <div className="stroke-white dark:stroke-darkTernary">
              {icons.info_icon}
            </div>
            <div
              className={`${
                animation.micro
                  ? "translate-y-0 transition-all duration-700 delay-300"
                  : "translate-y-24  transition-all duration-700"
              }`}
            >
              <p className="dark:text-darkTernary">“Ovozli yozish” </p>
              <p className="dark:text-darkTernary">ishlab chiqish jarayonida</p>
            </div>
          </div>
        </div>
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
        <div className="relative flex items-center">
          <button
            className={`${
              animation.copy
                ? "text-primary dark:text-darkPrimary"
                : "text-[#0D2148] dark:text-darkTernary"
            } inline-block ${
              textLength > 0
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
      <div className="flex items-center space-x-[26px]">
        <p className="text-[16px] font-medium dark:text-darkTernary">
          {textLength > 0 ? textLength : 0}/5000
        </p>
      </div>
    </div>
  );
}

export default LeftTools;
