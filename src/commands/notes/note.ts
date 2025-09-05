import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
} from "discord.js";

import { Reply } from "../../utils/messages/replies";

const reply = new Reply();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("note")
    .setDescription("[NOTES] View a specific note")
    .addStringOption((option) =>
      option
        .setName("note-title")
        .setDescription("Note")
        .setRequired(true)
        .setAutocomplete(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const noteOpt = interaction.options.getString("note-title", true);
    const noteID = noteOpt.match(/\(ID:\s*(\d+)\)/);

    const view = await reply.viewNote(
      noteID ? Number(noteID[1]) : Number(noteOpt)
    );

    if (!view) return;

    const { components } = view;

    await interaction.reply({
      components,
      flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
    });
  },
};
