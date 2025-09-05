import { Events, ModalSubmitInteraction, MessageFlags } from "discord.js";
import { Reply } from "../../../../utils/messages/replies";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const reply = new Reply();

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: ModalSubmitInteraction) {
    if (!interaction.isModalSubmit()) return;
    if (!interaction.customId.startsWith("edit-note-modal-")) return;

    const noteId = interaction.customId.replace("edit-note-modal-", "");
    const title = interaction.fields.getField("title").value;
    const content = interaction.fields.getField("content").value;

    const updatedNote = await prisma.note.update({
      where: {
        id: Number(noteId),
        createdBy: interaction.user.id,
      },
      data: {
        title,
        content,
      },
    });

    if (updatedNote) {
      await interaction.deferUpdate();

      const view = await reply.viewNote(updatedNote.id);
      if (!view) return;
      const { components } = view;

      await interaction.editReply({
        components,
        flags: MessageFlags.IsComponentsV2,
      });
    }
  },
};
