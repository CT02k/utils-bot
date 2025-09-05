import {
  ActionRowBuilder,
  Events,
  ModalSubmitInteraction,
  MessageActionRowComponentBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  SeparatorBuilder,
  TextDisplayBuilder,
  SectionBuilder,
  SeparatorSpacingSize,
} from "discord.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const NOTES_PER_PAGE = 3;

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: ModalSubmitInteraction) {
    if (!interaction.isModalSubmit()) return;
    if (!interaction.customId.startsWith("create-note-modal-")) return;

    const currentPage = Number(interaction.customId.split("-")[3]);
    const totalNotes = Number(interaction.customId.split("-")[4]);

    await interaction.deferUpdate();

    const title = interaction.fields.getField("title").value;
    const content = interaction.fields.getField("content").value;

    const note = await prisma.note.create({
      data: {
        title,
        content,
        createdBy: interaction.user.id,
      },
    });

    if (note) {
      const notas = await prisma.note.findMany({
        where: {
          createdBy: interaction.user.id,
        },
        take: NOTES_PER_PAGE,
        skip: currentPage * NOTES_PER_PAGE,
        orderBy: {
          createdAt: "desc",
        },
      });

      const components: (
        | ContainerBuilder
        | SeparatorBuilder
        | ActionRowBuilder<MessageActionRowComponentBuilder>
      )[] = [];

      const createButtonRow =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId(`notes-prev-${currentPage}`)
            .setLabel("<")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(currentPage === 0),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`create-note-${currentPage}-${totalNotes}`)
            .setLabel("Create"),
          new ButtonBuilder()
            .setCustomId(`notes-next-${currentPage}`)
            .setLabel(">")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled((currentPage + 1) * NOTES_PER_PAGE >= totalNotes)
        );

      if (notas.length === 0) {
        const noNotesContainer =
          new ContainerBuilder().addTextDisplayComponents(
            new TextDisplayBuilder().setContent("No notes found.")
          );
        components.push(noNotesContainer);
      } else {
        notas.forEach((nota, i) => {
          const noteContainer = new ContainerBuilder().addSectionComponents(
            new SectionBuilder()
              .setButtonAccessory(
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Secondary)
                  .setCustomId(`view-${nota.id}`)
                  .setLabel("View")
              )
              .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(nota.title),
                new TextDisplayBuilder().setContent(
                  `<t:${Math.floor(nota.createdAt.getTime() / 1000)}>`
                )
              )
          );
          components.push(noteContainer);
          if (notas.length > 1 && i !== notas.length - 1)
            components.push(
              new SeparatorBuilder()
                .setSpacing(SeparatorSpacingSize.Small)
                .setDivider(true)
            );
        });
      }

      components.push(createButtonRow);

      await interaction.editReply({
        components: components,
      });
    }
  },
};
