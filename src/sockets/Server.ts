import { Socket, Server as SocketServer } from "socket.io";
import Connection from "./listeners/SocketManager";
import http from "http";

export class SocketServerClass {
  public server: http.Server;
  public io: SocketServer;
  constructor(server: http.Server) {
    this.server = server;
    this.io = new SocketServer(this.server, {
      allowUpgrades: true,
      cors: {
        origin: "*",
      },
    });
  }

  async init() {
    this.io.on("connection", (socket) => Connection(socket, this.io));
  }
}
