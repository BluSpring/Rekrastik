const Discord = require('discord.js');
const config = require(`../../config.json`);

module.exports = {
    exec: async (bot, message, args) => {
        // Complete code
        const kicked = message.guild.member(message.mentions.users.first());
        let reason = args.slice(1).join(' ');
        if(!kicked)
            return message.channel.send(`No user provided to kick!`)
        else if(!reason || reason == null)
            reason = `No reason specified.`
        if(!message.guild) 
            return message.channel.send(`You can't run this command in direct messages.`);
        else if(!message.guild.members.get(message.author.id).permissions.has('KICK_MEMBERS'))
            return message.channel.send("You need the **Kick Members** permission to do this!");
        else if(!message.guild.members.get(bot.user.id).permissions.has('KICK_MEMBERS'))
            return message.channel.send("I need the **Kick Members** permission to do this!");
        let sending = `Successfully kicked **${kicked.user.tag}** for reason **${reason}**`
       await kicked.kick(`Responsible moderator: ${message.author.tag}\nReason: ${reason}`)
        .catch(err => {
            sending = "That member couldn't be kicked. Do they have a higher role than me?"
        })
        .then(() => {
            message.channel.send(sending);
        })
    },
    help: {
        name: 'kick',
        aliases: ['kick'], // Not actually needed right now
        usage: `${config.prefix}kick <user> [reason]`,
        description: `Kick users that are breaking the rules!`,
        category: `Moderation`
    }
}