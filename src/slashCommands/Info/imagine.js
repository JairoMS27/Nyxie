const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    apiKey: 'place_openai_api_key'
});

const openai = new OpenAIApi(configuration);

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription('Convierte tu imaginación en imágenes con Nyxie IA')
    .addStringOption(option => option
        .setName('prompt')
        .setDescription('Describa la imagen que desea generar')
        .setRequired(true)    
    ),
    async execute (client, interaction) {
        await interaction.deferReply();

        const prompt = interaction.options.getString('prompt');

        try {
            const response = await openai.createImage({
                prompt: `${prompt}`,
                n: 1,
                size: `1024x1024`,
            });

            const image = response.data.data[0].url;

            const embed = new EmbedBuilder()
            .setColor(process.env.COLOR)
            .setTitle('Nyxie AI - Image Generator')
            .setDescription(`**Prompt**: ${prompt}`)
            .setImage(image)
            .setTimestamp()
            .setFooter({text: `© Ejemplo#1234`})

            await interaction.editReply({embeds: [embed] });
        } catch(e) {
            if (e.response.status == 400) return await interaction.editReply({content: `Nyxie AI - status code **400**`});
            return await interaction.editReply({content: `Request failed with status code **${e.response.status}**`});
        }
    }
}
