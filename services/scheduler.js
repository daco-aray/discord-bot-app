const cron = require('node-cron')

const handleSchedule = (message) => {

    const args = message.content.trim().split(/\s+/)

    if(args.length < 3)
        return message.reply("Usage: !schedule HH:MM mensaje [@user] [#channel]")

    const time = args[1]

    const mentionedUser = message.mentions.users.first()
    const mentionedChannel = message.mentions.channels.first()
    const mentionedEveryone = message.mentions.everyone

    const targetChannel = mentionedChannel || message.channel

    const scheduledText = args.slice(2).join(' ')

    const [hour, minute] = time.split(':')

    cron.schedule(`${minute} ${hour} * * *`, () => {
        
        let finalMessage = ""

        if (mentionedEveryone) finalMessage += "@everyone "
        if (mentionedUser) finalMessage += `@${mentionedUser.username} `
        finalMessage += scheduledText

        targetChannel.send(finalMessage)
    })

    message.reply(`Scheduled message "${scheduledText}" at ${time} every day!`)
}

module.exports = {
    handleSchedule
}
