// const Discord = require("discord.js")
const { getChat } = require("../utils/ClickUpAPI_Get")

// ENHANCE getTask if tas is mentioned
// TODO ignore messages from other bots & commands to bots when checking for the last message
// IMPORTANT client has to be passed to these functions in order to retrieve the last message on Discord, send the new message and use the logger

/** The logic is alway the same:
 * 1. The functions receives a param - team/space/folder/list - containing the information stored in the database.
 *    The calling functions handles looping through the array. This function receives an object at a time.
 *    The properties used here are:
 *      • channelId - the id of the discord channel to send the message
 *      • viewId - the id of the ClickUp's chat view from witch to fetch the message
 * 2. Call getChat for the selected view. It returns the last message written in ClickUp
 * 3. Checks:
 *      • if the author of the last message on ClickUp is the bot itself, ignores the message
 *      • get last discord message's content. If it's the same as the content of the message fetched from ClickUp, ignore the message
 * 4. Create a message with:
 *      • message's author in bold
 *      • message content
 *      • if present, assignees and assigner as fields
 * 5. Send the message to the selected channel.
*/

module.exports = {
  async getTeamComments(client, team) {
    const comment = await getChat(client, team.viewId)
    if (comment.err) {
      let msg = `Error fetching team view comments: ${comment.err}`
      return msg
    }
    if (comment.user.username === "ClickUp Bot") return

    let lastMessage = await client.channels.cache
      .get(folder.channelId)
      .messages.fetch({ limit: 1 })
      .then((msg) => {
        return msg.first().content
      })
      .catch((err) => {
        client.logger.error(`Error retrieving last comment: ${err}`)
      })
    if (msg.trim().normalize() === lastMessage.trim().normalize()) return

    client.channels.cache.get(`${team.channelId}`).send(msg)
  },

  async getSpaceComments(client, space) {
    const comment = await getChat(client, space.viewId)
    if (comment.err) {
      let msg = `Error fetching team view comments: ${comment.err}`
      return msg
    }
    if (comment.user.username === "ClickUp Bot") return

    let msg = `**${comment.user.username}**\n${comment.comment_text}`
    if (comment.hasOwnProperty("assignee")) {
      msg += `\nassigned to: ${comment.assignee.username}\tassigned by: ${comment.assigned_by.username}`
    }

    let lastMessage = await client.channels.cache
      .get(folder.channelId)
      .messages.fetch({ limit: 1 })
      .then((msg) => {
        return msg.first().content
      })
      .catch((err) => {
        client.logger.error(`Error retrieving last comment: ${err}`)
      })
    if (msg.trim().normalize() === lastMessage.trim().normalize()) return

    client.channels.cache.get(`${space.channelId}`).send(msg)
  },

  async getFolderComments(client, folder) {
    let comment = await getChat(client, folder.viewId)
    if (comment.err) {
      let msg = `Error fetching team view comments: ${comment.err}`
      return msg
    }
    if (comment.user.username === "ClickUp Bot") return

    let msg = `**${comment.user.username}**\n${comment.comment_text}`
    if (comment.hasOwnProperty("assignee")) {
      msg += `\nassigned to: ${comment.assignee.username}\tassigned by: ${comment.assigned_by.username}`
    }

    let lastMessage = await client.channels.cache
      .get(folder.channelId)
      .messages.fetch({ limit: 1 })
      .then((msg) => {
        return msg.first().content
        // if (msg.first().author.bot) {
        //   return msg.first().toJSON().embeds[0].description
        // } else {
        //   return msg.first().content
        // }
      })
      .catch((err) => {
        client.logger.error(`Error retrieving last comment: ${err}`)
      })
    if (msg.trim().normalize() === lastMessage.trim().normalize()) return
    // let msg = new Discord.MessageEmbed()
    //   .setAuthor(comment.user.username, comment.user.profilePicture)
    //   .setDescription(comment.comment_text)
    //   .setColor(comment.user.color)
    //   .setTimestamp(comment.date)
    // if (comment.hasOwnProperty("assignee")) {
    //   msg.addFields(
    //     {
    //       name: "assigned to",
    //       value: comment.assignee.username,
    //       inline: true,
    //     },
    //     {
    //       name: "assigned by",
    //       value: comment.assigned_by.username,
    //       inline: true,
    //     }
    //   )
    // }
    client.channels.cache.get(`${folder.channelId}`).send(msg)
  },

  async getListComments(client, list) {
    let comment = await getChat(client, list.viewId)
    if (comment.err) {
      let msg = `Error fetching team view comments: ${comment.err}`
      return msg
    }
    if (comment.user.username === "ClickUp Bot") return

    let msg = `**${comment.user.username}**\n${comment.comment_text}`
    if (comment.hasOwnProperty("assignee")) {
      msg += `\nassigned to: ${comment.assignee.username}\tassigned by: ${comment.assigned_by.username}`
    }

    let lastMessage = await client.channels.cache
      .get(folder.channelId)
      .messages.fetch({ limit: 1 })
      .then((msg) => {
        return msg.first().content
      })
      .catch((err) => {
        client.logger.error(`Error retrieving last comment: ${err}`)
      })
    if (msg.trim().normalize() === lastMessage.trim().normalize()) return

    client.channels.cache.get(`${list.channelId}`).send(msg)
  },
}
