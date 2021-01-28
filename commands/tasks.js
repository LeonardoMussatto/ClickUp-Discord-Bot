const Discord = require("discord.js")
const { getFolders, getList, getTasks } = require("../utils/ClickUpAPI_Get")

// TODO update getFolder
// ENHANCE get folders, lists and tasks by name

exports.run = async (client, message, args) => {
  if (args.length === 1) {
    const list = await getList(client, args[0])
    if (list.err)
      return message.channel.send(`Error fetching list: ${list.err}`)

    const tasks = await getTasks(client, list.id)
    if (tasks.err)
      return message.channel.send(`Error fetching tasks: ${tasks.err}`)

    if (tasks.length === 0)
      return message.channel.send("There are no tasks in this list")
    const embed = new Discord.MessageEmbed()
      .setTitle(`Tasks in list *${list.name}* :`)
      .setDescription(
        tasks
          .map((x) => `• ${x.name}  |  ${x.status.status}  |  ${x.assignees}`)
          .join("\n")
      )
      .setColor("#8951FC")
    // const msg =
    // `Tasks in the list ${list.name}:\n\`\`\`\n${tasks
    //   .map((x) => `•  ${x.name} | ${x.status.status} | ${x.assignees}`)
    //   .join("\n")}\n\`\`\``
    return message.channel.send(embed)
  } else {
    const folders = await getFolders(client, "6831505").then((folders) =>
      folders.filter((f) => f.lists.length !== 0)
    )
    if (folders.err)
      return message.channel.send(`Error fetching folders: ${folders.err}`)

    for await (const folder of folders) {
      let msg = `All tasks in folder \`\`${folder.name}\`\` (\`\`${folder.id}\`\`):\n\`\`\`\n`
      for await (const list of folder.lists) {
        msg += "----------\n"
        msg += `• ${list.name} | ${list.id}\n`
        const tasks = await getTasks(client, list.id)
        if (tasks.length === 0) msg += "No tasks!\n"
        for await (const task of tasks) {
          if (!task.name) continue
          const ass = task.assignees
            ? ` | [${task.assignees.map((x) => x.username).join()}]`
            : ""
          msg += `  ↪ ${task.name} | ${task.id} | ${task.status.status} ${ass}\n`
        }
      }
      msg += `\n\`\`\``
      await message.channel.send(msg)
    }
  }
}

exports.help = {
  name: "tasks",
}
