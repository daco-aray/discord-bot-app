require('dotenv').config()
const { Client, GatewayIntentBits, Events } = require('discord.js')
const { handleSchedule, loadScheduledMessages, initializeClient } = require('./services/scheduler')
import Message from './types/message'

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
})

client.once(Events.ClientReady, () => {
    initializeClient(client)
    loadScheduledMessages()
})

client.on(Events.MessageCreate, (message: Message) => {

    if (isBot(message)) return

    handleMessage(message)

})

client.on(Events.GuildCreate, (guild: any) => {
    console.log(`Joined new guild: ${guild.name} (ID: ${guild.id})`)
})

client.login(process.env.DISCORD_BOT_TOKEN)


const handleMessage = (message: Message) => {
    if (message.author.bot) return

    const command = message.content.trim().split(/\s+/)[0]

    switch(command) {
        case '!ping':
            message.reply('Pong!')
            break
        case '!hello':
            message.reply(`Hello, ${message.author.username}!`)
            break
        case '!schedule':
            handleSchedule(message)
            break
        default:
            // Handle other messages or ignore
            break
    }
}

const isBot = (message: Message) => {
    return message.author.bot
}