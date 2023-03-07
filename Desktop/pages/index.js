import TextEditor from "../components/Editor/text";
import Layout from "../components/Layout";
import { useCallback, useEffect, useRef, useState } from "react";

// export const isBrowser = typeof window !== "undefined";

export default function Home() {
  // const [data, setData] = useState(null);
  // const ws = useRef();

  // const sendAudio = useCallback(
  //   (blob) => {
  //     ws.current.send(blob);
  //   },
  //   [recorder]
  // );

  // const startRecording = useCallback(() => {
  //   navigator.mediaDevices
  //     .getUserMedia({ audio: true })
  //     .then(function onSuccess(stream) {
  //       recorder.current = new MediaRecorder(stream);

  //       const data = [];
  //       recorder.current.ondataavailable = (e) => {
  //         sendAudio(e);
  //         data.push(e.data);
  //       };
  //       recorder.current.start(1000);
  //       recorder.current.onerror = (e) => {
  //         throw e.error || new Error(e.name); // e.name is FF non-spec
  //       };
  //       recorder.current.onstop = (e) => {
  //         const audio = document.createElement("audio");
  //         audio.src = window.URL.createObjectURL(new Blob(data));
  //       };
  //     })
  //     .catch(function onError(error) {
  //       console.log(error.message);
  //     });
  // }, [recorder]);

  // useEffect(() => {
  //   if (!isBrowser) {
  //     return;
  //   }

  //   ws.current = new WebSocket("wss://oyqiz.airi.uz/ws/test/");
  //   ws.current.onopen = () => {
  //     console.log("CONNECTED");
  //   };
  //   ws.current.onclose = () => {
  //     console.log("DISCONNECTED");
  //   };

  //   ws.current.onmessage = (e) => {
  //     const data = JSON.parse(e.data);
  //     if (data.type === "data") {
  //       const d = new Float32Array(data.data.audio);
  //       feeder.bufferData([d, d]);
  //     } else {
  //       console.log("onmessage", data);
  //     }
  //     // setData(newData);
  //   };
  //   ws.current.onerror = (e) => {
  //     console.log(e.data);
  //   };

  //   return () => {
  //     ws.current.close();
  //   };
  // }, []);
  return (
    <Layout>
      <div className="px-4 flex flex-col flex-1 bg-white dark:bg-darkSecondary">
        <div className="border-b dark:border-[#495054] max-w-[1366px] w-full mx-auto flex-1">
          <TextEditor />
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ req }) {
  const device = req.headers["user-agent"].includes("Mobile");

  if (req.headers.host === "www.tilim.uz" && device) {
    return { redirect: { destination: "https://m.tilim.uz/" } };
  }

  return {
    props: {},
  };
}
