import { useCallback, useEffect, useRef, useState } from "react";
import AudioFeeder from "../audio-feeder";
import * as icons from "../utils/icons";

export const isBrowser = typeof window !== "undefined";

function Speaker({ value }) {
  const wsRef = useRef();
  const feeder = useRef();
  const [speaking, setSpeaking] = useState(false);

  const onClick = useCallback(() => {
    if (speaking) {
      setSpeaking(false);
      return;
    }
    if (value.length === 0) {
      return;
    }
    window.dispatchEvent(new CustomEvent("stopeverything"));
    setSpeaking(value);
  }, [value, speaking]);

  useEffect(() => {
    if (!isBrowser) {
      return;
    }
    if (speaking) {
      feeder.current = new AudioFeeder();
      feeder.current.init(2, 24000);

      wsRef.current = new WebSocket("wss://oyqiz.airi.uz/ws/speech/");
      wsRef.current.binaryType = "arraybuffer";
      wsRef.current.onmessage = (event) => {
        const floatArray = new Float32Array(event.data);
        feeder.current.bufferData([floatArray, floatArray]);
      };
      wsRef.current.onopen = () => {
        wsRef.current.send(speaking);
        feeder.current.waitUntilReady(() => {
          feeder.current.start();
          setTimeout(() => {
            feeder.current.onstarved = () =>
              setTimeout(() => setSpeaking(false), 500);
          }, 500);
        });
      };
    } else {
      if (feeder.current) {
        feeder.current.stop();
        feeder.current.close();
        feeder.current = null;
      }
      if (wsRef.current && wsRef.current.readyState !== 3) {
        wsRef.current.close();
        wsRef.current = null;
      }
    }
  }, [speaking]);

  useEffect(() => {
    if (!isBrowser) {
      return;
    }
    const stopeverything = () => {
      setSpeaking(false);
    };
    window.addEventListener("stopeverything", stopeverything);
    return () => {
      window.removeEventListener("stopeverything", stopeverything);
    };
  }, []);

  const className =
    value.length > 0
      ? "pointer-events-auto text-[#0D2148] dark:text-darkTernary"
      : "pointer-events-none text-gray-300 dark:text-gray-700";

  return (
    <div className="relative flex items-center">
      {speaking ? (
        <div className="absolute inset-0 flex justify-center items-center -z-10">
          <span className="animate-ping inline-flex p-2.5  rounded-full bg-primary dark:bg-darkPrimary"></span>
        </div>
      ) : null}
      <button
        onClick={onClick}
        className={`${className} select-none  ${
          speaking
            ? "text-primary dark:text-darkPrimary"
            : "text-[#0D2148] dark:text-darkTernary"
        }`}
      >
        {icons.volume}
      </button>
    </div>
  );
}

export default Speaker;
