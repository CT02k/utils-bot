import {
  ActionRowBuilder,
  ButtonInteraction,
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: ButtonInteraction) {
    if (!interaction.isButton()) return;
    if (!interaction.customId.startsWith("create-note-")) return;

    const currentPage = Number(interaction.customId.split("-")[2]);
    const totalNotes = Number(interaction.customId.split("-")[3]);

    const modal = new ModalBuilder()
      .setCustomId(`create-note-modal-${currentPage}-${totalNotes}`)
      .setTitle("Create note")
      .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId("title")
            .setLabel("Title")
            .setStyle(TextInputStyle.Short)
        )
      )
      .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId("content")
            .setLabel("Content")
            .setStyle(TextInputStyle.Paragraph)
        )
      );

    interaction.showModal(modal);
  },
};
