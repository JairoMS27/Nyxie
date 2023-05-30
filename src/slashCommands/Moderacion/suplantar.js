const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription('Manda un mensaje con el nombre de un usuario. (Admin Only)')
    .addUserOption(option => option
        .setName('user')
        .setDescription('Usuario al que quieres suplantar')
        .setRequired(true)    
    )
    .addStringOption(option => option
        .setName('message')
        .setDescription('Mensaje que quieres mandar')
        .setRequired(true)    
    ),
    async execute (client, interaction) {

        const { options } = interaction;
        const member = options.getUser('user');
        const message = options.getString('message');

        await interaction.channel.createWebhook({
            name: member.username,
            avatar: member.displayAvatarURL({ dynamic: true })
        }).then((webhook) => {
            webhook.send({ content: message });
            setTimeout(() => {
                webhook.delete();
            }, 3000)
        });

        await interaction.reply({ content: `El mensaje con el usuario ${member} ha sido enviado!`, ephemeral: true});
    }
}