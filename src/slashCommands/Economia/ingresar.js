const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ecoSchema = require('../../Schemas/ecoSchema');

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("💸 Ingresa el dinero en tu cuenta.")
    .addStringOption(option => option
        .setName('amount')
        .setDescription('Cantidad de dinero que quieres ingresar')
        .setRequired(true)   
    ),
    async execute(client, interaction) {
        const { options, user, guild } = interaction;

        const amount = options.getString("amount");
        const Data = await ecoSchema.findOne({ Guild: interaction.guild.id, User: user.id});

        if (!Data) return await interaction.reply({ content: `Necesitas tener una cuenta bancaria para usar este comando`, ephemeral: true});
        if (amount.startsWith('-')) return await interaction.reply({content: "No puedes ingresar cantidades negativas", ephemeral: true});

        if (amount.toLowerCase() === 'all') {
            if (Data.Wallet === 0) return await interaction.reply({content: "No tienes dinero para ingresar.", ephemeral: true});

            Data.Bank += Data.Wallet;
            Data.Wallet = 0;

            await Data.save();

            return await interaction.reply({content: "Todo tu dinero ha sido ingresado", ephemeral: true});
        } else {
            const Converted = Number(amount);

            if (isNaN(Converted) === true) return await interaction.reply({content: `Solo puedes ingresar cantidades numericas o \`all\`!`, ephemeral: true});

            if (Data.Wallet < parseInt(Converted) || Converted === Infinity) return await interaction.reply({content: "No tienes suficiente dinero para ingresar en tu cuenta", ephemeral: true});

            Data.Bank += parseInt(Converted);
            Data.Wallet -= parseInt(Converted);
            Data.Wallet = Math.abs(Data.Wallet);

            await Data.save();

            const embed = new EmbedBuilder()
            .setColor(process.env.COLOR)
            .setTitle('Ingreso Realizado')
            .setDescription(`Felicidades! Has ingresado ${parseInt(Converted)}€ en tu cuenta.`)

            return await interaction.reply({ embeds: [embed] });
        }
    }
}