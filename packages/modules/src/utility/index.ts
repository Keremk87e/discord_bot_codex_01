import { SlashCommandBuilder } from 'discord.js';
import { BotModule, baseEmbed } from '@packages/discord-core';

export const utilityModule: BotModule = {
  name: 'utility', description: 'Utility commands.', defaultEnabled: true, events: [],
  commands: [
    { data: new SlashCommandBuilder().setName('avatar').setDescription('Get user avatar').addUserOption(o=>o.setName('user').setDescription('Target user')), module:'utility', execute: async (i)=>{ const u=i.options.getUser('user')??i.user; await i.reply({embeds:[baseEmbed().setTitle(`${u.username}'s avatar`).setImage(u.displayAvatarURL({size:1024}))]});}},
    { data: new SlashCommandBuilder().setName('roleinfo').setDescription('Role information').addRoleOption(o=>o.setName('role').setDescription('Role').setRequired(true)), module:'utility', execute: async (i)=>{ const r=i.options.getRole('role',true); await i.reply({embeds:[baseEmbed().setTitle('Role Info').setDescription(`Name: ${r.name}\nID: ${r.id}`)]});}},
    { data: new SlashCommandBuilder().setName('botstatus').setDescription('Platform status'), module:'utility', execute: async (i)=>{ await i.reply({embeds:[baseEmbed().setTitle('Status').setDescription('Bot: Online\nAPI: Operational\nWorker: Operational')]});}}
  ]
};
