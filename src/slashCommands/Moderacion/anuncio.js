const { SlashCommandBuilder, ChannelType, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  OWNER: true,
  CMD: new SlashCommandBuilder()
  .setDescription('Manda un anuncio a un canal (Admin Only).')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addChannelOption(a => a
    .setName('canal')
    .setDescription('Canal donde se enviara el anuncio.')
    .addChannelTypes(ChannelType.GuildText)
    .setRequired(true)
    )
  .addStringOption(a => a
    .setName('titulo')
    .setDescription('Coloca el titulo al anuncio.')
    .setRequired(true)
    )
  .addStringOption(a => a
    .setName('description')
    .setDescription('Envia el contenido del anuncio.')
    .setRequired(true)
    )
  .addBooleanOption(a => a
    .setName('ping')
    .setDescription('Informa si quieres envíar un ping al canal del anuncio.')
    .setRequired(true)
    )
  .addStringOption(option => option
    .setName('foto')
    .setDescription('Link de una foto png/jpeg')
    .setRequired(false)    
  ),


  async execute(client, interaction){
    const { guild } = interaction;
    const 
          channel = interaction.options.getChannel('canal'),
          title = interaction.options.getString('titulo'),
          desc = interaction.options.getString('description'),
          boolean = interaction.options.getBoolean('ping');
          foto = interaction.options.getString('foto');
          icon = guild.iconURL();

          if (foto.startsWith('https') || foto.includes('http')) {
            const embed = new EmbedBuilder()
            .setColor(process.env.COLOR)
            .setThumbnail(icon)
            .setTitle(`${title}`)
            .setDescription(`${desc}`)
            .setImage(`${foto || null}`)


            client.channels.cache.get(channel.id).send({embeds: [embed]}).catch((e) => console.error(e));
            await interaction.reply({ content: "El anuncio se ha enviado", ephemeral: true});
            if(!boolean) return; 
            else client.channels.cache.get(channel.id).send({ content: '@everyone' });
          } else {
            return await interaction.reply({content: 'Tienes que subir un enlace valido.', ephemeral: true});
          }

  }
}