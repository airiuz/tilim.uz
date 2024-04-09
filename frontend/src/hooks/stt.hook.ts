import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { WebVoiceProcessor } from "@picovoice/web-voice-processor";
import axios from "axios";
import { useSttStore } from "../store/stt.store";
import { ContentState, EditorState } from "draft-js";
import { useTextEditorStore } from "../store/translate.store";

export const useSttHook = () => {
  useEffect(() => {
    WebVoiceProcessor.setOptions({
      outputSampleRate: 16000,
      frameLength: 1024,
      // filterOrder: 1
    });
  }, []);

  const { capturing, setCapturing, addText, text, setLoading } = useSttStore();

  const { setEditorState } = useTextEditorStore();

  useEffect(() => {
    if (text.length) {
      setEditorState(
        EditorState.createWithContent(
          ContentState.createFromText(text.join(" "))
        )
      );
    }
  }, [text]);

  const audioChunks = useRef<any[]>([]);

  const audioChunksWithHeader = useRef<any[]>([]);

  const engine = useMemo(
    () => ({
      onmessage: function (e: any) {
        switch (e.data.command) {
          case "process":
            // console.log(e.data.inputFrame.buffer);
            audioChunksWithHeader.current.push(
              setWavHeader(makeWavData(e.data.inputFrame))
            );
            audioChunks.current.push(makeWavData(e.data.inputFrame));

            break;
        }
      },
    }),
    [audioChunks, audioChunksWithHeader]
  );

  const startRecording = useCallback(async () => {
    setCapturing(true);

    await WebVoiceProcessor.subscribe(engine);
  }, []);

  const stopRecording = useCallback(async () => {
    setLoading(true);
    setCapturing(false);
    await WebVoiceProcessor.unsubscribe(engine);
    if (
      audioChunks &&
      audioChunks.current &&
      audioChunksWithHeader &&
      audioChunksWithHeader.current
    ) {
      const wavBlobNoHeader = new Blob(audioChunks.current, {
        type: "audio/wav",
      });

      const wavBlobHeader = new Blob(audioChunksWithHeader.current, {
        type: "audio/wav",
      });

      setCapturing(false);

      const formData = new FormData();

      formData.append("byte", wavBlobNoHeader);
      // formData.append("header", wavBlobHeader);

      const txt = await fetchData(formData);

      if (txt) addText(txt);

      setLoading(false);

      audioChunks.current = [];

      audioChunksWithHeader.current = [];
    }
  }, [audioChunks, audioChunksWithHeader]);

  const switchRecordMicrophone = useCallback(async () => {
    if (capturing) await stopRecording();
    else await startRecording();
  }, [capturing]);

  const fetchData = useCallback(async (body: any) => {
    try {
      const data = await axios.post("/wavdata", body, {
        baseURL: "",
      });
      return data.data.text;
    } catch (error) {
      return " ";
    }
  }, []);

  function setWavHeader(
    arrayBuffer: ArrayBufferLike & { BYTES_PER_ELEMENT?: undefined },
    numChannels: number = 1,
    sampleRate: number = 16000,
    bitsPerSample: number = 8
  ) {
    const view = new DataView(arrayBuffer);

    const dataSize = arrayBuffer.byteLength;
    const numFrames = dataSize / (numChannels * (bitsPerSample / 8));
    const subchunk2Size = numFrames * numChannels * (bitsPerSample / 8);

    // Write WAV header
    view.setUint32(0, 0x52494646, true); // "RIFF"
    view.setUint32(4, dataSize + 36, true); // File size - 8
    view.setUint32(8, 0x57415645, true); // "WAVE"
    view.setUint32(12, 0x666d7420, true); // "fmt "
    view.setUint32(16, 16, true); // Sub-chunk size

    // Audio format (PCM) - assuming uncompressed audio
    view.setUint16(20, 1, true);

    view.setUint16(22, numChannels, true); // Number of channels
    view.setUint32(24, sampleRate, true); // Sample rate
    view.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true); // Byte rate
    view.setUint16(32, numChannels * (bitsPerSample / 8), true); // Block align
    view.setUint16(34, bitsPerSample, true); // Bits per sample

    view.setUint32(36, 0x64617461, true); // "data"
    view.setUint32(40, subchunk2Size, true); // "Subchunk2Size"

    return arrayBuffer;
  }

  function makeWavData(data: Int16Array) {
    let buffer = new ArrayBuffer(2 * data.length);
    let uint8 = new Uint8Array(buffer);
    let i, d;
    for (i = 0; i < data.length; i++) {
      d = data[i];
      uint8[i * 2] = d & 0xff;
      uint8[i * 2 + 1] = d >>> 8;
    }
    return buffer;
  }

  return { switchRecordMicrophone, capturing };
};
