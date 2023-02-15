const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Send pong message!"),
  async execute (message){
    await message.reply("Pong!")
  }
}