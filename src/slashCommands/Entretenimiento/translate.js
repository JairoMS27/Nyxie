const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const translate = require('@iamtraction/google-translate');

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription('Traductor')
    .addStringOption(option => option
        .setName('message')
        .setDescription('Que deseas traducir?')
        .setRequired(true)    
    )
    .addStringOption(option => option
        .setName('language')
        .setDescription('Selecciona el idioma')
        .addChoices(
            {name: 'Latín', value: 'la'},
            {name: 'Francés', value: 'fr'},
            {name: 'Aleman', value: 'de'},
            {name: 'Italiano', value: 'it'},
            {name: 'Portugués', value: 'pt'},
            {name: 'Español', value: 'es'},
            {name: 'Griego', value: 'gl'},
            {name: 'English', value: 'en'},
            {name: 'Ruso', value: 'ru'},
            {name: 'Japonés', value: 'ja'},
            {name: 'Arabe', value: 'ar'}
        ).setRequired(true)
    ),

    async execute (client, interaction) {

        const { options } = interaction;
        const text = options.getString('message');
        const lan = options.getString('language');

        await interaction.reply({ content: '⚙️ Traduciendo el mensaje...', ephemeral: false });

        const applied = await translate(text, { to: `${lan}`});

        const embed = new EmbedBuilder()
        .setColor(process.env.COLOR)
        .setTitle('🔎 Nyxie Traductor')
        .addFields({ name: 'Mensaje Original', value: `\`\`\`${text}\`\`\``, inline: false})
        .addFields({ name: 'Mensaje Traducido', value: `\`\`\`${applied.text}\`\`\``, inline: false})

        await interaction.editReply({ content: '', embeds: [embed], ephemeral: false});
    }
}