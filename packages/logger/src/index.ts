import pino from 'pino';
import { config } from '@packages/config';

export const logger = pino({
  level: config.LOG_LEVEL,
  base: { app: config.BOT_SHORT_NAME, env: config.APP_ENV }
});

export const logCommandUsage = (command: string, guildId: string | null, userId: string) => {
  logger.info({ command, guildId, userId }, 'command_executed');
};

export const logError = (error: unknown, context: string) => {
  logger.error({ err: error, context }, 'application_error');
};
