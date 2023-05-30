const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ecoSchema = require('../../Schemas/ecoSchema');

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("💸 Retira el dinero de tu cuenta.")
    .addStringOption(option => option
        .setName('amount')
        .setDescription('Cantidad de dinero que quieres retirar')
        .setRequired(true)   
    ),
    async execute(client, interaction) {
        const { options, user, guild } = interaction;

        const amount = options.getString("amount");
        const Data = await ecoSchema.findOne({ Guild: interaction.guild.id, User: user.id});

        if (!Data) return await interaction.reply({ content: `Necesitas tener una cuenta bancaria para usar este comando`, ephemeral: true});
        if (amount.startsWith('-')) return await interaction.reply({content: "No puedes retirar cantidades negativas", ephemeral: true});

        if (amount.toLowerCase() === 'all') {
            if (Data.Bank === 0) return await interaction.reply({content: "No tienes dinero para retirar.", ephemeral: true});

            Data.Wallet += Data.Bank;
            Data.Bank = 0;

            await Data.save();

            return await interaction.reply({content: "Todo tu dinero ha sido retirado", ephemeral: true});
        } else {
            const Converted = Number(amount);

            if (isNaN(Converted) === true) return await interaction.reply({content: `Solo puedes ingresar cantidades numericas o \`all\`!`, ephemeral: true});

            if (Data.Bank < parseInt(Converted) || Converted === Infinity) return await interaction.reply({content: "No tienes suficiente dinero en tu cuenta para retirar", ephemeral: true});

            Data.Wallet += parseInt(Converted);
            Data.Bank -= parseInt(Converted);
            Data.Bank = Math.abs(Data.Bank);

            await Data.save();

            const embed = new EmbedBuilder()
            .setColor(process.env.COLOR)
            .setTitle('Retirada Realizado')
            .setDescription(`Felicidades! Has retirado ${parseInt(Converted)}€ de tu cuenta.`)

            return await interaction.reply({ embeds: [embed] });
        }
    }
}