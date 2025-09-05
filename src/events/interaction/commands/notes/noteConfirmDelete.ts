import { Events, Interaction, MessageFlags } from "discord.js";
import { PrismaClient } from "@prisma/client";
import { Reply } from "../../../../utils/messages/replies";

const prisma = new PrismaClient();

const reply = new Reply();

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    if (!interaction.isButton()) return;
    if (!interaction.customId.startsWith("confirm-delete-note-")) return;

    const noteId = interaction.customId.replace("confirm-delete-note-", "");

    try {
      await prisma.note.delete({
        where: {
          id: Number(noteId),
          createdBy: interaction.user.id,
        },
      });

      const { components } = await reply.notes(interaction.user.id, 0);

      await interaction.update({ components });

      await interaction.followUp({
        content: "Note successfully deleted!",
        ephemeral: true,
      });
    } catch (error) {
      await interaction.reply({
        content: "An error occurred while deleting the note.",
        flags: MessageFlags.Ephemeral,
        components: [],
      });
    }
  },
};
