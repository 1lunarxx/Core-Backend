import { Client, GatewayIntentBits, ActivityType } from "discord.js";
import { Log } from "../utils/handling/logging";
import registerCommand from "./cmd/register";
import deleteCommand from "./cmd/delete";
import fullCommand from "./cmd/fulllocker";
import banCommand from "./cmd/ban";
import unbanCommand from "./cmd/unban";

import "dotenv/config";

export const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences],
  presence: {
    activities: [{ name: `Core`, type: ActivityType.Watching }],
  },
});

const commands = async () => {
  try {
    const cmds = [
      registerCommand.data.toJSON(),
      deleteCommand.data.toJSON(),
      fullCommand.data.toJSON(),
      banCommand.data.toJSON(),
      unbanCommand.data.toJSON(),
    ];
    await client.application?.commands.set(cmds);
  } catch (error) {
    console.error(`Failed to register commands: ${error}`);
  }
};

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    try {
      switch (interaction.commandName) {
        case "register":
          await registerCommand.execute(interaction);
          break;
        case "delete":
          await deleteCommand.execute(interaction);
          break;
        case "fulllocker":
          await fullCommand.execute(interaction);
          break;
        case "unban":
          await unbanCommand.execute(interaction);
          break;
        case "ban":
          await banCommand.execute(interaction);
          break;
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "failed to execute comands",
        ephemeral: true,
      });
    }
  }
});

client.on("ready", async () => {
  await commands();
  Log(`Logged in as ${client.user?.tag}`);
});

const origin = (process.env.BOT_TOKEN ?? "").trim();
const token = origin.replace(/^Bot\s+/i, "");

client.login(token);
