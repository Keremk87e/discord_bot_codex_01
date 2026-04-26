import { REST, Routes } from 'discord.js';
import { config } from '@packages/config';
import { getEnabledModules } from '@packages/modules';

const mode = process.argv[2] ?? 'guild';
const commands = getEnabledModules().flatMap((m) => m.commands.map((c) => c.data.toJSON()));
const rest = new REST({ version: '10' }).setToken(config.DISCORD_BOT_TOKEN);

async function main() {
  if (mode === 'global') {
    await rest.put(Routes.applicationCommands(config.DISCORD_CLIENT_ID), { body: commands });
    console.log('Registered global commands');
    return;
  }
  if (!config.DISCORD_TEST_GUILD_ID) throw new Error('DISCORD_TEST_GUILD_ID is required for guild registration.');
  await rest.put(Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, config.DISCORD_TEST_GUILD_ID), { body: commands });
  console.log('Registered guild commands');
}

main();
