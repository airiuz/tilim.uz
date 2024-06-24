import { useTypingStore } from "@/src/store/typing.store";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import styles from "./index.module.css";
import { useThemeStore } from "@/src/store/theme.store";
import { DURATION, THEME } from "@/src/constants";
import { useTypingHook } from "@/src/hooks/typing.hook";

export const CountDown = () => {
  const { time, pause, setDuration } = useTypingStore();
  const { theme } = useThemeStore();

  const { handlePassed } = useTypingHook({ content: "" });

  return (
    <div className={styles.wrapper}>
      <svg style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="my-unique-id" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#3474df" />
            <stop offset="100%" stopColor="#8a3ada" />
          </linearGradient>
        </defs>
      </svg>

      <CountdownCircleTimer
        isPlaying={time && !pause}
        duration={DURATION}
        strokeWidth={7}
        trailColor={theme === THEME.DARK ? "#1d2736" : "#fff"}
        isSmoothColorTransition
        size={84}
        onUpdate={(remainTime) => setDuration(DURATION - remainTime)}
        colors={"url(#my-unique-id)"}
        onComplete={() => {
          handlePassed(DURATION);
        }}
      >
        {({ remainingTime }) => (
          <div className={styles.time}>
            <span>{remainingTime}</span>
            <span>soniya</span>
          </div>
        )}
      </CountdownCircleTimer>
    </div>
  );
};
