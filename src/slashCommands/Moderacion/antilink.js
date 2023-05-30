const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const linkSchema = require('../../Schemas/link');

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDescription('Configura y deshabilita el sistema de anti-links de invitaciones (Admin Only)')
    .addSubcommand(command => command
        .setName('setup')
        .setDescription('Configura el sistema anti-link para borrar todos los links!')
        .addStringOption(option => option
            .setName('permissions')
            .setRequired(true)
            .setDescription('Elige que permisos pueden evitar el sistema anti-links')
            .addChoices(
                { name: 'Gestionar Canales', value: 'ManageChannels'},
                { name: 'Gestionar Servidor', value: 'ManageGuild'},
                { name: 'Embed Links', value: 'EmbedLinks'},
                { name: 'Adjuntar Archivos', value: 'AttachFiles'},
                { name: 'Gestionar Mensajes', value: 'ManageMessages'},
                { name: 'Administrador', value: 'Administrator'}
            )
        ))
    .addSubcommand(command => command
        .setName(`disable`)
        .setDescription(`Desactiva el sistema anti-links`)    
    )
    .addSubcommand(command => command
        .setName(`check`)
        .setDescription(`Revisa el estado del sistema anti-link`)    
    )
    .addSubcommand(command => command
        .setName(`edit`)
        .setDescription(`Edita el sistema anti-links`)  
        .addStringOption(option => option
            .setName('permissions')
            .setDescription('Elige que permisos pueden evitar el sistema anti-links')
            .setRequired(true)
            .addChoices(
                { name: 'Gestionar Canales', value: 'ManageChannels'},
                { name: 'Gestionar Servidor', value: 'ManageGuild'},
                { name: 'Embed Links', value: 'EmbedLink'},
                { name: 'Adjuntar Archivos', value: 'AttachFiles'},
                { name: 'Gestionar Mensajes', value: 'ManageMessages'},
                { name: 'Administrador', value: 'Administrator'}
            )
        )
    ),
    async execute (client, interaction) {
        
        const { options } = interaction;

        const sub = options.getSubcommand();

        switch(sub) {

            case 'setup':
                const permissions = options.getString('permissions');

                const Data = await linkSchema.findOne({ Guild: interaction.guild.id});

                if (Data) return await interaction.reply({ content: `Ya configuraste el anti-link, usa el /antilink disable para eliminarlo`, ephemeral: true});

                if (!Data) {
                    linkSchema.create({
                        Guild: interaction.guild.id,
                        Perms: permissions
                    })
                }

                const embed = new EmbedBuilder()
                .setColor(process.env.COLOR)
                .setDescription(`:white_check_mark: El sistema anti-link ha sido activado y los permisos ${permissions} han sido excluidos de el`)

                await interaction.reply({ embeds: [embed]});

        }

        switch (sub) {
            case 'disable':
                await linkSchema.deleteMany();

                const embed2 = new EmbedBuilder()
                .setColor(process.env.COLOR)
                .setDescription(`:white_check_mark: El sistema anti-link ha sido desactivado`)

                await interaction.reply({ embeds: [embed2]});
        }

        switch (sub) {
            case 'check':
                const Data = await linkSchema.findOne({ Guild: interaction.guild.id});

                if (!Data) return await interaction.reply({ content: `El sistema anti-link no esta configurado aqui`, ephemeral:true});

                const permissions = Data.Perms;

                if (!permissions) return await interaction.reply({ content: `El sistema anti-link no esta configurado aqui`, ephemeral:true});
                else await interaction.reply({ content: `El sistema anti-links esta configurado correctamente. Los usuarios con los permisos **${permissions}** son excluidos del sistema`, ephemeral:true});

        }

        switch(sub) {
            case 'edit':
                const Data = await linkSchema.findOne({ Guild: interaction.guild.id});
                const permissions = options.getString('permissions');

                if (!Data) return await interaction.reply({ content: `El sistema anti-link no esta configurado aqui`});
                else {
                    await linkSchema.deleteMany();

                    await linkSchema.create({
                        Guild: interaction.guild.id,
                        Perms: permissions
                    })

                    const embed3 = new EmbedBuilder()
                    .setColor(process.env.COLOR)
                    .setDescription(`:white_check_mark: Los permisos que evitan el sistema anti-link se han ajustado a: ${permissions}`)

                    await interaction.reply({ embeds: [embed3]});
                }
        }
    }

     
    
}