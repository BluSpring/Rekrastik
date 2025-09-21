/*
	The Rekrastik code! Created by BluSpring.
	GitHub: https://github.com/Rekrastik/Rekrastik
	Bot Invite: https://discordapp.com/oauth2/authorize?client_id=471306061668941824&permissions=8&scope=bot
	Website: https://rekrastik.github.io/
	
	Not as many notes as I would add, I did most of the code myself and even I don't know how it works.
*/

// Good grief, how many initialization shit do I need?
const Discord = require('discord.js');
const bot = new Discord.Client();
const client = bot;
const config = require('./config.json');
const fs = require('fs');
const path = require('path');
const sqlite = require('sqlite'); // Database shiz
const SettingsManager = require('./util/SettingsManager.js');
bot.settings = new SettingsManager.Manager(path.resolve(path.join(__dirname, './data/settings.json')));
bot.commands = new Map();
bot.config = config;
const prefix = config.prefix;
const Music = require('discord.js-lavalink-musicbot');
bot.mainColour = '#ffa400';
const axios = require('axios');
bot.rateLimits = {"twitch": 0}; // Ratelimit thingy.
bot.notifs = require('./data/notifs.json');
let mesage;
const util = require('util');
const DBL = require("dblapi.js");
const dbl = new DBL(config.botLists.dbl, bot);

// Optional events
dbl.on('posted', () => {
	log('Server count posted!');
});
  
dbl.on('error', e => {
   	log(`Oops! ${e}`);
});
/*
const music = new Music(bot, {
	lavalink: {
		"restnode": {
			"host": "localhost",
			"port": 2333,
			"password":"FBK*9683"
		},
		"nodes": [
			{ "host": "localhost", "port": 80, "region": "asia", "password": "FBK*9683" }
		],
	},
	admins: config.admins,
	token: config.token,
	prefix: config.prefix
});*/
const admins = config.admins;
let level = require('./data/level.json');
bot.level = level;
/*
let settings = require('./data/settings.json');
bot.settings = settings;*/
function writeLevel() {
	fs.writeFile('./data/level.json', JSON.stringify(level), (err) => {
		if(err) message.channel.send(err.stack);
	});
}
bot.writeLevel = writeLevel;
let lastBotMessage = [];
let retardedUsers = {};
let count = 1;
/* // Old JSON settings setup.
function writeSettings() {
	fs.writeFile('./data/settings.json', JSON.stringify(settings), (err) => {
		if(err) message.channel.send(err.stack);
	});
}
bot.writeSettings = writeSettings;*/
bot.logHook = new Discord.WebhookClient(config.webhookID, config.webhookToken);
process.on('unhandledRejection', (reason, p) => {
    const ifNoMsg = new Discord.RichEmbed()
    .setColor([179, 0, 0]).setTimestamp()
    .addField('**ERROR!**', `Returned error: \`\`\`xl\nUnhandled Rejection at: ${p}, reason: ${reason}\`\`\``)
    bot.logHook.send(ifNoMsg)
    console.log('Unhandled Rejection at: ', p, ', reason:', reason);
    if(reason.toString().includes('ENOTFOUND')) return process.exit(1)
});
process.on('uncaughtException', (err) => {
    console.error(`Uncaught Exception Error: ${err.stack}`)
        process.exit(1)
});
async function loadCommands(message = null) { // I actually have no notes for this. I did it all blindly.
	let loadedCommands = [];
	let currentMsg;
	if(message !== null)
		currentMsg = await message.channel.send(`Reloading commands...`);
	//try {
		fs.readdir('./commands', (err, files) => {
			if(err) {
				if(message == null) {
					log(`Error loading commands: ${err.stack}`);
				} else {
					message.channel.send(`Error loading commands: ${err.stack}`);
					currentMsg.edit(loadedCommands.join('\n'));
				};
			};
			files.forEach(async crx => {
				if(!crx.includes('.')) {
					fs.readdir(`./commands/${crx.toString()}`, async (errr, filesx) => {
						if(errr) {
							if(message == null) {
								log(`Error loading commands in ${crx}: ${errr.stack}`);
							} else {
								loadedCommands.push(`Error loading commands in ${crx}: ${errr.stack}`);
								currentMsg.edit(loadedCommands.join('\n'));
							};
						};
						filesx.forEach(async cr => {
							try {
								if(!cr.includes('.js')) return;
								let mod = require(`./commands/${crx.toString()}/${cr.toString()}`);
								if(bot.commands.get(mod.help.name) == undefined) {
									bot.commands.set(mod.help.name, mod);
									if(message == null) {
										console.log(`Loaded ${mod.help.name}.`);
									} else {
										loadedCommands.push(`Loaded module **${mod.help.name}**.`);
										currentMsg.edit(loadedCommands.join('\n'));
									};
								} else {
									await delete require.cache[`${__dirname}\\commands\\${crx.toString()}\\${cr.toString()}`];
									mod = require(`./commands/${crx.toString()}/${cr.toString()}`);
									await bot.commands.set(mod.help.name, mod);
									if(message == null) {
										console.log(`Reloaded ${mod.help.name}`);
									} else {
										loadedCommands.push(`Reloaded module **${mod.help.name}**.`);
										currentMsg.edit(loadedCommands.join('\n'));
									};
								};
							} catch (error) {
								if(message == null) {
									log(`Error loading commands: ${error.stack}`)
								} else {
									loadedCommands.push(`Error loading commands: ${error.stack}`);
									currentMsg.edit(loadedCommands.join('\n'));
								};
							};
						});
					});
				} else {
					try {
						if(!crx.includes('.js')) return;
						let mod = require(`./commands/${cr.toString()}`);
						if(bot.commands.get(mod.help.name) == undefined) {
							bot.commands.set(mod.help.name, mod);
							if(message == null) {
								console.log(`Loaded ${mod.help.name}.`);
							} else {
								loadedCommands.push(`Loaded module **${mod.help.name}**.`);
								currentMsg.edit(loadedCommands.join('\n'));
							};
						} else {
							await delete require.cache[`${__dirname}\\commands\\${cr.toString()}`];
							mod = require(`./commands/${cr.toString()}`);
							await bot.commands.set(mod.help.name, mod);
							if(message == null) {
								console.log(`Reloaded ${mod.help.name}`);
							} else {
								loadedCommands.push(`Reloaded module **${mod.help.name}**.`);
								currentMsg.edit(loadedCommands.join('\n'));
							};
						};
					} catch (error) {
						if(message == null) {
							log(`Error loading commands: ${error.stack}`)
						} else {
							loadedCommands.push(`Error loading commands: ${error.stack}`);
							currentMsg.edit(loadedCommands.join('\n'));
						};
					};
				};
			});
		})
};
bot.loadCommands = loadCommands;
bot.commandsRun = [];

