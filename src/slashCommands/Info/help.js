const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription('Mira mis comandos'),
    
    async execute (client, interaction) {

        const embed = new EmbedBuilder()
        .setColor(process.env.COLOR)
        .setTitle("Centro de Ayuda")
        .setDescription("Guía del Comando de Ayuda:")
        .addFields({ name: "Página 1", value: "Utilidades"})
        .addFields({ name: "Página 2", value: "Entretenimiento"})
        .addFields({ name: "Página 3", value: "Moderación"})
        .addFields({ name: "Página 4", value: "Música"})
        .addFields({ name: "Página 5", value: "Economía"})

        const embed4 = new EmbedBuilder()
        .setColor(process.env.COLOR)
        .setTitle("Comandos de Utilidades")
        .addFields({ name: "/afk", value: "Usa /afk para estar en modo AFK."})
        .addFields({ name: "/emoji", value: "Usa /emoji para añadir un emoji al servidor (Admin Only)."})
        .addFields({ name: "/poll", value: "Usa /poll para hacer una encuesta y mandarla en un canal (Admin Only)."})
        .addFields({ name: "/help", value: "Usa /help para ver mis comandos de ayuda."})
        .addFields({ name: "/info", value: "Usa /info para la info sobre mi."})
        .addFields({ name: "/infoserver", value: "Usa /infoserver para la info sobre el servidor."})
        .addFields({ name: "/ask-gpt", value: "Usa /ask-gpt para preguntar a GPT-3."})
        .addFields({ name: "/imagine", value: "Usa /imagine para usar la generacion de imagen."})
        .addFields({ name: "/translate", value: "Usa /translate para usar abrir un traductor."})
        .addFields({ name: "?premium", value: "Usa ?premium para comprobar tu suscripcion."})
        .addFields({ name: "?setup-welcome", value: "Usa ?setup-welcome para activar el sistema de bienvenidas (Admin Only)."})
        .addFields({ name: "/sticker", value: "Usa /sticker para añadir un sticker al servidor (Admin Only)."})
        .addFields({ name: "/jointocreate", value: "Usa /jointocreate para configurar el sistema join-to-create (Admin Only)."})
        .addFields({ name: "/setup-tickets", value: "Usa /setup-tickets para configurar el sistema de tickets (Admin Only)."})
        .addFields({ name: "/ticket-disable", value: "Usa /ticket-disable para desactivar el sistema de tickets (Admin Only)."})
        .setFooter({ text: "Comandos de Utilidades"})
        .setTimestamp()

        const embed2 = new EmbedBuilder()
        .setColor(process.env.COLOR)
        .setTitle("Comandos de Entretenimiento")
        .addFields({ name: "/bola8", value: "Usa /bola8 para agitar la bola."})
        .addFields({ name: "/gatos", value: "Usa /gatos para que aparezca un michi."})
        .addFields({ name: "/buscaminas", value: "Usa /buscaminas para jugar al buscaminas."})
        .addFields({ name: "/pokemon", value: "Usa /pokemon para adivinar el pokemon."})
        .addFields({ name: "/slots", value: "Usa /slots para jugar a las slots."})
        .addFields({ name: "/tictactoe", value: "Usa /tictactoe para jugar al 3 en raya con alguien."})
        .setFooter({ text: "Comandos de Entretenimiento"})
        .setTimestamp()

        const embed3 = new EmbedBuilder()
        .setColor(process.env.COLOR)
        .setTitle("Comandos de Moderación")
        .addFields({ name: "/ban", value: "Usa /ban para banear a un usuario (Admin Only)."})
        .addFields({ name: "/anuncio", value: "Usa /anuncio para mandar un anuncio en un canal (Admin Only) (Deshabilitado)."})
        .addFields({ name: "/unban", value: "Usa /unban para desbanear a un usuario(ID) (Admin Only)."})
        .addFields({ name: "/clear", value: "Usa /clear para borrar mensajes (Admin Only)."})
        .addFields({ name: "/timeout", value: "Usa /timeout para aislar a un usuario (Admin Only)."})
        .addFields({ name: "/antilink", value: "Usa /antilink setup para decidir quien puede mandar invitaciones de discord (Admin Only)."})
        .addFields({ name: "/xpreset", value: "Usa /xpreset para resetear el xp de todo el servidor (Admin Only) (Deshabilitado)."})
        .addFields({ name: "/xpureset", value: "Usa /xpureset para resetear el xp de usuario (Admin Only) (Deshabilitado)."})
        .addFields({ name: "/automod", value: "Usa /automod para configurar el automod (Admin Only)."})
        .addFields({ name: "/suplantar", value: "Usa /suplantar para enviar un mensaje desde un usuario (Admin Only)."})
        .addFields({ name: "/mass-unban", value: "Usa /mass-unban para desbanear a todos los usuarios (Raid) (Ban Members Permisison)."})
        .addFields({ name: "/slowmode", value: "Usa /slowmode para activar el modo lento en un canal. (Admin Only)."})
        .setFooter({ text: "Comandos de Moderación"})
        .setTimestamp()

        const embed5 = new EmbedBuilder()
        .setColor(process.env.COLOR)
        .setTitle("Comandos de Música")
        .addFields({ name: "/play", value: "Usa /play para poner canciones."})
        .addFields({ name: "/pausar", value: "Usa /pausar para pausar la cancion."})
        .addFields({ name: "/cola", value: "Usa /cola para ver la cola de canciones."})
        .addFields({ name: "/adelantar", value: "Usa /adelantar para adelantar segundos en la cancion."})
        .addFields({ name: "/retrasar", value: "Usa /adelantar para retrasar segundos en la cancion."})
        .addFields({ name: "/aleatorio", value: "Usa /aleatorio para poner el modo aleatorio."})
        .addFields({ name: "/bucle", value: "Usa /bucle para poner en bucle las canciones."})
        .addFields({ name: "/reproduciendo", value: "Usa /reproduciendo para ver que cancion esta sonando."})
        .addFields({ name: "/resume", value: "Usa /resume para continuar con la cola."})
        .addFields({ name: "/skip", value: "Usa /skip para saltar la cancion."})
        .addFields({ name: "/stop", value: "Usa /stop para parar la cancion."})
        .addFields({ name: "/volumen", value: "Usa /volumen para cambiar el volumen de la cancion."})
        .addFields({ name: "/filtros", value: "Usa /filtros para añadir filtros a las canciones."})
        .setFooter({ text: "Comandos de Música"})
        .setTimestamp()

        const embed6 = new EmbedBuilder()
        .setColor(process.env.COLOR)
        .setTitle("Comandos de Economía")
        .addFields({ name: "/banco", value: "Usa /banco para crear una cuenta."})
        .addFields({ name: "/balance", value: "Usa /balance para ver tu dinero."})
        .addFields({ name: "/suerte", value: "Usa /suerte para probar suerte y recibir una recompensa."})
        .addFields({ name: "/robar", value: "Usa /robar para robar a alguien."})
        .addFields({ name: "/ingresar", value: "Usa /ingresar para ingresar dinero en el banco."})
        .addFields({ name: "/retirar", value: "Usa /retirar para retirar dinero del banco."})
        .setFooter({ text: "Comandos de Economía"})
        .setTimestamp()

        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`page4`)
            .setLabel(`Página 1`)
            .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
            .setCustomId(`page2`)
            .setLabel(`Página 2`)
            .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
            .setCustomId(`page3`)
            .setLabel(`Página 3`)
            .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
            .setCustomId(`page5`)
            .setLabel(`Página 4`)
            .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
            .setCustomId(`page6`)
            .setLabel(`Página 5`)
            .setStyle(ButtonStyle.Success),
        )

        const message = await interaction.reply({ embeds: [embed], components: [button] });
        const collector = await message.createMessageComponentCollector();

        collector.on('collect', async i => {

            if (i.customId === 'page4') {
                if (i.user.id !== interaction.user.id) {
                    return await i.reply({ content: `Solo ${interaction.user.tag} puede usar los botones!`, ephemeral: true})
                }
                await i.update({ embeds: [embed4], components: [button]})
            }

            if (i.customId === 'page2') {
                if (i.user.id !== interaction.user.id) {
                    return await i.reply({ content: `Solo ${interaction.user.tag} puede usar los botones!`, ephemeral: true})
                }
                await i.update({ embeds: [embed2], components: [button]})
            }

            if (i.customId === 'page3') {
                if (i.user.id !== interaction.user.id) {
                    return await i.reply({ content: `Solo ${interaction.user.tag} puede usar los botones!`, ephemeral: true})
                }
                await i.update({ embeds: [embed3], components: [button]})
            }

            if (i.customId === 'page5') {
                if (i.user.id !== interaction.user.id) {
                    return await i.reply({ content: `Solo ${interaction.user.tag} puede usar los botones!`, ephemeral: true})
                }
                await i.update({ embeds: [embed5], components: [button]})
            }

            if (i.customId === 'page6') {
                if (i.user.id !== interaction.user.id) {
                    return await i.reply({ content: `Solo ${interaction.user.tag} puede usar los botones!`, ephemeral: true})
                }
                await i.update({ embeds: [embed6], components: [button]})
            }
        })

    }
}
