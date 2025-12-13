import { Client, GatewayIntentBits, ActivityType } from "discord.js";
import { Log } from "../utils/handling/logging";
import { createCommands } from "../utils/creationTools/createCommands";
import "dotenv/config";
import { config } from "..";

let createdCommands = new Map();

export const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  presence: {
    activities: [{ name: `Core`, type: ActivityType.Watching }],
  },
});

const commands = async () => {
  try {
    const { commands, cmds } = await createCommands();
    createdCommands = commands;

    await client.application?.commands.set(cmds);
  } catch (error) {
    console.error(`Failed to register commands: ${error}`);
  }
};

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = createdCommands.get(interaction.commandName);
    if (!command) {
      return interaction.reply({
        content:
          "Couldnt load this commmand, please restart your discord or try again later!",
        ephemeral: true,
      });
    }

    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content:
          "Couldnt load this commmand, please restart your discord or try again later!",
        ephemeral: true,
      });
    }
  }
});

client.on("ready", async () => {
  await commands();
  Log(`Logged in as ${client.user?.tag}`);
});

const origin = (config.get("bot_token") ?? "").trim();
const token = origin.replace(/^Bot\s+/i, "");

client.login(token);
