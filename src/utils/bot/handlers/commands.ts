import { Client, Collection } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";

interface Command {
  data: { name: string; description: string };
  execute: (...args: any[]) => Promise<void> | void;
}

declare module "discord.js" {
  export interface Client {
    commands: Collection<string, Command>;
  }
}

export function loadCommands(client: Client, commandsPath: string) {
  client.commands = new Collection();
  const commandFolders = readdirSync(commandsPath);

  console.log("\n.......... COMMANDS ....................");

  for (const folder of commandFolders) {
    const folderPath = join(commandsPath, folder);
    const commandFiles = readdirSync(folderPath).filter(
      (file) => file.endsWith(".ts") || file.endsWith(".js")
    );

    for (const file of commandFiles) {
      const filePath = join(folderPath, file);
      const command: Command = require(filePath);

      if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
        console.log(`[🟡 COMMAND LOADED] ${command.data.name}`);
      } else {
        console.log(
          `[🟡 WARNING] The command at ${filePath} is missing a required data or execute property.`
        );
      }
    }
  }
  console.log("✅ ALL COMMANDS LOADED");
  console.log(".......... COMMANDS ....................\n");
}
