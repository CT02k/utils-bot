import { Events, Interaction } from "discord.js";
import { Reply } from "../../../../utils/messages/replies";

const reply = new Reply();

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    if (!interaction.isButton()) return;
    if (!interaction.customId.startsWith("cancel-delete-note-")) return;

    const view = await reply.viewNote(
      Number(interaction.customId.replace("cancel-delete-note-", ""))
    );

    if (!view) return;

    const { components } = view;

    await interaction.update({ components });
  },
};
