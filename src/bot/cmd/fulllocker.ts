import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} from "discord.js";
import User from "../../database/models/User";
import Profiles from "../../database/models/Profiles";

export default {
  data: new SlashCommandBuilder()
    .setName("fulllocker")
    .setDescription("Give a user full locker!")
    .addStringOption((opt) =>
      opt.setName("user").setDescription("Users Discord ID").setRequired(true),
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

      const profile = await Profiles.findOne({ accountId: user.accountId });
      if (!profile) {
        const embed = new EmbedBuilder()
          .setTitle("Core")
          .setDescription("User is missing a profile!")
          .setColor("Red")
          .setTimestamp();

        return await interaction.reply({ embeds: [embed], ephemeral: true });
      }

      if (!user.hasFL) {
        let athena = profile.profiles["athena"];

        const allItems = await Bun.file(
          "src/resources/utilities/allCosmetics.json",
        ).json();

        athena.items = { ...athena.items, ...allItems };

        await profile?.updateOne({
          $set: { "profiles.athena.items": athena.items },
        });

        user.hasFL = true;
        await user.save();
      }

      const embed = new EmbedBuilder()
        .setTitle("Core")
        .setDescription("Successfully gave Full Locker!")
        .setColor("Green")
        .setTimestamp();

      return await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (err) {
      console.error(err);

      const embed = new EmbedBuilder()
        .setTitle("Core")
        .setDescription(
          "We ran into an error while giving full locker, please try again later.",
        )
        .setColor("Red")
        .setTimestamp();

      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
