const { SlashCommandBuilder } = require("discord.js");
const { GuessThePokemon } = require('discord-gamecord');

module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("❓ Adivina el pokemon"),

    async execute (client, interaction) {

      const Game = new GuessThePokemon({
        message: interaction,
        embed: {
          title: 'Adivina el pokemon',
          color: '#83EF18'
        },
        timeoutTime: 60000,
        winMessage: 'Lo adivinaste! Es {pokemon}.',
        loseMessage: 'Fallaste! Es {pokemon}.',
        errMessage: 'No se pueden recuperar los datos de pokemon! Por favor, inténtalo de nuevo.',
        playerOnlyMessage: 'Solo {player} puede usar los botones.'
      });
      
      Game.startGame();
      Game.on('gameOver', result => {
        
      });
    }
}

