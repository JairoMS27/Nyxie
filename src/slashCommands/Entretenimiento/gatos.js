const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const axios = require("axios")

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Genera Fotos de Michis."),

       async execute(client, interaction) {
        
        const respuesta = await axios.get('https://api.thecatapi.com/v1/images/search');
        const url = respuesta.data[0].url;
        const mensajeEmbed = new EmbedBuilder()
          .setTitle(`Aqui esta tu michi 🐈`)
          .setImage(url)
          .setColor(process.env.COLOR)
          .setFooter({text:`Pedido por ${interaction.user.tag}`})
          .setTimestamp()
        interaction.reply({ embeds: [mensajeEmbed] })
        
    } 
}