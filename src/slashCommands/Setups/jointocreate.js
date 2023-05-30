const { SlashCommandBuilder, Client, PermissionFlagsBits, ChannelType, GuilVoice, EmbedBuilder } = require('discord.js');
const schema = require("../../Schemas/join-to-create");

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Configura un canal para el sistema join to create. (Admin Only)")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addSubcommand(command => command
        .setName('setup')
        .setDescription('Configura un canal para el sistema join to create.')
        .addChannelOption(option => option 
            .setName("channel")
            .setDescription("Elige el canal para activar el sistema")
            .addChannelTypes(ChannelType.GuildVoice)
            .setRequired(true)    
        )
        .addNumberOption(option => option
            .setName("userlimit")
            .setDescription("El numero de usuarios limite para todos los canales.")
            .setMinValue(1)
            .setMaxValue(99)
            .setRequired(true)  
        )
    )
    .addSubcommand(command => command
        .setName('disable')
        .setDescription('Desactiva el sistema join-to-create.')
    ),

    async execute(client, interaction) {
        const { guild, options } = interaction;
        const channel = options.getChannel("channel")
        const userlimit = options.getNumber("userlimit")
        const sub = options.getSubcommand();
        let data = await schema.findOne({ Guild: interaction.guild.id })

        switch (sub) {
            case 'setup':
                
                if (!data) {
                    data = new schema({
                        Guild: interaction.guild.id,
                        Channel: channel.id,
                        UserLimit: userlimit
                    })
        
                    await data.save()
        
                }
        
                const embed = new EmbedBuilder()
                embed.setColor(process.env.COLOR).setDescription("🔊 | El sistema join to create se ha configurado.");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            
            case 'disable':

                if (!data) return await interaction.reply({ content: 'No hay ningu sistema join to create activado!', ephemeral: true});
                else {

                    const embed2 = new EmbedBuilder()
                    .setColor(process.env.COLOR)
                    .setDescription('🔊 | El sistema join to create se ha **desactivado**!')

                    await schema.deleteMany({Guild: interaction.guild.id});

                    await interaction.reply({embeds: [embed2]});
                }
            break;
        }
        
    }
}