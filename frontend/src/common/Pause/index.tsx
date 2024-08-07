import { ContinueIcon } from "@/src/common/Utils/icons";
import { Button } from "@/src/common/Button";
import styles from "./index.module.css";
import { useTypingStore } from "@/src/store/typing.store";
import { useEffect } from "react";

export const Pause = () => {
  const { setPause, setTime, setReadonly, pause, typedText } = useTypingStore();
  useEffect(() => {
    if (window === undefined) return;

    function keyPressHandler(event: KeyboardEvent) {
      if (event.code === "Space") handleClick();
    }

    window.addEventListener("keypress", keyPressHandler);

    return () => {
      window.removeEventListener("keypress", keyPressHandler);
    };
  }, []);
  const handleClick = () => {
    setReadonly(false);
    setTime(typedText.trim() !== "");
    setPause(null);
  };
  return (
    <div className={styles.puase__wrapper}>
      <Button onClick={handleClick} className={styles.continue}>
        <span>{ContinueIcon}</span>
        <span>{pause}</span>
      </Button>
    </div>
  );
};
