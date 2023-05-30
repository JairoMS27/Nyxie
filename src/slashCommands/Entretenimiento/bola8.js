const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("🎱 Agita la bola 8")
    .addStringOption(option => option
        .setName('question')
        .setDescription('Preguntale a la bola tu preocupación')
        .setRequired(true)    
    ),

    async execute (client, interaction) {
        const { options } = interaction;
        
        const question = options.getString('question');
        const choice = ["🎱| Es cierto.", "🎱| Definitivamente si.", "🎱| Correcto.", "🎱| Doy fe.", "🎱| No es cierto.", "🎱| Es erroneo.", "🎱| Es mentira.", "🎱| No tienes razon.", "🎱| Dani es gay." ]
        const ball = Math.floor(Math.random() * choice.length);

        const embed = new EmbedBuilder()
        .setColor(process.env.COLOR)
        .setTitle(`🎱| Bola 8`)
        .addFields({ name: "Pregunta: ", value: `${question}`, inline: true})
        
        const embed2 = new EmbedBuilder()
        .setColor(process.env.COLOR)
        .setTitle(`🎱| Bola 8`)
        .addFields({ name: "Pregunta: ", value: `${question}`, inline: true})
        .addFields({ name: "Respuesta: ", value: `${choice[ball]}`, inline: true})

        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('button')
            .setLabel(`🎱 Agita la bola!!`)
            .setStyle(ButtonStyle.Primary)
        )

        const msg = await interaction.reply({ embeds: [embed], components: [button]});
        const collector = msg.createMessageComponentCollector()

        collector.on('collect', async i => {
            if (i.customId == 'button') {
                i.update({ embeds: [embed2], components: [] })
            }
        })
    }
}