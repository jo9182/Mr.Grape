//Usage: `gamble <amount>`, 50/50 chance of doubling your bet or losing it
let cooldown = false
for(let i = 0; i < cooldowns.length; i++)
{
	if (cooldowns[i] === cmd + message.author.id)
	{
		message.channel.send("bro chill out and wait a bit");
		cooldown = true;
	}
}
if (!cooldown)
{
	cooldowns.push(cmd + message.author.id);
	cooldowns.push("c5");
	if (!parseInt(args[1]) || parseInt(args[1]) < 1 || parseInt(args[1]) > parseInt(currency[currency.indexOf(message.author.id) + 1]))
	{
		message.channel.send("thats not a valid number of stars to gamble");
	}
	else
	{
		let roll = Math.round(Math.random() * 5) + 1
    const gambleEmbed = new Discord.MessageEmbed()
					.setColor('#dd2de0')
					.setTitle(message.author.username + `'s gambling table`)
					.addFields(
						{ name: '', value: 'ok, if you roll an even number you win, if you roll an odd number, you lose' },
					)
			                .setThumbnail('https://i.imgur.com/JXfpgdXh.jpg')
					.setTimestamp()
					.setFooter('Grape Gambling Club.');
		setTimeout(function()
		{
			const gambleEmbed = new Discord.MessageEmbed().addFields(
        { name: '', value: 'you rolled a...' },
        )
			setTimeout(function()
			{
				const gambleEmbed = new Discord.MessageEmbed().addFields(
        {name: '', value: roll},
        )
				setTimeout(function()
				{
					if (roll / 2 === Math.floor(roll / 2))
					{
						const gambleEmbed = new Discord.MessageEmbed().addFields(
              {name: '', value: 'aw.. i lost'},
              )
						currency[currency.indexOf(message.author.id) + 1] = parseInt(currency[currency.indexOf(message.author.id) + 1]) + parseInt(args[1]);
					}
					else
					{
							const gambleEmbed = new Discord.MessageEmbed().addFields(
              {name: '', value: 'ha... i win'},
              )
						currency[currency.indexOf(message.author.id) + 1] -= parseInt(args[1]);
					}
				}, 1000)
			}, 3000)
		}, 2000)
	}
}