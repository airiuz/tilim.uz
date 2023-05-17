import useWebSocket, { WebSocketMessage } from "@/src/hooks/websocket.hook";
import { useCallback, useRef } from "react";
import dynamic from "next/dynamic";
// import AudioFeeder from "audio-feeder";

const AudioFeeder = dynamic(async () => await import("audio-feeder"), {
  ssr: false,
});

export const useTextToSpeech = ({
  text,
  audio,
  setAudio,
}: {
  text: string;
  audio: string | null;
  setAudio: (audio: string | null) => void;
}) => {
  const socket = useRef<WebSocket | null>();
  const feeder = useRef<any>();

  const handleClick = () => {
    if (audio) {
      setAudio(null);
      return;
    }
    if (text.length === 0) {
      return;
    }

    setAudio(text);
  };

  const handleActivate = useCallback(() => {
    if (typeof window === "undefined") return;

    if (audio) {
      // @ts-ignore
      feeder.current = new AudioFeeder();
      feeder.current.init(2, 24000);

      socket.current = new WebSocket("wss://oyqiz.airi.uz/ws/speech/");

      socket.current.binaryType = "arraybuffer";
      socket.current.onmessage = (event: MessageEvent<WebSocketMessage>) => {
        console.log(event.data);
        const floatArray = new Float32Array(event.data as ArrayBuffer);
        feeder.current.bufferData([floatArray, floatArray]);
      };
      socket.current.onopen = () => {
        console.log("socket opened");
        socket.current?.send(audio);
        feeder.current.waitUntilReady(() => {
          feeder.current.start();
          setTimeout(() => {
            feeder.current.onstarved = () =>
              setTimeout(() => setAudio(null), 500);
          }, 500);
        });
      };

      socket.current.onclose = () => {
        console.log("socket.current.onclose");
      };
    } else {
      if (feeder.current) {
        feeder.current.stop();
        feeder.current.close();
        feeder.current = null;
      }
      if (socket && socket.current?.readyState !== 3) {
        socket.current?.close();
        socket.current = null;
      }
    }
  }, [audio, socket]);

  return { handleClick, handleActivate };
};
