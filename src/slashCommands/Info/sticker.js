const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageEmojisAndStickers)
    .setDescription('Añade un sticker a tu servidor')
    .addAttachmentOption(option => option
        .setName('sticker')
        .setDescription('Sube un sticker png/jpeg')
        .setRequired(true)    
    )
    .addStringOption(option => option
        .setName('name')
        .setDescription('Nombre del sticker')
        .setRequired(true)   
    ),
    async execute(client, interaction) {

        const upload = interaction.options.getAttachment('sticker');
        const name = interaction.options.getString('name');

        if (name.length <= 2) {
            return await interaction.reply({content: 'Tienes que añadir un nombre mas largo', ephemeral: true});
        }

        if (upload.contentType === 'image/gif') {
            return await interaction.reply({content: 'No puedes subir gifs.', ephemeral: true});
        }

        await interaction.reply('⚙️ Subiendo Sticker...');

        const sticker = await interaction.guild.stickers.create({file: `${upload.attachment}`, name: `${name}`}).catch(err => {
            setTimeout(() => {
                return interaction.editReply({content: `${err.rawError.message}`});
            }, 2000);
        });

        const embed = new EmbedBuilder()
        .setColor(process.env.COLOR)
        .setDescription(`✅ | El Sticker se ha subido correctamente con el nombre \`${name}\``)

        setTimeout(() => {
            if (!sticker) {
                return;
            }

            interaction.editReply({content: ``, embeds: [embed]});
        }, 3000);
    }
}