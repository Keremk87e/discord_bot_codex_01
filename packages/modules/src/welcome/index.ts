import { Events, SlashCommandBuilder } from 'discord.js';
import { BotModule, baseEmbed, successEmbed } from '@packages/discord-core';
import { prisma } from '@packages/database';

export const welcomeModule: BotModule = {
  name: 'welcome',
  description: 'Welcome experience for new members.',
  defaultEnabled: true,
  commands: [
    { data: new SlashCommandBuilder().setName('setwelcome').setDescription('Set welcome channel and template').addChannelOption((o)=>o.setName('channel').setDescription('Channel').setRequired(true)).addStringOption((o)=>o.setName('template').setDescription('Template with {user} and {server}').setRequired(false)), module: 'welcome', execute: async (i)=>{
      const channel=i.options.getChannel('channel',true); const template=i.options.getString('template') ?? 'Welcome {user} to {server}!';
      await prisma.guildConfig.upsert({ where:{guildId:i.guildId!}, update:{welcomeChannelId:channel.id, welcomeMessageTemplate:template}, create:{guildId:i.guildId!, welcomeChannelId:channel.id, welcomeMessageTemplate:template}});
      await i.reply({embeds:[successEmbed('Welcome settings updated.')]});
    }}
  ],
  events: [
    { name: Events.GuildMemberAdd, execute: async (member) => {
      const cfg = await prisma.guildConfig.findUnique({ where: { guildId: member.guild.id } });
      if (!cfg?.welcomeChannelId) return;
      const channel = await member.guild.channels.fetch(cfg.welcomeChannelId);
      if (channel?.isTextBased()) {
        const text = (cfg.welcomeMessageTemplate ?? 'Welcome {user} to {server}!').replace('{user}', `<@${member.id}>`).replace('{server}', member.guild.name);
        await channel.send({ embeds: [baseEmbed().setTitle('Welcome').setDescription(text)] });
      }
    } }
  ]
};
