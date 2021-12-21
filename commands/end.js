const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) {return message.channel.send(`<:bloberror:869118676740239411> ${message.author}, you don't have the permission to use this command!\`\`\`Permissions: MANAGE_MESSAGES or Giveaway role\`\`\``)}

    if (!args[0]) {
        const embed = new Discord.MessageEmbed()
        .setTitle(`Error!`)
        .setFooter(`${client.user.username}`, client.user.avatarURL())
        .setTimestamp()
            .setColor('FF0000')
            .setDescription("<:bloberror:869118676740239411> Please insert a valid message id!")
        return message.channel.send(embed)
    }
    let messageID = args[0];
    try {
        client.giveawaysManager.edit(messageID, {
            setEndTimestamp: Date.now()
        }).then(() => {
            const embwed = new Discord.MessageEmbed()
                .setTitle('Success!')
                .setColor('#00FF00')
                .setDescription("<:blobsuccess:869118676840873994> Giveaway ended!")
            return message.channel.send(embwed)
        })
    } catch (e) {
        console.log(e)
        const ewm3bed = new Discord.MessageEmbed()
        .setTitle(`Error!`)
        .setFooter(`${client.user.username}`, client.user.avatarURL())
        .setTimestamp()
            .setColor('FF0000')
            .setDescription("<:bloberror:869118676740239411> No giveaway with this message id exist!")
        return message.channel.send(ewm3bed)
    }
}

module.exports.help = {
    name: 'giveaway-stop',
    aliases: ["gstop"]
}
