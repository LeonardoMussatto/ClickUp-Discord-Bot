const Discord = require("discord.js")
const fs = require("fs")
const { join } = require("path")
const firebase = require("firebase/app")
require("firebase/database")

const client = new Discord.Client()
client.commands = new Discord.Collection()
client.logger = require("./logger")

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "clickup-discord-bot.firebaseapp.com",
  projectId: "clickup-discord-bot",
  databaseURL: "https://clickup-discord-bot-default-rtdb.firebaseio.com",
  storageBucket: "clickup-discord-bot.appspot.com",
  messagingSenderId: process.env.SENDER_ID,
  appId: "1:428084021978:web:5aa1a3c7e9a10b574df3e3",
  measurementId: "G-BQYET7E1SN"
}
firebase.initializeApp(firebaseConfig)

let database = firebase.database()
client.database = database

let ref = client.database.ref("default/botSettings")
ref.once("value")
  .then((snapshot) => {
    var data = snapshot.val()
    client.settings = data
  }, (error) => {
    client.logger.error(`Error reading settings: ${error}`)
  }
)

// Developers' commands
client.loadCommand = (commandName) => {
  try {
    const props = require(join(__dirname, "commands", commandName))
    client.commands.set(commandName, props)
    client.logger.log(`[Command Initialization] Command Loaded: ${commandName}`)
    return true
  } catch (e) {
    return `Unable to load command ${commandName}: ${e}`;
  }
}

client.unloadCommand = (commandName) => {
  let command
  if (client.commands.has(commandName)) {
    command = client.commands.get(commandName)
  }
  if (!command) return `The command \`${commandName}\` doesn't seem to exist, nor is it an alias. Try again!`
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

// Command Handling
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

client.login(process.env.CLIENT_TOKEN)

const http = require("http")
const server = http.createServer((req, res) => {
  res.writeHead(200)
  res.end("ok")
})
server.listen(3000)
