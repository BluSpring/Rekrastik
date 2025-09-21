const Discord = require('discord.js');
const config = require(`../../config.json`);

module.exports = {
    exec: async (bot, message, args) => {
		if(!message.guild.members.get(message.author.id).hasPermission('MANAGE_GUILD'))
			return message.channel.send(`You require to have **Manage Server** to use this!`);
		if(!args[1])
			return message.channel.send(`
Usage: \`${bot.commands.get('settings').help.usage}\`
Settings setup:
\`\`\`asciidoc
name        :: value      :: default
--------------------
joinEnabled :: true/false :: false
joinMessage :: text       :: Welcome, *{user.tag}*, to *{guild.name}*!
joinChannel :: Discord channel (mention) :: null
leaveEnabled :: true/false :: false
leaveMessage :: text       :: Goodbye, *{user}*, and we hope you return!
leaveChannel :: Discord channel (mention) :: null
levellingEnabled :: true/false :: false
levellingMessage :: text :: Good job, {user.tag}, you are now *Level {user.level}*!

\`\`\`
			`);
		
		const settingsList = [
			"joinEnabled",
			'joinMessage',
			'joinChannel',
			'leaveEnabled',
			'leaveMessage',
			'leaveChannel',
			'levellingEnabled',
			'levellingMessage'
		];
		if(settingsList.some(cr => args[1] == cr)) {
			if(!args[2]) return message.channel.send(`Oh come on now, ${message.author.toString()}, you didn't specify a value!`);
			
			const channelList = [
				'joinChannel',
				'leaveChannel'
			];
			
			let value = args.slice(2).join(' ');
			if(channelList.some(crt => args[1] == crt)) {
				if(!message.mentions.channels.first() && (message.mentions.users.first() || message.mentions.roles.first() && args[2] == message.mentions.users.first().toString() || args[2] == message.mentions.roles.first().toString() || message.mentions.everyone == true))
					return message.channel.send(`I'm surprised you tried mentioning a user instead of a channel.`);
				
				value = message.mentions.channels.first();
				
				bot.settings.set(message.guild.id, args[1], value.id);
			} else {
				const booList = [
					'joinEnabled',
					'leaveEnabled',
					'levellingEnabled'
				];
				
				if(booList.some(crtx => args[1] == crtx))
					if(!['true', 'false'].some(crk => args[2] == crk))
						return message.channel.send(`Hey! This value is supposed to be **true** or **false**!`)
				bot.settings.set(message.guild.id, args[1], value);
			}
			
			message.channel.send(`Set type **${args[1]}** to value \`${value}\`!`);
		} else {
			message.channel.send(`This is an invalid type!`);
		}
    },
    help: {
        name: 'settings',
        aliases: ['settings'],
        usage: `${config.prefix}settings <type> <value>`,
        description: `To set up settings for your server!`,
        category: `Moderation`
    }
}