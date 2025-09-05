import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import { getRate } from "../../utils/exchange";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("exchange")
    .setDescription("[FINANCE]")
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("rate")
        .setDescription("[FINANCE] Get the exchange rate of a currency/crypto")
        .addStringOption((option) =>
          option.setName("amount").setDescription("Amount").setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("currency-from")
            .setDescription("From")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption((option) =>
          option
            .setName("currency-to")
            .setDescription("To")
            .setRequired(true)
            .setAutocomplete(true)
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const amount = interaction.options.getString("amount", true);
    const from = interaction.options.getString("currency-from", true);
    const to = interaction.options.getString("currency-to", true);

    const rate = await getRate(amount, from, to);

    await interaction.reply({
      content: `\`${rate.from.data.code} ${rate.from.data.amount}\` -> \`${rate.to.data.code} ${rate.rate}\``,
      flags: MessageFlags.Ephemeral,
    });
  },
};
