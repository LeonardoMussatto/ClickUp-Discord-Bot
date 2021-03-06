/** LOAD COMMAND
 * load selected command
 * show amount of time needed to complete the task
 * only registered devs can run this command
*/

const { Stopwatch } = require("@klasa/stopwatch")

exports.run = async (client, message, args) => {
  if (message.author.id !== client.config.dev_id)
    return message.channel.send(
      "Only developers are allowed to ask me to load commands"
    )
  if (!args || args.length < 0)
    return message.channel.send("You must provide me a command to reload")

  const msg = await message.channel.send(
    `Loading command **${args[0]}** <a:loading:730285373422305360>`
  )
  try {
    const stopwatch = new Stopwatch().start()
    await client.loadCommand(args[0])
    stopwatch.stop()
    return msg.edit(
      `:white_check_mark: Command Loaded in **${Math.round(
        stopwatch.duration
      )}ms**`
    )
  } catch (error) {
    return msg.edit(
      `:x: well fuck, looks like shits broken again... blame ittim!\n\`\`\`\n${error}\n\`\`\``
    )
  }
}

exports.help = {
  name: "load",
  args: 1,
  usage: "<command>",
}
