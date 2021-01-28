// TODO add creator info
// TODO add permission handling
// TODO add help command
// TODO store token and other setting in a safe place
// TODO add OAuth to ClickUp

// check if the necessary version of Node is used. v12 is needed for features as embedded messages and retrieving sent messages
if (Number(process.version.slice(1).split(".")[0]) < 12)
  throw new Error(
    "Node 12.0.0 or higher is required. Update Node on your system."
  )

const Discord = require("discord.js")
const fs = require("fs")
const { join } = require("path")
const config = require("./config");
const firebase = require("firebase/app")
require("firebase/database")

const client = new Discord.Client()
client.commands = new Discord.Collection()

// custom logger for better readability
client.logger = require("./logger")

// basic settings - tokens, ...
client.config = config

// Get user settings from firebase realtime database
const firebaseConfig = {
  apiKey: client.config.api_key,
  authDomain: "clickup-discord-bot.firebaseapp.com",
  projectId: "clickup-discord-bot",
  databaseURL: "https://clickup-discord-bot-default-rtdb.firebaseio.com",
  storageBucket: "clickup-discord-bot.appspot.com",
  messagingSenderId: client.config.sender_id,
  appId: "1:428084021978:web:5aa1a3c7e9a10b574df3e3",
  measurementId: "G-BQYET7E1SN",
}
firebase.initializeApp(firebaseConfig)

let database = firebase.database()
client.database = database
client.settings = {}
client.settings.sync = {}

let botSettingsRef = client.database.ref(`users/default/botSettings`)
botSettingsRef.on("value", (snapshot) => {
  var data = snapshot.val()
  client.settings.bot = data
})
let moduleSettingsRef = client.database.ref(`users/default/modules`)
moduleSettingsRef.on("value", (snapshot) => {
  var data = snapshot.val()
  client.settings.modules = data
})
let syncTeamRef = client.database.ref(`users/default/syncTeamChat`)
syncTeamRef.on("value", (snapshot) => {
  var data = snapshot.val()
  client.settings.sync.TeamChat = data
})
let syncSpaceRef = client.database.ref(`users/default/syncSpaceChat`)
syncSpaceRef.on("value", (snapshot) => {
  var data = snapshot.val()
  client.settings.sync.SpaceChat = data
})
let syncFolderRef = client.database.ref(`users/default/syncFolderChat`)
syncFolderRef.on("value", (snapshot) => {
  var data = snapshot.val()
  client.settings.sync.FolderChat = data
})
let syncListRef = client.database.ref(`users/default/syncListChat`)
syncListRef.once("value", (snapshot) => {
  var data = snapshot.val()
  client.settings.sync.ListChat = data
})

// Command Initialization
client.loadCommand = (commandName) => {
  try {
    const props = require(join(__dirname, "commands", commandName))
    client.commands.set(commandName, props)
    client.logger.log(`[Command Initialization] Command Loaded: ${commandName}`)
    return true
  } catch (e) {
    return `Unable to load command ${commandName}: ${e}`
  }
}

client.unloadCommand = (commandName) => {
  let command
  if (client.commands.has(commandName)) {
    command = client.commands.get(commandName)
  }
  if (!command)
    return `The command \`${commandName}\` doesn't seem to exist, nor is it an alias. Try again!`
  client.commands.delete(commandName)
  const mod =
    require.cache[
      require.resolve(join(__dirname, "commands", command.help.name))
    ]
  delete require.cache[
    require.resolve(`${join(__dirname, "commands", command.help.name)}.js`)
  ]
  for (let i = 0; i < mod.parent.children.length; i++) {
    if (mod.parent.children[i] === mod) {
      mod.parent.children.splice(i, 1)
      break
    }
  }
  return true
}

fs.readdir(join(__dirname, "events"), (err, files) => {
  if (err)
    return client.logger.error(
      `[Event Initialization] Error while loading loading events: ${err}`
    )

  files.forEach((file) => {
    if (!file.endsWith(".js")) return
    const event = require(join(__dirname, "events", file))
    const eventName = file.split(".")[0]
    client.on(eventName, event.bind(null, client))
    delete require.cache[require.resolve(join(__dirname, "events", file))]
    client.logger.log(`[Event Initialization] Event Loaded: ${eventName}`)
  })
})

fs.readdir(join(__dirname, "commands"), (err, files) => {
  if (err)
    return console.error(
      `[Command Initialization] Error while loading loading commands: ${err}`
    )
  files.forEach((file) => {
    if (!file.endsWith(".js")) return
    try {
      client.loadCommand(file.split(".js")[0])
    } catch (error) {
      client.logger.error(error.message)
    }
  })
})

client.login(client.config.Discord_token)

// to run on Repl.it - a custom website will be needed to setup users' configs
const http = require("http")
const server = http.createServer((req, res) => {
  res.writeHead(200)
  res.end("ok")
})
server.listen(3000)

// Automatically fetch comments from ClickUp, if the feature is enabled
const {
    getTeamComments,
    getSpaceComments,
    getFolderComments,
    getListComments,
  } = require("./utils/syncCommentsFromClickUp")

  setTimeout(() => {
    client.logger.debug(client.settings.modules.sync)
    if (client.settings.modules.sync) {
      if (client.settings.modules.syncTeamChat.isActive) {
        setInterval(async () => {
          // client.logger.log("syncTeamChat - check")
          getTeamComments(client, client.settings.sync.TeamChat, client.message)
        }, client.settings.modules.syncTeamChat.interval)
      }
      if (client.settings.modules.syncSpaceChat.isActive) {
        setInterval(async () => {
          // client.logger.log("syncSpacesChat - check")
          for await (const space of client.settings.sync.SpaceChat) {
            getSpaceComments(client, space, client.message)
          }
        }, client.settings.modules.syncSpaceChat.interval)
      }
      if (client.settings.modules.syncFolderChat.isActive) {
        setInterval(async () => {
          // client.logger.log("syncFoldersChat - check")
          for await (const folder of client.settings.sync.FolderChat) {
            getFolderComments(client, folder, client.message)
          }
        }, client.settings.modules.syncFolderChat.interval)
      }
      if (client.settings.modules.syncListChat.isActive) {
        setInterval(async () => {
          // client.logger.log("syncListsChat - check")
          for await (const list of client.settings.sync.ListChat) {
            await getListComments(client, list, client.message)
          }
        }, client.settings.modules.syncListChat.interval)
      }
    }
  }, 1000)
