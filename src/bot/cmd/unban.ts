import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} from "discord.js";
import User from "../../db/models/User";

export default {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a user from core!")
    .addStringOption((opt) =>
      opt.setName("user").setDescription("Users Discord ID").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction: ChatInputCommandInteraction) {
    if (
      !interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)
    ) {
      const embed = new EmbedBuilder()
        .setTitle("Core")
        .setDescription("You do not have permissions to use this command.")
        .setColor("Red")
        .setTimestamp();

      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const users = interaction.options.getString("user", true);
    try {
      const user = await User.findOne({ discordId: users });
      if (!user) {
        const embed = new EmbedBuilder()
          .setTitle("Core")
          .setDescription("Couldn't find the selected user.")
          .setColor("Red")
          .setTimestamp();

        return await interaction.reply({ embeds: [embed], ephemeral: true });
      }

      if (!user.banned) {
        const embed = new EmbedBuilder()
          .setTitle("Core")
          .setDescription("User is not banned!")
          .setColor("Red")
          .setTimestamp();

        return await interaction.reply({ embeds: [embed], ephemeral: true });
      } else {
        user.banned = false;
        user.save();
      }

      const embed = new EmbedBuilder()
        .setTitle("Core")
        .setDescription("Successfully unbanned user!")
        .setColor("Green")
        .setTimestamp();

      return await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (err) {
      console.error(err);

      const embed = new EmbedBuilder()
        .setTitle("Core")
        .setDescription(
          "We ran into an error while unbanning the selected user, please try again later."
        )
        .setColor("Red")
        .setTimestamp();

      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
