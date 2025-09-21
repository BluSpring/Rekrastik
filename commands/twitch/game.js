/*
	if(!args[0]) return message.channel.send(`No arguments defined!`)
	axios.get(functions.selectType(message, 'gameName', args.join(' ')), options)
	.then(async response => {
		const r = response.data.data[0];
		if(response.status == 404 || response.data.data == [])
			return message.channel.send("No results found.");
		
		const embed = new Discord.RichEmbed()
		.setColor(twitch.mainColour)
		.setTitle(r.name)
		.setDescription("[View Streams](https://www.twitch.tv/directory/game/{})".replace('{}', `${r.name}`.replace(' ', '%20')))
		.setImage(`${r.box_art_url}`.replace('{width}', '285').replace('{height}', '380'))
		message.channel.send(embed);
    })
    */

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
       if(!args[0]) return message.channel.send(`No arguments defined!`)
       axios.get(bot.selectType(message, 'gameName', args.join(' ')), options)
       .then(async response => {
           const r = response.data.data[0];
           if(response.status == 404 || response.data.data == [])
               return message.channel.send("No results found.");
           
           const embed = new Discord.RichEmbed()
           .setColor(bot.mainColour)
           .setTitle(r.name)
           .setDescription("[View Streams](https://www.twitch.tv/directory/game/{})".replace('{}', `${r.name}`.replace(' ', '%20')))
           .setImage(`${r.box_art_url}`.replace('{width}', '285').replace('{height}', '380'))
           message.channel.send(embed);
       })
    },
    help: {
        name: 'game',
        aliases: ['game'], // Not actually needed right now
        usage: `${config.prefix}game <name>`,
        description: `Gets info on a Twitch game`,
        category: `Twitch`
    }
}