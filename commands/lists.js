const { getFolder, getLists, getFolders } = require("../utils/ClickUpAPI_Get")

// TODO update getFolder
// ENHANCE get folders and lists by name
// ENHANCE add more info about the lists

exports.run = async (client, message, args) => {
  if (args.length === 1) {
    const folder = await getFolder(client, args[0])
    if (folder.err)
      return message.channel.send(`Error fetching folder: ${folder.err}`)

    const lists = await getLists(client, folder.id)
    if (lists.err)
      return message.channel.send(`Error fetching lists: ${lists.err}`)

    const embed = new Discord.MessageEmbed()
      .setTitle(`Lists in the folder *${folder.name}* :`)
      .setDescription(lists.map((x) => `• ${x.name} | ${x.id}`).join("\n"))
      .setColor("#8951FC")
    return message.channel.send(embed)
  } else {
    const folders = await getFolders(client, "6831505")
    if (folders.err)
      return message.channel.send(`Error fetching folders: ${folder.err}`)

    let msg = ""
    for (const folder of folders) {
      const lists = folder.lists
      msg += `\n--------\nFolder: ${folder.name} | ${folder.id}\n${lists
        .map((l) => `  • ${l.name} | ${l.id}`)
        .join("\n")}`
    }

    return message.channel.send(`All lists:\n\`\`\`\n${msg}\n\`\`\``)
  }
}

exports.help = {
  name: "lists",
}
