const fetch = require("node-fetch")

// ENHANCE allow multiple entries - splice || and loop
// ENHANCE allow the user to call by name - find id under the hood
// TODO offset body to the function handling the data collection
/* create
    const body = JSON.stringify({
      name: title,
      description: content,
      priority: priority,
      status: status,
      parent: parent,
      notify_all: true,
    })
  update
   const body = JSON.stringify({
     name: title,
     description: content,
     priority: priority,
     status: status,
     parent: parent,
     notify_all: true,
   })
*/

module.exports = {
  /**
   * create a checklist - items can be added using createChecklistItem()
   * @param {object} client needed for ClickUp's Token
   * @param {string} task_id unique id of each ClickUp task - can be found using getTasks()
   * @param {string} title checklist's title
   */
  async createChecklist(client, task_id, title) {
    const body = JSON.stringify({
      name: title,
    })
    return await fetch(
      `https://api.clickup.com/api/v2/task/${task_id}/checklist/`,
      {
        method: "POST",
        headers: {
          Authorization: client.config.ClickUp_token,
          "Content-Type": "application/json",
        },
        body,
      }
    )
  },

  /**
   * create a checklist item - checklists can be created using createChecklist()
   * @param {object} client needed for ClickUp's Token
   * @param {string} checklist_id unique id of each ClickUp checklist - can be found using getTask()
   * @param {string} title checklist item's title
   * @param {string} assignee checklist item's assignee - optional
   */
  async createChecklistItem(client, checklist_id, title, assignee) {
    const body = JSON.stringify({
      name: title,
      assignee: assignee,
    })
    return await fetch(
      `https://api.clickup.com/api/v2/checklist/${checklist_id}/checklist_item`,
      {
        method: "POST",
        headers: {
          Authorization: client.config.ClickUp_token,
          "Content-Type": "application/json",
        },
        body,
      }
    )
  },

  /**
   * create a folder - lists can be added using createList()
   * @param {object} client needed for ClickUp's Token
   * @param {number} space_id unique id of each ClickUp space - can be found using getSpaces()
   * @param {string} title folder's title
   */
  async createFolder(client, space_id, title) {
    const body = JSON.stringify({
      name: title,
    })
    return await fetch(
      `https://api.clickup.com/api/v2/space/${space_id}/folder`,
      {
        method: "POST",
        headers: {
          Authorization: client.config.ClickUp_token,
          "Content-Type": "application/json",
        },
        body,
      }
    )
  },

  /**
   * create a list - tasks can be added using createTask()
   * @param {object} client needed for ClickUp's Token
   * @param {number} folder_id unique id of each ClickUp folder - can be found using getFolders()
   * @param {string} title list's title
   * @param {string} content list's description - optional
   * @param {string} priority list's priority - optional
   */
  async createList(client, folder_id, title, content, priority) {
    const body = JSON.stringify({
      name: title,
      content: content,
      priority: priority,
      status: status
    })
    return await fetch(
      `https://api.clickup.com/api/v2/folder/${folder_id}/list`,
      {
        method: "POST",
        headers: {
          Authorization: client.config.ClickUp_token,
          "Content-Type": "application/json",
        },
        body,
      }
    )
  },

  /**
   * create a Task - Checklists can be added using createChecklist()
   * @param {object} client needed for ClickUp's Token
   * @param {number} list_id unique id of each ClickUp list - can be found using getFolders()
   * @param {object} body contains settings for the task :
   *  title task's title
   * • (content) task's description
   * • (priority) task's priority
   * • (status) task's initial state
   * • (parent) make the task a subtask referencing the parent task
   */
  async createTask(client, list_id, body) {
    return await fetch(`https://api.clickup.com/api/v2/list/${list_id}/task`, {
      method: "POST",
      headers: {
        Authorization: client.config.ClickUp_token,
        "Content-Type": "application/json",
      },
      body,
    }).then((res) => res.json())
  },

  /**
   * update a Task
   * @param {object} client needed for ClickUp's Token
   * @param {string} task_id unique id of each ClickUp task - can be found using getTasks()
   * @param {object} body contains settings for the task :
   *  title task's title
   * • (content) task's description
   * • (priority) task's priority
   * • (status) task's initial state
   * • (parent) make the task a subtask referencing the parent task
   */
  async updateTask(client, task_id, body) {
    return await fetch(`https://api.clickup.com/api/v2/task/${task_id}`, {
      method: "PUT",
      headers: {
        Authorization: client.config.ClickUp_token,
        "Content-Type": "application/json",
      },
      body,
    }).then((res) => res.json())
  },

  /**
   * delete a task by it's id
   * @param {object} client needed for ClickUp's Token
   * @param {string} task_id unique id of each ClickUp task - can be found using getTasks()
   */
  async deleteTask(client, task_id) {
    return await fetch(`https://api.clickup.com/api/v2/task/${task_id}`, {
      method: "DELETE",
      headers: {
        Authorization: client.config.ClickUp_token,
        "Content-Type": "application/json",
      },
    }).then((res) => res.json())
  },

  /**
   * post a comment to the selected task
   * @param {object} client needed for ClickUp's Token
   * @param {string} task_id unique id of each ClickUp task - can be found using getTasks()
   * @param {string} content message content
   */
  async createTaskComment(client, task_id, content) {
    const body = JSON.stringify({
      comment_text: content
    })
    return await fetch(
      `https://api.clickup.com/api/v2/task/${task_id}/comment`,
      {
        method: "POST",
        headers: {
          Authorization: client.config.ClickUp_token,
          "Content-Type": "application/json",
        },
        body,
      }
    ).then((res) => res.json())
  },

  /**
   * post a comment to the selected chat view using the template [username]: [message]
   * @param {object} client needed for ClickUp's Token
   * @param {string} view_id id unique for each ClickUp view
   * @param {object} message Discord.js message object
   */
  async postComment(client, view_id, message) {
    const body = JSON.stringify({
      comment_text: `${message.member.user.username}: ${message.content}`,
    })
    return await fetch(
      `https://api.clickup.com/api/v2/view/${view_id}/comment`,
      {
        method: "POST",
        headers: {
          Authorization: client.config.ClickUp_token,
          "Content-Type": "application/json",
        },
        body,
      }
    )
  },
}
