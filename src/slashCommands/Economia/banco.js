const { Client, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const ecoSchema = require("../../Schemas/ecoSchema");

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("💸 Crea una nueva cartera"),
    async execute (client, interaction) {
        const { user, guild } = interaction;

        let Data = await ecoSchema.findOne({ Guild: interaction.guild.id, User: interaction.user.id});

        const embed = new EmbedBuilder()
        .setColor(process.env.COLOR)
        .setTitle("Qué quieres hacer?")
        .addFields({ name: "Abrir Cuenta", value: "Abre tu cuenta bancaria en Nyxie Bank"})
        .addFields({ name: "Cerrar Cuenta", value: "Cierra tu cuenta bancaria en Nyxie Bank"})
        
        const embed2 = new EmbedBuilder()
        .setColor(process.env.COLOR)
        .setTitle("Bienvenid@ a Nyxie Bank")
        .setDescription("Gracias por elegirnos.")
        .addFields({ name: "Cuenta Creada", value: "Tu cuenta ha sido creada correctamente! Acabas de recibir 1000€ por abrir tu cuenta"})
        .setFooter({ text: `Solicitada por ${interaction.user.username}`})
        .setTimestamp()

        const embed3 = new EmbedBuilder()
        .setColor(process.env.COLOR)
        .setTitle("Cuenta Eliminada")
        .setDescription("Te echaremos de menos. Te esperamos pronto!")
        .addFields({ name: "Tu cuenta ha sido cerrada", value: "Tu cuenta se cerró correctamente"})

        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('page1')
            .setEmoji(`✅`)
            .setLabel('Abrir')
            .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
            .setCustomId('page2')
            .setEmoji(`❌`)
            .setLabel(`Cerrar`)
            .setStyle(ButtonStyle.Danger),
        )

        const message = await interaction.reply({ embeds: [embed], components: [button] });

        const collector = await message.createMessageComponentCollector();

        collector.on('collect', async i => {
            if (i.customId === 'page1') {

                if (Data) return await i.reply({ content: `Ya posees una cuenta en Nyxie Bank`, ephemeral: true});

                if (i.user.id !== interaction.user.id) {
                return i.reply({ content: `Solo ${interaction.user.tag} puede usar estos botones`, ephemeral: true})
                }
            

                Data = new ecoSchema({
                    Guild: interaction.guild.id,
                    User: user.id,
                    Bank: 0,
                    Wallet: 1000
                })

            await Data.save();

            await i.update({ embeds: [embed2], components: []});
            }

            if (i.customId === 'page2') {
                if (i.user.id !== interaction.user.id) {

                    return i.reply({ content: `Solo ${interaction.user.tag} puede usar estos botones`, ephemeral: true}) 
                }
                if (!Data) {
                return await i.reply({ content: `No tienes ninguna cuenta bancaria todavia.`, ephemeral: true})
                } else {
                    await Data.deleteOne();
                    await i.update({ embeds: [embed3], components: []});
                }
                
            }
        })
    }
}
