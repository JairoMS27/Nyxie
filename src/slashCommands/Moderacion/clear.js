const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChatInputCommandInteraction, ChannelType} = require("discord.js");
const Transcripts = require("discord-html-transcripts");
const clearSchema = require('../../Schemas/clearSchema');

module.exports = {
    CMD: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Borrar mensajes (Admin Only)")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false)
    .addSubcommand(command => command
        .setName(`use`)
        .setDescription(`Borra mensajes`)
        .addNumberOption(options => options
            .setName("amount")
            .setDescription("Numero de mensajes que quieres eliminar")
            .setMinValue(1)
            .setMaxValue(100)
            .setRequired(true)
        )
        .addStringOption(options => options
            .setName("reason")
            .setDescription("Explica la razon")
            .setRequired(true)
        )
        .addUserOption(options => options
            .setName("target")
            .setDescription("Elige el usuario del que quieres borrar los mensajes (Opcional)")
        )
    )
    .addSubcommand(command => command
        .setName(`config`)
        .setDescription(`Configura el canal de logs`)  
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('Elige el canal que quieres para los logs del comando.')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)    
        )  
    ),
    /**
     * 
     * @param {ChatInputCommandInteraction}  interaction
     * 
    */
    async execute(client, interaction) {
        const Amount = interaction.options.getNumber("amount");
        const Reason = interaction.options.getString("reason");
        const Target = interaction.options.getUser("target");
        const logChannel = interaction.options.getChannel('channel');

        const channelMessages = await interaction.channel.messages.fetch();
        const sub = interaction.options.getSubcommand();

        switch (sub) {
            case 'use':
                const Data = await clearSchema.findOne({ Guild: interaction.guild.id });

                if (!Data) {
                    interaction.reply({content: 'Usa /clear config para configurar un canal de logs.'})
                } else {
                const logChannel1 = Data.Channelogs;
                const logChannel2 = interaction.guild.channels.cache.get(logChannel1);
                const responseEmbed = new EmbedBuilder().setColor(process.env.COLOR);
                const logEmbed = new EmbedBuilder().setColor(process.env.COLOR)
                .setAuthor({name: "COMANDO CLEAR UTILIZADO"});

                let logEmbedDescription = [
                    `• Moderador: ${interaction.member}`,
                    `• Usuario: ${Target || "None"}`,
                    `• Canal: ${interaction.channel}`,
                    `• Razón: ${Reason}`
                ];

                if(Target) {
                    let i = 0;
                    let messagesToDelete = [];
                    channelMessages.filter((message) => {
                        if(message.author.id === Target.id && Amount > i) {
                            messagesToDelete.push(message);
                            i++
                        }
                    });

                    const Transcript = await Transcripts.generateFromMessages(messagesToDelete, interaction.channel);

                    interaction.channel.bulkDelete(messagesToDelete, true).then((messages) => {
                        interaction.reply({
                            embeds: [responseEmbed.setDescription(`🗑️ Borrados \`${messages.size}\` mensajes de ${Target}`)],
                            ephemeral: true
                        });

                        logEmbedDescription.push(`• Mensajes Totales: ${messages.size}`);
                        logChannel2.send({
                            embeds: [logEmbed.setDescription(logEmbedDescription.join("\n"))],
                            files: [Transcript]
                        });

                    });
                } else {
                    const Transcript = await Transcripts.createTranscript(interaction.channel, { limit: Amount });

                    interaction.channel.bulkDelete(Amount, true).then((messages) => {
                        interaction.reply({
                            embeds: [responseEmbed.setDescription(`🗑️ Borrados \`${messages.size}\` mensajes.`)],
                            ephemeral: true
                        });

                        logEmbedDescription.push(`• Mensajes Totales: ${messages.size}`);
                        logChannel2.send({
                            embeds: [logEmbed.setDescription(logEmbedDescription.join("\n"))],
                            files: [Transcript]
                        });
                    });
                }
            }
                
                
        break;

        case 'config':

        clearSchema.findOne({ Guild: interaction.guild.id}, async (err, data) => {

            if (!data) {
                clearSchema.create({
                    Guild: interaction.guild.id,
                    Channelogs: logChannel.id,
                })
                const embed = new EmbedBuilder()
                .setColor(process.env.COLOR)
                .setDescription(`Se ha configurado correctamente el canal de logs en ${logChannel}.`)

                interaction.reply({embeds: [embed], ephemeral:true})

            } else {
                await clearSchema.deleteMany({Guild: interaction.guild.id});

                clearSchema.create({
                    Guild: interaction.guild.id,
                    Channelogs: logChannel.id,
                })
                const embed = new EmbedBuilder()
                .setColor(process.env.COLOR)
                .setDescription(`Se ha configurado correctamente el canal de logs en ${logChannel}.`)

                interaction.reply({embeds: [embed], ephemeral:true})
            }
            
        })
        }
        
        

    }
}