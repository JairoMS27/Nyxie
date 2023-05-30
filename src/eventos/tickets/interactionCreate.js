const ticketSchema = require('../../Schemas/ticketSchema');
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, PermissionFlagsBits, EmbedBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require("discord.js")

module.exports = async(client, interaction) => {
    
    if (interaction.isButton()) return;
    if (interaction.isChatInputCommand()) return;

    

    const modal = new ModalBuilder()
    .setTitle(`Rellena los datos necesarios`)
    .setCustomId('modal')
    

    const usertag = new TextInputBuilder()
    .setCustomId('usertag')
    .setRequired(true)
    .setLabel('Escriba su nombre completo de Discord')
    .setPlaceholder('Ejemplo#1234')
    .setStyle(TextInputStyle.Short)

    const username = new TextInputBuilder()
    .setCustomId('username')
    .setRequired(true)
    .setLabel('Escriba su nombre')
    .setPlaceholder('Ejemplo')
    .setStyle(TextInputStyle.Short)

    const reason = new TextInputBuilder()
    .setCustomId('reason')
    .setRequired(true)
    .setLabel('Escriba la razón de este ticket')
    .setPlaceholder('Razón')
    .setStyle(TextInputStyle.Short)

    const firstActionRow = new ActionRowBuilder().addComponents(usertag)
    const secondActionRow = new ActionRowBuilder().addComponents(username)
    const thirdActionRow = new ActionRowBuilder().addComponents(reason)

    modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

    let choices;
    if (interaction.isSelectMenu()) {

        choices = interaction.values;

        const result = choices.join("");

        ticketSchema.findOne({ Guild: interaction.guild.id}, async (err, data) => {

            const filter = {Guild: interaction.guild.id};
            const update = {Ticket: result};
            

            ticketSchema.updateOne(filter, update, {
                new: true
            }).then(value => {
            })
        })
    }

    if (!interaction.isModalSubmit()) {
        interaction.showModal(modal)
    }

    if (interaction.customId == "modal") {
        ticketSchema.findOne({Guild: interaction.guild.id}, async (err, data) => {

            const usertagInput = interaction.fields.getTextInputValue('usertag')
            const usernameInput = interaction.fields.getTextInputValue('username')
            const reasonInput = interaction.fields.getTextInputValue('reason')

            const posChannel = await interaction.guild.channels.cache.find(c => c.name === `ticket-${interaction.user.id}`);
            if (posChannel) return await interaction.reply({ content: `Ya tienes un ticket abierto - ${posChannel}`, ephemeral: true});

            const category = data.Channel;

            const embed = new EmbedBuilder()
            .setColor(process.env.COLOR)
            .setTitle(`Ticket de ${interaction.user.username}`)
            .setDescription('Bienvenid@ a tu ticket! Espera mientras un miembro del STAFF revisa tu caso')
            .addFields({name: `User`, value: `${usertagInput}`})
            .addFields({name: `Nombre`, value: `${usernameInput}`})
            .addFields({name: `Motivo`, value: `${reasonInput}`})
            .addFields({name: `Tipo`, value: `${data.Ticket}`})
            .setFooter({ text: `${interaction.guild.name}´s Tickets`})

            const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('ticket')
                .setLabel(`🗑️ Cerrar Ticket`)
                .setStyle(ButtonStyle.Danger)
            )

            if (!interaction.guild.roles.cache.has(data.AdminRole)) return interaction.reply({content: 'Error, primero se debe configurar un rol valido.', ephemeral: true});

            let channel = await interaction.guild.channels.create({
                name: `ticket-${data.Ticket}-${interaction.user.username}`,
                type: ChannelType.GuildText,
                parent: `${category}`,
                permissionOverwrites: [
                    {
                      id: interaction.user.id,
                      allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                    ],
                   },
                   {
                    id: interaction.guild.id,
                    deny: [PermissionFlagsBits.ViewChannel],
                   },
                   {
                    id: data.AdminRole,
                    allow: [
                        PermissionFlagsBits.ViewChannel, // que vea el canal
                        PermissionFlagsBits.SendMessages, // que pueda enviar mensajes
                    ],
                   }
                 ]
            });

            let msg = await channel.send({embeds: [embed], components: [button]});
            await interaction.reply({ content: `Tu ticket esta abierto en ${channel}`, ephemeral: true});

            const collector = msg.createMessageComponentCollector()

            collector.on('collect', async i => {
                ;(await channel).delete();

                const dmEmbed = new EmbedBuilder()
                .setColor(process.env.COLOR)
                .setTitle('Tu ticket ha sido cerrado')
                .setDescription("Gracias por contactar con nosotros! Si necesitas ayuda no dudes en abrir otro ticket!")
                .setFooter({ text: `${interaction.guild.name}´s Tickets`})
                .setTimestamp()

                await interaction.member.send({ embeds: [dmEmbed]}).catch(err => {
                    return;
                })
            })
        })
    }
}