import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AttachmentBuilder,
  SlashCommandSubcommandBuilder,
  MessageFlags,
} from "discord.js";
import { Jimp } from "jimp";
import jsQR from "jsqr";
import QRCode from "qrcode";

export const data = new SlashCommandBuilder()
  .setName("qrcode")
  .setDescription("[QRCODE] Generate or read QR Codes.")
  .addSubcommand(
    new SlashCommandSubcommandBuilder()
      .setName("read")
      .setDescription("[QRCODE] Reads a QR Code from an uploaded image.")
      .addAttachmentOption((opt) =>
        opt
          .setName("image")
          .setDescription("Image containing the QR Code.")
          .setRequired(true)
      )
  )
  .addSubcommand(
    new SlashCommandSubcommandBuilder()
      .setName("create")
      .setDescription("[QRCODE] Generate a QR Code from text/URL.")
      .addStringOption((opt) =>
        opt
          .setName("text")
          .setDescription("Text or URL to convert into a QR.")
          .setRequired(true)
      )
      .addStringOption((opt) =>
        opt
          .setName("ecc")
          .setDescription("Error correction level.")
          .addChoices(
            { name: "L (7%)", value: "L" },
            { name: "M (15%)", value: "M" },
            { name: "Q (25%)", value: "Q" },
            { name: "H (30%)", value: "H" }
          )
      )
      .addIntegerOption((opt) =>
        opt.setName("size").setDescription("QR scale (default: 8). Ex.: 4-20")
      )
      .addIntegerOption((opt) =>
        opt.setName("margin").setDescription("Margin in modules (default: 2).")
      )
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand();

  if (subcommand === "read") {
    const image = interaction.options.getAttachment("image", true);

    try {
      const jimpImage = await Jimp.read(image.url);
      const { data, width, height } = jimpImage.bitmap;

      const qr = jsQR(new Uint8ClampedArray(data), width, height);

      if (!qr) {
        await interaction.reply({
          content: "❌ No QR Code found in the image.",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      await interaction.reply({
        content: `\`\`\`\n${qr.data}\n\`\`\``,
        flags: MessageFlags.Ephemeral,
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: "❌ I couldn't read the QR Code from the image.",
        flags: MessageFlags.Ephemeral,
      });
    }
  } else if (subcommand === "create") {
    const text = interaction.options.getString("text", true);
    const ecc = (interaction.options.getString("ecc") ?? "M") as
      | "L"
      | "M"
      | "Q"
      | "H";
    const scale = interaction.options.getInteger("size") ?? 8;
    const margin = interaction.options.getInteger("margin") ?? 2;
    const ephemeral = interaction.options.getBoolean("ephemeral") ?? false;

    try {
      const pngBuffer = await QRCode.toBuffer(text, {
        errorCorrectionLevel: ecc,
        type: "png",
        scale,
        margin,
        color: { dark: "#000000", light: "#FFFFFF" },
      });

      const file = new AttachmentBuilder(pngBuffer, { name: "qrcode.png" });

      await interaction.reply({
        content: `ECC: **${ecc}** | Size: **${scale}** | Margin: **${margin}**\n\`${text}\``,
        flags: ephemeral ? MessageFlags.Ephemeral : undefined,
        files: [file],
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content:
          "❌ I couldn't generate the QR Code. Please check the text/URL and try again.",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
}
