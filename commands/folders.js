const { getFolders } = require("../utils/ClickUpAPI_Get")

// TODO update getFolder
// ENHANCE get folders by name
// ENHANCE add more infos about the folder - e.g. if a chat is present

exports.run = async (client, message, args) => {
  const folders = await getFolders(client, "6831505")
  if (folders.err)
    return message.channel.send(`Error fetching folders: ${folders.err}`)
  const embed = new Discord.MessageEmbed()
    .setTitle(`Folders in the space *~spaceNameHere~* :`)
    .setDescription(folders.map((x) => `• ${x.name} | ${x.id}`).join("\n"))
    .setColor("#8951FC")
  return message.channel.send(embed)
}

exports.help = {
  name: "folders",
}
