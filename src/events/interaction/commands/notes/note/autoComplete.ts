import { AutocompleteInteraction, Events } from "discord.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: AutocompleteInteraction) {
    if (!interaction.isAutocomplete()) return;
    if (interaction.options.getFocused(true).name !== "note-title") return;

    const focusedValue = interaction.options.getFocused();

    const notes = await prisma.note.findMany({
      where: {
        createdBy: interaction.user.id,
      },
    });

    const result = notes
      .filter((note) => {
        return note.title.includes(focusedValue);
      })
      .map((note) => {
        return {
          name: `${note.title} (ID: ${note.id})`,
          value: note.id.toString(),
        };
      })
      .slice(0, 25);

    await interaction.respond(result);
  },
};
