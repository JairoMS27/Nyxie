const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDescription("Desbanea a un usuario (Admin Only)")
    .addUserOption(option => option
        .setName('user')
        .setDescription('Escribe el usuario que quieres desbanear')
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName('reason')
        .setDescription('Escribe la razon del desbaneo')
        .setRequired(true)
    ),

    async execute(client, interaction) {

        const userID = interaction.options.getUser('user');

        if (interaction.member.id === userID) return await interaction.reply({ content: "No puedes desbanearte a ti idiota", ephemeral: true});

        let reason = interaction.options.getString('reason');
        if (!reason) reason = "No has dado ninguna razon";

        const embed = new EmbedBuilder()
        .setColor(process.env.COLOR)
        .setDescription(`:white_check_mark: ${userID} ha sido desbaneado | ${reason}`)

        await interaction.guild.bans.fetch()
        .then(async bans => {

            if (bans.size == 0) return await interaction.reply({ content: "No hay nadie baneado en este server", ephemeral: true})
            let bannedID = bans.find(ban => ban.user.id == userID);
            if (!bannedID) return await interaction.reply({ content: "La ID proporcionada no esta baneada de este server", ephemeral: true})

            await interaction.guild.bans.remove(userID, reason).catch(err => {
                return interaction.reply({ content: "No puedo desbanear a este usuario"})
            })
        })

        await interaction.reply({ embeds: [embed]});

    }
}

