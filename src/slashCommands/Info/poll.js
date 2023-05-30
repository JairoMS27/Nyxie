const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');
const pollschema = require('../../Schemas/poll');

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription('Crea una encuensta')
    .addStringOption(option => option
        .setName('topic')
        .setDescription('El topico de tu encuesta')
        .setMinLength(1)
        .setMaxLength(2000)
        .setRequired(true)    
    ),

    async execute (client, interaction) {

        await interaction.reply({content: `Tu encuesta ha sido publicada`, ephemeral: true });
        const topic = await interaction.options.getString('topic');

        const embed = new EmbedBuilder()
        .setColor(process.env.COLOR)
        .setAuthor({ name: '📃 Sistema de Encuestas'})
        .setFooter({ text: '📃 Encuesta Iniciada'})
        .setTimestamp()
        .setTitle(`📌 Encuesta`)
        .setDescription(`> ${topic}`)
        .addFields({ name: 'A Favor', value: `> ** Ningún voto**`, inline: true})
        .addFields({ name: 'En contra', value: `> ** Ningún voto**`, inline: true})
        .addFields({ name: 'Autor', value: `> ${interaction.user}`, inline: false})

        const buttons = new ActionRowBuilder()
        .addComponents(

            new ButtonBuilder()
            .setCustomId('up')
            .setLabel('✅')
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setCustomId('down')
            .setLabel('❌')
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setCustomId('votes')
            .setLabel('Votos')
            .setStyle(ButtonStyle.Secondary),
        )

        const msg = await interaction.channel.send({ embeds: [embed], components: [buttons] });
        msg.createMessageComponentCollector();

        await pollschema.create({
            Msg: msg.id,
            Upvote: 0,
            Downvote: 0,
            UpMembers: [],
            DownMembers: [],
            Guild: interaction.guild.id,
            Owner: interaction.user.id
        })


    }
}