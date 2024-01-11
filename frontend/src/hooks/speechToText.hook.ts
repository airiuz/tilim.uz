import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";

export const useSpeechToTextHook = ({
  capturing,
  setCapturing,
  onData,
  setOpen,
}: {
  capturing: boolean;
  setCapturing: Dispatch<SetStateAction<boolean>>;
  onData: (data: { text: string; is_final: boolean }) => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const mediaStream = useRef<MediaStream | null>();
  const socket = useRef<WebSocket | null>();

  function makeWavData(data: Float32Array) {
    let buffer = new ArrayBuffer(2 * data.length);
    let uint8 = new Uint8Array(buffer);
    let i, d;
    for (i = 0; i < data.length; i++) {
      d = (data[i] * 32767 + 0x10000) & 0xffff;
      uint8[i * 2] = d & 0xff;
      uint8[i * 2 + 1] = d >>> 8;
    }
    return buffer;
  }

  const stream = async () => {
    try {
      setOpen(false);

      socket.current = new WebSocket("wss://oyqiz.airi.uz/ws/live/");

      socket.current.onerror = () => {
        console.log("error");
      };

      socket.current.onopen = async () => {
        console.log("socket opened");

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

        await audioContext.resume();

        const source = audioContext.createMediaStreamSource(
          mediaStream.current
        );
        source.connect(scriptProcessor);

        scriptProcessor.onaudioprocess = (e) => {
          const left = e.inputBuffer.getChannelData(0);
          const data = makeWavData(left);

          if (socket.current?.readyState === 1) {
            socket.current.send(data);
          }
        };

        setCapturing(true);
        setOpen(true);
      };

      socket.current.onclose = () => {
        console.log("socket closed");
        setOpen(false);
        stopCapturing();
      };

      socket.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        onData(data);
      };
    } catch (error) {
      console.error(error);
      setOpen(false);
    }
  };

  const stopCapturing = () => {
    setCapturing(false);
    if (!mediaStream.current) {
      return;
    }
    mediaStream.current.getTracks().forEach((track) => {
      if (track.readyState == "live") {
        track.stop();
      }
    });
    mediaStream.current = null;

    if (socket.current?.readyState !== 3) {
      socket.current?.close();
    }
    socket.current = null;
  };

  const onClick = useCallback(async () => {
    if (capturing) {
      stopCapturing();
    } else {
      await stream();
    }
  }, [capturing]);

  return { onClick };
};
