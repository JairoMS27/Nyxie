const linkSchema = require('../../Schemas/link');
module.exports = async(client, message) => {

    if (message.content.startsWith('discord.gg') || message.content.includes('discord.gg/')) {
        const Data = await linkSchema.findOne({ Guild: message.guild.id });

        if (!Data) return;

        const memberPerms = Data.Perms;

        const user = message.author;
        const member = message.guild.members.cache.get(user.id);

        if (member.permissions.has(memberPerms)) return;
        else {
            await message.channel.send({ content: `${message.author}, no puedes mandar invitaciones aquí`}).then(msg => {
                setTimeout(() => msg.delete(), 3000)
            })

            ;(await message).delete();
        }
    }
}