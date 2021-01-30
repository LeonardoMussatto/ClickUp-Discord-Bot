/** GET FOLDERS
 * command to get folders in the selected spaces, or all spaces
 * 1. if only one arg is passed:
 *      a. get teams' ids (aka workspaces)
 *      b. for each team, get spaces' ids
 *      c. get folders for each space
 *      d. send an embed with folder name, id,lists andactive tasks
 * 2. if more args are provided:
 *      a. create new args to accept multiple words' space names
 *      b. get teams' ids (aka workspaces)
 *      c. for each team, get the spaces' ids
 *      d. filter the spaces whose name has been passed in the args. If any match is found, add the folder to the array of targets
 *      e. when all workspaces have been scanned for matches, if none is found return
 *      f. get folders for each space in the target array
 *      g. send an embed with folder name, id,lists andactive tasks
 * //IMPORTANT spaces have to be called by name
*/

const Discord = require("discord.js")
const { getFolders, getTeams, getSpaces } = require("../utils/ClickUpAPI_Get")

exports.run = async (client, message, args) => {
  if (args.length === 0) {
    const teams = await getTeams(client)
    for await (const team of teams) {
      const spaces = await getSpaces(client, team.id)
      for await (const space of spaces) {
        const folders = await getFolders(client, space.id)
        const embed = new Discord.MessageEmbed()
          .setTitle(`Folders in space *${space.name}* :`)
          .setColor("#8951fc")
        if (folders.length < 1) {
          embed.setDescription("It seems like there isn't any yet!")
        } else {
          embed.setDescription(
            folders
              .map(
                (folder) =>
                  `• **${folder.name}** - ${folder.id}  
                   - lists: ${folder.lists.length}  
                   - tasks: ${folder.task_count}\n`
              )
              .join("\n")
          )
        }
        message.channel.send(embed)
      }
    }
  } else {
    const newArgs = message.content
      .slice(client.settings.bot.prefix.length + this.help.name.length)
      .trim()
      .split("|")
      .map((x) => x.trim())

    const teams = await getTeams(client)
    let targets = []
    for await (const team of teams) {
      const spaces = await getSpaces(client, team.id)
      let trg = spaces.filter((space) =>
        newArgs.some((target) => target === space.name)
      )
      if (trg.length > 0) {
        targets.push(...trg)
      }
    }
    if (targets.length < 1) return message.channel.send(`No match found`)
    for await (const space of targets) {
      const folders = await getFolders(client, space.id)
      const embed = new Discord.MessageEmbed()
        .setTitle(`Folders in space *${space.name}* :`)
        .setColor("#8951fc")
      if (folders.length < 1) {
        embed.setDescription("It seems like there isn't any yet!")
      } else {
        embed.setDescription(
          folders
            .map(
              (folder) =>
                `• **${folder.name}** - ${folder.id}  
                 - lists: ${folder.lists.length}  
                 - tasks: ${folder.task_count}\n`
            )
            .join("\n")
        )
      }
      message.channel.send(embed)
    }
  }
}

exports.help = {
  name: "folders",
  args: 0,
  usage: "(space) | (space) | ...",
}
