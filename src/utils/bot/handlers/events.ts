import { Client } from "discord.js";
import { readdirSync, statSync } from "fs";
import { join } from "path";

interface Event {
  name: string;
  once?: boolean;
  execute: (...args: any[]) => void;
}

export function loadEvents(client: Client, eventsPath: string) {
  const loadDir = (dir: string) => {
    const files = readdirSync(dir);

    for (const file of files) {
      const filePath = join(dir, file);
      const stat = statSync(filePath);

      if (stat.isDirectory()) {
        loadDir(filePath);
      } else if (file.endsWith(".ts") || file.endsWith(".js")) {
        const event: Event = require(filePath).default || require(filePath);

        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args));
        } else {
          client.on(event.name, (...args) => event.execute(...args));
        }
        console.log(`[🟡 EVENT LOADED] ${event.name}`);
      }
    }
  };

  console.log("\n.......... EVENTS ....................");
  loadDir(eventsPath);
  console.log("✅ ALL EVENTS LOADED");
  console.log(".......... EVENTS ....................\n");
}
