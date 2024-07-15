import { useEffect, useRef, useState } from "react";
import { useTTSHook } from "@/src/hooks/tts.hook";
import styles from "./index.module.css";
import loadingIconLight from "./light-mode-loading.svg";
import loadingIconDark from "./dark-mode-loading.svg";
import { AudioIcon } from "../Utils/icons";
import { useThemeStore } from "@/src/store/theme.store";
import { THEME } from "@/src/constants";
interface ITextToSpeech {
  className: string;
}
export const TextToSpeech = ({ className }: ITextToSpeech) => {
  const { handleClick, connected } = useTTSHook();
  const [disabled, setDisabled] = useState(false);
  const { theme } = useThemeStore();

  useEffect(() => {
    if (connected) setDisabled(false);
  }, [connected]);

  const handleCLickButton = async () => {
    handleClick(setDisabled);
    if (connected)
      setTimeout(() => {
        setDisabled(false);
      }, 1000);
  };

  if (disabled)
    return (
      <img
        width={18}
        height={18}
        src={theme === THEME.DARK ? loadingIconDark.src : loadingIconLight.src}
      />
    );

  return (
    <div
      onClick={handleCLickButton}
      className={`${connected && className} ${disabled && styles.passive}`}
    >
      {AudioIcon}
    </div>
  );
};
