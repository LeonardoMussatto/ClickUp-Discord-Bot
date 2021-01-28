/** REBOOT COMMAND
 * end node process
 * only registered devs can run this command
 */

exports.run = async (client, message, args) => {
  if (message.author.id !== client.config.dev_id)
    return message.channel.send(
      "Only developers are allowed to ask me to reload commands"
    )
  await message.reply("Bot is shutting down.")
  await Promise.all(client.commands.map((cmd) => client.unloadCommand(cmd)))
  process.exit(1)
}

exports.help = {
  name: "reboot",
  category: "System",
  description:
    "Shuts down the bot. If running under PM2, bot will restart automatically.",
  usage: "reboot",
}
