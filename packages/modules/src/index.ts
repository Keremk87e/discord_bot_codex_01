import { BotModule } from '@packages/discord-core';
import { config } from '@packages/config';
import { generalModule } from './general/index.js';
import { moderationModule } from './moderation/index.js';
import { utilityModule } from './utility/index.js';
import { loggingModule } from './logging/index.js';
import { welcomeModule } from './welcome/index.js';
import { ticketsModule } from './tickets/index.js';

const all: BotModule[] = [generalModule, utilityModule, moderationModule, loggingModule, welcomeModule, ticketsModule];

export const getEnabledModules = (): BotModule[] => all.filter((m) => {
  if (m.name === 'moderation') return config.ENABLE_MODERATION_MODULE;
  if (m.name === 'logging') return config.ENABLE_LOGGING_MODULE;
  if (m.name === 'welcome') return config.ENABLE_WELCOME_MODULE;
  if (m.name === 'tickets') return config.ENABLE_TICKETS_MODULE;
  return true;
});
