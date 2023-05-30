const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, VoiceChannel, GuildEmoji} = require('discord.js');

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription('🎧 Cambia el volumen de la cancion')
    .addIntegerOption(option => option 
        .setName('volume')
            .setDescription('Entre 1 y 100')
            .setMinValue(1)
            .setMaxValue(100)
            .setRequired(true)  
    ),
    async execute(client, interaction) {
        const { member, guild, options } = interaction;
        const volume = options.getInteger("volume");

        const voiceChannel = member.voice.channel;

        const embed = new EmbedBuilder();

        if (!voiceChannel) {
            embed.setColor(process.env.COLOR).setDescription("Tienes que estar en un canal de voz para reproducir música.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (!member.voice.channelId == guild.members.me.voice.channelId) {
            embed.setColor(process.env.COLOR).setDescription(`No puedes reporducir musica porque ya estoy en <#${guild.members.me.voice.channelId}`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        try {

            client.distube.setVolume(voiceChannel, volume);
            return interaction.reply({ content: `🔉 Volumen puesto al ${volume}%.`});

        } catch (err) {
            console.log(err);

            embed.setColor(process.env.COLOR).setDescription("⛔ | Algo salio mal...");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }


    }

}