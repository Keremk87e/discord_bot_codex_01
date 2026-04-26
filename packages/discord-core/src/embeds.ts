import { EmbedBuilder } from 'discord.js';
import { config } from '@packages/config';

const c = (hex: string) => parseInt(hex.replace('#', ''), 16);

export const baseEmbed = () => new EmbedBuilder().setColor(c(config.BOT_BRAND_COLOR)).setFooter({ text: config.BOT_DEFAULT_EMBED_FOOTER, iconURL: config.BOT_DEFAULT_EMBED_ICON_URL });
export const successEmbed = (msg: string) => baseEmbed().setColor(c(config.BOT_SUCCESS_COLOR)).setDescription(msg);
export const errorEmbed = (msg: string) => baseEmbed().setColor(c(config.BOT_ERROR_COLOR)).setDescription(msg);
