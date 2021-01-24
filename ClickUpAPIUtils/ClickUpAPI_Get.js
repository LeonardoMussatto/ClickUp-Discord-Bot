const fetch = require("node-fetch")

module.exports = {
  /**
   * fetch all teams
   */
  async getTeams() {
    return await fetch(`https://api.clickup.com/api/v2/team`, {
      method: "GET",
      headers: {
        Authorization: process.env.CLICKUP_TOKEN,
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      const json = await res.json()
      return json.teams
    })
  },

  /**
   * fetch all spaces
   * @param {string} team_id
   */
  async getSpaces(team_id) {
    return await fetch(
      `https://api.clickup.com/api/v2/team/${team_id}/space?archived=false`,
      {
        method: "GET",
        headers: {
          Authorization: process.env.CLICKUP_TOKEN,
          "Content-Type": "application/json",
        },
      }
    ).then(async (res) => {
      const json = await res.json()
      return json.spaces
    })
  },

  /**
   * fetch all folders
   * @param {string} space_id
   */
  async getFolders(space_id) {
    return await fetch(
      `https://api.clickup.com/api/v2/space/${space_id}/folder?archived=false`,
      {
        method: "GET",
        headers: {
          Authorization: process.env.CLICKUP_TOKEN,
          "Content-Type": "application/json",
        },
      }
    ).then(async (res) => {
      const json = await res.json()
      return json.folders
    })
  },

  /**
   * fetch all lists
   * @param {string} folder_id
   */
  async getLists(folder_id) {
    return await fetch(
      `https://api.clickup.com/api/v2/folder/${folder_id}/list`,
      {
        method: "GET",
        headers: {
          Authorization: process.env.CLICKUP_TOKEN,
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
   * @param {Number} list_id id of list
   * @param {boolean} archived default false
   * @param {Number} page page to fetch - default 0
   * @param {string} order_by orders by field - default created, options: id, created, updated, due_date
   * @param {boolean} reverse default false
   * @param {boolean} subtasks default false
   */
  async getTasks(
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
          Authorization: process.env.CLICKUP_TOKEN,
          "Content-Type": "application/json",
        },
      }
    ).then(async (res) => {
      const json = await res.json()
      return json.tasks
    })
  },

  /**
   * fetch a folder by id
   * @param {string} id
   */
  async getFolder(folder_id) {
    return await fetch(`https://api.clickup.com/api/v2/folder/${folder_id}`, {
      method: "GET",
      headers: {
        Authorization: process.env.CLICKUP_TOKEN,
        "Content-Type": "application/json",
      },
    }).then((res) => res.json())
  },

  /**
   * fetch a list by id
   * @param {string} list_id
   */
  async getList(list_id) {
    return await fetch(`https://api.clickup.com/api/v2/list/${list_id}`, {
      method: "GET",
      headers: {
        Authorization: process.env.CLICKUP_TOKEN,
        "Content-Type": "application/json",
      },
    }).then((res) => res.json())
  },

  /**
   * fetch a task by id
   * @param {string} task_id
   */
  async getTask(task_id) {
    return await fetch(`https://api.clickup.com/api/v2/task/${task_id}`, {
      method: "GET",
      headers: {
        Authorization: process.env.CLICKUP_TOKEN,
        "Content-Type": "application/json",
      },
    }).then((res) => res.json())
  },
}
