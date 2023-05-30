const { SlashCommandBuilder } = require("discord.js");
const { Slots } = require("discord-gamecord");

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("🎰 Slots"),

    async execute (client, interaction) {

        const Game = new Slots({
            message: interaction,
            embed: {
              title: 'Tragaperras',
              color: '#83EF18'
            },
            slots: ['🍇', '🍊', '🍋', '🍌']
          });
          
          Game.startGame();
          Game.on('gameOver', result => {
            
          });
    }
}

