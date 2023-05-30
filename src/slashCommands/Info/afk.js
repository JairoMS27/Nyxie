const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const afkSchema = require('../../Schemas/afkSchema');

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription('Muestrate AFK.')
    .addSubcommand(command => command
        .setName('set')
        .setDescription('Muestrate AFK.')
        .addStringOption(option => option
            .setName('message')
            .setDescription('Redacta la razón.')
            .setRequired(false)    
        )    
    )
    .addSubcommand(command => command
        .setName('remove')
        .setDescription('Quita el modo AFK')    
    ),

    async execute(client, interaction) {

        const { options } = interaction;
        const sub = options.getSubcommand();
        const Data = await afkSchema.findOne({ Guild: interaction.guild.id, User: interaction.user.id});

        switch (sub) {
            case 'set':

                if (Data) return await interaction.reply({ content: 'Ya estas en modo AFK en este servidor.', ephemeral: true});
                else {
                    const message = options.getString('message');
                    const nickname = interaction.member.nickname || interaction.user.username;
                    await afkSchema.create({
                        Guild: interaction.guild.id,
                        User: interaction.user.id,
                        Message: message,
                        Nickname: nickname
                    })

                    const name = `[AFK] ${nickname}`;
                    await interaction.member.setNickname(`${name}`).catch(err => {
                        return;
                    })

                    const embed = new EmbedBuilder()
                    .setColor(process.env.COLOR)
                    .setDescription('✅ | Estas AFK! Manda un mensaje o usar /afk remove para quitar el AFK!')

                    await interaction.reply({ embeds: [embed], ephemeral: true});
                }
            break;

            case 'remove':

                if (!Data) return await interaction.reply({ content: 'No estas AFK en este servidor.', ephemeral: true});
                else {
                    const nick = Data.Nickname;
                    await afkSchema.deleteMany({ Guild: interaction.guild.id, User: interaction.user.id});

                    await interaction.member.setNickname(`${nick}`).catch(err => {
                        return;
                    })

                    const embed = new EmbedBuilder()
                    .setColor(process.env.COLOR)
                    .setDescription('✅ | Ya no estas en modo AFK!')

                    await interaction.reply({ embeds: [embed], ephemeral: true})
                }
        }
    }
}