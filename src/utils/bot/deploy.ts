import fs from "node:fs";
import path from "node:path";
import { REST, Routes } from "discord.js";

const commandsArray: any[] = [];
const commandsPath = path.join(__dirname, "../../commands");

console.log("\n.......... DEPLOY ....................");

for (const folder of fs.readdirSync(commandsPath)) {
  const folderPath = path.join(commandsPath, folder);
  for (const file of fs
    .readdirSync(folderPath)
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"))) {
    const cmd = require(path.join(folderPath, file));
    if (cmd?.data?.toJSON) commandsArray.push(cmd.data.toJSON());
  }
}

export async function deployCommands() {
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);
  try {
    console.log(`🚀 Deploying ${commandsArray.length} slash commands...`);
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
      body: commandsArray,
    });
    console.log("✅ Commands successfully deployed");
  } catch (err) {
    console.error(err);
  }
  console.log(".......... DEPLOY ....................\n");
}
