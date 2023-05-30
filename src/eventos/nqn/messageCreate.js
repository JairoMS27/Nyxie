module.exports = async(client, message) => {
    console.log('Mensaje recibido:', message.content);

  if (!message.author.bot) {
    const emojiRegex = /<a?(:\w+:)\d+>/g;
    const emojis = message.content.match(emojiRegex);

    if (emojis) {
      console.log('Emojis encontrados:', emojis);

      const channel = message.channel;
      const webhook = await channel.createWebhook('EmojiWebhook', {
        avatar: message.author.displayAvatarURL(),
      });

      console.log('Webhook creado:', webhook);

      for (const emojiString of emojis) {
        const emojiName = emojiString.match(/:(\w+):/)[1];
        const emoji = client.emojis.cache.find(emoji => emoji.name === emojiName);

        console.log('Emoji encontrado:', emoji);

        if (emoji) {
          const webhookMessage = await webhook.send({
            content: emoji.toString(),
            username: message.author.username,
            avatarURL: message.author.displayAvatarURL(),
          });

          console.log('Mensaje enviado:', webhookMessage);

          await webhookMessage.react(emoji);
        }
      }

      await message.delete();
      console.log('Mensaje eliminado:', message);
    }
  }
}