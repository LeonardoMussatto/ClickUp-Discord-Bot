/** RELOAD COMMAND
 * reload selected command
 * show amount of time needed to complete the task
 * only registered devs can run this command
*/

const { Stopwatch } = require("@klasa/stopwatch")

exports.run = async (client, message, args) => {
  if (message.author.id !== client.config.dev_id)
    return message.channel.send(
      "Only developers are allowed to ask me to reload commands"
    )

  const cmd = client.commands.find(
    (x) => x.help.name.toLowerCase() === args[0].toLowerCase()
  )
  if (!cmd)
    return message.channel.send("paperwork got misfiled. oops ¯\\_(ツ)_/¯")

  const msg = await message.channel.send(
    `Reloading command **${cmd.help.name}** <a:loading:730285373422305360>`
  )
  try {
    const stopwatch = new Stopwatch().start()
    await client.unloadCommand(cmd.help.name)
    await client.loadCommand(cmd.help.name)
    stopwatch.stop()
    return msg.edit(
      `:white_check_mark: Command Reloaded in **${Math.round(
        stopwatch.duration
      )}ms**`
    )
  } catch (error) {
    return msg.edit(
      `:x: well, looks like it's broken again... blame ittim!\n\`\`\`\n${error}\n\`\`\``
    )
  }
}

exports.help = {
  name: "reload",
  args: 1,
  usage: "<command>",
}
