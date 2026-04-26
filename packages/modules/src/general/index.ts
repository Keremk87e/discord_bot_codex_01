import { SlashCommandBuilder } from 'discord.js';
import { BotModule, baseEmbed } from '@packages/discord-core';
import { config } from '@packages/config';

export const generalModule: BotModule = {
  name: 'general',
  description: 'General utility and onboarding commands.',
  defaultEnabled: true,
  events: [],
  commands: [
    { data: new SlashCommandBuilder().setName('ping').setDescription('Check bot latency.'), module: 'general', execute: async (i) => i.reply({ embeds: [baseEmbed().setTitle('Pong').setDescription(`Gateway latency: ${i.client.ws.ping}ms`)] }) },
    { data: new SlashCommandBuilder().setName('help').setDescription('Show help and module overview.'), module: 'general', execute: async (i) => i.reply({ embeds: [baseEmbed().setTitle(`${config.BOT_NAME} Help`).setDescription('Use slash commands to manage and protect your server.')] }) },
    { data: new SlashCommandBuilder().setName('about').setDescription('Show bot identity and links.'), module: 'general', execute: async (i) => i.reply({ embeds: [baseEmbed().setTitle(config.BOT_NAME).setDescription(config.BOT_DESCRIPTION).addFields({ name: 'Website', value: config.BOT_WEBSITE_URL }, { name: 'Support', value: config.BOT_SUPPORT_SERVER_URL })] }) },
    { data: new SlashCommandBuilder().setName('serverinfo').setDescription('Show current server info.'), module: 'general', execute: async (i) => i.reply({ embeds: [baseEmbed().setTitle('Server Info').setDescription(`Name: ${i.guild?.name}\nMembers: ${i.guild?.memberCount ?? 0}`)] }) },
    { data: new SlashCommandBuilder().setName('userinfo').setDescription('Show user info').addUserOption((o)=>o.setName('user').setDescription('User').setRequired(false)), module: 'general', execute: async (i) => { const user=i.options.getUser('user')??i.user; await i.reply({ embeds:[baseEmbed().setTitle('User Info').setDescription(`Tag: ${user.tag}\nID: ${user.id}`)]}); } }
  ]
};
