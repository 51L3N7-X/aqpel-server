import type { Socket } from "socket.io";

export const subscribe = (socket: Socket, roomId: string | string[]) => {
  if (Array.isArray(roomId)) {
    socket.join(roomId);
  } else {
    socket.join(String(roomId));
  }
  // io.to("test").emit("ttt", "hello");
  console.log("joined room", roomId);
};
