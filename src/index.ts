import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import { loadEvents } from "./utils/bot/handlers/events";
import { loadCommands } from "./utils/bot/handlers/commands";
import { join } from "node:path";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
}).setMaxListeners(20);

const eventsPath = join(__dirname, "events");
loadEvents(client, eventsPath);

const commandsPath = join(__dirname, "commands");
loadCommands(client, commandsPath);

client.login(process.env.DISCORD_TOKEN);
