const { ShardingManager } = require('discord.js');
const config = require('./config.json')
const Manager = new ShardingManager('./rekrastik.js', { totalShards: 'auto', token: config.token });
console.log('Starting...');

Manager.on('launch', async shard => {
    console.log(`Shard ${shard.id} (Process ${shard.process.pid}) now online!`)
})
.spawn();

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: ', p, ', reason:', reason);
    if(reason.toString().includes('ENOTFOUND')) return process.exit(1)
})