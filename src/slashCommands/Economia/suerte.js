const { Client, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const ecoSchema = require("../../Schemas/ecoSchema");

var timeout = [];

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("💸 Prueba tu suerte y recibe una recompensa."),
    async execute (client, interaction) {
        const { user, guild } = interaction;
        if (timeout.includes(interaction.user.id)) return interaction.reply({ content: `Calma, tomate un descanso y vuelve en 30 segundos`, ephemeral: true});

        let Data = await ecoSchema.findOne({ Guild: interaction.guild.id, User: interaction.user.id});

        if (!Data) return await interaction.reply({ content: `Necesitas tener una cuenta bancaria para usar este comando`, ephemeral: true});

        let negative = Math.round((Math.random() * -300) -10)
        let positive = Math.round((Math.random() * 300) + 10)

        const posN = [negative, positive];

        const amount = Math.round((Math.random() * posN.length));
        const value = posN[amount];

        if (!value) return await interaction.reply({ content: `No te doy ni un duro`, ephemeral: true});

        if (Data) {
            Data.Wallet += value;
            await Data.save();
        }

        if (value > 0) {
            const positiveChoices = [
                "MrBeast te dió",
                "Alguien te regalo",
                "Ganaste la loteria, y te llevaste",
            ]

            const posName = Math.floor(Math.random() * positiveChoices.length);

            const embed1 = new EmbedBuilder()
            .setColor(process.env.COLOR)
            .addFields({ name: "Felicidades", value: `${positiveChoices[posName]} ${value}€`})

            await interaction.reply({ embeds: [embed1] });
        } else {
            const negativeChoices = [
                "Te dejaste la cartera en el Eroski y has perdido",
                "Han atracado el banco y perdiste ",
                "Te metiste en un barrio gitano y te robaron",
            ]

            const negName = Math.floor((Math.random() * negativeChoices.length));

            const stringV = `${value}`;

            const nonSymbol = stringV.slice(1);
            
            const embed2 = new EmbedBuilder()
            .setColor(process.env.COLOR)
            .addFields({ name: "Mala Suerte...", value: `${negativeChoices[negName]} -${nonSymbol}€`})

            await interaction.reply({ embeds: [embed2] });
        }

        timeout.push(interaction.user.id);
        setTimeout(() => {
            timeout.shift();
        }, 30000)
    }
}
