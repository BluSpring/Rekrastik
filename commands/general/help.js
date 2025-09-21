const Discord = require('discord.js');
const config = require(`../../config.json`);

// World's shittiest help command setup?
module.exports = {
    exec: async (bot, message, args) => {
        let helpList = {};
		let crt = [];
        bot.commands.forEach(crx => {
            if(!helpList[crx.help.category]) helpList[crx.help.category] = [];
			if(!config.admins.some(ct => message.author.id == ct) && crx.help.category == 'Developer') return;
            helpList[crx.help.category].push(`${crx.help.usage} :: ${crx.help.description}`);
        });
		Object.keys(helpList).forEach(cr => {
			if(!config.admins.some(ct => message.author.id == ct) && cr == 'Developer')
				return;
			
			crt.push(`\n\n.${cr}.\n`);
			crt.push(helpList[cr].join('\n'));
		});
        message.channel.send(`
\`\`\`asciidoc
= Rekrastik's Help Command =
: <> = Required :
: [] = Optional :
If you're having issues with the bot, join the support server at https://discord.gg/xegmTCS
Music help: >mhelp
${crt.join('')}
\`\`\`
		`);
    },
    help: {
        name: 'help',
        aliases: ['help', '?'],
        usage: `${config.prefix}help`,
        description: `Rekrastik's complete help command!`,
        category: `General`
    }
}