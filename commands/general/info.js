const Discord = require('discord.js');
const config = require(`../../config.json`);
const pidusage = require('pidusage');
const os = require('os');
module.exports = {
	exec: async (bot, message, args) => {
        // Complete code
        /* // Note: This info command code is actually my code :P

        // Except for formatBytes(), that is from StackOverflow somewhere.
        // I actually lost the StackOverflow link for it.
        // Also this is from TwitchBot JS, a JS version of TwitchBot.
        var days1 = Math.floor(bot.uptime / 86400000)
		var hours1 = Math.floor((bot.uptime % 86400000) / 3600000)
		var minutes1 = Math.floor(((bot.uptime % 86400000) % 3600000) / 60000)
        var seconds1 = Math.floor((((bot.uptime % 86400000) % 360000) % 60000) / 1000)
    function getCurrentAmount() {
        const notif = Object.keys(bot.notifs);
        let currentAmount = notif.length;
		notif.forEach(cr => {
			currentAmount = (currentAmount + Object.keys(bot.notifs[cr]).length);
		})
        return currentAmount;
    }
	
	pidusage(process.pid, function (err, stats) {
		const embed = new Discord.RichEmbed()
		.setColor(twitch.mainColour)
		.setThumbnail(bot.user.avatarURL)
		.setTitle("<:twitch:404633403603025921> TwitchBot Stats")	
		.addField('Uptime', `${days1} days, ${hours1} hours, and ${minutes1} minutes`)
		.addField('Version', `NodeJS ${process.version}\nDiscord.JS v${Discord.version}`)
		.addField('Usage', `**•** ${bot.guilds.size} servers\n**•** ${bot.users.size} users\n**•** ${twitch.commandsRun.length} commands run\n**•** ${Object.keys(liveChecks).length} live checks\n**•** ${getCurrentAmount()} streamer notifications`)
		.addField('Shard Info', `**•** Current Shard: ${bot.shard.id + 1} (Real: ${bot.shard.id})\n**•** Shard latency: ${bot.ping}ms\n**•** Total shards: ${bot.shard.count}`)
		.addField('System', `**•** ${stats.cpu.toFixed(2)}% CPU\n**•** ${formatBytes(stats.memory)}/${formatBytes(os.totalmem())} memory used`)
	   embed.addField(`Developer(s)`, `Akira#4587 (Python version) • [Website](https://disgd.pw) • & Naz // ► BluSpring ► (Broken...)#1455 (JavaScript version) • [Website](https://fbk-bot.gq) •`)
       message.channel.send(embed)
       */
        var days1 = Math.floor(bot.uptime / 86400000);
		var hours1 = Math.floor((bot.uptime % 86400000) / 3600000);
		var minutes1 = Math.floor(((bot.uptime % 86400000) % 3600000) / 60000);
        var seconds1 = Math.floor((((bot.uptime % 86400000) % 360000) % 60000) / 1000);
        pidusage(process.pid, function (err, stats) {
            const embed = new Discord.RichEmbed()
            .setColor(bot.mainColour)
            .setThumbnail(bot.user.avatarURL)
            .setTitle("Rekrastik Info")	
            .addField('Uptime', `${days1} days, ${hours1} hours, and ${minutes1} minutes`)
            .addField('Version', `NodeJS ${process.version}\nDiscord.JS v${Discord.version}`)
            .addField('Usage', `**•** ${bot.guilds.size} servers\n**•** ${bot.users.size} users\n**•** ${bot.commandsRun.length} commands run`)
            .addField('Shard Info', `**•** Current Shard: ${bot.shard.id + 1} (Real: ${bot.shard.id})\n**•** Shard latency: ${bot.ping.toFixed(2)}ms\n**•** Total shards: ${bot.shard.count}`)
            .addField('System', `**•** ${stats.cpu.toFixed(2)}% CPU\n**•** ${formatBytes(stats.memory)}/${formatBytes(os.totalmem())} memory used`)
           embed.addField(`Developer(s)`, `${bot.users.get('455346525716086795').tag} • [Website](https://rekrastik.github.io)`)
           message.channel.send(embed)
        });
	},
	help: {
		name: 'info',
		aliases: ['info'], // Not actually needed right now
		usage: `${config.prefix}info`,
		description: `Bot information!`,
		category: `General`
	}
};

function formatBytes(bytes) {
    if(bytes < 1024) return bytes + " Bytes";
    else if(bytes < 1048576) return(bytes / 1024).toFixed(3) + " KB";
    else if(bytes < 1073741824) return(bytes / 1048576).toFixed(3) + " MB";
    else return(bytes / 1073741824).toFixed(3) + " GB";
};
