import { AudioIcon } from "@/src/common/Utils/icons";
import { useTTSHook } from "@/src/hooks/tts.hook";
import { useRef } from "react";

interface ITextToSpeech {
  className: string;
}

export const TextToSpeech = ({ className }: ITextToSpeech) => {
  const { handleClick, connected } = useTTSHook();

  const clicked = useRef(0);

  const handleCLickButton = () => {
    if (Date.now() - clicked.current > 500) {
      clicked.current = Date.now();
      handleClick();
    }
  };

  return (
    <div onClick={handleCLickButton} className={`${connected && className}`}>
      {AudioIcon}
    </div>
  );
};

//matnni kiriting, yana kiriting. ikkinchi gap.
