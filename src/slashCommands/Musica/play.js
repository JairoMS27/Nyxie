const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, VoiceChannel, GuildEmoji} = require('discord.js');

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription('🎧 Pon una cancion')
    .addStringOption(option => option 
        .setName('query')
        .setDescription('Escribe el nombre o URL de la canción. Soporto YT y Spotify')  
        .setRequired(true)  
    ),
    async execute(client, interaction) {
        const { options, member, guild, channel } = interaction;

        const query = options.getString("query");
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
            
            client.distube.play(voiceChannel, query, { textChannel: channel, member: member });
            return interaction.reply({ content: "🎶 Solicitud recibida."});

        } catch (err) {
            console.log(err);

            embed.setColor(process.env.COLOR).setDescription("⛔ | Algo salio mal...");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }


    }

}