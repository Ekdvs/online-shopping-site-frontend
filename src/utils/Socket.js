import { io } from "socket.io-client";

let socket;

export const connectSocket = (token, url = import.meta.env.VITE_API_WS_URL) => {
  socket = io(url, {
    auth: { token },
    transports: ["websocket"],
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};

export const getSocket = () => socket;
