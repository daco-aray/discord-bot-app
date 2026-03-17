# Discord Bot - Scheduled Messages
 
A Discord bot that allows users to schedule recurring daily messages with mentions and custom timing. Built with TypeScript, Discord.js, and PostgreSQL.
 
## Features
 
- **Basic Commands**: `!ping`, `!hello`
- **Scheduled Messages**: `!schedule HH:MM "message" [@user] [#channel]`
- **Database Storage**: PostgreSQL for persistent scheduled messages
- **Daily Recurrence**: Messages repeat every day at the specified time
- **Mentions Support**: @everyone, @user, and custom channel targeting
- **Docker Support**: Easy setup with Docker Compose
 
## Prerequisites
 
- Node.js (v16 or higher)
- PostgreSQL (or use the provided Docker setup)
- Discord Bot Token
- npm or yarn
 
## Setup Instructions
 
### 1. Clone the Repository
 
```bash
git clone <repository-url>
cd discord-bot-app
```
### 2. Install Dependencies
```bash
npm install
```
### 3. Create a Discord Bot
Go to the Discord Developer Portal
Click "New Application" and give your bot a name
Go to the "Bot" tab and click "Add Bot"
Under "Privileged Gateway Intents", enable:
* MESSAGE CONTENT INTENT
* SERVER MEMBERS INTENT
Copy the bot token (you'll need this for the .env file)

### 4. Configure Environment Variables
Create a .env file in the root directory:

# Discord Bot Configuration
```
DISCORD_BOT_TOKEN=your_bot_token_here
```

### Database Configuration
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=discord_bot
DB_USER=postgres
DB_PASSWORD=your_password_here
```

### 5. Database Setup
# Option A: Using Docker Compose (Recommended)
Make sure Docker is installed and running
Run the database container:
```bash
docker-compose up -d postgres
```

This will:

Start a PostgreSQL container
Create the database automatically
Run the initialization script to create the scheduled_messages table

### 6. Run the Bot
Development Mode:
```bash
npm run dev
```
Production Mode:
```
bash
npm run build
npm start
```

Adding the Bot to Your Discord Server
Go to the Discord Developer Portal
Select your application
Go to "OAuth2" → "URL Generator"
Select the following scopes:
bot
applications.commands
Under "Bot Permissions", select:
Send Messages
Read Message History
Mention Everyone
Use External Emojis
Embed Links
Copy the generated URL and paste it into your browser
Select the server you want to add the bot to and authorize it

### Bot Commands
# Basic Commands
```
!ping - Bot replies with "Pong!"
!hello - Bot greets you by username
```
# Scheduling Commands
```
!schedule HH:MM "message" - Schedule a daily message
!schedule HH:MM "message" @user - Schedule message with user mention
!schedule HH:MM "message" #channel - Schedule message to specific channel
!schedule HH:MM "message" @everyone - Schedule message with @everyone mention
```

Examples:
!schedule 09:00 "Good morning everyone!"
!schedule 14:30 "Team meeting reminder" @john
!schedule 18:00 "Daily report" #general
!schedule 08:00 "Wake up call" @everyone
Note: Messages must be enclosed in quotes. Time format is 24-hour (HH:MM).

### Project Structure
```
discord-bot-app/
├── src/
│   ├── config/
│   │   └── database.ts      # PostgreSQL configuration
│   ├── services/
│   │   └── scheduler.ts     # Message scheduling logic
│   ├── types/
│   │   ├── guild/           # Guild-related types
│   │   └── message/         # Message-related types
│   └── index.ts             # Main bot entry point
├── database/
│   └── init.sql             # Database initialization script
├── docker-compose.yml       # Docker configuration
├── package.json            # Dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

### Environment Variables Reference
# Variable	Description	Required
```
DISCORD_BOT_TOKEN	Your Discord bot token	Yes
DB_HOST	Database host	Yes
DB_PORT	Database port	Yes (default: 5432)
DB_NAME	Database name	Yes
DB_USER	Database username	Yes
DB_PASSWORD	Database password	Yes
```
### Troubleshooting
# Bot Not Responding
Check that the bot token is correct in your .env file
Ensure the bot has the necessary permissions in your server
Verify that Message Content Intent is enabled in the Discord Developer Portal
Database Connection Issues
Ensure PostgreSQL is running (check Docker container if using Docker)
Verify database credentials in .env file
Check that the database and tables were created correctly
Messages Not Scheduling
Check the bot console for error messages
Verify the time format is correct (HH:MM 24-hour)
Ensure the message is enclosed in quotes

### License
This project is open source and available under the MIT License.
