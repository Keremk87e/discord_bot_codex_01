import { Events, SlashCommandBuilder } from 'discord.js';
import { BotModule, successEmbed } from '@packages/discord-core';
import { prisma } from '@packages/database';

export const loggingModule: BotModule = {
  name: 'logging',
  description: 'Audit and event logging.',
  defaultEnabled: true,
  commands: [
    { data: new SlashCommandBuilder().setName('setlogchannel').setDescription('Set audit log channel').addChannelOption((o)=>o.setName('channel').setDescription('Channel').setRequired(true)), module: 'logging', execute: async (i) => {
      const channel = i.options.getChannel('channel', true);
      await prisma.guildConfig.upsert({ where: { guildId: i.guildId! }, update: { auditLogChannelId: channel.id }, create: { guildId: i.guildId!, auditLogChannelId: channel.id } });
      await i.reply({ embeds: [successEmbed(`Audit log channel set to <#${channel.id}>.`)] });
    } }
  ],
  events: [
    { name: Events.GuildMemberAdd, execute: async (member) => { await prisma.auditLog.create({ data: { guildId: member.guild.id, action: 'MEMBER_JOIN', actorId: member.id } }); } },
    { name: Events.GuildMemberRemove, execute: async (member) => { await prisma.auditLog.create({ data: { guildId: member.guild.id, action: 'MEMBER_LEAVE', actorId: member.id } }); } }
  ]
};
