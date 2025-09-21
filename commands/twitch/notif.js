const Discord = require('discord.js');
const config = require(`../../config.json`);
const axios = require('axios');
const path = require('path');
const fs = require('fs');
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
        // Again, TwitchBot JS
        //console.log(args);
        if(!args[1])
            return message.channel.send(`**ERROR!** You didn't define **add**, **remove** or **list**!`);
        if(args[1] == 'add') {
            if(!message.guild.members.get(message.author.id).hasPermission("MANAGE_GUILD")) return message.channel.send(`Error: You must have the "MANAGE_SERVER" permission in order to use that command!`)
            if(!args[3]) return message.channel.send(`You're missing some required arguments!`)
            if(!args[2] || !message.mentions.channels.first) return message.channel.send('No channel defined!')
            let username;
            let game;
            let daChannel = message.mentions.channels.first();
            if(args.join(' ').includes('https://twitch.tv/')) {
                username = args[3].toString().slice('https://twitch.tv/'.length)
            } else if(args.join(' ').includes('https://www.twitch.tv/')) {
                username = args[3].toString().slice('https://www.twitch.tv/'.length)
            } else {
                username = args[3]  
            }
            
            
            axios.get(bot.selectType(message, 'user', username), options)
            .then(responsi => {
                let response;
                let res = responsi.data.data,
                        keys = Object.keys(res)
                        newRes = keys.map(k => response = res[k])
        
                if(responsi.status == 404 || response == undefined) 
                    return message.channel.send("That user does not exist.")
                let botNotifs = bot.notifs[response.id];
                if(botNotifs == undefined || botNotifs == null) {
                    botNotifs = {};
                    bot.notifs[response.id] = botNotifs;
                }
                let theObject;
                if(!args[4]) {
                    theObject = {
                        'last_stream_id': null,
                        message: `https://twitch.tv/${username} is now live on Twitch!`
                    };
                    bot.notifs[response.id][daChannel.id] = theObject;
                } else {
                    theObject = {
                        'last_stream_id': null,
                        message: args.slice(3).join(' ')
                    };
                    bot.notifs[response.id][daChannel.id] = theObject;
                }
                fs.writeFile(path.join(__dirname, '../../data/notifs.json'), JSON.stringify(bot.notifs), err => {
                    if(err) {
                        log(message, err)
                        log(message, `${err}\nCommand: ${message.content}`)
                    }
                })
                message.channel.send(`You should now receive a message in ${daChannel} when \`${username}\` goes live.`)
            })
        } else if(args[1] == 'remove') {
            if(!message.guild.members.get(message.author.id).hasPermission("MANAGE_GUILD")) return message.channel.send(`Error: You must have the "MANAGE_SERVER" permission in order to use that command!`)
            if(!args[3]) return message.channel.send(`You're missing some required arguments!`)
            if(!args[2] || !message.mentions.channels.first) return message.channel.send('No channel defined!')
            let username;
            let game;
            let daChannel = message.mentions.channels.first();
            if(args.join(' ').includes('https://twitch.tv/')) {
                username = args[2].toString().slice('https://twitch.tv/'.length)
            } else if(args.join(' ').includes('https://www.twitch.tv/')) {
                username = args[2].toString().slice('https://www.twitch.tv/'.length)
            } else {
                username = args[2]   
            }
        
            axios.get(bot.selectType(message, 'user', username), options)
            .then(async responsi => {
                let response;
                let res = responsi.data.data,
                        keys = Object.keys(res)
                        newRes = keys.map(k => response = res[k])
        
        
                if(responsi.status == 404) 
                    return message.channel.send("That user does not exist.")
        
                let botNotifs = bot.notifs[response.id];
                let count = 0;
                await Object.keys(botNotifs).forEach(crx => {
                    if(crx == daChannel.id) count = count + 1;
                })
        
                try {
                    if(count == 0) {
                        return message.channel.send("Either that user doesn't exist or is not set up for that channel.");
                    } else {
                        delete botNotifs[daChannel.id];
                        message.channel.send("You won't get any notifications in {} when `{}` goes live.".replace('{}', daChannel.toString()).replace('{}', username))
                    }
                    if(Object.keys(botNotifs).length == 0)
                        delete botNotifs;
                    fs.writeFile(path.join(__dirname, '../../data/notifs.json'), JSON.stringify(bot.notifs), err => {
                        if(err) {
                            twitch.onCommandError(message, err)
                            twitch.onCommandError('1', `${err}\nCommand: ${message.content}`)
                        }
                    })
                } catch (err) {
                    return message.channel.send("Either that user doesn't exist or is not set up for that channel.");
                }
            })
        } else if(args[1] == 'list') {
            let allNotifs = [];
            let count = 1;
            let currentCount = 0;
            const channel = message.mentions.channels.first() || message.channel;
            await Object.keys(bot.notifs).forEach(async nto => {
                if(bot.notifs[nto][channel.id]) {
                    count = count + 1;
                    let crxx;
                    await axios.get(`https://api.twitch.tv/helix/users?id=${nto}`, options)
                    .then(async response => {
                        crxx = response.data.data[0];
                    })
                    allNotifs.push(`**${count}** - ${crxx.display_name}`)
                }
                currentCount = currentCount + 1;
            })
        
            let curLength = 0;
            allNotifs.forEach(crx => {
                curLength = Math.floor(curLength + crx.length);
            })
            //console.log(allNotifs)
            if(curLength > 1024)
                return message.channel.send(`Developer is so lazy, he doesn't want to fix this -_-`)
            const embed = new Discord.RichEmbed()
                .setColor(bot.mainColour)
                .setTitle(`Streamer notifications for #${channel.name}`)
                .setDescription(`\nMessages for streamer notifications were removed due to limitations with Discord embeds. (And due to the laziness of the developer, Naz)`)
                if(!allNotifs[0])
                    embed.addField('Notifications', 'No streamer notifications are set up for this channel.')
                else
                    embed.addField('Notifications', allNotifs.join('\n'))
                //embed.setFooter(twitch.crFooter)
        
            const curMsg = await message.channel.send(embed);

            const crt = setInterval(() => {
                if(allNotifs.length > 1) {
                    curMsg.edit(embed);
                    clearInterval(crt);
                }
            }, 20);
            setTimeout(() => {
                clearInterval(crt);
            }, 400);
        } else {
            message.channel.send(`**ERROR** It must be **add**, **remove** or **list**!`);
        }
    },
    help: {
        name: 'notif',
        aliases: ['notif'], // Not actually needed right now
        usage: `${config.prefix}notif <add/remove/list> <#discord_channel> <twitch_user> [message]`,
        description: `Add, remove, or view notifications you set for a specific channel!`,
        category: `Twitch`
    }
}