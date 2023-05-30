const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription('🎧 Muestra lo que estas reproduciendo'),
    async execute(client, interaction) {
        const { member, guild } = interaction;
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

            const queue = await client.distube.getQueue(voiceChannel);

            if(!queue) {
                embed.setColor(process.env.COLOR).setDescription('No hay ninguna cola activa.');
                return interaction.reply({ embeds: [embed], ephemeral: true});
            }

            const song = queue.songs[0];
            embed.setColor(process.env.COLOR).setDescription(`🎵 **Reproduciendo:** \`${song.name}\` - \`${song.formattedDuration}\`.\n**Link:** ${song.url}`).setThumbnail(song.thumbnail);
            return interaction.reply({ embeds: [embed], ephemeral: true});

        } catch (err) {
            console.log(err);

            embed.setColor(process.env.COLOR).setDescription("⛔ | Algo salio mal...");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }


    }

}