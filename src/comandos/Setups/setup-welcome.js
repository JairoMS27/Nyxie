const { EmbedBuilder } = require('discord.js');
const setupSchema = require("../../Schemas/setups");

module.exports = {
    DESCRIPTION: "Configura un sistema de bienvenidas (Admin Only).",
    PERMISSIONS: ["Administrator"],

    async execute(client, message, args, prefix) {
        const canalBienvenidas = message.guild.channels.cache.get(args[0]) || message.mentions.channels.find((ch) => ch.guild.id === message.guild.id)
        if(!canalBienvenidas) return message.reply("❌ **No se ha encontrado el canal que has especificado!**");

        let imagenBienvenida = args[1];
        if(!imagenBienvenida) return message.reply("❌ **Tienes que especificar una imagen de bienvenida!**");

        let mensajeBienvenida = args.slice(2).join(" ")
        if(!mensajeBienvenida) return message.reply("❌ **Tienes que especificar un mensaje de bienvenida!**");

        const bienvenidas = {
            canal: canalBienvenidas.id,
            mensaje: mensajeBienvenida,
            fondo: imagenBienvenida,
        }

        const data = await setupSchema.findOne({guildID: message.guild.id}); // Buscas si hay datos
        if(data) await setupSchema.findOneAndUpdate({guildID: message.guild.id}, { bienvenidas }); // Si hay, los editas
        else await setupSchema.create({ guildID: message.guild.id, bienvenidas });
        
        return message.reply({embeds: [
            new EmbedBuilder().setTitle(`✅ Sistema de Bienvenidas activado!`)
            .setDescription(`**Canal de Bienvenidas:** ${canalBienvenidas}\n\n**Mensaje de Bienvenida:**\`${mensajeBienvenida}\`\n\n**Imagen de Bienvenida: ** [\`Haz Clic\`](${imagenBienvenida})`)
            .setColor(process.env.COLOR)
        ]})


        
    }
}