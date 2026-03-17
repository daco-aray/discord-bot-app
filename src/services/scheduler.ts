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

    const scheduledText = args[2]

    const [hour, minute] = time.split(':')

    try {
        
        const result = await query(`
            INSERT INTO scheduled_messages (guild_id, channel_id, time, message, mentioned_user_id, mentioned_everyone, created_by, created_at, is_active) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), true)
        `, [message.guild?.id, targetChannel.id, time, scheduledText, mentionedUser?.id || null, mentionedEveryone, 'system'])

    } catch (error) {
        console.error(error)
        message.reply("Error scheduling message")
    }

    message.reply(`Scheduled message "${scheduledText}" at ${time} every day!`)
}

const isTimeValid: (time: string) => boolean = (time) => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    return timeRegex.test(time)
}

module.exports = {
    handleSchedule
}
