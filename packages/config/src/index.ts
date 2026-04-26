import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ path: process.env.ENV_FILE ?? '.env' });

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  LOG_LEVEL: z.string().default('info'),
  APP_ENV: z.string(),
  DISCORD_BOT_TOKEN: z.string().min(1),
  DISCORD_CLIENT_ID: z.string().min(1),
  DISCORD_CLIENT_SECRET: z.string().min(1),
  DISCORD_PUBLIC_KEY: z.string().min(1),
  DISCORD_OWNER_IDS: z.string().min(1),
  DISCORD_TEST_GUILD_ID: z.string().optional(),
  BOT_NAME: z.string(), BOT_SHORT_NAME: z.string(), BOT_DESCRIPTION: z.string(), BOT_VERSION: z.string(),
  BOT_WEBSITE_URL: z.string().url(), BOT_SUPPORT_SERVER_URL: z.string().url(), BOT_INVITE_URL: z.string().url(),
  BOT_DOCS_URL: z.string().url(), BOT_TERMS_URL: z.string().url(), BOT_PRIVACY_URL: z.string().url(),
  BOT_PERSONALITY: z.string(), BOT_DEFAULT_TONE: z.string(), BOT_ERROR_TONE: z.string(), BOT_SUCCESS_TONE: z.string(), BOT_HELP_STYLE: z.string(),
  BOT_BRAND_COLOR: z.string(), BOT_ERROR_COLOR: z.string(), BOT_SUCCESS_COLOR: z.string(), BOT_WARNING_COLOR: z.string(), BOT_INFO_COLOR: z.string(),
  BOT_DEFAULT_EMBED_FOOTER: z.string(), BOT_DEFAULT_EMBED_ICON_URL: z.string().url(), BOT_LOGO_URL: z.string().url(), BOT_BANNER_URL: z.string().url(),
  DATABASE_URL: z.string().url(), REDIS_URL: z.string().url(),
  API_PORT: z.coerce.number().int().positive(), API_BASE_URL: z.string().url(), WEB_BASE_URL: z.string().url(),
  SESSION_SECRET: z.string().min(12), OAUTH_CALLBACK_URL: z.string().url(),
  ENABLE_MODERATION_MODULE: z.coerce.boolean(), ENABLE_AUTOMOD_MODULE: z.coerce.boolean(), ENABLE_LOGGING_MODULE: z.coerce.boolean(), ENABLE_WELCOME_MODULE: z.coerce.boolean(),
  ENABLE_TICKETS_MODULE: z.coerce.boolean(), ENABLE_REACTION_ROLES_MODULE: z.coerce.boolean(), ENABLE_ANALYTICS_MODULE: z.coerce.boolean(), ENABLE_PREMIUM_MODULE: z.coerce.boolean(),
  DEFAULT_COMMAND_COOLDOWN_SECONDS: z.coerce.number().int().positive(), MAX_WARNINGS_BEFORE_ACTION: z.coerce.number().int().positive(), DEFAULT_LOCALE: z.string(), DEFAULT_TIMEZONE: z.string(),
  WORKER_CONCURRENCY: z.coerce.number().int().positive(), QUEUE_PREFIX: z.string().min(1)
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${JSON.stringify(parsed.error.flatten().fieldErrors, null, 2)}`);
}

export const config = {
  ...parsed.data,
  DISCORD_OWNER_IDS: parsed.data.DISCORD_OWNER_IDS.split(',').map((id) => id.trim())
};

export type AppConfig = typeof config;
