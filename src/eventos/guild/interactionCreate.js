module.exports = async(client, interaction) => {
    if(!interaction.guild || !interaction.channel) return;

    const COMANDO = client.slashCommands.get(interaction?.commandName);

    if(COMANDO){
        if(COMANDO.OWNER) {
            const DUEÑOS = process.env.OWNER.split(" ");
            if(!DUEÑOS.includes(interaction.user.id)) return interaction.reply({content: `❌ **Solo el dueño de este bot pueden ejecutar este comando!**\nDueño del bot: ${DUEÑOS.map(DUEÑO => `<@${DUEÑO}>`).join(", ")}`})
        }

        if(COMANDO.BOT_PERMISSIONS) {
            if(!interaction.guild.members.me.permissions.has(COMANDO.BOT_PERMISSIONS)) return interaction.reply({content: `❌ **Necesito los siguientes permisos para ejecutar este comando**\n${COMANDO.BOT_PERMISSIONS.map(PERMISO => `\`${PERMISO}\``).join(", ")}`})
        }

        if(COMANDO.PERMISSIONS) {
            if(!interaction.member.permissions.has(COMANDO.PERMISSIONS)) return interaction.reply({content: `❌ **Necesitas los siguientes permisos para ejecutar este comando**\n${COMANDO.PERMISSIONS.map(PERMISO => `\`${PERMISO}\``).join(", ")}`})
        }

        if (COMANDO.PREMIUM) {
            const PREMIUM = process.env.PREMIUM_IDS.split(" ");
            if(!PREMIUM.includes(message.author.id)) return message.reply({content: `❌ **Solo los usuarios Premium de este bot pueden ejecutar este comando!**`})
        }

        try {
            COMANDO.execute(client, interaction, "/")
        } catch(e){
            interaction.reply({content: `**Ha ocurrido un error al ejecutar el comando!**\n*Mira la consola para más detalle!`});
            console.log(e)
            return;
        }
    }
}