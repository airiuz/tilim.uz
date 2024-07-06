import styles from "./index.module.css";
import { FirstSection } from "@/src/components/Typing/TypingInTime/FirstSection";
import { Keyboard } from "@/src/components/Typing/TypingInTime/Keyboard";
import { Result } from "@/src/components/Typing/TypingInTime/Result";
import { useTypingStore } from "@/src/store/typing.store";
import { Pause } from "@/src/common/Pause";
import Skeleton from "react-loading-skeleton";
import { Loader } from "../../Loader";

const TypingTime = () => {
  const { passed, pause } = useTypingStore();

  if (passed) return <Result />;

  return (
    <div className={styles.container}>
      {pause && <Pause />}

      <FirstSection />
      <Keyboard />
    </div>
  );
};

export default TypingTime;
