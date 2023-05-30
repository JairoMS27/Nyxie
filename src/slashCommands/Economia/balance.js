const { Client, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const ecoSchema = require("../../Schemas/ecoSchema");

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("💸 Comprueba el dinero de tu cuenta"),
    async execute (client, interaction) {
        const { user, guild } = interaction;

        let Data = await ecoSchema.findOne({ Guild: interaction.guild.id, User: user.id});

        if (!Data) return await interaction.reply({ content: `Necesitas tener una cuenta bancaria para usar este comando`, ephemeral: true});

        const wallet = Math.round(Data.Wallet)
        const bank = Math.round(Data.Bank)
        const total = Math.round(Data.Wallet + Data.Bank)

        const embed = new EmbedBuilder()
        .setColor(process.env.COLOR)
        .setTitle("Nyxie Bank")
        .addFields({ name: "Tu Cuenta:", value: `**Banco:** ${bank}€\n**Cartera:** ${wallet}€\n**Total:** ${total}€`})

        await interaction.reply({embeds: [embed]});

    }
}
