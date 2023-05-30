const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDescription('Desbanea a TODOS los usuarios del servidor. (Admin Only)'),
    async execute (client, interaction) {

        const { options, guild } = interaction;
        const users = await interaction.guild.bans.fetch();
        const ids = users.map(u => u.user.id);

        if (!users) return await interaction.reply({ content: `No hay ningun usuario baneado en este servidor`, ephemeral: true});

        await interaction.reply({ content: '⚙️ Desbaneando a todos los usuarios de tu servidor, puedo tardar un poco si hay muchos usuarios baneados...'});

        for (const id of ids) {
            await guild.members.unban(id)
            .catch(err => {
                return interaction.editReply({ content: `${err.rawError}`});
            });
        }

        const embed = new EmbedBuilder()
        .setColor(process.env.COLOR)
        .setDescription(`✅ | ${ids.length} usuarios han sido **desbaneados** de este servidor`)

        await interaction.editReply({ content: '', embeds: [embed]});
    }
}