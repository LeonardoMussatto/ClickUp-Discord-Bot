const {getFolders} = require("../utils/ClickUpAPI_Get")

exports.run = async (client, message, args) => {
  const folders = await getFolders(process.env.SPACE_ID)
  if (folders.err)
    return message.channel.send(`Error fetching folders: ${folders.err}`)
  return message.channel.send(
    `Folders:\n\`\`\`\n${folders
      .map((x) => `• ${x.name} | ${x.id}`)
      .join("\n")}\n\`\`\``
  )
}

exports.help = {
  name: "folders",
}
