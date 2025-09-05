import {
  Events,
  Interaction,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  MessageActionRowComponentBuilder,
  MessageFlags,
  ContainerBuilder,
  TextDisplayBuilder,
} from "discord.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    if (!interaction.isButton()) return;
    if (!interaction.customId.startsWith("view-")) return;

    const noteId = interaction.customId.replace("view-", "");

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

    const components = [
      new TextDisplayBuilder().setContent(`**${note.title}**`),

      new ContainerBuilder().addTextDisplayComponents(
        new TextDisplayBuilder().setContent(note.content)
      ),

      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId(`back-to-notes`)
          .setLabel("<")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`edit-note-${note.id}`)
          .setEmoji("✏️")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId(`delete-note-${note.id}`)
          .setEmoji("🗑️")
          .setStyle(ButtonStyle.Danger)
      ),
    ];

    await interaction.update({
      components: components,
      flags: [MessageFlags.IsComponentsV2],
    });
  },
};
