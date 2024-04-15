const fs = require('fs');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const dotenv = require('dotenv').config();

const token = process.env.token;
const guildId = process.env.guildId;
const guildId2 = process.env.guildId2;
const clientId = process.env.clientId;
const status = process.env.BOT_STATUS || 'sudoku'

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessageReactions
	]
});


//Loading Commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}
// Sending commands
const commands = [];

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands for main server.'))
	.catch(console.error);

rest.put(Routes.applicationGuildCommands(clientId, guildId2), { body: commands })
	.then(() => console.log('Successfully registered application commands for Second server.'))
	.catch(console.error);

client.once('ready', async () => {

	console.log('Ready!');
	client.user.setPresence({
		activities: [{ name: status, type: 0 }], // Type 0 is for "Playing", you can change it to other activity types
		status: 'online'
	});

});



client.on('interactionCreate', async interaction => {

	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);

