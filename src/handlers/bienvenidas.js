const setupSchema = require("../Schemas/setups");
const { AttachmentBuilder } = require("discord.js");
const { Welcome } = require("niby-welcomes");

module.exports = client => {
  client.on("guildMemberAdd", async member => {
    try {
      const { guild } = member;

      let setupData = await setupSchema.findOne({ guildID: guild.id });
      if (!setupData) return;

      let canalBienvenidas = guild.channels.cache.get(
        setupData?.bienvenidas?.canal
      );
      if (!canalBienvenidas) return;

      //CREACIÓN DE BUFFER DE IMAGEN (BIENVENIDA)
      let imagenBienvenida = await new Welcome()
        .setWelcomeMessage("BIENVENID@")
        .setUsername(member.user.tag, /*OPCIONAL*/ { color: "#ffffff" })
        .setMemberCount(
          `Eres el número #${member.guild.memberCount}`,
          /*OPCIONAL*/ { color: "#ffffff" }
        )
        .setAvatar(member.user.displayAvatarURL({size: 512, extension: "png"}))
        .setBackgroundUrl(
          setupData?.bienvenidas?.fondo,
          /*OPCIONAL*/ { opacity: 0.8 }
        )
        .setBorder(false, /*OPCIONAL*/ { color: "#ffffff", size: 15 })
        .setStyle("koya") //koya, mee6
        .build();

        let attachment = new AttachmentBuilder(imagenBienvenida, {name: `bienvenida ${member.user.tag}.png`});

        canalBienvenidas.send({content: `${setupData?.bienvenidas?.mensaje.replace(/{usuario}/, member).replace(/{servidor}/, guild.name)}`, files: [attachment]
    }).catch((e) => {console.log(e)});
    } catch (e) {
      console.log(e);
    }
  });
};
