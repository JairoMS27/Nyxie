const { EmbedBuilder, SlashCommandBuilder} = require('discord.js');

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("🎧 Muestra las opciones de bucle.")
    .addStringOption(option => option
        .setName("options")
        .setDescription("Opciones de bucle: apagado, cancion, cola")
        .addChoices(
            { name: "apagado", value: "off" },
            { name: "cancion", value: "song" },
            { name: "cola", value: "queue" },
        )
        .setRequired(true)
    ),
    async execute(client, interaction, args, prefix, GUILD_DATA) {
        const { member, options, guild } = interaction;
        const option = options.getString("options");
        const voiceChannel = member.voice.channel;

        const embed = new EmbedBuilder()

        if (!voiceChannel)  {
            embed.setColor(process.env.COLOR).setDescription("Tienes que estar en un canal de voz para reproducir música.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (!member.voice.channelId == guild.members.me.voice.channelId) {
            embed.setColor(process.env.COLOR).setDescription(`No puedes reporducir musica porque ya estoy en <#${guild.members.me.voice.channelId}`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        try {
            const queue = await client.distube.getQueue(voiceChannel);

            if (!queue) {
                embed.setColor(process.env.COLOR).setDescription("No hay ninguna cola activa.");
                return interaction.reply({ embeds: [embed], ephemeral:true });
            }

            let mode = null;

            switch (option) {
                case "off":
                    mode = 0;
                    break;
                case "song":
                    mode = 1;
                    break;
                case "queue":
                    mode = 2;
                    break;

            }

            mode = await queue.setRepeatMode(mode);

            mode = mode ? (mode === 2? "Repetir cola" : "Repetir canción") : "Apagado";

            embed.setColor(process.env.COLOR).setDescription(`🔁 Bucle: \`${mode}\`.`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (err) {
            console.log(err);

            embed.setColor(process.env.COLOR).setDescription("⛔ | Algo salio mal...");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        
    }
}