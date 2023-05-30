const { EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');
const pollschema = require('../../Schemas/poll');

module.exports = async(client, interaction) => {
    if (!interaction.guild) return;
    if (!interaction.message) return;
    if (!interaction.isButton) return;

    const data = await pollschema.findOne({Guild: interaction.guild.id, Msg: interaction.message.id});
    if (!data) return;
    const msg = await interaction.channel.messages.fetch(data.Msg);

    if (interaction.customId === 'up') {
        if (data.UpMembers.includes(interaction.user.id)) return await interaction.reply({ content: `No puedes volver a votar!`, ephemeral: true });

        let downvotes = data.Downvote;
        if (data.DownMembers.includes(interaction.user.id)) {
            downvotes = downvotes - 1;
        }

        const newembed = EmbedBuilder.from(msg.embeds[0]).setFields({name: `A favor`, value: `> **${data.Upvote + 1}** votos`, inline: true}, {name: 'En contra', value: `> **${downvotes}** votos`, inline: true}, {name: `Autor`, value: `> <@${data.Owner}>`})

        const buttons = new ActionRowBuilder()
        .addComponents(

            new ButtonBuilder()
            .setCustomId('up')
            .setLabel('✅')
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setCustomId('down')
            .setLabel('❌')
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setCustomId('votes')
            .setLabel('Votos')
            .setStyle(ButtonStyle.Secondary),
        )

        await interaction.update({embeds: [newembed], components: [buttons] });

        data.Upvote++;

        if (data.DownMembers.includes(interaction.user.id)) {
            data.Downvote = data.Downvote - 1;
        }

        data.UpMembers.push(interaction.user.id);
        data.DownMembers.pull(interaction.user.id);
        data.save();
    }

    if (interaction.customId === 'down') {
        
        if (data.DownMembers.includes(interaction.user.id)) return await interaction.reply({ content: `No puedes votar mas de una vez!`, ephemeral: true });

        let upvotes = data.Upvote;
        if (data.UpMembers.includes(interaction.user.id)) {
            upvotes = upvotes - 1;
        }

        const newembed = EmbedBuilder.from(msg.embeds[0]).setFields({name: `A favor`, value: `> **${upvotes}** votos`, inline: true}, {name: 'En contra', value: `> **${data.Downvote + 1}** votos`, inline: true}, {name: `Autor`, value: `> <@${data.Owner}>`})

        const buttons = new ActionRowBuilder()
        .addComponents(

            new ButtonBuilder()
            .setCustomId('up')
            .setLabel('✅')
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setCustomId('down')
            .setLabel('❌')
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setCustomId('votes')
            .setLabel('Votos')
            .setStyle(ButtonStyle.Secondary),
        )

        await interaction.update({ embeds: [newembed], components: [buttons] });

        data.Downvote++;

        if (data.UpMembers.includes(interaction.user.id)) {
            dataUpvote = data.Upvote - 1;
        }

        data.DownMembers.push(interaction.user.id);
        data.UpMembers.pull(interaction.user.id);
        data.save();
    }

    if (interaction.customId === 'votes') {

        let upvoters = [];
        await data.UpMembers.forEach(async member => {
            upvoters.push(`<@${member}>`)
        });

        let downvoters = [];
        await data.DownMembers.forEach(async member => {
            downvoters.push(`<@${member}>`)
        });

        const embed = new EmbedBuilder()
        .setColor(process.env.COLOR)
        .setAuthor({ name: '📃 Sistema de Encuestas'})
        .setFooter({ text: '📃 Participantes'})
        .setTimestamp()
        .setTitle(`Votos`)
        .addFields({ name: `A Favor (${upvoters.length})`, value: `> ${upvoters.join(', ').slice(0, 1020) || `No hay votos`}`, inline: true})
        .addFields({ name: `En contra (${downvoters.length})`, value: `> ${downvoters.join(', ').slice(0, 1020) || `No hay votos`}`, inline: true})

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}