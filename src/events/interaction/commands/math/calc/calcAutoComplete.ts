import { AutocompleteInteraction, Events, Interaction } from "discord.js";

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: Interaction) {
    if (!interaction.isAutocomplete()) return;
    if (interaction.options.getFocused(true).name !== "expression") return;

    const focusedValue = interaction.options.getFocused();

    let result = "";
    try {
      if (/^[0-9+\-*/().\s]+$/.test(focusedValue)) {
        result = eval(focusedValue).toString();
      } else if (!focusedValue) {
        result = "🦜 Enter a expression";
      } else {
        result = "❌ Invalid expression";
      }
    } catch {
      result = "❌ Invalid expression";
    }

    if (!result) result = "❌ Invalid expression";
    if (result.length > 100) result = result.slice(0, 97) + "...";

    await interaction.respond([
      {
        name: `${result}`,
        value: focusedValue,
      },
    ]);
  },
};
