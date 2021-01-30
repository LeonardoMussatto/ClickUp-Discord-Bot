/** GET LISTS
 * command to get lists in the selected folders, or folders from all spaces
 * 1. if only one arg is passed:
 *      get teams' ids (aka workspaces)
 *      a. for each team, get spaces' ids
 *      b. get folders for each space
 *      c. for each folder, send an embed with each list's name, id + priority level and assignees, if present
 * 2. if more args are provided:
 *      a. create new args to accept multiple words' list names
 *      b. get teams' ids (aka workspaces)
 *      c. for each team, get spaces' ids
 *      d. for each space, get folders
 *      d. filter the folders whose name has been passed in the args. If any match is found, add the folder to the array of targets
 *      e. when all workspaces have been scanned for matches, if none is found return
 *      f. get folders for each space in the target array
 *      g. for each folder, send an embed with each list's name, id + priority level and assignees, if present
 * //IMPORTANT folders and lists have to be called by name
*/


const Discord = require("discord.js")
const { getFolders, getTeams, getSpaces } = require("../utils/ClickUpAPI_Get")

exports.run = async (client, message, args) => {
  let months_arr = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]

  if (args.length === 0) {
    const teams = await getTeams(client)
    for await (const team of teams) {
      const spaces = await getSpaces(client, team.id)
      for await (const space of spaces) {
        const folders = await getFolders(client, space.id)
        for await (const folder of folders) {
          const embed = new Discord.MessageEmbed()
            .setTitle(`Lists in folder *${folder.name}* :`)
            .setColor("#8951fc")
          if (folder.lists.length < 1) {
            embed.setDescription("It seems like there isn't any yet!")
          } else {
            embed.setDescription(
              folder.lists
                .map((list) => {
                  if (!(list.assignees || list.due_date || list.priority)) {
                    return `• **${list.name}** - ${list.id} -  ${list.task_count} tasks`
                  } else if (
                    list.assignees.length &&
                    task.due_date &&
                    list.priority
                  ) {
                    let assignees = list.assignees.map((x) => x.username)
                    let date = new Date(list.due_date * 1000)
                    let day = date.getDate()
                    let month = months_arr[date.getMonth()]
                    return `• **${list.name}** - ${list.id} -  ${list.task_count} tasks\n -  priority: ${list.priority.priority}  -  due date: ${day} ${month}\n  -  assignees: ${assignees}`
                  } else if (
                    list.assignees &&
                    !list.due_date &&
                    !list.priority
                  ) {
                    let assignees = list.assignees.map((x) => x.username)
                    return `• **${list.name}** - ${list.id}  -  ${list.task_count} tasks\n -  assignees: ${assignees}`
                  } else if (
                    list.due_date &&
                    !list.assignees &&
                    !list.priority
                  ) {
                    let date = new Date(list.due_date * 1000)
                    let day = date.getDate()
                    let month = months_arr[date.getMonth()]
                    return `• **${list.name}** - ${list.id}  -  ${list.task_count} tasks\n -  due date: ${day} ${month}`
                  } else if (
                    list.priority &&
                    !list.due_date &&
                    !list.assignees
                  ) {
                    return `• **${list.name}** - ${list.id} -  ${list.task_count} tasks\n -  priority: ${list.priority.priority}`
                  }
                })
                .join("\n")
            )
          }
          message.channel.send(embed)
        }
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
      for await (const space of spaces) {
        const folders = await getFolders(client, space.id)
        let trg = folders.filter((folder) =>
          newArgs.some((target) => target === folder.name)
        )
        if (trg.length > 0) {
          targets.push(...trg)
        }
      }
    }
    if (targets.length < 1) return message.channel.send(`No match found`)
    for await (const folder of targets) {
      const embed = new Discord.MessageEmbed()
        .setTitle(`Lists in folder *${folder.name}* :`)
        .setColor("#8951fc")
      if (folder.lists.length < 1) {
        embed.setDescription("It seems like there isn't any yet!")
      } else {
        embed.setDescription(
          folder.lists
            .map((list) => {
              if (!(list.assignees || list.due_date || list.priority)) {
                return `• **${list.name}** - ${list.id} -  ${list.task_count} tasks`
              } else if 
              (
                list.assignees && 
                task.due_date && 
                list.priority
              ) {
                let assignees = list.assignees.map((x) => x.username)
                let date = new Date(list.due_date * 1000)
                let day = date.getDate()
                let month = months_arr[date.getMonth()]
                return `• **${list.name}** - ${list.id} -  ${list.task_count} tasks\n  -  priority: ${list.priority.priority}  -  due date: ${day} ${month}\n  -  assignees: ${assignees}`
              } else if 
              (
                list.assignees && 
                !list.due_date && 
                !list.priority
              ) {
                let assignees = list.assignees.map((x) => x.username)
                return `• **${list.name}** - ${list.id}  -  ${list.task_count} tasks\n  -  assignees: ${assignees}`
              } else if 
              (
                list.due_date && 
                !list.assignees && 
                !list.priority
              ) {
                let date = new Date(list.due_date * 1000)
                let day = date.getDate()
                let month = months_arr[date.getMonth()]
                return `• **${list.name}** - ${list.id}  -  ${list.task_count} tasks\n  -  due date: ${day} ${month}`
              } else if 
              (
                list.priority && 
                !list.due_date && 
                !list.assignees
              ) {
                return `• **${list.name}** - ${list.id} -  ${list.task_count} tasks\n  -  priority: ${list.priority.priority}`
              }
            })
            .join("\n")
        )
      }
      message.channel.send(embed)
    }
  }
}

exports.help = {
  name: "lists",
  args: 0,
  usage: "(folder) | (folder) | ...",
}
