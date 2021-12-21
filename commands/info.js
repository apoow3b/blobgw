const Discord = require('discord.js');

module.exports.run = async (client, message) => {
    let allGiveaways = client.giveawaysManager.giveaways
    let notEnded = client.giveawaysManager.giveaways.filter((g) => !g.ended);
    let ended = client.giveawaysManager.giveaways.filter((g) => g.ended);
    message.channel.send(
        new Discord.MessageEmbed()
        .setTitle(`Bot Stats`)
        .setFooter(`${client.user.username}`, client.user.avatarURL())
        .setTimestamp()
            .setColor('FF0000')
        .setDescription(`\`\`\`All giveaways: ${allGiveaways.length}\nIn progress: ${notEnded.length}\nEnded: ${ended.length}\`\`\``)
    )
}

module.exports.help = {
    name: 'botstats',
    aliases: ['gstats']
}
