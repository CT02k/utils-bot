import {
  SlashCommandBuilder,
  CommandInteraction,
  MessageFlags,
} from "discord.js";
import { Reply } from "../../utils/messages/replies";

const reply = new Reply();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("notes")
    .setDescription("[NOTES] View, edit and create notes"),

  async execute(interaction: CommandInteraction) {
    const { components } = await reply.notes(interaction.user.id, 0);

    await interaction.reply({
      components: components,
      flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
    });
  },
};
