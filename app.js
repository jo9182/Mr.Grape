const fs = require('fs');
const Discord = require('discord.js');
const config  = require('./config.json');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const Keyv = require('keyv');
const users = new Keyv(process.env.DATABASE_URL, {namespace: 'users'});
const items = new Keyv(process.env.DATABASE_URL, {namespace: 'items'});
const commandFilesEconomy = fs.readdirSync('./commands/economy').filter(file => file.endsWith('.js'));
const commandFilesFun = fs.readdirSync('./commands/fun').filter(file => file.endsWith('.js'));
const commandFilesUtility = fs.readdirSync('./commands/utility').filter(file => file.endsWith('.js'));
const addMoni = async function (who, howmuch) {
    let rightnow = await users.get(who);
    if (rightnow === undefined) {
        await users.set(who, 0)
    }
    await users.set(who, (rightnow + howmuch))
}
const itemShop = {
    fan: 100,
    orangedetector: 100,
    mangodetector: 50,
    carrotdetector: 50,
    starmagnet: 100,
    shovel: 100
}
const d = {
	"Discord":Discord, 
	"config":config,
	"client":client,
	"users":users,
	"addMoni":addMoni,
	"Keyv": Keyv,
	"items":items,
	"itemShop":itemShop
}

for (const file of commandFilesEconomy) {
	const command = require(`./commands/economy/${file}`);
	client.commands.set(command.name, command);
}

for (const file of commandFilesFun) {
	const command = require(`./commands/fun/${file}`);
	client.commands.set(command.name, command);
}

for (const file of commandFilesUtility) {
	const command = require(`./commands/utility/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();


users.on('error', err => console.error('Keyv connection error:', err));
items.on('error', err => console.error('Keyv connection error:', err));

client.once('ready', () => {
	console.log('Ready!');
	client.user.setPresence({ activity: { name: `with ${config.prefix}help` }, status: 'idle' })
});

client.on('message', message => {
	async function onMessage() {
	if (!message.content.startsWith(config.prefix) || message.author.bot || message.channel.type === 'dm') return;

	const args = message.content.slice(config.prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;
	
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const commandFanException = ['daily']
	let inv = await items.get(message.author.id);
	let haveFan;
	const blankObj = {};
	if (inv === undefined || inv === null) {await items.set(message.author.id, blankObj); inv = blankObj}
	if (inv.fan === undefined || inv.fan === null) {haveFan = 0}
	else {haveFan = inv.fan}
	let cooldownAmount;
	if (commandFanException.includes(command.name)) {cooldownAmount = command.cooldown * 1000}
	else {cooldownAmount = (1 - (0.03 * haveFan)) * (command.cooldown  * 1000)};
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			const cool = new Discord.MessageEmbed()
            			.setColor('#dd2de0')
            			.setTitle('ayo chill man')
            			.addFields({
				 name: `${command.name.charAt(0).toUpperCase() + command.name.slice(1)}`,
                		 value: `${timeLeft.toFixed(1)}` + " second(s) left"
            			  }, )
		                .setTimestamp()
            			.setFooter('Grape Enterprises');
			return message.channel.send(cool);
		}
	}
	
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);


	try {
		command.execute(message, args, d);
	} catch (error) {
		console.error(error);
		message.channel.send('made an oopsie tryna do that command');
	}
}
onMessage();	
});

client.login(process.env.BOT_TOKEN);