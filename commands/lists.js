const fetch = require("node-fetch")
const {getFolder, getLists, getFolders} = require("../ClickUpAPIUtils/ClickUpAPI_Get")

exports.run = async (client, message, args) => {
  if (args.length === 1) {
    const folder = await getFolder(args[0])
    if (folder.err)
      return message.channel.send(`Error fetching folder: ${folder.err}`)

    const lists = await getLists(folder.id)
    if (lists.err)
      return message.channel.send(`Error fetching lists: ${lists.err}`)

    return message.channel.send(
      `Lists in the folder ${folder.name}:\n\`\`\`\n${lists
        .map((x) => `• ${x.name} | ${x.id}`)
        .join("\n")}\n\`\`\``
    )
  } else {
    const folders = await getFolders(process.env.SPACE_ID)
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
