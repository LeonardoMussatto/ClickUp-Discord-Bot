/** Get Tasks
 * command to get all tasks in the selected folders or lists
 * The function is built around for-of loops and filters
 * 1. create new args with the selected targets' type (folders/lists) and targets' names
 * 2.1 if the target type is folder:
 *       a. get teams' ids (aka workspaces)
 *       b. for each team, get the spaces' ids
 *    ~  c. for each space, get the folders. If there are no folders, skip to the next space
 *    ~  d. filter the folders whose name has been passed in the args
 *    ~  c. if any match is found, add the folder to the array of targets
 *       e. when all workspaces have been scanned for matches, if none is found return
 *       f. get tasks for each list inside the selected folders
 *       g. send an embed with tasks name, id, status + due date and assignees if present
 * 2.2 if the target type is list:
 *       a. get teams' ids (aka workspaces)
 *       b. for each team, get the spaces' ids
 *    ~  c. for each space, check for folderless lists. If any is present, scan for matches
 *    ~  d. for each space, get the folders. If any is present, search for matches in those which have lists
 *    ~  e. if any match is found, add the list to the array of targets
 *       f. when all workspaces have been scanned for matches, if none is found return
 *       g. get tasks for each list in the target array
 *       e. send an embed with tasks name, id, status + due date and assignees if present
 *  •
 * //IMPORTANT folders/lists have to be called by case sensitive names
 *  if a name is used for more then one list of space, all the matches will be considered
*/

// ENHANCE add message.edit() - add 2FAuth and request permission to edit messages

const Discord = require("discord.js")
const {
  getFolders,
  getTasks,
  getTeams,
  getSpaces,
  getFolderlessLists,
} = require("../utils/ClickUpAPI_Get")

exports.run = async (client, message, args) => {
  const newArgs = message.content
    .slice(client.settings.bot.prefix.length + this.help.name.length)
    .trim()
    .split("|")
    .map((x) => x.trim())
  // message.channel.send("Loading")
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
  switch (newArgs[0].toLowerCase()) {
    case "folder": {
      const teams = await getTeams(client)
      let targets = []
      for await (const team of teams) {
        const spaces = await getSpaces(client, team.id)
        for await (const space of spaces) {
          const folders = await getFolders(client, space.id)
          if (folders.length < 1) continue
          let trg = folders.filter((folder) =>
            newArgs.some((target) => target === folder.name)
          )
          if (trg.length > 0) {
            targets.push(...trg)
          }
        }
      }
      if (targets.length < 1) return message.channel.send(`No match found`)
      for await (const target of targets) {
        for await (const list of target.lists) {
          const tasks = await getTasks(client, list.id)
          const embed = new Discord.MessageEmbed()
            .setTitle(`Tasks in list *${list.name}* :`)
            .setColor("#8951fc")
          if (tasks.length === 0) {
            embed.setDescription("It seems like there isn't any yet!")
          } else {
            embed.setDescription(
              tasks
                .map((task) => {
                  if (!(task.assignees && task.due_date)) {
                    return `- **${task.name}** • ${task.id}  •  ${task.status.status}`
                  } else if (task.assignees.length && task.due_date) {
                    let assignees = task.assignees.map((x) => x.username)
                    let date = new Date(task.due_date * 1000)
                    let day = date.getDate()
                    let month = months_arr[date.getMonth()]
                    return `- **${task.name}** • ${task.id}  •  ${task.status.status}  •  due date: ${day} ${month}  •  assignees: ${assignees}`
                  } else if (task.assignees && !task.due_date) {
                    let assignees = task.assignees.map((x) => x.username)
                    return `- **${task.name}** • ${task.id}  •  ${task.status.status}  •  assignees: ${assignees}`
                  } else if (task.due_date && task.assignees.length < 1) {
                    let date = new Date(task.due_date * 1000)
                    let day = date.getDate()
                    let month = months_arr[date.getMonth()]
                    return `- **${task.name}** • ${task.id}  •  ${task.status.status}  •  due date: ${day} ${month}`
                  }
                })
                .join("\n")
            )
          }
          message.channel.send(embed)
        }
      }
      break
    }
    case "list": {
      const teams = await getTeams(client)
      let targets = []
      for await (const team of teams) {
        const spaces = await getSpaces(client, team.id)
        for await (const space of spaces) {
          const lists = await getFolderlessLists(client, space.id)
          if (lists) {
            let trg = lists.filter((list) =>
              newArgs.some((target) => target === list.name)
            )
            if (trg.length > 0) {
              targets.push(...trg)
            }
          }
          const folders = await getFolders(client, space.id)
          if (folders.length < 1) continue
          for await (const folder of folders) {
            if (folder.lists.length < 1) continue
            let trg = folder.lists.filter((list) =>
              newArgs.some((target) => target === list.name)
            )
            if (trg.length > 0) {
              targets.push(...trg)
            }
          }
        }
      }
      if (targets.length < 1) return message.channel.send(`No match found`)
      for await (const list of targets) {
        const tasks = await getTasks(client, list.id)
        const embed = new Discord.MessageEmbed()
          .setTitle(`Tasks in list *${list.name}* :`)
          .setColor("#8951fc")
        if (tasks.length === 0) {
          embed.setDescription("It seems like there isn't any yet!")
        } else {
          embed.setDescription(
            tasks
              .map((task) => {
                if (!(task.assignees && task.due_date)) {
                  return `- **${task.name}** • ${task.id}  •  ${task.status.status}`
                } else if (task.assignees.length && task.due_date) {
                  let assignees = task.assignees.map((x) => x.username)
                  let date = new Date(task.due_date * 1000)
                  let day = date.getDate()
                  let month = months_arr[date.getMonth()]
                  return `- **${task.name}** • ${task.id}  •  ${task.status.status}  •  due date: ${day} ${month}  •  assignees: ${assignees}`
                } else if (task.assignees && !task.due_date) {
                  let assignees = task.assignees.map((x) => x.username)
                  return `- **${task.name}** • ${task.id}  •  ${task.status.status}  •  assignees: ${assignees}`
                } else if (task.due_date && task.assignees.length < 1) {
                  let date = new Date(task.due_date * 1000)
                  let day = date.getDate()
                  let month = months_arr[date.getMonth()]
                  return `- **${task.name}** • ${task.id}  •  ${task.status.status}  •  due date: ${day} ${month}`
                }
              })
              .join("\n")
          )
        }
        message.channel.send(embed)
      }
      break
    }

    default:
      let reply = `Sorry ${message.author}, you didn't provide a valid option!\nThe options are: \` folder or list \``
        message.channel.send(reply)
      break
  }
}

exports.help = {
  name: "tasks",
  args: 2,
  usage: "[folder/list] | [target] | (target) | ...",
}
