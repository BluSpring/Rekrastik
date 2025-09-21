const inviteLink = 'https://discordapp.com/oauth2/authorize?client_id=471306061668941824&permissions=8&scope=bot';
const Discord = require('discord.js');
const config = require(`../../config.json`);

module.exports = {
    exec: async (bot, message, args) => {
        // Complete code
        message.channel.send(`${message.author.toString()}, you can invite me at ${inviteLink}`)
    },
    help: {
        name: 'invite',
        aliases: ['invite'], // Not actually needed right now
        usage: `${config.prefix}invite`,
        description: `Invite me to your server! I'll send you the invite!`,
        category: `General`
    }
}