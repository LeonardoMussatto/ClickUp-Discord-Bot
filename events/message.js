/** MESSAGE EVENT
 * Checks and pre-commands features:
 *   • only check for messages in text channels
 *   • ignore messages from other bots
 *   • post to ClickUp messages sent to specific channels, if the feature is active
 *   • ignore messages not starting with the selected prefix, on regular channels
 *   • update member list if a new member joins a server
 *   • basic role handling - to be improved
 * Command handling
 *   • find command in command's collection
 *   • create args
 *   • check if enough args are provided. If not, show expected usage. Both args minimum number and expected usage are defined in each command's file.
 *   • return command
*/

const { postComment } = require("../utils/ClickUpAPI_Actions")

module.exports = async (client, message) => {
  if (message.channel.type !== "text") return
  if (message.author.bot) return
  if (client.settings.modules.sync) {
    if (
      Object.values(client.settings.sync.TeamChat).includes(message.channel.id)
    ) {
      let view_id = client.settings.sync.TeamChat.viewId
      postComment(client, view_id, message)
    } else if (
      client.settings.sync.SpaceChat.some(
        (x) => x.channelId === message.channel.id
      )
    ) {
      let index = client.settings.sync.SpaceChat.findIndex(
        (x) => x.channelId === message.channel.id
      )
      let view_id = client.settings.sync.SpaceChat[index].viewId
      postComment(client, view_id, message)
    } else if (
      client.settings.sync.FolderChat.some(
        (x) => x.channelId === message.channel.id
      )
    ) {
      let index = client.settings.sync.FolderChat.findIndex(
        (x) => x.channelId === message.channel.id
      )
      let view_id = client.settings.sync.FolderChat[index].viewId
      postComment(client, view_id, message)
    } else if (
      client.settings.sync.ListChat.some(
        (x) => x.channelId === message.channel.id
      )
    ) {
      let index = client.settings.sync.ListChat.findIndex(
        (x) => x.channelId === message.channel.id
      )
      let view_id = client.settings.sync.ListChat[index].viewId
      postComment(client, view_id, message)
    }
  }
  if (
    !message.content
      .toLowerCase()
      .startsWith(client.settings.bot.prefix.toLowerCase())
  )
    return
  if (message.guild && !message.member)
    await message.guild.members.fetch(message.author)
  if (!message.member.roles.cache.has(client.config.staff_role))
    return message.channel.send(
      "Sorry, your role doesn't give you permission to run this command"
    )

  const args = message.content
    .slice(client.settings.bot.prefix.length)
    .trim()
    .split(/ +/g)
  const cmdName = args.shift().toLowerCase()
  const cmd = client.commands.find((x) => x.help.name.toLowerCase() === cmdName)
  if (!cmd)
    return message.channel.send(
      "This command doesn't seem to exist.\n Try checking the spelling or use *cu!help* to get the list of available commands"
    )
  client.logger.cmd(
    `[Command Execution] ${message.author.username} (${
      message.author.id
    }) ran command ${cmd.help.name}: ${cmdName} ${args.join(" ")}`
  )
  if (args.length < cmd.help.args) {
    let reply = `You didn't provide any arguments, ${message.author}!`
    if (cmd.help.usage) {
      reply += `\nThe proper usage would be: \`${client.settings.bot.prefix}${cmd.help.name} ${cmd.help.usage}\``
    }
    return message.channel.send(reply)
  }
  return cmd.run(client, message, args)
}
