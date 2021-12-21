const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {

  if (!message.member.hasPermission('MANAGE_MESSAGES')) {return message.channel.send(`<:bloberror:869118676740239411> ${message.author}, you don't have the permission to use this command!\`\`\`Permissions: MANAGE_MESSAGES or Giveaway role\`\`\``)}


  if (!args[0]) {
    const embed = new Discord.MessageEmbed()
    .setTitle(`Error!`)
    .setFooter(`${client.user.username}`, client.user.avatarURL())
    .setTimestamp()
        .setColor('FF0000')
      .setDescription("<:bloberror:869118676740239411> Please insert a valid message id")
    return message.channel.send(embed)
  }

  let messageID = args[0];
  client.giveawaysManager.reroll(messageID, {
    messages: {
      congrat: "<:blobtada:869513959483510824> Congratulations: {winners}",
    }
  }).catch((err) => {
    const ewmbed = new Discord.MessageEmbed()
    .setTitle(`Error!`)
    .setFooter(`${client.user.username}`, client.user.avatarURL())
    .setTimestamp()
        .setColor('FF0000')
      .setDescription("<:bloberror:869118676740239411> No giveaways with this message id!")
    return message.channel.send(ewmbed)
  });

}

module.exports.help = {
  name: "giveaway-reroll",
  aliases: ["greroll"]
}
