const { EmbedBuilder } = require("discord.js");
const { DisTube } = require("distube");
const {SpotifyPlugin} = require('@distube/spotify');


module.exports = async(client) => {

    client.distube = new DisTube(client, {
        emitNewSongOnly: true,
        leaveOnFinish: true,
        leaveOnEmpty: true,
        emitAddSongWhenCreatingQueue: false,
        customFilters: {
            name: "8D",
            value: "apulsator=hz=0.08",
        },
        plugins: [new SpotifyPlugin()]
    })

const status = queue =>
    `Volumen: \`${queue.volume}%\` | Filtros: \`${queue.filters.names.join(', ') || 'Off'}\` | Loop: \`${queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
    }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``
client.distube
    .on('playSong', (queue, song) =>
        queue.textChannel.send({
            embeds: [new EmbedBuilder().setColor(process.env.COLOR)
                .setDescription(`🎶 | Escuchando \`${song.name}\` - \`${song.formattedDuration}\`\nAñadida por: ${song.user
                    }\n${status(queue)}`)]
        })
    )
    .on('addSong', (queue, song) =>
        queue.textChannel.send(
            {
                embeds: [new EmbedBuilder().setColor(process.env.COLOR)
                    .setDescription(`🎶 | Añadida ${song.name} - \`${song.formattedDuration}\` a la cola por ${song.user}`)]
            }
        )
    )
    .on('addList', (queue, playlist) =>
        queue.textChannel.send(
            {
                embeds: [new EmbedBuilder().setColor(process.env.COLOR)
                    .setDescription(`🎶 | añadida \`${playlist.name}\` playlist (${playlist.songs.length
                        } songs) a la cola\n${status(queue)}`)]
            }
        )
    )
    .on('error', (channel, e) => {
        if (channel) channel.send(`⛔ | Error encontrado: ${e.toString().slice(0, 1974)}`)
        else console.error(e)
    })
    .on('empty', channel => channel.send({
        embeds: [new EmbedBuilder().setColor(process.env.COLOR)
            .setDescription('⛔ | El Canal de Voz esta vacio! Saliendo del canal...')]
    }))
    .on('searchNoResult', (message, query) =>
        message.channel.send(
            {
                embeds: [new EmbedBuilder().setColor(process.env.COLOR)
                    .setDescription(`⛔ | No se ha encontrado \`${query}\`!`)]
            })
    )
    .on('finish', queue => queue.textChannel.send({
        embeds: [new EmbedBuilder().setColor(process.env.COLOR)
            .setDescription('🏁 | Cola Terminada!')]
    }))

}