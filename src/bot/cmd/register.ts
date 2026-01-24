import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import User from "../../database/models/User";
import Profiles from "../../database/models/Profiles";
import createProfiles from "../../utils/creationTools/createProfiles";
import Tournaments from "../../database/models/Tournaments";

export default {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Create a Core account!")
    .addStringOption((opt) =>
      opt.setName("username").setDescription("Username").setRequired(true),
    )
    .addStringOption((opt) =>
      opt.setName("email").setDescription("Email").setRequired(true),
    )
    .addStringOption((opt) =>
      opt.setName("password").setDescription("Password").setRequired(true),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const username = interaction.options.getString("username", true);
    const emailInput = interaction.options.getString("email", true);
    const passwordInput = interaction.options.getString("password", true);

    const generateRandomPassword = () => {
      const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const numbers = "0123456789";
      let password = "";
      for (let i = 0; i < 4; i++) {
        password += letters[Math.floor(Math.random() * letters.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
      }
      return password;
    };

    const email =
      emailInput || `${Math.floor(1000000 + Math.random() * 9000000)}@core.dev`;
    const rawPassword = passwordInput || generateRandomPassword();

    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    const accountId = uuidv4().replace(/-/g, "");
    const userProfile = await createProfiles(accountId);

    const exist = await User.findOne({ discordId: interaction.user.id });
    if (exist) {
      return interaction.reply({
        content: "You already have an account. Please delete in via /delete!",
        flags: 64,
      });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return interaction.reply({
        content: "Username is already being used.",
        flags: 64,
      });
    }

    try {
      await User.create({
        accountId,
        username,
        email,
        password: hashedPassword,
        created: new Date(),
        banned: false,
        discordId: interaction.user.id,
      });

      await Profiles.create({
        accountId,
        profiles: userProfile,
        created: new Date().toISOString(),
        access_token: "",
        refresh_token: "",
      });

      await Tournaments.create({
        accountId,
        hype: 0,
        divisions: ["NormalArenaDiv1"],
      });

      const embed = new EmbedBuilder()
        .setTitle("Welcome to Core!")
        .setDescription(
          `Welcome **${username}**! Your account has been created.`,
        )
        .addFields(
          { name: "Email", value: email, inline: true },
          { name: "Account ID", value: accountId, inline: true },
        )
        .setColor("#00FF99")
        .setTimestamp()
        .setFooter({
          text: "Core Backend",
        });

      return await interaction.reply({
        embeds: [embed],
        flags: 64,
      });
    } catch (err) {
      console.error(err);
      return await interaction.reply({
        content: "Could not make your account, please contact support!",
        flags: 64,
      });
    }
  },
};
