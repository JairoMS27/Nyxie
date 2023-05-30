const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDescription("Banea a un usuario (Admin Only)")
    .addUserOption(option => option
        .setName('user')
        .setDescription('Escribe el usuario que quieres banear')
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName('reason')
        .setDescription('Escribe la razon del baneo')
        .setRequired(true)
    ),

    async execute(client, interaction) {

        const users = interaction.options.getUser('user');
        const ID = users.id;
        const banUser = client.users.cache.get(ID)

        if (interaction.member.id === ID) return await interaction.reply({ content: "No puedes banearte a ti idiota", ephemeral: true});

        let reason = interaction.options.getString('reason');
        if (!reason) reason = "No has dado ninguna razon";

        const dmEmbed = new EmbedBuilder()
        .setColor(process.env.COLOR)
        .setDescription(`:white_check_mark: Has sido baneado de **${interaction.guild.name}** | ${reason}`)

        const embed = new EmbedBuilder()
        .setColor(process.env.COLOR)
        .setDescription(`:white_check_mark: ${banUser.tag} ha sido baneado | ${reason}`)

        await interaction.guild.bans.create(banUser.id, {reason}).catch(err => {
            return interaction.reply({ content: "No puedo banear a ese usuario!", ephemeral: true})
        })

        await banUser.send({ embeds: [dmEmbed]}).catch(err => {
            return;
        })

        await interaction.reply({ embeds: [embed] });

    }
}

