const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ecoSchema = require('../../Schemas/ecoSchema');

var timeout = [];

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("💸 Robale dinero a alguien.")
    .addUserOption(option => option
        .setName('user')
        .setDescription('Busca tu victima')
        .setRequired(true)   
    ),
    async execute(client, interaction) {
        const { options, user, guild } = interaction;

        if (timeout.includes(interaction.user.id)) return await interaction.reply({content: "Espera 1 minuto para robarle a alguien otra vez", ephemeral: true});

        const userStealing = options.getUser('user');

        let Data = await ecoSchema.findOne({Guild: guild.id, User: user.id});
        let DatUser = await ecoSchema.findOne({ Guild: guild.id, User: userStealing.id});

        if (!Data) return await interaction.reply({ content: `Necesitas tener una cuenta bancaria para usar este comando`, ephemeral: true});
        if (userStealing == interaction.user) return await interaction.reply({content: "Eres Tonto? No puedes robarte a ti mismo", ephemeral:true});
        if(!DatUser) return await interaction.reply({content: `Este usuario no tiene una cuenta en nuestro banco. No puedes robarle`, ephemeral:true});
        if (DatUser.Wallet <= 0) return await interaction.reply({content: "Este usuario no tiene dinero en su cartera.", ephemeral:true});

        let negative = Math.round((Math.random() * -150) - 10);
        let positive = Math.round((Math.random() * 300) + 10);

        const posN = [negative, positive];

        const amount = Math.round((Math.random() * posN.length));
        const value = posN[amount];

        if (Data.Wallet <= 0) return await interaction.reply({content: "No puedes robar porque tu cartera esta vacia", ephemeral:true});

        if (value > 0) {
            const positiveChoices = [
                "Acabas de robar",
                "Tomaste prestados",
                "El dueño te ha visto y te ayudo a robar",
                "Pillaste"
            ]

            const posName = Math.floor(Math.random() * positiveChoices.length);

            const bgEmbed = new EmbedBuilder()
            .setColor(process.env.COLOR)
            .setTitle("Robo Completado")
            .addFields({name: "Hiciste un robo y", value: `${positiveChoices[[posName]]} ${value}€`})

            interaction.reply({embeds: [bgEmbed]});

            Data.Wallet += value;
            await Data.save();

            DatUser.Wallet -= value;
            await DatUser.save()
        } else if (value < 0) {
            const negativeChoices = [
                "Dani te robo",
                "La policia te pillo y perdiste",
                "El dueño te ha dejado inconsciente y te robó",
            ]

            const wal = Data.Wallet;
            if (isNaN(value)) return await interaction.reply({content: `Alguien llamó a la policia, pero lograste escapar y no perdiste ni ganaste nada`, ephemeral: true})

            const negName = Math.floor(Math.random() * negativeChoices.length);

            let nonSymbol;
            if (value - wal < 0) {
                const stringV = `${value}`;

                nonSymbol = await stringV.slice(1)

                const los = new EmbedBuilder()
                .setColor(process.env.COLOR)
                .setTitle("Robo Fallido")
                .addFields({name: "Hiciste un robo y", value: `${negativeChoices[[negName]]} ${nonSymbol}€`})

                Data.Bank += value;
                await Data.save();

                DatUser.Wallet -= value;
                await DatUser.save();

                return await interaction.reply({embeds: [los]});
            }

            const begLostEmbed = new EmbedBuilder()
            .setColor(process.env.COLOR)
            .setTitle("Robo Fallido")
            .addFields({name: "Hiciste un robo y", value: `${negativeChoices[[negName]]} ${nonSymbol}€`})

            interaction.reply({embeds: [begLostEmbed]});

            Data.Wallet += value;
            await Data.save();

            DatUser.Wallet -= value;
            await DatUser.save()
        }

        timeout.push(interaction.user.id);
        setTimeout(() => {
            timeout.shift();
        }, 30000)
    }
}