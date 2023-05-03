import { ContinueIcon } from "@/src/common/Utils/icons";
import { Button } from "@/src/common/Button";
import styles from "./index.module.css";
import { useTypingStore } from "@/src/store/typing.store";

export const Pause = () => {
  const { setPause, setTime, setReadonly } = useTypingStore();
  const handleClick = () => {
    setReadonly(false);
    setTime(true);
    setPause(false);
  };
  return (
    <div className={styles.puase__wrapper}>
      <Button onClick={handleClick} className={styles.continue}>
        <span>{ContinueIcon}</span>
        <span>Orqaga qaytish</span>
      </Button>
    </div>
  );
};
