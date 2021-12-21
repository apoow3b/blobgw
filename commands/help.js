const Discord = require("discord.js");
const client = new Discord.Client()
const disbut = require("discord-buttons")
disbut(client);

let button = new disbut.MessageButton()
.setStyle('url')
.setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`) 
.setLabel('Add the bot! 🤖'); 

module.exports.run = async (client, message) => {
    var help = new Discord.MessageEmbed()
    .setTitle(`Commands List`)
    .setFooter(`${client.user.username}`, client.user.avatarURL())
    .setTimestamp()
    .addField("<:blobtada:869513959483510824> ➔ Giveaway", "```gstart, gstop, greroll```")
    .addField("<:blobinfos:869483667888685057> ➔ Everyone", "```botstats, addbot```")

    .setColor("fcc21b")
    message.channel.send(help, button)
}

module.exports.help = {
    name: "help",
    aliases: []
}
