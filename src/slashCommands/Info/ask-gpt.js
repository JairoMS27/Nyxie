const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    apiKey: 'place_openai_api_key'
});

const openai = new OpenAIApi(configuration);

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("GPT-3 puede ayudarte a crear contenidos, diseñar soluciones y simplificar las cosas")
    .addStringOption(option => option
        .setName("question")
        .setDescription("Escribe tu consulta a GPT-3")
        .setRequired(true)
        
    )
    .setDMPermission(false),

    async execute(client, interaction) {

        await interaction.deferReply();

        const question = interaction.options.getString('question');

        try {
            const res = await openai.createCompletion({
                model: 'text-davinci-003',
                max_tokens: 2048,
                temperature: 0.5,
                prompt: question
            })

            const embed = new EmbedBuilder()
            .setColor(process.env.COLOR)
            .setTitle('Nyxie AI - GPT-3')
            .setDescription(`Aqui esta respuesta: \`\`\`${res.data.choices[0].text}\`\`\``)
            .setFooter({ text: `© Ejemplo#1234`})

            await interaction.editReply({ embeds: [embed]});

        } catch(e) {
            return await interaction.editReply({ content: `Nyxie AI - status code **${e.response.status}**`, ephemeral: true})
        }

        

        
        
    }

    
}
