const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js');
module.exports = {
    OWNER: true,
    CMD: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription("Recarga los archivos del bot (Owner Only)")
    .addStringOption(option =>
        option.setName("modulo")
        .setDescription("Módulo a recargar")
        .addChoices(
            {name: "Comandos", value: "comandos"},
            {name: "Comandos Diagonales", value: "slash"},
            {name: "Eventos", value: "events"},
            {name: "Handlers", value: "handlers"},
        )
        ),

    async execute(client, interaction, prefix){
        let args = interaction.options.getString("modulo");
        let opcion = "Comandos, Eventos y Handlers";

        try {
            switch (args?.toLowerCase()) {
                case "commands":
                case "comandos":{
                    opcion = "Comandos"
                    await client.loadCommands();
                }
                    break;

                case "slashcommands":
                case "slash":{
                    opcion = "Comandos Diagonales"
                    await client.loadSlashCommands();
                }
                    break;

                case "handlers":{
                    opcion = "Handlers"
                    await client.loadHandlers();
                }
                    break;

                case "events":
                case "eventos":{
                    opcion = "Eventos"
                    await client.loadEvents();
                }
                    break;
                
                default:{
                    await client.loadEvents();
                    await client.loadHandlers();
                    await client.loadSlashCommands();
                    await client.loadCommands();
                }
                    break;
            }

            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .addFields({name: `✅ ${opcion} Recargados`, value: `*Okay!*`})
                    .setColor(process.env.COLOR)

                ]
        })

        } catch(e) {
            interaction.reply({content:`**Ha ocurrido un error al recargar los archivos!**\n*Mira la consola para más detalles!.*`});
            console.log(e);
        }
    }
}