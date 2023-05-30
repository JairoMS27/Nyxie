const { PermissionFlagsBits, EmbedBuilder, ChannelType, ActionRowBuilder, SlashCommandBuilder, StringSelectMenuBuilder } = require("discord.js");
const ticketSchema = require("../../Schemas/ticketSchema");

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription("Configura un sistema de tickets. (Admin Only)")
    .addChannelOption(option => option
        .setName('channel')
        .setDescription('Elige el canal donde configurar los tickets')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
        )
    .addChannelOption(option => option
        .setName('category')
        .setDescription('Elige la categoria donde apareceran los tickets')
        .addChannelTypes(ChannelType.GuildCategory)
        .setRequired(true)
        )
    .addRoleOption(option => option
        .setName('role')
        .setDescription('Selecciona el rol que puede ver los tickets')
        .setRequired(true)
        )
    .addStringOption(a => a
        .setName('titulo')
        .setDescription('Coloca el titulo al mensaje de tickets.')
        .setRequired(true))
      .addStringOption(a => a
        .setName('description')
        .setDescription('Envia el contenido del mensaje de tickets.')
        .setRequired(true)
        )
    .addStringOption(a => a
        .setName('tema1')
        .setDescription('Nombre primera opcion de tickets.')
        .setRequired(false)
        )
    .addStringOption(a => a
        .setName('tema2')
        .setDescription('Nombre segunda opcion de tickets.')
        .setRequired(false)
        )
    .addStringOption(a => a
        .setName('tema3')
        .setDescription('Nombre tercera opcion de tickets.')
        .setRequired(false)
        )
    .addStringOption(a => a
        .setName('tema4')
        .setDescription('Nombre cuarta opcion de tickets.')
        .setRequired(false)
        ),
    async execute (client, interaction) {

        const channel = interaction.options.getChannel("channel")
        const category = interaction.options.getChannel("category")
        const title = interaction.options.getString('titulo')
        const desc = interaction.options.getString('description')
        const tema1 = interaction.options.getString('tema1')
        const tema2 = interaction.options.getString('tema2')
        const tema3 = interaction.options.getString('tema3')
        const tema4 = interaction.options.getString('tema4')
        const role = interaction.options.getRole('role')

        ticketSchema.findOne({ Guild: interaction.guild.id}, async (err, data) => {

            if (!data) {
                ticketSchema.create({
                    Guild: interaction.guild.id,
                    Channel: category.id,
                    Ticket: 'first',
                    AdminRole: role.id,
                })
            } else {
                await interaction.reply({ content: "Ya tienes configurado un sistema de tickets, puedes usar /ticket-disable para borrarlo. "})
                return;
            }

            const embed = new EmbedBuilder()
            .setColor(process.env.COLOR)
            .setTitle(`${title}`)
            .setDescription(`${desc}`)
            .setFooter({ text: `${interaction.guild.name}´s Tickets`})

        const menu = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
            .setCustomId('select')
            .setMaxValues(1)
            .setPlaceholder("Selecciona un tema...")
            .addOptions(
                {   
                    label: `${tema1 || '💠 Soporte General'}`, /* `💠 Soporte General` */
                    value: `${tema1 || 'Soporte General'}`
                },
                {
                    label: `${tema2 || '🔰 Soporte Moderacion'}`, /*`🔰 Soporte Moderacion`*/
                    value: `${tema2 || 'Soporte Moderacion'}`
                },
                {
                    label: `${tema3 || '🫰 Apoyar al Servidor'}`, /*`🫰 Apoyar al Servidor`*/
                    value: `${tema3 || 'Apoyar al Servidor'}`
                },
                {
                    label: `${tema4 || '⚜️ Otro'}`, /*`⚜️ Otro`*/
                    value: `${tema4 || 'Otro' }`
                },
            )
        )

        await channel.send({ embeds: [embed], components: [menu]});
        await interaction.reply({content: `Tu sistema de tickets ha sido configurado en ${channel}`, ephemeral: true})

        })

        
    }
}
