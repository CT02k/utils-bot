import { Events, Interaction, MessageFlags } from "discord.js";
import { Reply } from "../../../../utils/messages/replies";

const reply = new Reply();

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== "back-to-notes") return;

    const { components } = await reply.notes(interaction.user.id, 0);

    interaction.update({
      components,
      flags: [MessageFlags.IsComponentsV2],
    });
  },
};
