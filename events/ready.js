module.exports = async (client) => {
  client.logger.log(`ClickUp bot ready to work with ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`, "ready")
  client.user.setActivity(`${client.settings.prefix}help`, {type: "PLAYING"})
}
