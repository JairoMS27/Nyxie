const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  CMD: new SlashCommandBuilder()
  .setDescription('🎧 Añade filtros a las canciones')
  .addStringOption(option => option
    .setName("options")
    .setDescription("Elige el filtro que quieres agregar")
    .addChoices(
        { name: "Nightcore", value: "nightcore" },
        { name: "3D", value: "3d" },
        { name: "Vaporwave", value: "vaporwave" },
        { name: "Reverse", value: "reverse" },
        { name: "Surround", value: "surround" },
        { name: "Earwax", value: "earwax" },
        { name: "Earrape", value: "earrape" },
        { name: "BassBoost", value: "bassboost" },
        { name: "Resetear", value: "reset" },
    )
    .setRequired(true)
),

  async execute(client, interaction) {
    const { member, options, guild } = interaction;
    const embed = new EmbedBuilder();
    const option = options.getString("options");
    const voiceChannel = member.voice.channel;

    if (!voiceChannel)  {
      embed.setColor(process.env.COLOR).setDescription("Tienes que estar en un canal de voz para reproducir música.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    if (!member.voice.channelId == guild.members.me.voice.channelId) {
      embed.setColor(process.env.COLOR).setDescription(`No puedes reporducir musica porque ya estoy en <#${guild.members.me.voice.channelId}`);
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    
    try {
    const queue = client.distube.getQueue(interaction);
    if (!queue) {
      embed.setColor(process.env.COLOR).setDescription("No hay ninguna cola activa.");
      return interaction.reply({ embeds: [embed], ephemeral:true });
    }

    switch (option) {
      case "nightcore":
          queue.filters.add("nightcore");
          break;
      case "3d":
          queue.filters.add("3d");
          break;
      case "vaporwave":
          queue.filters.add("vaporwave");
          break;
      case "reverse":
          queue.filters.add("reverse");
          break;
      case "surround":
          queue.filters.add("surround");
          break;
      case "earwax":
          queue.filters.add("earwax");
          break;
      case "earrape":
          queue.setVolume(1000);
          break;
      case "bassboost":
          queue.filters.add("bassboost");
          break;
      case "reset":
          queue.filters.clear();
          queue.setVolume(50)
          break;

    }

    if (option === "reset") {
      embed.setColor(process.env.COLOR).setDescription("♻️ Se han reseteado los filtros.");
      return interaction.reply({ embeds: [embed], ephemeral: true});
    }

    embed.setColor(process.env.COLOR).setDescription("🎤 El filtro se ha aplicado.");
      return interaction.reply({ embeds: [embed], ephemeral: true});

    } catch (err) {
      console.log(err);

      embed.setColor(process.env.COLOR).setDescription("⛔ | Algo salio mal...");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }
}
