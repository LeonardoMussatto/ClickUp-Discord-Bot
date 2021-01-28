const fetch = require("node-fetch")

module.exports = {
  /**
   * fetch all teams
   * @param {object} client needed for ClickUp's Token
   */
  async getTeams(client) {
    return await fetch(`https://api.clickup.com/api/v2/team`, {
      method: "GET",
      headers: {
        Authorization: client.config.ClickUp_token,
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      const json = await res.json()
      return json.teams
    })
  },

  /**
   * fetch all spaces and their infos
   * @param {object} client needed for ClickUp's Token
   * @param {number} team_id unique id of each ClickUp team - can be found using getTeams()
   */
  async getSpaces(client, team_id) {
    return await fetch(
      `https://api.clickup.com/api/v2/team/${team_id}/space?archived=false`,
      {
        method: "GET",
        headers: {
          Authorization: client.config.ClickUp_token,
          "Content-Type": "application/json",
        },
      }
    ).then(async (res) => {
      const json = await res.json()
      return json.spaces
    })
  },

  /**
   * fetch all folders, their infos and children lists
   * @param {object} client needed for ClickUp's Token
   * @param {number} space_id unique id of each ClickUp space - can be found using getSpaces()
   */
  async getFolders(client, space_id) {
    return await fetch(
      `https://api.clickup.com/api/v2/space/${space_id}/folder?archived=false`,
      {
        method: "GET",
        headers: {
          Authorization: client.config.ClickUp_token,
          "Content-Type": "application/json",
        },
      }
    ).then(async (res) => {
      const json = await res.json()
      return json.folders
    })
  },

  /**
   * fetch all lists and their infos
   * @param {object} client needed for ClickUp's Token
   * @param {number} folder_id unique id of each ClickUp folder - can be found using getFolders()
   */
  async getLists(client, folder_id) {
    return await fetch(
      `https://api.clickup.com/api/v2/folder/${folder_id}/list`,
      {
        method: "GET",
        headers: {
          Authorization: client.config.ClickUp_token,
          "Content-Type": "application/json",
        },
      }
    ).then(async (res) => {
      const json = await res.json()
      return json.lists
    })
  },

  /**
   * Fetch all tasks from a list
   * @param {object} client needed for ClickUp's Token
   * @param {number} list_id id of list
   * @param {boolean} archived default false
   * @param {number} page page to fetch - default 0
   * @param {string} order_by orders by field - default created, options: id, created, updated, due_date
   * @param {boolean} reverse default false
   * @param {boolean} subtasks default false
   */
  async getTasks(
    client,
    list_id,
    archived = false,
    page = 0,
    order_by = "created",
    reverse = false,
    subtasks = false
  ) {
    return await fetch(
      `https://api.clickup.com/api/v2/list/${list_id}/task?archived=${archived}&page=${page}&order_by=${order_by}&reverse=${reverse}&subtasks=${subtasks}`,
      {
        method: "GET",
        headers: {
          Authorization: client.config.ClickUp_token,
          "Content-Type": "application/json",
        },
      }
    ).then(async (res) => {
      const json = await res.json()
      return json.tasks
    })
  },

  /**
   * fetch folder's info and children lists by it's id
   * @param {object} client needed for ClickUp's Token
   * @param {number} folder_id unique id of each ClickUp folder - can be found using getFolders()
   */
  async getFolder(client, folder_id) {
    return await fetch(`https://api.clickup.com/api/v2/folder/${folder_id}`, {
      method: "GET",
      headers: {
        Authorization: client.config.ClickUp_token,
        "Content-Type": "application/json",
      },
    }).then((res) => res.json())
  },

  /**
   * fetch list's infos by it's id
   * @param {object} client needed for ClickUp's Token
   * @param {number} list_id unique id of each ClickUp list - can be found using getFolders()
   */
  async getList(client, list_id) {
    return await fetch(`https://api.clickup.com/api/v2/list/${list_id}`, {
      method: "GET",
      headers: {
        Authorization: client.config.ClickUp_token,
        "Content-Type": "application/json",
      },
    }).then((res) => res.json())
  },

  /**
   * fetch a task by id
   * @param {object} client needed for ClickUp's Token
   * @param {string} task_id unique id of each ClickUp task - can be found using getTasks()
   */
  async getTask(client, task_id) {
    return await fetch(`https://api.clickup.com/api/v2/task/${task_id}`, {
      method: "GET",
      headers: {
        Authorization: client.config.ClickUp_token,
        "Content-Type": "application/json",
      },
    }).then((res) => res.json())
  },

  /**
   * fetch all comments in chat view for the chosen view
   * @param {object} client needed for ClickUp's Token
   * @param {string} view_id unique id of each ClickUp view
   */
  async getChat(client, view_id) {
    return await fetch(
      `https://api.clickup.com/api/v2/view/${view_id}/comment`,
      {
        method: "GET",
        headers: {
          Authorization: client.config.ClickUp_token,
          "Content-Type": "application/json",
        },
      }
    ).then(async (res) => {
      const json = await res.json()
      return json.comments[0]
    })
  },
}
