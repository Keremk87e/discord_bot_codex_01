import { ChatInputCommandInteraction, ClientEvents, SlashCommandBuilder } from 'discord.js';

export type CommandHandler = (interaction: ChatInputCommandInteraction) => Promise<void>;
export type BotCommand = { data: SlashCommandBuilder; module: string; execute: CommandHandler; cooldownSeconds?: number };
export type BotEvent<K extends keyof ClientEvents = keyof ClientEvents> = {
  name: K;
  once?: boolean;
  execute: (...args: ClientEvents[K]) => Promise<void>;
};

export type BotModule = {
  name: string;
  description: string;
  defaultEnabled: boolean;
  commands: BotCommand[];
  events: BotEvent[];
};
