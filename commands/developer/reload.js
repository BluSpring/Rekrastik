const Discord = require('discord.js');
const config = require(`../../config.json`);
const fs = require('fs');

module.exports = {
    exec: async (bot, message, args) => {
        if(config.admins.some(crx => message.author.id.includes(crx))) {
            bot.loadCommands(message);
        } else {
            message.channel.send(`You don't have permission to use this command!`);
        }
    },
    help: {
        name: 'reload',
        aliases: ['reload'],
        usage: `${config.prefix}reload`,
        description: `The reload command (Developer only)!`,
        category: `Developer`
    }
}