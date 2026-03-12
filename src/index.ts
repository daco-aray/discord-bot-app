require('dotenv').config()
const { Client, GatewayIntentBits, Events } = require('discord.js')
const { handleSchedule } = require('./services/scheduler')
import Message from './types/message'

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
})

client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}!`)
    console.log(`Bot id: ${client.user.id}`)
})

client.on(Events.MessageCreate, (message: Message) => {
    if (message.author.bot) return

    switch(message.content) {
        case '!ping':
            message.reply('Pong!')
            break
        case '!hello':
            message.reply(`Hello, ${message.author.username}!`)
            break
        default:
            // Handle other messages or ignore
            break
    }

})

client.on(Events.GuildCreate, (guild: any) => {
    console.log(`Joined new guild: ${guild.name} (ID: ${guild.id})`)
})

client.on(Events.MessageCreate, (message: Message) => {
    if (message.author.bot) return

    if(message.content.startsWith('!schedule')) {
        handleSchedule(message)
    }

})

client.login(process.env.DISCORD_BOT_TOKEN)