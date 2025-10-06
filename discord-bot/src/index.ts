import { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes, EmbedBuilder, AttachmentBuilder } from 'discord.js';
import { config } from 'dotenv';
import fetch from 'node-fetch';

config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// GitHub API helper
async function fetchGitHubData(endpoint: string) {
  const response = await fetch(`https://api.github.com/repos/gunnchOS3k/FINDS-Sharks-From-Space${endpoint}`);
  return response.json();
}

// Slash Commands
const commands = [
  new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Post an announcement to the channel')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('The announcement message')
        .setRequired(true)
    ),
  
  new SlashCommandBuilder()
    .setName('link')
    .setDescription('Share a link with description')
    .addStringOption(option =>
      option.setName('url')
        .setDescription('The URL to share')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('description')
        .setDescription('Description of the link')
        .setRequired(false)
    ),
  
  new SlashCommandBuilder()
    .setName('meeting')
    .setDescription('Schedule a meeting')
    .addStringOption(option =>
      option.setName('url')
        .setDescription('Meeting URL (Zoom, Teams, etc.)')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('time')
        .setDescription('Meeting time (e.g., "Tomorrow 2pm EST")')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('title')
        .setDescription('Meeting title')
        .setRequired(false)
    ),
  
  new SlashCommandBuilder()
    .setName('github')
    .setDescription('Get GitHub repository information')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('What to fetch from GitHub')
        .setRequired(true)
        .addChoices(
          { name: 'Latest Issues', value: 'issues' },
          { name: 'Latest Pull Requests', value: 'pulls' },
          { name: 'Recent Commits', value: 'commits' },
          { name: 'Repository Stats', value: 'stats' }
        )
    ),
  
  new SlashCommandBuilder()
    .setName('subscribe')
    .setDescription('Subscribe to GitHub notifications')
    .addStringOption(option =>
      option.setName('events')
        .setDescription('Which events to subscribe to')
        .setRequired(false)
        .addChoices(
          { name: 'All Events', value: 'all' },
          { name: 'Issues Only', value: 'issues' },
          { name: 'Pull Requests Only', value: 'pulls' },
          { name: 'Commits Only', value: 'commits' }
        )
    ),
  
  new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show available commands and features')
];

// Register slash commands
async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN!);
  
  try {
    console.log('Started refreshing application (/) commands.');
    
    await rest.put(
      Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID!, process.env.DISCORD_GUILD_ID!),
      { body: commands }
    );
    
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}

