module.exports = (client, guild) => {
  if (!guild.available) return
  client.logger.cmd(`[GUILD LEAVE] ${guild.name} (${guild.id}) removed the bot.`)
  // TODO add handling for stale data in database
}
