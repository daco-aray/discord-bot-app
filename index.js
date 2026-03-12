require('dotenv').config()
const { Client, GatewayIntentBits, Events } = require('discord.js')
const { handleSchedule } = require('./services/scheduler')

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

client.on(Events.MessageCreate, (message) => {
    if (message.author.bot) return

    if(message.content === '!ping') {
        message.reply('Pong!')
    }

    if(message.content === '!hello') {
        message.reply(`Hello, ${message.author.username}!`)
    }
})

client.on(Events.GuildCreate, (guild) => {
    console.log(`Joined new guild: ${guild.name} (ID: ${guild.id})`)
})

client.on(Events.MessageCreate, (message) => {
    if (message.author.bot) return

    if(message.content.startsWith('!schedule')) {
        handleSchedule(message)
    }

})

client.login(process.env.DISCORD_BOT_TOKEN)