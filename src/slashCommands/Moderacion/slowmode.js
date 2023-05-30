const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription('Configura el modo lento de un canal. (Admin Only)')
    .addSubcommand(command => command
        .setName('on')
        .setDescription('Configura el modo lento de un canal.')
        .addIntegerOption(option => option
            .setName('duration')
            .setDescription('Duracion del modo lento. (segundos)')
            .setRequired(true)    
        )
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('Elige el canal que quieres poner en modo lento')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(false)    
        )
    )
    .addSubcommand(command => command
        .setName(`off`)
        .setDescription(`Desactiva el modo lento`)  
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('Elige el canal que quieres poner en modo lento')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(false)    
        )  
    ),

    async execute (client, interaction) {
        const { options } = interaction;
        const sub = options.getSubcommand();
        const duration = options.getInteger('duration');
        const channel = options.getChannel('channel') || interaction.channel;

        switch(sub) {

            case 'on':
                

                const embed = new EmbedBuilder()
                .setColor(process.env.COLOR)
                .setDescription(`✅ | ${channel} ahora esta en **modo lento** de ${duration} segundos.`)

                channel.setRateLimitPerUser(duration).catch(err => {
                    return;
                });

                await interaction.reply({embeds: [embed] });
            break;

            case 'off':

                const embed2 = new EmbedBuilder()
                .setColor(process.env.COLOR)
                .setDescription(`✅ | Se ha **desactivado** el modo lento en ${channel}.`)

                channel.setRateLimitPerUser(0).catch(err => {
                    return;
                });

                await interaction.reply({embeds: [embed2] });
                break;

        }
        
    }
}