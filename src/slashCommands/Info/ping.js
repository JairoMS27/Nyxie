const {SlashCommandBuilder} = require('discord.js');
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Pong!"),

    async execute(client, interaction, prefix){
        return interaction.reply(`\`${client.ws.ping}ms\``)
    }
}