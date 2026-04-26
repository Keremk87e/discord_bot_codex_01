import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { BotModule, errorEmbed, successEmbed } from '@packages/discord-core';
import { prisma } from '@packages/database';
import { assertGuildAdmin } from '@packages/permissions';
import { config } from '@packages/config';

const modOnly = (b: SlashCommandBuilder) => b.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);

async function recordCase(guildId: string, userId: string, moderatorId: string, action: string, reason?: string) {
  await prisma.guild.upsert({ where: { id: guildId }, update: {}, create: { id: guildId, name: guildId } });
  await prisma.moderationCase.create({ data: { guildId, userId, moderatorId, action, reason } });
}

export const moderationModule: BotModule = {
  name: 'moderation',
  description: 'Moderation actions and warning system.',
  defaultEnabled: true,
  events: [],
  commands: [
    { data: modOnly(new SlashCommandBuilder().setName('warn').setDescription('Warn user').addUserOption(o=>o.setName('user').setDescription('User').setRequired(true)).addStringOption(o=>o.setName('reason').setDescription('Reason'))), module: 'moderation', execute: async (i)=>{ assertGuildAdmin(i.member as any, i.user.id); const user=i.options.getUser('user',true); const reason=i.options.getString('reason')??'No reason'; const w=await prisma.warning.create({data:{guildId:i.guildId!, userId:user.id, moderatorId:i.user.id, reason}}); await recordCase(i.guildId!, user.id, i.user.id, 'WARN', reason); await i.reply({embeds:[successEmbed(`Warned ${user.tag}. Warning ID: ${w.id}`)]}); }},
    { data: modOnly(new SlashCommandBuilder().setName('warnings').setDescription('List warnings').addUserOption(o=>o.setName('user').setDescription('User').setRequired(true))), module:'moderation', execute: async (i)=>{ const user=i.options.getUser('user',true); const warnings=await prisma.warning.findMany({where:{guildId:i.guildId!, userId:user.id}, take:10, orderBy:{createdAt:'desc'}}); await i.reply({embeds:[successEmbed(warnings.length?warnings.map(w=>`${w.id}: ${w.reason ?? 'No reason'}`).join('\n'):'No warnings found')]});}},
    { data: modOnly(new SlashCommandBuilder().setName('clearwarnings').setDescription('Clear user warnings').addUserOption(o=>o.setName('user').setDescription('User').setRequired(true))), module:'moderation', execute: async (i)=>{ const user=i.options.getUser('user',true); const r=await prisma.warning.deleteMany({where:{guildId:i.guildId!, userId:user.id}}); await recordCase(i.guildId!, user.id, i.user.id, 'CLEAR_WARNINGS'); await i.reply({embeds:[successEmbed(`Cleared ${r.count} warning(s).`)]});}},
    { data: modOnly(new SlashCommandBuilder().setName('timeout').setDescription('Timeout user').addUserOption(o=>o.setName('user').setDescription('User').setRequired(true)).addIntegerOption(o=>o.setName('minutes').setDescription('Minutes').setRequired(true))), module:'moderation', execute: async (i)=>{ const m=await i.guild!.members.fetch(i.options.getUser('user',true).id); const minutes=i.options.getInteger('minutes',true); await m.timeout(minutes*60*1000, 'Timed out by command'); await recordCase(i.guildId!, m.id, i.user.id, 'TIMEOUT'); await i.reply({embeds:[successEmbed(`Timed out ${m.user.tag} for ${minutes} minutes.`)]});}},
    { data: modOnly(new SlashCommandBuilder().setName('untimeout').setDescription('Remove timeout').addUserOption(o=>o.setName('user').setDescription('User').setRequired(true))), module:'moderation', execute: async (i)=>{ const m=await i.guild!.members.fetch(i.options.getUser('user',true).id); await m.timeout(null); await recordCase(i.guildId!, m.id, i.user.id, 'UNTIMEOUT'); await i.reply({embeds:[successEmbed(`Removed timeout from ${m.user.tag}.`)]});}},
    { data: modOnly(new SlashCommandBuilder().setName('kick').setDescription('Kick user').addUserOption(o=>o.setName('user').setDescription('User').setRequired(true))), module:'moderation', execute: async (i)=>{ const m=await i.guild!.members.fetch(i.options.getUser('user',true).id); if(!m.kickable) return i.reply({embeds:[errorEmbed('User is not kickable.')], ephemeral:true}); await m.kick(); await recordCase(i.guildId!, m.id, i.user.id, 'KICK'); await i.reply({embeds:[successEmbed(`Kicked ${m.user.tag}.`)]});}},
    { data: modOnly(new SlashCommandBuilder().setName('ban').setDescription('Ban user').addUserOption(o=>o.setName('user').setDescription('User').setRequired(true))), module:'moderation', execute: async (i)=>{ const user=i.options.getUser('user',true); await i.guild!.members.ban(user.id); await recordCase(i.guildId!, user.id, i.user.id, 'BAN'); await i.reply({embeds:[successEmbed(`Banned ${user.tag}.`)]});}},
    { data: modOnly(new SlashCommandBuilder().setName('unban').setDescription('Unban user').addStringOption(o=>o.setName('userid').setDescription('User ID').setRequired(true))), module:'moderation', execute: async (i)=>{ const userId=i.options.getString('userid',true); await i.guild!.members.unban(userId); await recordCase(i.guildId!, userId, i.user.id, 'UNBAN'); await i.reply({embeds:[successEmbed(`Unbanned ${userId}.`)]});}},
    { data: modOnly(new SlashCommandBuilder().setName('purge').setDescription('Delete recent messages').addIntegerOption(o=>o.setName('count').setDescription('2-100').setRequired(true))), module:'moderation', execute: async (i)=>{ const count=i.options.getInteger('count',true); const ch=i.channel; if(!ch?.isTextBased() || !('bulkDelete' in ch)) return; await ch.bulkDelete(Math.min(Math.max(count,2),100), true); await recordCase(i.guildId!, i.user.id, i.user.id, 'PURGE', `count=${count}`); await i.reply({embeds:[successEmbed(`Purged ${count} messages.`)], ephemeral:true}); }}
  ].map((c)=> ({...c, cooldownSeconds: config.DEFAULT_COMMAND_COOLDOWN_SECONDS}))
};
