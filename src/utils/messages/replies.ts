import { PrismaClient } from "@prisma/client";
import {
  SeparatorBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  SectionBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
  MessageFlags,
} from "discord.js";

const prisma = new PrismaClient();
const NOTES_PER_PAGE = 3;

export class Reply {
  async notes(userId: string, currentPage = 0) {
    const totalNotes = await prisma.note.count({
      where: { createdBy: userId },
    });
    const notas = await prisma.note.findMany({
      where: { createdBy: userId },
      take: NOTES_PER_PAGE,
      skip: currentPage * NOTES_PER_PAGE,
      orderBy: { createdAt: "desc" },
    });

    const components: (
      | ContainerBuilder
      | SeparatorBuilder
      | ActionRowBuilder<any>
    )[] = [];

    if (notas.length === 0) {
      const noNotesContainer = new ContainerBuilder().addTextDisplayComponents(
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

    components.push(
      new ActionRowBuilder<ButtonBuilder>().addComponents(
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
      )
    );

    return { components, totalNotes };
  }

  async viewNote(noteId: number) {
    const note = await prisma.note.findUnique({ where: { id: noteId } });
    if (!note) return null;

    const components = [
      new TextDisplayBuilder().setContent(`**${note.title}**`),

      new ContainerBuilder().addTextDisplayComponents(
        new TextDisplayBuilder().setContent(note.content)
      ),

      new ActionRowBuilder<ButtonBuilder>().addComponents(
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

    return { components };
  }
}
