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
        let args = argus.slice(1);
        // Complete code
        let username;
        if(!message.guild.members.get(bot.user.id).hasPermission('EMBED_LINKS')) return message.channel.send(`**ERROR!** I don't have the \`EMBED_LINKS\` permission!`)
        if(!args.join(' ')) {
            return message.channel.send(`No arguments defined!`);
        }
        if(args.join(' ').includes('https://twitch.tv/')) {
            username = args[0].toString().slice('https://twitch.tv/'.length)
        } else if(args.join(' ').includes('https://www.twitch.tv/')) {
            username = args[0].toString().slice('https://www.twitch.tv/'.length)
        } else {
            username = args[0]
        }
            axios.get(bot.selectType(message, 'user', username), options).then(response => {
                if(response.status == 429) {
                    let newRoss;
                    let res = response,
                    keys = Object.keys(res),
                    ress = keys.map(k => newRoss = res[k])
                    message.channel.send(`**ERROR!** The bot has been ratelimited! Please wait...`);
                    log(`**ERROR!** Bot has been ratelimited!`);
                    //twitch.bot.ratelimits.twitch = response
                }
                let newRes;
                let responso;
                let residentEvil;
                let res = response.data.data,
                    keys = Object.keys(res),
                    ress = keys.map(k => newRes = res[k])
                    
                //let user = bot.twitchAPIRequest(message, 'getUser', username)
                let userData = user
                if(newRes == undefined) return message.channel.send(`Error: That user does not exist!`)
                const embed = new Discord.RichEmbed()
                    .setColor(bot.mainColour)
                    .setAuthor(newRes.display_name, newRes.profile_image_url, `https://twitch.tv/${newRes.login}`)
                    .setThumbnail(newRes.profile_image_url)
                    .setTitle(newRes.login)
                    .setDescription(newRes.description)
                    .addField('Views', newRes.view_count)
                    axios.get(bot.selectType(message, 'getUser', username), options).then(async responsike => {
                        let resi = responsike.data.data,
                    keysu = Object.keys(resi),
                    resii = keysu.map(k => responso = resi[k])
                    let awuu = await message.channel.send(embed)
                    
                if(responso !== undefined) {
                    axios.get(functions.selectType(message, 'game', responso.game_id), options).then(responsi => {
                        let resu = responsi.data.data,
                    keysi = Object.keys(resu),
                    resuu = keysi.map(k => residentEvil = resu[k])
                    
                    embed.addField(`Currently Live`, `Playing ${residentEvil.name} for ${responso.viewer_count} viewers\n\n**[Watch on Twitch](https://twitch.tv/${newRes.login})**`)
                    awuu.edit(embed)
                    })
                } else {
                    embed.addField(`Currently Offline`, `[View Twitch Profile](https://twitch.tv/${newRes.login})`)
                    awuu.edit(embed)
                }
            })
        })
    },
    help: {
        name: 'user',
        aliases: ['user'], // Not actually needed right now
        usage: `${config.prefix}user <twitch_user>`,
        description: `Gets info on a Twitch channel`,
        category: `Twitch`
    }
}