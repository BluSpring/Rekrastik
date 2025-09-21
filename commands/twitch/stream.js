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
    exec: async (bot, message, argus) => {
        // Complete code
        let args = argus.slice(1);
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
    
            //functions.twitchAPIRequest(message, 'user', username)
            axios.get(bot.selectType(message, 'user', username), options)
            .then(responsi => {
                let newRos;
                let rest = responsi.data.data,
                keyss = Object.keys(rest),
                resi = keyss.map(k => newRos = rest[k])
    
                //functions.twitchAPIRequest(message, 'game', newRoss.game_id)
                axios.get(bot.selectType(message, 'game', newRoss.game_id), options)
                .then(responso => {
                    let newRose;
                    let resu = responso.data.data,
                    keysss = Object.keys(resu),
                    restp = keysss.map(k => newRose = resu[k])
    
                    const embed = new Discord.RichEmbed()
                    .setColor(bot.mainColour)
                    .setImage(`${newRoss.thumbnail_url}`.replace('{width}', '1920').replace('{height}', '1080'))
                    .setTitle(newRoss.title)
                    .setDescription(`
                    Playing ${newRose.name} for ${newRoss.viewer_count} viewers
    **[Watch on Twitch](https://twitch.tv/${newRos.login})** or type \`${config.prefix}watch ${newRos.login}\`
    Stream Preview:
                    `)
                    .setAuthor(newRos.display_name, newRos.profile_image_url, `https://twitch.tv/${newRos.login}`)
                    //.setFooter(twitch.crFooter)
                    message.channel.send(embed)
                })
            })
        })
    },
    help: {
        name: 'stream',
        aliases: ['stream'], // Not actually needed right now
        usage: `${config.prefix}stream <user>`,
        description: `Gets info on a user's stream`,
        category: `Twitch`
    }
}