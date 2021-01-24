const fetch = require("node-fetch")

module.exports = {
  /**
   * fetch all comments in chat view for the chosen **team**
   * @param {string} team_id
   * @param {string} view_id
   */
  async getTeamChat(team_id, view_id) {
    return await fetch(
      `https://api.clickup.com/api/v2/team/${team_id}/view/${view_id}/comment`,
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
   * fetch all comments in chat view for the chosen **space**
   * @param {string} space_id
   * @param {string} view_id
   */
  async getSpaceChat(space_id, view_id) {
    return await fetch(
      `https://api.clickup.com/api/v2/space/${space_id}/view/${view_id}/comment`,
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
   * fetch all comments in chat view for the chosen **folder**
   * @param {string} folder_id
   * @param {string} view_id
   */
  async getFolderChat(folder_id, view_id) {
    return await fetch(
      `https://api.clickup.com/api/v2/folder/${folder_id}/view/${view_id}/comment`,
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
   * fetch all comments in chat view for the chosen **list**
   * @param {string} list_id
   * @param {string} view_id
   */
  async getListChat(list_id, view_id) {
    return await fetch(
      `https://api.clickup.com/api/v2/list/${list_id}/view/${view_id}/comment`,
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
}
