import { AudioIcon } from "@/src/common/Utils/icons";
import { useTTSHook } from "@/src/hooks/tts.hook";

interface ITextToSpeech {
  className: string;
}

export const TextToSpeech = ({ className }: ITextToSpeech) => {
  const { handleClick, connected } = useTTSHook();

  return (
    <div onClick={handleClick} className={`${connected && className}`}>
      {AudioIcon}
    </div>
  );
};

//matnni kiriting, yana kiriting. ikkinchi gap.
