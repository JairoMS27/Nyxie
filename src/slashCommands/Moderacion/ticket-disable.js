const { PermissionFlagsBits, EmbedBuilder, ChannelType, ActionRowBuilder, SlashCommandBuilder, StringSelectMenuBuilder } = require("discord.js");
const ticketSchema = require("../../Schemas/ticketSchema");

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription("Desactiva un sistema de tickets. (Admin Only)"),
    async execute (client, interaction) {

        ticketSchema.deleteMany({ Guild: interaction.guild.id}, async (err,data) => {
            await interaction.reply({ content: "El sistema de tickets ha sido desactivado", ephemeral: true})
        })
        
    }
}
