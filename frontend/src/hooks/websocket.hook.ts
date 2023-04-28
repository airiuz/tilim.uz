import { useState, useEffect } from "react";

export type WebSocketMessage =
  | string
  | ArrayBuffer
  | SharedArrayBuffer
  | Blob
  | ArrayBufferView;

type WebSocketResult = {
  socket: WebSocket | null;
};

const useWebSocket = (url: string): WebSocketResult => {
  const [data, setData] = useState<WebSocketMessage | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const newSocket = new WebSocket(url);

    newSocket.onerror = (error) => {
      console.log("error", error);
    };

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [url]);

  return { socket };
};

export default useWebSocket;