// Event handlers
client.once('ready', async () => {
  console.log(`🦈 FINDS Bot is online as ${client.user?.tag}!`);
  await registerCommands();
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, options } = interaction;

  try {
    switch (commandName) {
      case 'announce':
        const message = options.getString('message', true);
        const embed = new EmbedBuilder()
          .setTitle('📢 Announcement')
          .setDescription(message)
          .setColor(0x00ff00)
          .setTimestamp()
          .setFooter({ text: 'FINDS Bot' });
        
        await interaction.reply({ embeds: [embed] });
        break;

      case 'link':
        const url = options.getString('url', true);
        const description = options.getString('description') || 'Shared link';
        
        const linkEmbed = new EmbedBuilder()
          .setTitle('🔗 Shared Link')
          .setDescription(`${description}\n\n[Click here](${url})`)
          .setColor(0x0099ff)
          .setTimestamp();
        
        await interaction.reply({ embeds: [linkEmbed] });
        break;

      case 'meeting':
        const meetingUrl = options.getString('url', true);
        const time = options.getString('time', true);
        const title = options.getString('title') || 'Team Meeting';
        
        const meetingEmbed = new EmbedBuilder()
          .setTitle('📅 Meeting Scheduled')
          .setDescription(`**${title}**\n\n⏰ **Time:** ${time}\n🔗 **Link:** [Join Meeting](${meetingUrl})`)
          .setColor(0xff6b35)
          .setTimestamp();
        
        await interaction.reply({ embeds: [meetingEmbed] });
        break;

      case 'github':
        const type = options.getString('type', true);
        
        await interaction.deferReply();
        
        let githubEmbed: EmbedBuilder;
        
        switch (type) {
          case 'issues':
            const issues = await fetchGitHubData('/issues?state=open&sort=updated&per_page=5');
            githubEmbed = new EmbedBuilder()
              .setTitle('🐛 Latest Issues')
              .setColor(0xff6b6b)
              .setTimestamp();
            
            if (issues.length > 0) {
              githubEmbed.setDescription(issues.map((issue: any) => 
                `**[${issue.title}](${issue.html_url})**\n` +
                `Status: ${issue.state} | Updated: ${new Date(issue.updated_at).toLocaleDateString()}`
              ).join('\n\n'));
            } else {
              githubEmbed.setDescription('No open issues found.');
            }
            break;

          case 'pulls':
            const pulls = await fetchGitHubData('/pulls?state=open&sort=updated&per_page=5');
            githubEmbed = new EmbedBuilder()
              .setTitle('🔀 Latest Pull Requests')
              .setColor(0x4ecdc4)
              .setTimestamp();
            
            if (pulls.length > 0) {
              githubEmbed.setDescription(pulls.map((pr: any) => 
                `**[${pr.title}](${pr.html_url})**\n` +
                `Status: ${pr.state} | Updated: ${new Date(pr.updated_at).toLocaleDateString()}`
              ).join('\n\n'));
            } else {
              githubEmbed.setDescription('No open pull requests found.');
            }
            break;

          case 'commits':
            const commits = await fetchGitHubData('/commits?per_page=5');
            githubEmbed = new EmbedBuilder()
              .setTitle('📝 Recent Commits')
              .setColor(0x45b7d1)
              .setTimestamp();
            
            if (commits.length > 0) {
              githubEmbed.setDescription(commits.map((commit: any) => 
                `**${commit.commit.message.split('\n')[0]}**\n` +
                `By: ${commit.commit.author.name} | ${new Date(commit.commit.author.date).toLocaleDateString()}`
              ).join('\n\n'));
            } else {
              githubEmbed.setDescription('No recent commits found.');
            }
            break;

          case 'stats':
            const repo = await fetchGitHubData('');
            githubEmbed = new EmbedBuilder()
              .setTitle('📊 Repository Statistics')
              .setDescription(
                `**Stars:** ${repo.stargazers_count}\n` +
                `**Forks:** ${repo.forks_count}\n` +
                `**Issues:** ${repo.open_issues_count}\n` +
                `**Language:** ${repo.language || 'Mixed'}\n` +
                `**Last Updated:** ${new Date(repo.updated_at).toLocaleDateString()}`
              )
              .setColor(0x9b59b6)
              .setTimestamp();
            break;
        }
        
        await interaction.editReply({ embeds: [githubEmbed] });
        break;

      case 'subscribe':
        const events = options.getString('events') || 'all';
        const subscribeEmbed = new EmbedBuilder()
          .setTitle('🔔 Subscription Updated')
          .setDescription(`You're now subscribed to: **${events}** GitHub events\n\nI'll notify you about updates to the FINDS repository.`)
          .setColor(0x2ecc71)
          .setTimestamp();
        
        await interaction.reply({ embeds: [subscribeEmbed] });
        break;

      case 'help':
        const helpEmbed = new EmbedBuilder()
          .setTitle('🦈 FINDS Bot Commands')
          .setDescription('Here are all available commands:')
          .addFields(
            { name: '/announce', value: 'Post an announcement to the channel', inline: true },
            { name: '/link', value: 'Share a link with description', inline: true },
            { name: '/meeting', value: 'Schedule a meeting with URL and time', inline: true },
            { name: '/github', value: 'Get GitHub repository information', inline: true },
            { name: '/subscribe', value: 'Subscribe to GitHub notifications', inline: true },
            { name: '/help', value: 'Show this help message', inline: true }
          )
          .setColor(0x3498db)
          .setTimestamp();
        
        await interaction.reply({ embeds: [helpEmbed] });
        break;
    }
  } catch (error) {
    console.error('Error handling command:', error);
    await interaction.reply({ content: '❌ An error occurred while processing your command.', ephemeral: true });
  }
});

// Login
client.login(process.env.DISCORD_BOT_TOKEN);
