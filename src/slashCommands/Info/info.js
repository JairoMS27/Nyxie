const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Descubre sobre mi"),
    async execute (client, interaction) {
        const name = "Nyxie";
        const icon = `${client.user.displayAvatarURL()}`;
        let servercount = await client.guilds.cache.reduce((a,b) => a+b.memberCount, 0);

        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        let uptime = `${days} días, ${hours} horas, ${minutes} minutos & ${seconds} segundos`;

        let ping = `${Date.now() - interaction.createdTimestamp}ms.`

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setLabel('Buy me a Coffee')
            .setStyle(ButtonStyle.Link)
            .setURL('https://www.buymeacoffee.com/ejemplo'),

            new ButtonBuilder()
            .setLabel('Invita al bot')
            .setStyle(ButtonStyle.Link)
            .setURL('https://discord.com/oauth2/authorize?client_id=1075757342756454430&permissions=1619168586999&scope=bot')
        )

        const embed = new EmbedBuilder()
        .setColor(process.env.COLOR)
        .setAuthor({ name: name, iconURL: icon})
        .setThumbnail(`${icon}`)
        .setFooter({ text: "© Ejemplo#1234"})
        .setTimestamp()
        .addFields({ name: 'Servidores', value: `${client.guilds.cache.size}`, inline: true})
        .addFields({ name: 'Usuarios', value: `${servercount}`, inline: true})
        .addFields({ name: 'Latencia', value: `${ping}`, inline: true})
        .addFields({ name: 'Encendido', value: `\`\`\`${uptime}\`\`\``, inline: true})

        await interaction.reply({ embeds: [embed], components: [row]});
    }
}