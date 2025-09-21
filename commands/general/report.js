const Discord = require('discord.js');
const config = require(`../../config.json`);

module.exports = {
    exec: async (bot, message, args) => {
        const argus = message.content.split(' ').slice(1);
        if(!argus || argus == '')
            return message.channel.send('You forgot to add arguments!');
        bot.channels.get('484133584878174211').send(`Issue filed by **${message.author.tag}** (${message.author.id}) in server ${message.guild.name} (${message.guild.id}) with message: \`\`\`\n${argus.join(' ')}\`\`\``);
        message.channel.send(`Report successfully sent! If you want more support, please go to the support server at <https://discord.gg/dNN4azK>`);
    },
    help: {
        name: 'report',
        aliases: ['report'],
        usage: `${config.prefix}report <message>`,
        description: `Report bot issues to the developer(s)!`,
        category: `General`
    }
}