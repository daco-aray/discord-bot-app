const cron = require('node-cron')
const { EmbedBuilder } = require('discord.js')
import { query } from '../config/database'
import Message from '../types/message'

const handleSchedule = async(message: Message) => {

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

    const scheduledText = message.content.match(/"([^"]*)"/)?.[1]

    if(!scheduledText) {
        return message.reply("No message provided. Use !schedule HH:MM \"message\" [@user] [#channel]")
    }

    try {
        
        const result = await query(`
            INSERT INTO scheduled_messages (guild_id, channel_id, time, message, mentioned_user_id, mentioned_everyone, created_by, created_at, is_active) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), true)
        `, [message.guild?.id, targetChannel.id, time, scheduledText, mentionedUser?.id || null, mentionedEveryone, 'system'])

        let finalMessage = ""
        if(mentionedEveryone) finalMessage += " @everyone "
        if(mentionedUser) {
            finalMessage += ` @${mentionedUser.username} `
        }
        finalMessage += scheduledText

        const [hour, minute] = time.split(':')
        cron.schedule(`${minute} ${hour} * * *`, () => {
            targetChannel.send(finalMessage)
        })

    } catch (error) {
        console.error(error)
        message.reply("Error scheduling message")
    }

    message.reply(`Scheduled message "${scheduledText}" at ${time} every day!`)
}

const sendScheduleMessage = async(id: number, client: any) => {

    try {

        const result = await query(`
            SELECT * FROM scheduled_messages WHERE id = $1 AND is_active = true
        `, [id])

        if(result.rows.length === 0) return

        const scheduledMessage = result.rows[0]
        const channel = await client.channels.fetch(scheduledMessage.channel_id)

        if(!channel) return

        let finalMessage = ""
        if(scheduledMessage.mentioned_everyone) finalMessage += " @everyone "
        if(scheduledMessage.mentioned_user_id) {
            const user = await client.users.fetch(scheduledMessage.mentioned_user_id)
            finalMessage += ` @${user.username} `
        }
        finalMessage += scheduledMessage.message

        const embed = new EmbedBuilder()
            .setTitle("Scheduled Message")
            .setDescription(finalMessage)
            .setColor("#ffae00")
            .setTimestamp()
        
        channel.send({ embeds: [embed] })
        
    } catch (error) {
        console.error(error)
    }
    
}

const loadScheduledMessages = async(client: any) => {
    try {
        const result = await query('SELECT * FROM scheduled_messages WHERE is_active = true')
        result.rows.forEach((scheduledMessage) => {
            const [hour, minute] = scheduledMessage.time.split(':')
            console.log('messages', scheduledMessage.message)
            cron.schedule(`${minute} ${hour} * * *`, () => {
                sendScheduleMessage(scheduledMessage.id, client)
            })
        })
    } catch (error) {
        console.error(error)
    }
}

const isTimeValid: (time: string) => boolean = (time) => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    return timeRegex.test(time)
}

module.exports = {
    handleSchedule,
    loadScheduledMessages
}
