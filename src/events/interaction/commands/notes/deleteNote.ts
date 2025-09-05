import {
  Events,
  Interaction,
  ButtonStyle,
  ActionRowBuilder,
  ButtonBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
} from "discord.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    if (!interaction.isButton()) return;
    if (!interaction.customId.startsWith("delete-note-")) return;

    const noteId = interaction.customId.replace("delete-note-", "");

    const note = await prisma.note.findUnique({
      where: {
        id: Number(noteId),
        createdBy: interaction.user.id,
      },
    });

    if (!note) {
      await interaction.reply({
        content: "Note not found.",
        ephemeral: true,
      });
      return;
    }

    const confirmButton = new ButtonBuilder()
      .setCustomId(`confirm-delete-note-${note.id}`)
      .setLabel("Confirm")
      .setStyle(ButtonStyle.Danger);

    const cancelButton = new ButtonBuilder()
      .setCustomId(`cancel-delete-note-${note.id}`)
      .setLabel("Cancel")
      .setStyle(ButtonStyle.Secondary);

    const components = [
      new TextDisplayBuilder().setContent(
        `Are you sure you want to delete the note **“${note.title}”**? This action is irreversible.`
      ),

      new ActionRowBuilder<ButtonBuilder>().addComponents(
        confirmButton,
        cancelButton
      ),
    ];

    await interaction.update({
      components: components,
    });
  },
};
