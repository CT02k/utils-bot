import { AutocompleteInteraction, Events, Interaction } from "discord.js";
import { getCurrencies } from "../../../../../utils/exchange";

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: Interaction) {
    if (!interaction.isAutocomplete()) return;
    if (!interaction.options.getFocused(true).name.startsWith("currency"))
      return;

    const focusedValue = interaction.options.getFocused();

    const currency = await getCurrencies(focusedValue);
    const result = currency.map((c) => {
      return {
        name: `${c.data.name} (${c.code})`,
        value: c.code,
      };
    });

    await interaction.respond(result);
  },
};
