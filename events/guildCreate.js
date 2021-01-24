module.exports = (client, guild) => {
    client.logger.cmd(`[GUILD JOIN] ${guild.name} (${guild.id}) added the bot.`)
    // ENHANCE add presentation message
}