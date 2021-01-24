exports.run = async (client, message, args) => {
  const msg = await message.channel.send("Seriously, I'm sleeping")
  const ping =
    (msg.editedTimestamp || msg.createdAt) -
    (message.editedTimestamp || message.createdAt)
  msg.edit(`Fine, its ${ping}ms.`)
}

exports.help = {
  name: "ping",
}
