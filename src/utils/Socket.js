import { io } from "socket.io-client";

let socket = null;

// Connect socket
export const connectSocket = (token, url) => {
  if (!socket) {
    socket = io(url, {
      auth: { token },
      transports: ["websocket"],
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });
  }
  return socket;
};

// Disconnect socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Get existing socket instance
export const getSocket = () => {
  return socket;
};