bot.on('message', async message => {
	masage = message;
    const msg = message.content.trim();
	const command = msg.substring(prefix.length).split(/[ \n]/)[0].toLowerCase().trim();
	const args = msg.substring(prefix.length + command.length).split(' ');
	if(message.author.bot) return;
	if(message.content.startsWith(prefix) && bot.commands.get(command) !== undefined) {
		message.channel.startTyping();
		bot.commandsRun.push(command);
		setTimeout(() => {
			try {
				bot.commands.get(command).exec(bot, message, args)
				.catch(err => {
					message.channel.send(`Error using command **${command}**: ${err.stack}`);
					log(`Error using command <${command}> [Usage: ${message.content}]: ${err.stack}\n\nPlease go to the support server at https://discord.gg/dNN4azK for assistance!`);
				});
			} catch (err) {
				message.channel.send(`Error using command **${command}**: ${err.stack}`);
				log(`Error using command <${command}> [Usage: ${message.content}]: ${err.stack}\n\nPlease go to the support server at https://discord.gg/dNN4azK for assistance!`);
			}
			message.channel.stopTyping(true);
		}, 1000);
	};
	if(!message.content.startsWith(prefix) && message.content.length > 3) {
		
		if(!bot.settings.get(message.guild.id, 'levellingEnabled') && !bot.settings.get(message.guild.id, 'levellingMessage')) {
			bot.settings.set(message.guild.id, 'levellingEnabled', false);
			bot.settings.set(message.guild.id, 'levellingMessage', `Good job, {user.tag}, you are now **Level {user.level}**!`)
		}
		if(bot.settings.get(message.guild.id, 'levellingEnabled') == false)
			return;		
		if(!level[message.author.id]) level[message.author.id] = {
			level: 0,
			experience: 0
		};


		let user = level[message.author.id];
		const resultt = Math.floor((Math.random() * 12) + (message.content.length - (Math.random() * message.content.length)));
		if(isNaN(user.experience) || user.experience == null) {
			user.experience = 0;
		}
		user.experience = Math.floor(user.experience + resultt);
		const xpSel = 205;
		const ctx = (xpSel * (user.level + 1));
		if(user.experience > ctx) {
			user.level = Math.floor(user.level + 1);
			replaceTags(bot.settings.get(message.guild.id, 'levellingMessage'), message);
		}
		writeLevel();
	}

	/* // Raid Protection setup, not needed right now.
	if(["@everyone", "@here", "<@&", "https://discord.gg", "https://discordapp.com/invite"].some(tld => msg.toLowerCase().includes(tld))) {
		if(!settings[message.guild.id] || !settings[message.guild.id].raidProtection || settings[message.guild.id].raidProtection.enabled == false)
			return;
		const Staff = message.guild.roles.find("name", "Staff");
		const retarded = () => {
			if(!retardedUsers[message.author.id]) retardedUsers[message.author.id] = [];
			return retardedUsers[message.author.id];
		}
		const retards = retarded();
		const otherDate = `${new Date().getDate()}:${new Date().getMonth()}:${new Date().getYear()}`
		let count;
		function countery() {
			if(!retards[0])
				count = 1;
			else
				count = Math.floor(retards[0].count + 1);
			
			return count;
		}
		let counting = countery();
		if(Staff !== null) { if(message.member.roles.get(Staff.id) !== undefined) return; }
		if(message.author.id === bot.user.id) return;
		if(message.author.bot) {
			message.channel.send(`${message.author.tag} **[BOT]** is doing \`@everyone\`, sending an invite or mentioning a role in channel ${message.channel.toString()}! May be a raid! For precautions, I shall delete this message.
			If a staff member was doing this on purpose, you may retrieve the message by typing \`twf.retrieve {count}\`. The current count for this message is **${count}**! If it doesn't exist, the bot may have restarted!`)
			count = count + 1;
			lastBotMessage.push(message.content);
			message.guild.channels.find("name", "logs").send(`${message.author.tag} **[BOT]** is doing \`@everyone\`, sending an invite or mentioning a role in channel ${message.channel.toString()}! May be a raid! For precautions, I shall delete this message.
			If a staff member was doing this on purpose, you may retrieve the message by typing \`twf.retrieve {count}\`. The current count for this message is **${count}**! If it doesn't exist, the bot may have restarted! Message content: \`\`\`\n${message.content}\n\`\`\` (Try mentioning the role that is like \`<@&123456789012345678>\` or something like it.) ${Staff.toString()}, go check on it!`)
			return message.delete();
		}
		message.delete();
		message.guild.channels.find("name", "logs").send(`${message.author.tag} **[USER]** is using \`@everyone\`, sending an invite or mentioning a role in ${message.channel.toString()}! May be a raid! Message content: \`\`\`\n${message.content}\n\`\`\` (Try mentioning the role that is like \`<@&123456789012345678>\` or something like it.) ${Staff.toString()}, go check on it!`);
		retards.push({
			count: counting,
			date: otherDate
		})

		if(retards.length === 2)
			retards.shift();
		
		if(retards[0].count > 2 && retards[0].date == otherDate) {
			message.guild.members.get(message.author.id).ban(`Spamming @everyone and @here, sending an invite or a role over 5 times.`);
			delete retards;
		}
	}*/
	/*
	if(message.content.startsWith(prefix) && command == 'eval') {
        message.channel.startTyping();
        function clean(text) {
            if (typeof(text) === "string")
              return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else
                return text;
        }
        if(admins.some(adm => message.author.id.includes(adm))) {
			try {
                let code = args.join(" ");
                let evaled = eval(code)
                if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);
                if(evaled.length > 1024)
                    evaled = `Evaluation too long!`
                const embed = new Discord.RichEmbed()
				.setColor([0, 179, 0])
				.setThumbnail(client.user.avatarURL)
				.addField(':inbox_tray: Input', '```js\n' + clean(code) + '\n```')
                .addField(':outbox_tray: Output :thumbsup:', '```xl\n' + clean(evaled) + '\n```')
				message.channel.send(embed)
			} catch (err) {
				const code = args.join(" ");
				const embed = new Discord.RichEmbed()
				.setColor([179, 0, 0])
				.setThumbnail(client.user.avatarURL)
				.addField(':inbox_tray: Input', '```js\n' + clean(code) + '\n```')
                .addField(':outbox_tray: Output :x:', '```xl\n' + clean(err) + '\n```')
				message.channel.send(embed)
			}
		} else {
			message.channel.send('No permission.')
		}
		message.channel.stopTyping(true);
	}*/
	if(message.content.startsWith(prefix) && command == 'eval') {
		if(admins.some(cr => message.author.id.includes(cr))) {
			let code = args.join(' ');
			if (!code) return message.channel.send('No code provided!');
			this.client = bot;

			const evaled = {};
			const logs = [];

			const token = this.client.token.split('').join('[^]{0,2}');
			const rev = this.client.token.split('').reverse().join('[^]{0,2}');
			const tokenRegex = new RegExp(`${token}|${rev}`, 'g');
			const cba = '```js\n';
			const cb = '```';

			const print = (...a) => { // eslint-disable-line no-unused-vars
				const cleaned = a.map(obj => {
					if (typeof o !== 'string') obj = util.inspect(obj, { depth: 1 });
					return obj.replace(tokenRegex, 'Token? what token? I only seez a fool...');
					
				});

				if (!evaled.output) {
					logs.push(...cleaned);
					return;
				}

				evaled.output += evaled.output.endsWith('\n') ? cleaned.join(' ') : `\n${cleaned.join(' ')}`;
				const title = evaled.errored ? '☠\u2000**Error**' : '📤\u2000**Output**';

				if (evaled.output.length + code.length > 1900) evaled.output = 'Output too long.';
				var emb = new Discord.RichEmbed().setColor('GREEN')
				.addField(`📥\u2000**Input**`,
				`${cba}js`+code+cb).addField(`${title}`,
				`${cba}js`+evaled.output+cb).setTimestamp();
				evaled.message.edit("", emb);
			};

			try {
				let output = eval(code);
				if (output && typeof output.then === 'function') output = await output;

				if (typeof output !== 'string') output = util.inspect(output, { depth: 0 });
				output = `${logs.join('\n')}\n${logs.length && output === 'undefined' ? '' : output}`;
				output = output.replace(tokenRegex, 'Token? what token? I only seez a fool...');

				if (output.length + code.length > 1900) output = 'Output too long.';

				var emb = new Discord.RichEmbed().setColor('GREEN')
				.addField(`📥\u2000**Input**`,
				`${cba}`+code+cb).addField(`📤\u2000**Output**`,
				`${cba}`+output+cb).setTimestamp();
				const sent = await message.channel.send("", emb);

				evaled.message = sent;
				evaled.errored = false;
				evaled.output = output;

				return sent;
			} catch (err) {
				console.error(err); // eslint-disable-line no-console
				let error = err;

				error = error.toString();
				error = `${logs.join('\n')}\n${logs.length && error === 'undefined' ? '' : error}`;
				error = error.replace(tokenRegex, 'Token? what token? I only seez a fool...');

				var emb = new Discord.RichEmbed().setColor('RED')
				.addField(`📥\u2000**Input**`,
				`${cba}`+code+cb).addField(`☠\u2000**Error**`,
				`${cba}`+error+cb).setTimestamp();
				const sent = await message.channel.send("", emb);

				evaled.message = sent;
				evaled.errored = true;
				evaled.output = error;

				return sent;
			}
		}
	}
	/*
	$("#myHref").on('click', function() {
  alert("inside onclick");
  window.location = "http://www.google.com";
});
	*/
})
.on('ready', async () => {
    log(`Online!`);
    console.log(`[Rekrastik] Serving ${bot.guilds.size} guilds!`);
	bot.user.setActivity(`${bot.guilds.size} servers! | ${prefix}help`, { type: 'WATCHING' });
	loadCommands(); // Load all the commands.
	//bot.settings.init(); // Initialize the database, I originally didn't do that.
	setInterval(poll, 240000);
})
.on('guildCreate', async guild => {
	bot.user.setActivity(`${bot.guilds.size} servers! | ${prefix}help`, { type: 'WATCHING' });
	axios.post(`https://bots.disgd.pw/api/bot/${bot.user.id}/stats`, { headers: { Authorization: config.botLists.konomi }, guild_count: bot.guilds.size })
	.then(async res => {
		if(res.status !== 200)
			return log(`Received status code which is not "200"! Status Code: ${res.status}, \`\`\`json\n${res.data}\n\`\`\``);
	});
	dbl.postStats(bot.guilds.size, bot.shard.id, bot.shard.count);
	log(`Joined guild ${guild.name} with ID ${guild.id}, owner: ${guild.owner.user.tag} (${guild.owner.id})`, 'Guild Join')
})
.on('guildDelete', async guild => {
	bot.user.setActivity(`${bot.guilds.size} servers! | ${prefix}help`, { type: 'WATCHING' });
	axios.post(`https://bots.disgd.pw/api/bot/${bot.user.id}/stats`, { headers: { Authorization: config.botLists.konomi }, guild_count: bot.guilds.size })
	.then(async res => {
		if(res.status !== 200)
			return log(`Received status code which is not "200"! Status Code: ${res.status}, \`\`\`json\n${res.data}\n\`\`\``);
	});
	bl.postStats(bot.guilds.size, bot.shard.id, bot.shard.count);
	log(`Left guild ${guild.name} with ID ${guild.id}, owner: ${guild.owner.user.tag} (${guild.owner.id})`, 'Guild Leave')
})
.on('guildMemberAdd', async member => {
	const message = member;
	const msc = {
		author: {
			id: member.user.id,
			tag: member.user.tag,
			username: member.user.username
		},
		guild: {
			name: member.guild.name,
			memberCount: member.guild.memberCount
		}
	}
	if(!bot.settings.get(message.guild.id, 'joinEnabled') && !bot.settings.get(message.guild.id, 'joinMessage') && !bot.settings.get(message.guild.id, 'joinChannel')) {
		bot.settings.set(message.guild.id, 'joinEnabled', false);
		bot.settings.set(message.guild.id, 'joinMessage', `Welcome, **{user.tag}**, to **{guild.name}**!`);
		bot.settings.set(message.guild.id, 'joinChannel', 'none');
	}
	if(bot.settings.get(message.guild.id, 'joinEnabled') == false || bot.settings.get(message.guild.id, 'joinChannel') == 'none')
		return;
	
	member.guild.channels.get(bot.settings.get(message.guild.id, 'joinChannel')).send(replaceTags(bot.settings.get(message.guild.id, 'joinMessage'), msc));
})
.on('guildMemberRemove', async member => {
	const message = member;
	const msc = {
		author: {
			id: member.user.id,
			tag: member.user.tag,
			username: member.user.username
		},
		guild: {
			name: member.guild.name,
			memberCount: member.guild.memberCount
		}
	};
	if(!bot.settings.get(message.guild.id, 'leaveEnabled') && !bot.settings.get(message.guild.id, 'leaveMessage') && !bot.settings.get(message.guild.id, 'leaveChannel')) {
		bot.settings.set(message.guild.id, 'leaveEnabled', false);
		bot.settings.set(message.guild.id, 'leaveMessage', `Goodbye, **{user}**, and we hope you return!`);
		bot.settings.set(message.guild.id, 'leaveChannel', 'none');
	}
	if(bot.settings.get(message.guild.id, 'leaveEnabled') == false || bot.settings.get(message.guild.id, 'leaveChannel') == 'none')
		return;
	
	member.guild.channels.get(bot.settings.get(message.guild.id, 'leaveChannel')).send(replaceTags(bot.settings.get(message.guild.id, 'leaveMessage'), msc));
})


