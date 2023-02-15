const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { token } = require("./config.json");
require("./system/register_slash_commands.js");

// Create a new client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Define commands
client.commands = new Collection()

const commandsPath = path.join(__dirname, "commands/slash");
const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandsFiles){
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Save command name and value into Collection 
  if ('data' in command && 'execute' in command){
    client.commands.set(command.data.name, command)
  }else{
    console.log(`[Alert] Command ${filePath} is missing required data or execute property`)
  }
}

client.once(Events.ClientReady, res => {
  console.log(`Sucessfully logged as ${res.user.tag}`)
})

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token)