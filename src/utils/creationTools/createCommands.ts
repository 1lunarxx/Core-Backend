import fs from "fs";
import path from "path";
import { LogError } from "../logging";

export async function createCommands() {
  const commands = new Map();
  const cmds = [];

  const commandsDir = path.join(process.cwd(), "src", "bot", "cmd");

  const files = fs
    .readdirSync(commandsDir)
    .filter((f) => f.endsWith(".ts") || f.endsWith(".js"));
  for (const file of files) {
    const filePath = path.join(commandsDir, file);
    const mod = await import(`file://${filePath}`);
    const command = mod.default ?? mod;

    if (!command.data || !command.execute) {
      LogError(`Couldnt load ${file} as a command!`);
      continue;
    }

    commands.set(command.data.name, command);
    cmds.push(command.data.toJSON());
  }

  return { commands, cmds };
}