bot.login(config.token);

function log(message, type = 'Logs') { // To log in both console and webhook.
	console.log(`[Rekrastik] [${type}] ${message}`);
	bot.logHook.send(`[${type}] ${message}`)
}
/*
I'm currently working on a bot aiming to be one of the great ones!
► **Invite Link**: https://discordapp.com/oauth2/authorize?client_id=471306061668941824&scope=bot&permissions=8

► **Description**: A bot which currently only supports levelling and music!
*/


async function replaceTags(value, message) { // To replace all the tags with whatever.
	let crtx = value.toString().split(' ');
	let result = [];
	if(!level[message.author.id]) level[message.author.id] = {
		level: 0,
		experience: 0
	};
	crtx.forEach(async crx => {
		let vr = crx;
		vr = vr.replace('{user}', message.author.tag);
		vr = vr.replace('{user.tag}', `<@${message.author.id}>`);
		vr = vr.replace('{user.level}', level[message.author.id].level);
		vr = vr.replace('{guild.name}', message.guild.name);
		vr = vr.replace('{guild.members}', message.guild.memberCount);
		result.push(vr);
	});
	return result.join(' ');
};

bot.replaceTags = replaceTags;

/* Command Example
	const Discord = require('discord.js');
	const config = require(`../../config.json`);

	module.exports = {
		exec: async (bot, message, args) => {
			// Complete code
		},
		help: {
			name: 'command',
			aliases: ['alias1'], // Not actually needed right now
			usage: `${config.prefix}command`,
			description: `Command Description`,
			category: `Category (Will be used in help command)`
		}
	}
*/

