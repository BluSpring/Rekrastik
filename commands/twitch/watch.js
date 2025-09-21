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
    exec: async (bot, message, argss) => {
        // Complete code
        let args = argss.slice(1);
        if(!args[0]) return message.channel.send('No arguments defined!')
        let username;
        if(args.join(' ').includes('https://twitch.tv/')) {
            username = args[0].toString().slice('https://twitch.tv/'.length)
        } else if(args.join(' ').includes('https://www.twitch.tv/')) {
            username = args[0].toString().slice('https://www.twitch.tv/'.length)
        } else {
            username = args[0]
        }
        //functions.twitchAPIRequest(message, 'getUser', username)
        axios.get(bot.selectType(message, 'getUser', username), options)
        .then(response => {
            let newRoss;
            let res = response.data.data,
            keys = Object.keys(res),
            ress = keys.map(k => newRoss = res[k])
    
            if(newRoss == [])
                return message.channel.send("That user doesn't exist or is not online.")
            message.channel.send("**<:twitch:478117673566208001> Live on Twitch**\nhttps://twitch.tv/{}".replace('{}', username))
        })
    },
    help: {
        name: 'watch',
        aliases: ['watch'], // Not actually needed right now
        usage: `${config.prefix}watch`,
        description: `Watch a Twitch stream from Discord!`,
        category: `Twitch`
    }
}