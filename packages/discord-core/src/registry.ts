import { Collection, Events } from 'discord.js';
import { BotCommand, BotEvent, BotModule } from './types.js';
import { handleInteractionError } from './errors.js';
import { assertCooldown } from '@packages/permissions';
import { config } from '@packages/config';
import { logCommandUsage } from '@packages/logger';

export const commandCollection = new Collection<string, BotCommand>();

export const registerModules = (modules: BotModule[]) => {
  const events: BotEvent[] = [];
  for (const module of modules) {
    for (const command of module.commands) commandCollection.set(command.data.name, command);
    events.push(...module.events);
  }
  return events;
};

export const bindCoreEvents = (client: any) => {
  client.on(Events.InteractionCreate, async (interaction: any) => {
    if (!interaction.isChatInputCommand()) return;
    const command = commandCollection.get(interaction.commandName);
    if (!command) return;
    try {
      assertCooldown(interaction, command.data.name, command.cooldownSeconds ?? config.DEFAULT_COMMAND_COOLDOWN_SECONDS);
      await command.execute(interaction);
      logCommandUsage(command.data.name, interaction.guildId, interaction.user.id);
    } catch (error) {
      await handleInteractionError(interaction, error);
    }
  });
};
