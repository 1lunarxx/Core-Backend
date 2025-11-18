import type { CoreSocket } from "..";
import type { ServerWebSocket } from "bun";

export function createClient(
  socket: ServerWebSocket<CoreSocket>,
  message: string | Buffer
) {
  if (typeof message !== "string") return;
  console.log(message);
}
