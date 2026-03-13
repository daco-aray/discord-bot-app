const cron = require('node-cron')
const { EmbedBuilder } = require('discord.js')
import Message from '../types/message'

const handleSchedule = (message: Message) => {

    const args = message.content.trim().split(/\s+/)

    if(args.length < 3)
        return message.reply("Usage: !schedule HH:MM mensaje [@user] [#channel]")

    const time = args[1]

    if(!isTimeValid(time)) {
        return message.reply("Invalid time format. Use HH:MM (24-hour format)")
    }

    const { users, channels, everyone } = message.mentions

    const mentionedUser = users.first()
    const mentionedChannel = channels.first()
    const mentionedEveryone = everyone

    const targetChannel = mentionedChannel || message.channel

    const scheduledText = args[2]

    const [hour, minute] = time.split(':')

    cron.schedule(`${minute} ${hour} * * *`, () => {
        
        let finalMessage = ""

        if (mentionedEveryone) finalMessage += "@everyone "
        if (mentionedUser) finalMessage += `@${mentionedUser.username} `
        finalMessage += scheduledText

        const embed = new EmbedBuilder()
            .setTitle('Scheduled Message')
            .setDescription(finalMessage)
            .setColor(0xFEE75C)
            .setTimestamp()

        targetChannel.send({ embeds: [embed] })
    })

    message.reply(`Scheduled message "${scheduledText}" at ${time} every day!`)
}

const isTimeValid: (time: string) => boolean = (time) => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    return timeRegex.test(time)
}

module.exports = {
    handleSchedule
}
