import { CommandInteraction, CacheType } from "discord.js";

export interface BotCommand {
  data: { name: string; toJSON(): object };
  execute: (interaction: CommandInteraction<CacheType>) => Promise<void>;
}

export interface BotEvent {
  name: string;
  once?: boolean;
  execute: (...args: any[]) => Promise<void> | void;
}
