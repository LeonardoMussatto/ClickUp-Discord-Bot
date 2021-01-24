const fetch = require("node-fetch")

// ENHANCE add creator info
// TODO offset body to the function handling the data collection
/* create
    const body = JSON.stringify({
      name: title,
      description: content,
      assignees: [assignees],
      priority: priority,
      status: status,
      parent: parent,
      notify_all: true,
    })
   update
    const body = JSON.stringify({
      name: title,
      description: content,
      assignees: { add: [addAssignees], rem: [remAssignees]},
      priority: priority,
      status: status,
      parent: parent,
      notify_all: true,
    })
  */
// ENHANCE allow multiple entries - splice and loop
// TODO always show the id to allow the user to call it

module.exports = {
  async createChecklist(task_id, title) {
    const body = JSON.stringify({
      name: title,
    })
    return await fetch(
      `https://api.clickup.com/api/v2/task/${task_id}/checklist/`,
      {
        method: "POST",
        headers: {
          Authorization: process.env.CLICKUP_TOKEN,
          "Content-Type": "application/json",
        },
        body,
      }
    )
  },

  async createChecklistItem(checklist_id, title, assignee) {
    const body = JSON.stringify({
      name: title,
      assignee: assignee,
    })
    return await fetch(
      `https://api.clickup.com/api/v2/checklist/${checklist_id}/checklist_item`,
      {
        method: "POST",
        headers: {
          Authorization: process.env.CLICKUP_TOKEN,
          "Content-Type": "application/json",
        },
        body,
      }
    )
  },

  async createFolder(space_id, title) {
    const body = JSON.stringify({
      name: title,
    })
    return await fetch(
      `https://api.clickup.com/api/v2/space/${space_id}/folder`,
      {
        method: "POST",
        headers: {
          Authorization: process.env.CLICKUP_TOKEN,
          "Content-Type": "application/json",
        },
        body,
      }
    )
  },

  async createList(folder_id, title, content, priority) {
    const body = JSON.stringify({
      name: title,
      content: content,
      priority: priority,
    })
    return await fetch(
      `https://api.clickup.com/api/v2/folder/${folder_id}/list`,
      {
        method: "POST",
        headers: {
          Authorization: process.env.CLICKUP_TOKEN,
          "Content-Type": "application/json",
        },
        body,
      }
    )
  },

  async createTask(list_id, body) {
    return await fetch(`https://api.clickup.com/api/v2/list/${list_id}/task`, {
      method: "POST",
      headers: {
        Authorization: process.env.CLICKUP_TOKEN,
        "Content-Type": "application/json",
      },
      body,
    }).then((res) => res.json())
  },

  async updateTask(task_id, body) {
    return await fetch(`https://api.clickup.com/api/v2/task/${task_id}`, {
      method: "PUT",
      headers: {
        Authorization: process.env.CLICKUP_TOKEN,
        "Content-Type": "application/json",
      },
      body,
    }).then((res) => res.json())
  },

  async deleteTask(task_id) {
    return await fetch(`https://api.clickup.com/api/v2/task/${task_id}`, {
      method: "DELETE",
      headers: {
        Authorization: process.env.CLICKUP_TOKEN,
        "Content-Type": "application/json",
      },
    }).then((res) => res.json())
  },

  async createViewComment(view_id, content, assignee) {
    const body = JSON.stringify({
      comment_text: content,
      assignee: assignee,
      notify_all: true,
    })
    return await fetch(
      `https://api.clickup.com/api/v2/view/${view_id}/comment`,
      {
        method: "POST",
        headers: {
          Authorization: process.env.CLICKUP_TOKEN,
          "Content-Type": "application/json",
        },
        body,
      }
    ).then((res) => res.json())
  },

  async createTaskComment(task_id, content, assignee) {
    const body = JSON.stringify({
      comment_text: content,
      assignee: assignee,
      notify_all: true,
    })
    return await fetch(
      `https://api.clickup.com/api/v2/task/${task_id}/comment`,
      {
        method: "POST",
        headers: {
          Authorization: process.env.CLICKUP_TOKEN,
          "Content-Type": "application/json",
        },
        body,
      }
    ).then((res) => res.json())
  },
}
