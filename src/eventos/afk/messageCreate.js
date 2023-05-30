const afkSchema = require('../../Schemas/afkSchema');
module.exports = async(client, message) => {

    if (message.author.bot) return;

    const check = await afkSchema.findOne({ Guild: message.guild.id, User: message.author.id});
    if (check) {
        const nick = check.Nickname;
        await afkSchema.deleteMany({ Guild: message.guild.id, User: message.author.id});

        await message.member.setNickname(`${nick}`).catch(err => {
            return;
        })

        const m1 = await message.reply({ content: `Bienvenido de nuevo, ${message.author}! Te acabo de quitar el modo AFK`, ephemeral: true});
        setTimeout(() => {
            m1.delete();
        }, 4000)
    } else {

        const members = message.mentions.users.first();
        if (!members) return;
        const Data = await afkSchema.findOne({ Guild: message.guild.id, User: members.id});
        if (!Data) return;

        const member = message.guild.members.cache.get(members.id);
        const msg = Data.Message || 'Ninguna razón.';

        if (message.content.includes(members)) {
            const m = await message.reply({ content: `${member.user.tag} esta en modo AFK, no lo menciones - Razón: ${msg}`});
            setTimeout(() => {
                m.delete();
                message.delete();
            }, 4000)
        }
    }
}
