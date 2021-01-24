const {getTask, getFolder} = require("../utils/ClickUpAPI_Get")

exports.run = async (client, message, args) => {
  if (args.length !== 1)
    return message.channel.send(
      "I need information, in order to file it"
    )

  const task = await getTask(args[0])
  if (task.err)
    return message.channel.send(`ittim threw out the paper work... ${res1.err}`)

  const folder = await getFolder(task.folder.id)
  if (!folder) return message.channel.send("faafjebhroi! folder not found!")

  const res = await deleteTask(task.id)
  if (res.err) return message.channel.send(`fdgffrg! ${res.err}`)

  return message.channel.send(
    `Deleted task \`\`${task.name}\`\` from list \`\`${folder.name}\`\`!`
  )
}

exports.help = {
  name: "deletetask",
}
