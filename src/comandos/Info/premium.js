module.exports = {
    DESCRIPTION: "Sirve para ver si eres usuario premium.",
    PREMIUM: true,
    async execute(client, message, args, prefix, GUILD_DATA) {

        return message.reply(`🌟 Si ves este mensaje eres usuario Premium`)

        
    }
}