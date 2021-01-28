const { getTask, getFolder } = require("../utils/ClickUpAPI_Get")

// ?? consider deleting this command. It might be safer to use ClickUp directly when deleting things - at least set up a double check - e.g. ask the user for confirmation

exports.run = async (client, message, args) => {
  if (args.length !== 1)
    return message.channel.send("I need information, in order to file it")

  const task = await getTask(client, args[0])
  if (task.err)
    return message.channel.send(`ittim threw out the paper work... ${res1.err}`)

  const folder = await getFolder(client, task.folder.id)
  if (!folder) return message.channel.send("faafjebhroi! folder not found!")

  const res = await deleteTask(client, task.id)
  if (res.err) return message.channel.send(`fdgffrg! ${res.err}`)

  return message.channel.send(
    `Deleted task \`\`${task.name}\`\` from list \`\`${folder.name}\`\`!`
  )
}

exports.help = {
  name: "deletetask",
  args: 1,
  usage: "<task_id>",
}
