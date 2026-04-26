import { config } from '@packages/config';
import { createClient, registerModules, bindCoreEvents } from '@packages/discord-core';
import { getEnabledModules } from '@packages/modules';
import { connectDatabase, disconnectDatabase } from '@packages/database';
import { logger } from '@packages/logger';

const client = createClient();

async function bootstrap() {
  await connectDatabase();
  const modules = getEnabledModules();
  const events = registerModules(modules);
  bindCoreEvents(client);
  for (const event of events) {
    if (event.once) client.once(event.name, (...args) => void event.execute(...(args as never)));
    else client.on(event.name, (...args) => void event.execute(...(args as never)));
  }
  client.once('ready', () => logger.info({ user: client.user?.tag, modules: modules.map((m) => m.name) }, 'bot_ready'));
  await client.login(config.DISCORD_BOT_TOKEN);
}

const shutdown = async () => {
  logger.info('shutting_down');
  client.destroy();
  await disconnectDatabase();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

bootstrap().catch((err) => {
  logger.error({ err }, 'bot_bootstrap_failed');
  process.exit(1);
});