/* Command Tree Example
	----- commands
		|--------- categoryName
				|-------------- command.js
*/

// This entire Twitch notification code was made by me, however it was based on
// TwitchBot (https://twitch.disgd.pw)

let gameCache = {}; // Game Caching, I guess?
const streamNotifs = require('./data/notifs.json');
let options = {
    headers: {
        'Client-ID': config.stream_id,
        'Authentication': `Bearer ${config.stream_secret}`,
        'User-Agent': 'Rekrastik',
        'Accept': "application/vnd.twitchtv.v5+json"
    }
}

let optionsOri = {
    headers: {
        'Client-ID': config.stream_id,
        'Authentication': `Bearer ${config.stream_secret}`,
        'User-Agent': 'Rekrastik',
        'Accept': "application/vnd.twitchtv.v5+json"
    }
}

let options2 = {
    headers: {
        'Client-ID': config.stream_id_2,
        'Authentication': `Bearer ${config.stream_secret_2}`,
        'User-Agent': 'Rekrastik',
        'Accept': "application/vnd.twitchtv.v5+json"
    }
}

let options3 = {
    headers: {
        'Client-ID': config.stream_id_3,
        'Authentication': `Bearer ${config.stream_secret_3}`,
        'User-Agent': 'Rekrastik',
        'Accept': "application/vnd.twitchtv.v5+json"
    }
}


