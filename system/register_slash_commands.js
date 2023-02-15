const { REST, Routes } = require("discord.js");
const fs = require("fs");
const { token, clientId, guildId } = require("../config.json");

const commands = [];

const commandFile = fs.readdirSync("./commands/slash").filter(file => file.endsWith(".js"));

for(file of commandFile){
  const command = require(`../commands/slash/${file}`);
  commands.push(command.data.toJSON());
}

const res = new REST({ version: 10 }).setToken(token);

// Deploy all commands
(async() => {
  try{
    console.log(`[Reoload] Starting refreshing ${commands.length} application (/) commands..`)
    
    const data = res.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands },
      )
    
    console.log(`[Success] Successfully reloaded ${commands.length} application (/) commamds.`)
  }catch (e){
    console.log(e)
  }
})()