import type { CoreSocket } from "..";
import type { ServerWebSocket } from "bun";
import xmlparser from "xml-parser";

export function createClient(
  socket: ServerWebSocket<CoreSocket>,
  message: string | Buffer
) {
  if (typeof message !== "string") return;
  console.log(message);
}
