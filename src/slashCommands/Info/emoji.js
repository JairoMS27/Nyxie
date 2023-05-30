const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { default: axios} = require(`axios`);

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageEmojisAndStickers)
    .setDescription("Añade emojis de otro server aqui (Admin Only)")
    .addStringOption(option => option
        .setName('emoji')
        .setDescription('Pon el emoji que quieres añadir')
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName('name')
        .setDescription('Escribe el nombre del emoji')
        .setRequired(true)
    ),

    async execute(client, interaction) {

        let emoji = interaction.options.getString(`emoji`)?.trim();
        const name = interaction.options.getString('name');

        if (emoji.startsWith("<") && emoji.endsWith(">")) {
            const id = emoji.match(/\d{15,}/g)[0];

            const type = await axios.get(`https://cdn.discordapp.com/emojis/${id}.gif`)
            .then(image => {
                if (image) return "gif"
                else return "png"
            }).catch(err => {
                return "png"
            })

            emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`
        }

        if (!emoji.startsWith("http")) {
            return await interaction.reply({ content: "No puedes añadir emojis default!"})
        }

        if (!emoji.startsWith("https")) {
            return await interaction.reply({ content: "No puedes añadir emojis default!"})
        }

        interaction.guild.emojis.create({ attachment: `${emoji}`, name: `${name}`})
        .then(emoji => {
            const embed = new EmbedBuilder()
            .setColor(process.env.COLOR)
            .setDescription(`Añadido ${emoji}, con el nombre "**${name}**"`)

            return interaction.reply({ embeds: [embed] });
        }).catch(err => {
            interaction.reply({ content: "No puedes añadir mas emojis porque ya no se pueden añadir mas al servidor", ephemeral: true})
        })
    }
}