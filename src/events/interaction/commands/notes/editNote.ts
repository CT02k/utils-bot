import {
  Events,
  Interaction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from "discord.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    if (!interaction.isButton()) return;
    if (!interaction.customId.startsWith("edit-note-")) return;

    const noteId = interaction.customId.replace("edit-note-", "");

    const note = await prisma.note.findUnique({
      where: {
        id: Number(noteId),
        createdBy: interaction.user.id,
      },
    });

    if (!note) {
      await interaction.reply({ content: "Note not found.", ephemeral: true });
      return;
    }

    const modal = new ModalBuilder()
      .setCustomId(`edit-note-modal-${note.id}`)
      .setTitle(`Edit Note: ${note.title}`);

    const titleInput = new TextInputBuilder()
      .setCustomId("title")
      .setLabel("Title")
      .setStyle(TextInputStyle.Short)
      .setValue(note.title)
      .setRequired(true);

    const contentInput = new TextInputBuilder()
      .setCustomId("content")
      .setLabel("Content")
      .setStyle(TextInputStyle.Paragraph)
      .setValue(note.content)
      .setRequired(true);

    const firstActionRow =
      new ActionRowBuilder<TextInputBuilder>().addComponents(titleInput);
    const secondActionRow =
      new ActionRowBuilder<TextInputBuilder>().addComponents(contentInput);

    modal.addComponents(firstActionRow, secondActionRow);

    await interaction.showModal(modal);
  },
};
