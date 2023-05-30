const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription('Configura el sistema AutoMod.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(command => command
        .setName('palabras-ofensivas') 
        .setDescription('Bloquea blasfemias, contenido sexual e insultos')   
    )
    .addSubcommand(command => command
        .setName('spam')
        .setDescription('Bloquea mensajes sospechosos de spam')     
    )
    .addSubcommand(command => command
        .setName('menciones')
        .setDescription('Bloquea los mensajes que contengan un determinado número de menciones')
        .addIntegerOption(option => option
            .setName('number')
            .setDescription('Numero de menciones necesarias')
            .setRequired(true)
        )     
    )
    .addSubcommand(command => command
        .setName('keyword')
        .setDescription('Bloquea una palabra clave determinada en el servidor')  
        .addStringOption(option => option
            .setName('word')
            .setDescription('Palabra a bloquear')
            .setRequired(true)
        )   
    ),

    async execute(client, interaction) {
        const { guild, options } = interaction;
        const sub = options.getSubcommand();

        switch (sub) {
            case 'palabras-ofensivas':
                
            await interaction.reply({content: `⚙️ Cargando regla...`});

            const rule = await guild.autoModerationRules.create({
                name: `Bloquear blasfemias, contenido sexual e insultos. Creado por Nyxie`,
                creatorId: '1075757342756454430',
                enabled: true,
                eventType: 1,
                triggerType: 4,
                triggerMetadata:
                    {
                        presets: [1, 2, 3]
                    },
                actions: [
                    {
                        type: 1,
                        metadata: {
                            channel: interaction.channel,
                            durationSeconds: 10,
                            customMessage: 'Este mensaje fue impedido por la moderación automática de Nyxie'
                        }
                    }
                ]
            }).catch(async err => {
                setTimeout(async () => {
                    console.log(err);
                    await interaction.editReply({content: `${err}`});
                }, 2000)
            })

            setTimeout(async () => {
                if (!rule) return;

                const embed = new EmbedBuilder()
                .setColor(process.env.COLOR)
                .setDescription(`✅ | Tu regla ha sido configurada correctamente y Nyxie se encargará de todo.`)

                await interaction.editReply({content: ``, embeds: [embed]});
            }, 3000)

                break;
        
            case 'keyword':

            await interaction.reply({content: `⚙️ Cargando regla...`});
            let word = options.getString('word');

            const rule2 = await guild.autoModerationRules.create({
                name: `Prohibe la palabra ${word} de ser usada. Creado por Nyxie`,
                creatorId: '1075757342756454430',
                enabled: true,
                eventType: 1,
                triggerType: 1,
                triggerMetadata:
                    {
                        keywordFilter: [`${word}`]
                    },
                actions: [
                    {
                        type: 1,
                        metadata: {
                            channel: interaction.channel,
                            durationSeconds: 10,
                            customMessage: 'Este mensaje fue impedido por la moderación automática de Nyxie'
                        }
                    }
                ]
            }).catch(async err => {
                setTimeout(async () => {
                    console.log(err);
                    await interaction.editReply({ content: `${err}`});
                }, 2000)
            })

            setTimeout(async () => {
                if (!rule2) return;

                const embed2 = new EmbedBuilder()
                .setColor(process.env.COLOR)
                .setDescription(`✅ | Tu regla ha sido configurada y todos los mensajes que contengas la palabra **${word}** serán eliminados.`)

                await interaction.editReply({content: ``, embeds: [embed2]});
            }, 3000)

                break;
            
            case 'spam':

            await interaction.reply({content: `⚙️ Cargando regla...`});
            //const number = options.getString('number');

            const rule3 = await guild.autoModerationRules.create({
                name: 'Evita el spam de mensajes. Creado por Nyxie',
                creatorId: '1075757342756454430',
                enabled: true,
                eventType: 1,
                triggerType: 3,
                triggerMetadata:
                    {
                        //mentionTotalLimit: number
                    },
                actions: [
                    {
                        type: 1,
                        metadata: {
                            channel: interaction.channel,
                            durationSeconds: 10,
                            customMessage: 'Este mensaje fue impedido por la moderación automática de Nyxie'
                        }
                    }
                ]
            }).catch(async err => {
                setTimeout(async () => {
                    console.log(err);
                    await interaction.editReply({content: `${err}`});
                }, 2000)
            })

            setTimeout(async () => {
                if (!rule3) return;

                const embed3 = new EmbedBuilder()
                .setColor(process.env.COLOR)
                .setDescription(`✅ | Tu regla ha sido configurada correctamente y Nyxie se encargará de todo.`)

                await interaction.editReply({content: ``, embeds: [embed3]});
            }, 3000)

                break;

            case 'menciones':

            await interaction.reply({content: `⚙️ Cargando regla...`});
            const number = options.getInteger('number');

            const rule4 = await guild.autoModerationRules.create({
                name: 'Evita el spam de menciones by Nyxie',
                creatorId: '1075757342756454430',
                enabled: true,
                eventType: 1,
                triggerType: 5,
                triggerMetadata:
                    {
                        mentionTotalLimit: number
                    },
                actions: [
                    {
                        type: 1,
                        metadata: {
                            channel: interaction.channel,
                            durationSeconds: 10,
                            customMessage: 'Este mensaje fue impedido por la moderación automática de Nyxie'
                        }
                    }
                ]
            }).catch(async err => [
                setTimeout(async () => {
                    console.log(err);
                    await interaction.editReply({content: `${err}`});
                }, 2000)
            ])

            setTimeout(async () => {
                if (!rule4) return;

                const embed4 = new EmbedBuilder()
                .setColor(process.env.COLOR)
                .setDescription(`✅ | Tu regla ha sido configurada correctamente y Nyxie se encargará de todo.`)

                await interaction.editReply({content: ``, embeds: [embed4]});
            }, 3000)

            break;
        }
    }
    
}