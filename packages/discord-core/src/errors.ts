import { ChatInputCommandInteraction } from 'discord.js';
import { errorEmbed } from './embeds.js';
import { logError } from '@packages/logger';

export const handleInteractionError = async (interaction: ChatInputCommandInteraction, error: unknown) => {
  logError(error, 'interaction');
  const reply = { embeds: [errorEmbed('Request failed. Please try again or contact an admin.')], ephemeral: true };
  if (interaction.replied || interaction.deferred) await interaction.followUp(reply);
  else await interaction.reply(reply);
};
