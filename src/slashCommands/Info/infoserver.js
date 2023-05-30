const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription('Info del servidor'),
    async execute (client, interaction) {

        const { guild } = interaction;
        const { members } = guild;
        const { name, ownerId, createdTimestamp, memberCount } = guild;
        const icon = guild.iconURL();
        const roles = guild.roles.cache.size;
        const emojis = guild.emojis.cache.size;
        const id = guild.id;

        let baseVerification = guild.verificationLevel;

        if (baseVerification == 0) baseVerification = "Ninguno"
        if (baseVerification == 1) baseVerification = "Bajo"
        if (baseVerification == 2) baseVerification = "Medio"
        if (baseVerification == 3) baseVerification = "Alto"
        if (baseVerification == 4) baseVerification = "Muy Alto"

        const embed = new EmbedBuilder()
        .setColor(process.env.COLOR)
        .setThumbnail(icon)
        .setAuthor({ name: name, iconURL: icon })
        .setFooter({ text: `Server ID: ${id}` })
        .setTimestamp()
        .addFields({ name: "Nombre", value: `${name}`, inline: false })
        .addFields({ name: "Fecha de Creacion", value: `<t:${parseInt(createdTimestamp / 1000)}:R> (Ponte encima para más)`, inline: true})
        .addFields({ name: "Dueño del Server", value: `<@${ownerId}>`, inline: true})
        .addFields({ name: "Miembros del Server", value: `${memberCount}`, inline: true})
        .addFields({ name: "Número de Roles", value: `${roles}`, inline: true})
        .addFields({ name: "Número de Emojis", value: `${emojis}`, inline: true})
        .addFields({ name: "Nivel de Verificación", value: `${baseVerification}`, inline: true})
        .addFields({ name: "Server Boosts", value: `${guild.premiumSubscriptionCount}`, inline: true})

        await interaction.reply({ embeds: [embed]});
    }
}
