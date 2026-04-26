import Fastify from 'fastify';
import { config } from '@packages/config';
import { logger } from '@packages/logger';
import { prisma } from '@packages/database';

const app = Fastify({ logger: false });

app.get('/health', async () => ({ ok: true, env: config.APP_ENV }));
app.get('/status', async () => {
  const guilds = await prisma.guild.count();
  return { botName: config.BOT_NAME, version: config.BOT_VERSION, guilds, modules: { moderation: config.ENABLE_MODERATION_MODULE, tickets: config.ENABLE_TICKETS_MODULE } };
});

app.listen({ port: config.API_PORT, host: '0.0.0.0' }).then(()=> logger.info(`api_started:${config.API_PORT}`));
