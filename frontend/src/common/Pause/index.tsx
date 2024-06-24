import { ContinueIcon } from "@/src/common/Utils/icons";
import { Button } from "@/src/common/Button";
import styles from "./index.module.css";
import { useTypingStore } from "@/src/store/typing.store";

export const Pause = () => {
  const { setPause, setTime, setReadonly, pause, typedText } = useTypingStore();
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
