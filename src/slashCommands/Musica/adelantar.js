const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, VoiceChannel, GuildEmoji} = require('discord.js');

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription('🎧 Adelanta segundos en la cancion')
    .addIntegerOption(option => option
        .setName("seconds")
        .setDescription("Cantidad de segundos que quieres adelantar")
        .setMinValue(0)
        .setRequired(true)   
    ),
    async execute(client, interaction) {
        const { options, member, guild } = interaction;
        const seconds = options.getInteger("seconds");
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
            
            await queue.seek(queue.currentTime + seconds);
            embed.setColor(process.env.COLOR).setDescription(`⏩ La cancion se adelantó \`${seconds}s\`.`);
            return interaction.reply({ embeds: [embed], ephemeral: true});

        } catch (err) {
            console.log(err);

            embed.setColor(process.env.COLOR).setDescription("⛔ | Algo salio mal...");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }


    }

}