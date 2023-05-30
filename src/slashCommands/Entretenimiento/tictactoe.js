const { SlashCommandBuilder } = require("discord.js");
const { TicTacToe } = require("discord-gamecord");

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("3 en raya con alguien, Menciona alguien para jugar")
    .addUserOption(options => options
        .setName("target")
        .setDescription("Elige el usuario con el que jugar")
        .setRequired(true)
    ),

    async execute (client, interaction) {

      const Game = new TicTacToe({
        message: interaction,
        opponent: interaction.options.getUser('target'),
        isSlashGame: true,
        embed: {
          title: '3 en Raya',
          color: '#83EF18',
          statusTitle: 'Status',
          overTitle: 'Game Over'
        },
        emojis: {
          xButton: '❌',
          oButton: '🔵',
          blankButton: '➖'
        },
        mentionUser: true,
        timeoutTime: 60000,
        xButtonStyle: 'DANGER',
        oButtonStyle: 'PRIMARY',
        turnMessage: '{emoji} | Es turno de **{player}**.',
        winMessage: '{emoji} | **{player}** Ganó.',
        tieMessage: 'Empate!',
        timeoutMessage: '¡El Juego se quedó sin terminar!',
        playerOnlyMessage: 'Solo {player} y {opponent} pueden usar los botones.'
      });
      
      Game.startGame();
      Game.on('gameOver', result => {

      });
    }
}

