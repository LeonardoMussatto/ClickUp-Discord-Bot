module.exports = async (client, message) => {
  if (message.channel.type !== "text") return
  if (message.author.bot) return
  if (!message.content.toLowerCase().startsWith(process.env.PREFIX.toLowerCase()))return
  if (!message.member.roles.cache.has(process.env.STAFF_ROLE))
    return message.channel.send("Sorry, your role doesn't give you permission to run this command")

  const args = message.content
    .slice(process.env.PREFIX.length)
    .trim()
    .split(/ +/g)
  const cmdName = args.shift().toLowerCase()
  const cmd = client.commands.find((x) => x.help.name === cmdName)
  if (!cmd) return message.channel.send("This command doesn't seem to exist.\n Try checking the spelling or use *cu!help* to get the list of available commands")
  console.log(
    `[Command Execution] ${message.author.username} (${
      message.author.id
    }) ran command ${cmd.help.name}: ${cmdName} ${args.join(" ")}`
  )
  return cmd.run(client, message, args)
}
