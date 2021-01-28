/** SYNC CHAT
 * command to manually retrieve messages from ClickUp
 *  • create new args with the selected targets (spaces/folders/lists)
 *  • if only one arg is passed, sync all teams/spaces/folders/lists
 *  • if more args are provided, sync selected spaces/folders/lists
 * //IMPORTANT spaces/folders/lists have to be called by name - please use unique names
 * //REMEMBER it's only possible to sync targets which have been inserted in the database
 */

const {
  getTeamComments,
  getSpaceComments,
  getFolderComments,
  getListComments,
} = require("../utils/syncCommentsFromClickUp")

exports.run = async (client, message, args) => {
  const newArgs = message.content
    .slice(client.settings.bot.prefix.length + this.help.name.length)
    .trim()
    .split("|")
    .map((x) => x.trim())

  if (newArgs.length === 1) {
    switch (newArgs[0].toLowerCase()) {
      case "team": {
        getTeamComments(client, client.settings.sync.TeamChat, message)
        break
      }
      case "spaces": {
        for await (const space of client.settings.sync.SpaceChat) {
          getSpaceComments(client, space, message)
        }
        break
      }
      case "folders": {
        for await (const folder of client.settings.sync.FolderChat) {
          getFolderComments(client, folder, message)
        }
        break
      }
      case "lists": {
        for await (const list of client.settings.sync.ListChat) {
          getListComments(client, list, message)
        }
        break
      }
      default: {
        let reply = `Sorry ${message.author}, you didn't provide a valid option!\nThe options are:\n\` - team \n - spaces \n - folders \n - lists \``
        message.channel.send(reply)
        break
      }
    }
  } else {
    switch (newArgs[0].toLowerCase()) {
      case "team": {
        getTeamComments(client, client.settings.sync.TeamChat, message)
        break
      }
      case "spaces": {
        let spaces = client.settings.sync.SpaceChat.filter((x) =>
          newArgs.some((t) => t === x.spaceName)
        )
        for await (const space of spaces) {
          getSpaceComments(client, space, message)
        }
        break
      }
      case "folders": {
        let folders = client.settings.sync.FolderChat.filter((x) =>
          newArgs.some((t) => t === x.folderName)
        )
        for await (const folder of folders) {
          getFolderComments(client, folder, message)
        }
        break
      }
      case "lists": {
        let lists = client.settings.sync.ListChat.filter((x) =>
          newArgs.some((t) => t === x.listName)
        )
        for await (const list of lists) {
          getListComments(client, list, message)
        }
        break
      }
      default: {
        let reply = `Sorry ${message.author}, you didn't provide a valid option!\nThe options are: \` - team \n - spaces \n - folders \n - lists \``
        message.channel.send(reply)
        break
      }
    }
  }
}

exports.help = {
  name: "syncChat",
  args: 1,
  usage: "[team/spaces/folders/lists] | (target) | (target) | ...",
}
