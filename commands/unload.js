const { Stopwatch } = require("@klasa/stopwatch")

exports.run = async (client, message, args) => {
  if (message.author.id !== process.env.DEV_ID)
    return message.channel.send(
      "Only developers are allowed to ask me to unload commands"
    )
  if (!args || args.length < 0)
    return message.channel.send("You must provide me a command to reload")
  const cmd = client.commands.find(
    (x) => x.help.name.toLowerCase() === args[0].toLowerCase()
  )
  if (!cmd)
    return message.channel.send("paperwork got misfiled. oops ¯\\_(ツ)_/¯")
  const msg = await message.channel.send(
    `Unloading command **${cmd.help.name}** <a:loading:730285373422305360>`
  )
  try {
    const stopwatch = new Stopwatch().start()
    await client.unloadCommand(cmd.help.name)
    stopwatch.stop()
    return msg.edit(
      `<a:tickgreen:730207093797290025> Command Unloaded in **${Math.round(stopwatch.duration)}ms**`
    )
  } catch (error) {
    return msg.edit(
      `<a:tickred:730207097114984519> well, looks like it's broken again... blame ittim!\n\`\`\`\n${error}\n\`\`\``
    )
  }
}

exports.help = {
  name: "unload",
}
