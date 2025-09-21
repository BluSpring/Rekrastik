const Discord = require('discord.js');
const config = require(`../../config.json`);

module.exports = {
    exec: async (bot, message, args) => {
        // Complete code
        const user = message.mentions.users.first() || message.author;
        const embed = new Discord.RichEmbed()
        .setColor(bot.mainColour)
        .setTitle(`${user.tag}'s avatar`)
        .setImage(user.avatarURL)
        message.channel.send(embed);
    },
    help: {
        name: 'avatar',
        aliases: ['avatar'], // Not actually needed right now
        usage: `${config.prefix}avatar [user]`,
        description: `Get a user avatar!`,
        category: `General`
    }
}