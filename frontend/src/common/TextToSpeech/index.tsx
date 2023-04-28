import { AudioIcon } from "@/src/common/Utils/icons";
import { useEffect, useRef, useState } from "react";
import { useTextToSpeech } from "@/src/hooks/textToSpeech.hook";

interface ITextToSpeech {
  text: string;
  className: string;
}

export const TextToSpeech = ({ text, className }: ITextToSpeech) => {
  const [audio, setAudio] = useState<null | string>(null);

  const { handleClick, handleActivate } = useTextToSpeech({
    text,
    audio,
    setAudio,
  });

  useEffect(() => {
    handleActivate();
  }, [audio]);

  return (
    <div onClick={handleClick} className={`${audio && className}`}>
      {AudioIcon}
    </div>
  );
};
