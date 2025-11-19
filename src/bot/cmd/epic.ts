import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import User from "../../db/models/User";
import Profiles from "../../db/models/Profiles";
import { createProfilesFromBearer } from "../../utils/creationTools/createProfiles";
import Tournaments from "../../db/models/Tournaments";
import { Fortnite } from "fortnitenpm";

const fortnite = new Fortnite();

async function registerUser(
  email: string,
  username: string,
  accountId: string,
  bearer: string
) {
  const password = uuidv4().replace(/-/g, "");
  const hashedPassword = await bcrypt.hash(password, 10);
  const userProfile = await createProfilesFromBearer(bearer);

  const created = await User.create({
    accountId,
    username,
    email,
    password: hashedPassword,
    created: new Date(),
  });

  await Profiles.create({
    accountId: created.accountId,
    profiles: userProfile,
    created: new Date().toISOString(),
    access_token: bearer,
    refresh_token: "",
  });

  return { created, password };
}

export default {
  data: new SlashCommandBuilder()
    .setName("epic")
    .setDescription("Register with your Epic Games account!")
    .addStringOption((opt) =>
      opt
        .setName("code")
        .setDescription("Authorization code")
        .setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const code = interaction.options.getString("code");

    if (!code) {
      const authLink =
        "https://www.epicgames.com/id/api/redirect?clientId=3f69e56c7649492c8cc29f1af08a8a12&responseType=code";

      const embed = new EmbedBuilder()
        .setTitle("Login with Epic Games")
        .setDescription(
          `Click the link below to get your authorization code.\nCopy the authorization code and run:\n\n\`/epic code:YOUR_authorizationCode\``
        )
        .addFields({
          name: "Login Link",
          value: `[Click Here](${authLink})`,
        })
        .setColor("#00AAFF")
        .setTimestamp()
        .setFooter({ text: "Core Backend" });

      return interaction.reply({
        embeds: [embed],
        flags: 64,
      });
    }

    const existing = await User.findOne({ discordId: interaction.user.id });
    if (existing) {
      return interaction.reply({
        content: "You already have an account. Please delete in via /delete!",
        flags: 64,
      });
    }

    try {
      const login = await fortnite.login(code);

      const conflict = await User.findOne({ username: login.username });
      if (conflict) {
        return interaction.reply({
          content: "You already have an account. Please delete in via /delete!",
          flags: 64,
        });
      }

      const email = `${login.username.replace(/[^a-zA-Z0-9]/g, "")}@corefn.dev`;

      const { created, password } = await registerUser(
        email,
        login.username,
        login.accountId,
        login.bearer
      );

      await Tournaments.create({
        accountId: login.accountId,
        hype: 0,
        divisions: ["NormalArenaDiv1"],
      });

      const embed = new EmbedBuilder()
        .setTitle("Welcome to Core!")
        .setDescription(
          `Welcome **${login.username}**! Your account has been created.`
        )
        .addFields(
          { name: "Email", value: email, inline: true },
          { name: "Account ID", value: login.accountId, inline: true },
          { name: "Password", value: password, inline: true }
        )
        .setColor("#00FF99")
        .setTimestamp()
        .setFooter({ text: "Core Backend" });

      return interaction.reply({
        embeds: [embed],
        flags: 64,
      });
    } catch (err) {
      return interaction.reply({
        content: "Invalid or expired authorization code.",
        flags: 64,
      });
    }
  },
};
