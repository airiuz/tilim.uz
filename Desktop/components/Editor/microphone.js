import { useCallback, useEffect, useRef, useState } from "react";
import * as icons from "../utils/icons";
export const isBrowser = typeof window !== "undefined";

function makeWavData(data) {
  var buffer = new ArrayBuffer(2 * data.length);
  var uint8 = new Uint8Array(buffer);
  var i, d;

  for (i = 0; i < data.length; i++) {
    d = (data[i] * 32767 + 0x10000) & 0xffff;
    uint8[i * 2] = d & 0xff;
    uint8[i * 2 + 1] = d >>> 8;
  }

  return buffer;
}

async function checkMicrophone(mediaStream, wsRef, onSuccess, onError, onData) {
  try {
    mediaStream.current = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: {
        channelCount: 1,
        sampleRate: 16000,
      },
    });
    const audioContext = new AudioContext({ sampleRate: 16000 });
    const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);
    scriptProcessor.connect(audioContext.destination);
    audioContext.resume();

    const source = audioContext.createMediaStreamSource(mediaStream.current);
    source.connect(scriptProcessor);

    wsRef.current = new WebSocket("wss://oyqiz.airi.uz/ws/live/");
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onData(data);
    };

    scriptProcessor.onaudioprocess = (e) => {
      const left = e.inputBuffer.getChannelData(0);
      const data = makeWavData(left);

      if (wsRef.current?.readyState === 1) {
        wsRef.current.send(data);
      }
    };

    onSuccess();
  } catch (error) {
    console.error(error);
    onError();
  }
}

function stopCapturing(mediaStream, wsRef) {
  if (!mediaStream.current) {
    return;
  }
  mediaStream.current.getTracks().forEach((track) => {
    if (track.readyState == "live") {
      track.stop();
    }
  });
  mediaStream.current = null;

  if (wsRef.current.readyState !== 3) {
    wsRef.current.close();
  }
  wsRef.current = null;
}

function Microphone({ onData }) {
  const wsRef = useRef();
  const mediaStream = useRef();

  const [capturing, setCapturing] = useState(false);
  const [animation, setAnimation] = useState(false);

  const showError = useCallback(() => {
    setAnimation(true);
    setTimeout(() => {
      setAnimation(false);
    }, 5000);
  }, []);

  const onClick = useCallback(() => {
    if (capturing) {
      stopCapturing(mediaStream, wsRef);
      setCapturing(false);
      onData({ type: "end" });
    } else {
      window.dispatchEvent(new CustomEvent("stopeverything"));
      checkMicrophone(
        mediaStream,
        wsRef,
        () => {
          setCapturing(true);
          onData({ type: "start" });
        },
        showError,
        onData
      );
    }
  }, [capturing, showError]);

  useEffect(() => {
    if (!isBrowser) {
      return;
    }
    const stopeverything = () => {
      stopCapturing(mediaStream, wsRef);
      setCapturing(false);
      onData({ type: "end" });
    };
    window.addEventListener("stopeverything", stopeverything);
    return () => {
      window.removeEventListener("stopeverything", stopeverything);
    };
  }, []);

  return (
    <div className="relative flex items-center">
      <button
        className={`flex w-8 h-8 justify-center items-center ${
          capturing
            ? "text-primary dark:text-darkPrimary stroke-primary fill-primary hover:fill-darkPrimary"
            : "text-[#0D2148] dark:text-darkTernary"
        }`}
        onClick={onClick}
        type="button"
      >
        {icons.microphone}
      </button>

      <div
        className={`flex absolute top-full left-0 px-4 overflow-hidden space-x-[10px] text-white mt-5  bg-primary dark:bg-darkPrimary h-[74px] items-center rounded-[4px] ${
          animation
            ? "w-[600px] transition-all duration-700 visible opacity-100"
            : "w-[70px] ease-linear duration-700 delay-300 invisible opacity-0"
        }`}
      >
        <div className="stroke-white dark:stroke-darkTernary">
          {icons.info_icon}
        </div>
        <div
          className={`${
            animation
              ? "translate-y-0 transition-all duration-700 delay-300"
              : "translate-y-24 transition-all duration-700"
          }`}
        >
          <p className="dark:text-darkTernary">“Ovozli yozish” </p>
          <p className="dark:text-darkTernary">
            Ushbu funksiyani ishlatish uchun, mikrofonga ruxsat bering.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Microphone;
