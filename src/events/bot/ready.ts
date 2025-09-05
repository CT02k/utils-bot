import { Client, Events } from "discord.js";
import { deployCommands } from "../../utils/bot/deploy";

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client) {
    console.log(`[🤖 READY] Logged in ${client.user?.tag}`);
    await deployCommands();
  },
};
