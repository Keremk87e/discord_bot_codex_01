import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, Events, SlashCommandBuilder } from 'discord.js';
import { BotModule, successEmbed } from '@packages/discord-core';
import { prisma } from '@packages/database';

const BTN_ID='ticket:create';

export const ticketsModule: BotModule = {
  name: 'tickets', description: 'Ticketing workflows.', defaultEnabled: true,
  commands: [
    { data: new SlashCommandBuilder().setName('ticket').setDescription('Ticket commands').addSubcommand(s=>s.setName('setup').setDescription('Post ticket setup panel')).addSubcommand(s=>s.setName('close').setDescription('Close current ticket')), module:'tickets', execute: async (i)=>{
      const sub=i.options.getSubcommand();
      if(sub==='setup'){ const row=new ActionRowBuilder<ButtonBuilder>().addComponents(new ButtonBuilder().setCustomId(BTN_ID).setLabel('Create Ticket').setStyle(ButtonStyle.Primary)); await i.reply({content:'Ticket panel ready.',components:[row]}); return; }
      const t=await prisma.ticket.findFirst({where:{channelId:i.channelId, status:'OPEN'}}); if(!t){ await i.reply({embeds:[successEmbed('No open ticket in this channel.')],ephemeral:true}); return; }
      await prisma.ticket.update({where:{id:t.id},data:{status:'CLOSED'}}); await i.reply({embeds:[successEmbed('Ticket closed. Transcript generation is scaffolded.')]});
    }}
  ],
  events: [
    { name: Events.InteractionCreate, execute: async (interaction: any) => {
      if (!interaction.isButton() || interaction.customId !== BTN_ID || !interaction.guild) return;
      const channel = await interaction.guild.channels.create({ name: `ticket-${interaction.user.username}`.slice(0, 90), type: ChannelType.GuildText });
      await prisma.ticket.create({ data: { guildId: interaction.guild.id, userId: interaction.user.id, channelId: channel.id } });
      await interaction.reply({ embeds: [successEmbed(`Ticket created: <#${channel.id}>`)], ephemeral: true });
    } }
  ]
};
