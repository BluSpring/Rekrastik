const Discord = require('discord.js');
const config = require(`../../config.json`);

module.exports = {
    exec: async (bot, message, args) => {
        let level = bot.level;
        if(!bot.settings.get(message.guild.id, 'levellingEnabled') && !bot.settings.get(message.guild.id, 'levellingMessage')) {
			bot.settings.set(message.guild.id, 'levellingEnabled', false);
			bot.settings.set(message.guild.id, 'levellingMessage', `Good job, {user.tag}, you are now **Level {user.level}**!`)
		}
		if(bot.settings.get(message.guild.id, 'levellingEnabled') == false)
			return;		
		const user = (message.mentions.users.first() && message.guild.member(message.mentions.users.first()).user) || message.author;
		if(!level[message.author.id]) level[message.author.id] = {
			level: 0,
			experience: 0
		};
		bot.writeLevel();
		const rank = level[user.id];
		const embed = new Discord.RichEmbed()
		.setColor([0, 255, 0])
		.setAuthor(`Rank Card`, user.avatarURL)
		.setTitle(`${user.tag}'s Rank Card`)
		.addField('Level', rank.level, true)
		.addField('`Experience`', `${rank.experience}/${Math.floor(205 * (rank.level + 1))}`, true)
		message.channel.send(embed);
    },
    help: {
        name: 'rank',
        aliases: ['rank'],
        usage: `${config.prefix}rank [user]`,
        description: `Rank information (Global)!`,
        category: `General`
    }
}