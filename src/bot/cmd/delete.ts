import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";
import User from "../../database/models/User";
import Profiles from "../../database/models/Profiles";

export default {
  data: new SlashCommandBuilder()
    .setName("delete")
    .setDescription("Delete your Core account"),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const user = await User.findOne({ discordId: interaction.user.id });
      if (!user) {
        const embed = new EmbedBuilder()
          .setTitle("Core")
          .setDescription("You are not registered!")
          .setColor("Red")
          .setTimestamp();

        return await interaction.reply({ embeds: [embed], flags: 64 });
      }

      const profile = await Profiles.findOne({ accountId: user.accountId });
      if (!profile) {
        const embed = new EmbedBuilder()
          .setTitle("Core")
          .setDescription("Please contact support, your profile was not found.")
          .setColor("Orange")
          .setTimestamp();

        return await interaction.reply({ embeds: [embed], flags: 64 });
      }

      await profile.deleteOne();
      await user.deleteOne();

      const embed = new EmbedBuilder()
        .setTitle("Core")
        .setDescription("Your Core account has been successfully deleted.")
        .setColor("Green")
        .setTimestamp();

      return await interaction.reply({ embeds: [embed], flags: 64 });
    } catch (err) {
      console.error(err);

      const embed = new EmbedBuilder()
        .setTitle("Core")
        .setDescription(
          "We ran into a error while deleting your account, please try again later.",
        )
        .setColor("Red")
        .setTimestamp();

      return await interaction.reply({ embeds: [embed], flags: 64 });
    }
  },
};
