const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const Database = require("../../Schemas/infractions");
const ms = require("ms");

module.exports = {
    CMD: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Manda a alguien al rincon temporalmente. (Admin Only)")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addUserOption(options => options
            .setName("target")
            .setDescription("Selecciona al castigado")
            .setRequired(true)
        )
        .addStringOption(options => options
            .setName("duration")
            .setDescription("Ingresa la duracion (1m,1h,1d)")
            .setRequired(true)
        )
        .addStringOption(options => options
            .setName("reason")
            .setDescription("Explica el motivo.")
            .setMaxLength(512)
        ),
        /**
         * 
         * @param {ChatInputCommandInteraction}  interaction
         * 
         */
        async execute(client, interaction) {
            const { options, guild, member } = interaction;
            const target = options.getMember("target");
            const duration = options.getString("duration");
            const reason = options.getString("reason") || "No especificado.";

            const errorsArray = [];

            const errorsEmbed = new EmbedBuilder()
            .setAuthor({name: "No se ha podido cerrar el miembro debido a"})
            .setColor("Red")

            if(!target) return interaction.reply({
                embeds: [errorsEmbed.setDescription("El pibe se fue.")],
                ephemeral: true
            });

            if(!ms(duration) || ms(duration) > ms("28d"))
            errorsArray.push("El tiempo es incorrecto o supera los 28 dias.");

            if(!target.manageable || !target.moderatable)
            errorsArray.push("El usuario seleccionado es parte del staff.");

            if(member.roles.highest.position < target.roles.highest.position)
            errorsArray.push("El usuario seleccionado esta por encima de ti");

            if(errorsArray.length)
            return interaction.reply({
                embeds: [errorsEmbed.setDescription(errorsArray.join("\n"))],
                ephemeral: true
            });


            target.timeout(ms(duration), reason).catch((err) => {
                interaction.reply({
                    embeds: [errorsEmbed.setDescription("No se ha podido castigar al usuario debido a un error poco común")]
                })
                return console.log("Error ocurred in Timeout.js", err)
            });

            const newInfractionsObject = {
                IssuerID: member.id,
                IssuerTag: member.user.tag,
                reason: reason,
                Date: Date.now()
            }

            let userData = await Database.findOne({Guild: guild.id, User: target.id});
            if(!userData) userData = await Database.create({Guild: guild.id, User: target.id, Infractions: [newInfractionsObject]});
            else userData.Infractions.push(newInfractionsObject) && await userData.save();


            const successEmebd = new EmbedBuilder()
            .setAuthor({name: "Timeout issues", iconURL: guild.iconURL()})
            .setColor(process.env.COLOR)
            .setDescription([
                `${target} se fue al banquillo durante **${ms(ms(duration), {long: true})}** gracias a ${member}`,
                `Ahora tiene un total de **${userData.Infractions.length} puntos**.`,
                `\nReason: ${reason}`
            ].join("\n"));

            return interaction.reply({embeds: [successEmebd]});

        }
}