let options4 = {
    headers: {
        'Client-ID': config.stream_id_4,
        'Authentication': `Bearer ${config.stream_secret_4}`,
        'User-Agent': 'Rekrastik',
        'Accept': "application/vnd.twitchtv.v5+json"
    }
}
let currentRateLimited = 0;

function setRateLimit() {
	if(currentRateLimited == 0) {
		currentRateLimited = 1;
		options = options2;
	}
	else if(currentRateLimited == 1) {
		currentRateLimited = 2;
		options = options3;
	}
	else if(currentRateLimited == 2) {
		currentRateLimited = 3;
		options = options4;
	}
	else if(currentRateLimited == 4) {
		currentRateLimited = 0;
		options = optionsOri;
	}
}


let lastStreamPoll;
async function poll() {
	const startingTime = new Date().getTime();
	console.log(`Polling for Twitch notifications...`);
	let count = 0;
	const message = mesage;
	const mainColour = 0x6441A4; // Main Twitch colour.
	const logHook = new Discord.WebhookClient(config.webhookID, config.webhookToken)
	let resc;
    let res = streamNotifs,
				keys = Object.keys(res),
                newRes = keys.map(k => resc = res[k])
                
    //resc.forEach(async rx => {
        axios.get(`https://api.twitch.tv/helix/streams?user_id=${Object.keys(bot.notifs).join('&user_id=')}`, options)
        .then(async response => {
            try {
			if(response.headers['ratelimit-remaining'] < 2) {
				setRateLimit();
			}
            if(response.status > 299) {
                log(`Stream request returned non-2xx status code: ${response.status}\n\`\`\`json\n${response.data}\n\`\`\``);
            }
			
			if(response.data.data.length == 0)
				return console.log(`No streamers streaming!`);
			response.data.data.forEach(reso => {
				
			
				if(reso !== undefined && reso.type == 'live') {
					const meta = bot.notifs[reso.user_id]
					/*
					meta.map(async gd => {
						if(gd.lastStreamID !== reso.id) {
							bot.notifs[reso.user_id][countChannels].lastStreamID = reso.id;
							fs.writeFile('./data/notifs.json', JSON.stringify(bot.notifs), err => {
								if(err) console.error(err);
							})
							const embed = new Discord.RichEmbed()
								.setColor(mainColour)
								.setTitle(reso.title)
							let game = null;
							
							if(!gameCache[reso.game_id]) {
								axios.get(`https://api.twitch.tv/helix/games?id=${reso.game_id}`, options)
								.then(async responsi => {
									let resac;
									let ress = responsi.data.data,
									keysa = Object.keys(ress),
									newRess = keysa.map(k => resac = ress[k])
									if(responsi.status > 299) {
										logHook.send(`Stream request returned non-2xx status code: ${response.status}\n\`\`\`json\n${response.data}\n\`\`\``);
									} else {
										game = resac.name;
										gameCache[reso.game_id] = game;
									}
								})
							} else {
								game = gameCache[reso.game_id];
							}
							embed.setDescription(`Playing ${gameCache[reso.game_id]} for ${reso.viewer_count} viewers`);
							embed.setImage(`${reso.thumbnail_url}`.replace('{width}', '1920').replace('{height}', '1080'));
							try {
								bot.channels.get(bot.notifs[reso.user_id][countChannels].channelID).send(bot.notifs[reso.user_id][countChannels].message, embed);
							} catch (err) {
								logHook.send(`Failed to send message: \`\`\`\n{}\n\`\`\``.replace('{}', err.stack))
							}
						countChannels = Math.floor(countChannels + 1);
						if(countChannels > bot.notifs['StreamIDs'].length) countChannels = 0;
						}
					})*/
					const allChannels = Object.keys(meta);
					allChannels.forEach(async gd => {
						const dis = meta[gd];
						if(dis['last_stream_id'] !== reso.id) {
							bot.notifs[reso.user_id][gd]['last_stream_id'] = reso.id;
							fs.writeFile('./data/notifs.json', JSON.stringify(bot.notifs), err => {
								if(err) console.error(err);
							})
							const embed = new Discord.RichEmbed()
								.setColor(mainColour)
								.setTitle(reso.title)
								.setAuthor(reso.login, reso.profile_image_url, `https://twitch.tv/reso.login`)
							let game = await grabGame(reso);
							
							embed.setDescription(`Playing ${game} for ${reso.viewer_count} viewers\n[Watch on Twitch](https://twitch.tv/${reso.login})`);
							embed.setImage(`${reso.thumbnail_url}`.replace('{width}', '1920').replace('{height}', '1080'));
							try {
								bot.channels.get(gd).send(bot.notifs[reso.user_id][gd].message, embed);
								count = count + 1;
							} catch (err) {
								log(`Failed to send message: \`\`\`\n{}\n\`\`\``.replace('{}', err.stack))
							}
						}
					})
				}
				log(`${count} notifications have successfully been polled in ${(new Date().getTime() - startingTime) / 1000} seconds.`);
				lastStreamPoll = new Date().toString();
			});
        } catch (err) {
            log(`Failed to send notification: \`\`\`xl${err.stack}\`\`\``);
        }
        })
		//count = Math.floor(count + 1);
    //})
}

