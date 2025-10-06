# 🦈 FINDS Discord Bot

A Discord bot for the FINDS project that integrates GitHub, announcements, and team coordination.

## Features

- **📢 Announcements**: Post team announcements with `/announce`
- **🔗 Link Sharing**: Share important links with `/link`
- **📅 Meeting Scheduling**: Schedule meetings with `/meeting`
- **🐙 GitHub Integration**: Get repository info with `/github`
- **🔔 Notifications**: Subscribe to GitHub events with `/subscribe`
- **❓ Help**: Get command help with `/help`

## Setup Instructions

### 1. Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Name it "FINDS Bot" (or whatever you prefer)
4. Go to "Bot" section
5. Click "Add Bot"
6. Copy the **Bot Token** (keep this secret!)

### 2. Get Application ID

1. In the same Discord Developer Portal
2. Go to "General Information"
3. Copy the **Application ID** (this is your CLIENT_ID)

### 3. Get Server ID

1. In Discord, right-click your server name
2. Click "Copy Server ID"
3. This is your GUILD_ID

### 4. Invite Bot to Server

1. In Discord Developer Portal, go to "OAuth2" → "URL Generator"
2. Select scopes: `bot`, `applications.commands`
3. Select permissions:
   - Send Messages
   - Embed Links
   - Attach Files
   - Read Message History
   - Use Slash Commands
4. Copy the generated URL and open it in your browser
5. Select your server and authorize

### 5. Configure Environment

1. Copy `env.example` to `.env`
2. Fill in your values:
   ```
   DISCORD_BOT_TOKEN=your_bot_token_here
   DISCORD_CLIENT_ID=your_application_id_here
   DISCORD_GUILD_ID=your_server_id_here
   ```

### 6. Install and Run

```bash
cd discord-bot
npm install
npm run build
npm start
```

## Commands

- `/announce <message>` - Post an announcement
- `/link <url> [description]` - Share a link
- `/meeting <url> <time> [title]` - Schedule a meeting
- `/github <type>` - Get GitHub info (issues, pulls, commits, stats)
- `/subscribe [events]` - Subscribe to GitHub notifications
- `/help` - Show all commands

## Deployment

### Option 1: Local Development
```bash
npm run dev
```

### Option 2: Production
```bash
npm run build
npm start
```

### Option 3: GitHub Actions (Auto-deploy)
The bot can be deployed automatically via GitHub Actions when you push to the repository.

## Troubleshooting

- **Bot not responding**: Check if the bot is online and has proper permissions
- **Slash commands not showing**: Wait a few minutes for Discord to sync, or restart the bot
- **Permission errors**: Make sure the bot has the required permissions in your server
