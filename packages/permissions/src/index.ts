import { ChatInputCommandInteraction, GuildMember, PermissionFlagsBits } from 'discord.js';
import { config } from '@packages/config';
import { CooldownError, ModuleDisabledError, PermissionError } from '@packages/shared';

const cooldownMap = new Map<string, number>();

export const hasOwnerBypass = (userId: string): boolean => config.DISCORD_OWNER_IDS.includes(userId);

export const assertGuildAdmin = (member: GuildMember | null, userId: string) => {
  if (hasOwnerBypass(userId)) return;
  if (!member?.permissions.has(PermissionFlagsBits.Administrator)) throw new PermissionError('Administrator permission required.');
};

export const assertModuleEnabled = (enabled: boolean, moduleName: string) => {
  if (!enabled) throw new ModuleDisabledError(`${moduleName} module is disabled.`);
};

export const assertCooldown = (interaction: ChatInputCommandInteraction, key: string, seconds: number) => {
  const composed = `${interaction.user.id}:${key}`;
  const now = Date.now();
  const next = cooldownMap.get(composed) ?? 0;
  if (next > now) throw new CooldownError(`Try again in ${Math.ceil((next - now) / 1000)}s.`);
  cooldownMap.set(composed, now + seconds * 1000);
};
