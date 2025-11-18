import type { ServerWebSocket } from "bun";
import { createClient } from "./utilities/createClient";
import { Log } from "../utils/handling/logging";

export interface CoreSocket {
  bLoggedIn?: boolean;
  accountId?: string;
  displayName?: string;
  socket?: ServerWebSocket<CoreSocket> | null;
}

export const XMPPServer = Bun.serve<CoreSocket, {}>({
  port: 70,
  fetch(request, server) {
    server.upgrade(request, { data: { socket: null } });
    return undefined;
  },
  websocket: {
    open(socket) {
      socket.data!.socket = socket;
    },

    async close(socket) {
      if (!socket.data) return;
    },

    message(socket, message) {
      console.log(message);
      createClient(socket, message);
    },
  },
});

Log(`Running XMPP on port ${XMPPServer.port}`);
