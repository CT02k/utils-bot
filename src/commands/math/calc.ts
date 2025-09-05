import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
} from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("calc")
    .setDescription("[MATH] Calculate a math expression")
    .addStringOption((option) =>
      option
        .setName("expression")
        .setDescription("Your expression")
        .setRequired(true)
        .setAutocomplete(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const expr = interaction.options.getString("expression", true);

    let result = "";
    try {
      if (!/^[0-9+\-*/().\s]+$/.test(expr))
        throw new Error("❌ Invalid expression");
      result = eval(expr).toString();
    } catch {
      result = "❌ Invalid expression";
    }

    await interaction.reply({
      content: `\`${expr} = ${result}\``,
      flags: MessageFlags.Ephemeral,
    });
  },
};
