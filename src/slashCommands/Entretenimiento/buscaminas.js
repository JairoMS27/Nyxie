const { SlashCommandBuilder } = require("discord.js");
const { Minesweeper } = require('discord-gamecord');

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("💣 Buscaminas"),

    async execute (client, interaction) {

        const Game = new Minesweeper({
            message: interaction,
            isSlashGame: false,
            embed: {
              title: 'Buscaminas',
              color: '#83EF18',
              description: 'Clica en los botones para descubrir las casillas.'
            },
            emojis: { flag: '🚩', mine: '💣' },
            mines: 5,
            timeoutTime: 60000,
            winMessage: 'Has Ganado!',
            loseMessage: 'Has Perdido',
            playerOnlyMessage: 'Solo {player} puede jugar.'
          });
          
          Game.startGame();
          Game.on('gameOver', result => {

          });
    }
}