async function grabGame(reso) {
    let game = 'Unknown';
    if(!gameCache[reso.game_id]) {
        axios.get(`https://api.twitch.tv/helix/games?id=${reso.game_id}`, options)
        .then(async responsi => {
            let resac;
            let ress = responsi.data.data,
            keysa = Object.keys(ress),
            newRess = keysa.map(k => resac = ress[k])
            if(responsi.status > 299) {
				logHook.send(`Stream request returned non-2xx status code: ${response.status}\n\`\`\`json\n${response.data}\n\`\`\``);
				game = 'Unknown (Ratelimited)';
            } else {
                game = resac.name;
                gameCache[reso.game_id] = game;
            }
        })
    } else {
        game = gameCache[reso.game_id];
    }

    return game;
}

bot.selectType = (message, type, end) => {
    if(type == 'getUser') {
        return `https://api.twitch.tv/helix/streams?user_login=${end}`
    } else if(type == 'user') {
        return `https://api.twitch.tv/helix/users?login=${end}`
    } else if(type == 'game') {

		return `https://api.twitch.tv/helix/games?id=${end}`
	} else if(type == 'gameName') {

		return `https://api.twitch.tv/helix/games?name=${end}`
	} else if(type == 'gameTop') {
		
		return `https://api.twitch.tv/helix/games/top?first=10`
	} else if(type == 'music') {
	
		return `https://twitch.tv/${end}`
	} else if(type == 'stream') {
		
		return `https://api.twitch.tv/helix/streams?user_id=${end}`
	} else if(type == 'clip') {
		return `https://api.twitch.tv/kraken/clips/top?channel=${end}`
    } else {
        log(message, `TypeError: Wrong type defined! Must've been a Developer messup.`)
    }
}