const Discord = require('discord.js');
const config = require(`../../config.json`);
const axios = require('axios');
const options = {
    headers: {
        'Client-ID': config.client_id,
        'Authentication': `Bearer ${config.client_secret}`,
        'User-Agent': 'TwitchBot JS Attempt',
        'Accept': "application/vnd.twitchtv.v5+json"
    }
}
module.exports = {
    exec: async (bot, message, args) => {
        // Complete code
        axios.get(`https://api.twitch.tv/kraken/games/top`, options)
        .then(async response => {
            const r = response.data.top;
            const embed = new Discord.RichEmbed()
            .setColor(bot.mainColour)
            .setTitle("<:twitch:478117673566208001> Top Games")
            let place = 1;
            r.forEach(cr => {
                embed.addField(`\`${place}.\` ${cr.game.name}`, `${cr.viewers} viewers • ${cr.channels} channels`)
                place = place + 1;
            })
            message.channel.send(embed);
        })
    },
    help: {
        name: 'top',
        aliases: ['top'], // Not actually needed right now
        usage: `${config.prefix}top`,
        description: `Gets the most popular Twitch games`,
        category: `Twitch`
    }
}