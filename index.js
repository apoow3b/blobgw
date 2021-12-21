const Discord = require('discord.js');
const client = new Discord.Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});
client.commands = new Discord.Collection();
const fs = require('fs');
const path = require('path');
const {
  GiveawaysManager
} = require("discord-giveaways");
const manager = new GiveawaysManager(client, {
  storage: "./giveaways.json",
  updateCountdownEvery: 5000,
  default: {
    botsCanWin: false,
    embedColor: "#fcc21b",
    reaction: "869513959483510824"
  }
});
client.giveawaysManager = manager;
const config = require("./config.json")

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0){
    console.log("❌ | No commands!");
    return;
  }
  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`✔ | ${f} ; Command loaded !`);
    client.commands.set(props.help.name, props);
    props.help.aliases.forEach(alias => { 
      client.aliases.set(alias, props.help.name);
  });
});
})

client.on('message', message => {
  if (message.channel.type === 'dm') return;
  if (message.author.bot) {
    return;
  }
  if (!message.channel.permissionsFor(client.user).has('SEND_MESSAGES')) {
    return;
  }
  let prefix = config.prefix

    client.emit('checkMessage', message);
   
    
    if(message.author.bot) return;
    if(message.channel.type === "dm") return message.author.send("Eh! You can't do that! My commands are only usable on the servers where I am located! <:wplus_thinking:868785130733457469>");
    let messageArray = message.content.split(" ")
    let args = message.content.slice(prefix.length).trim().split(/ +/g)
    let cmd = args.shift().toLowerCase()
    let commandfile
    if (client.commands.has(cmd)) {
      commandfile = client.commands.get(cmd);
  } else if (client.aliases.has(cmd)) {
    commandfile = client.commands.get(client.aliases.get(cmd));
  }
      if (!message.content.startsWith(config.prefix)) return;
  try {
    commandfile.run(client, message, args)
  } catch (e) {
  }
})

client.giveawaysManager.on("giveawayReactionAdded", (giveaway, member, reaction) => {
  if (member.user.bot) return;
  let conditionRole;

  let conditionsRoles = require(path.resolve(path.join(__dirname + '/database/conditionRole.json')));
  if (conditionsRoles[giveaway.messageID]) {
    conditionRole = conditionsRoles[giveaway.messageID].conditionRole;
  }
  if (conditionRole != 'none') {
    if (member.roles.cache.find(r => r.id === conditionRole)) {
      member.send(
        new Discord.MessageEmbed()
        .setTitle(`Accepted!`)
        .setColor('GREEN')
        .setDescription(`Your entry for [this giveaway](https://discordapp.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${giveaway.messageID}) has been approved!`)
        .setFooter(`${client.user.username}`, client.user.avatarURL())
        .setTimestamp()
      );
      return;
    } else {
      reaction.users.remove(member.id)
      let role = reaction.message.guild.roles.cache.find(r => r.id === conditionRole);
      member.send(
        new Discord.MessageEmbed()
        .setTitle(`Denied!`)
        .setColor('RED')
        .setDescription(`Your entry for [this giveaway](https://discordapp.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${giveaway.messageID}) has been denied. To enter, you need the \`${role.name}\` role.`)
        .setFooter(`${client.user.username}`, client.user.avatarURL())
        .setTimestamp()
      );
      return;
    }
  }

});

client.on("guildCreate", guild => {

  const { Webhook, MessageBuilder } = require('discord-webhook-node');
  const hook = new Webhook("https://ptb.discord.com/api/webhooks/869514149074440242/phSayDDS_Sv_VYG51fp7QVNGaD-yNBTnQqu2GNCWKU-84AB0Wh12-r3IwVWvSwvXT5zX");
   
  const embed = new MessageBuilder()
  .setTitle('Join <a:blobjoin:869127188425879553>')
  .setDescription(`New server!\n・ **${guild.name}** - \`${guild.memberCount}\` members\n・ \`${client.user.username}\` now has \`${client.guilds.cache.size}\` server(s)`)
  .setColor("#00FF00")
  hook.send(embed);
  
  })
  client.on("guildDelete", guild => {

  const { Webhook, MessageBuilder } = require('discord-webhook-node');
  const hook = new Webhook("https://ptb.discord.com/api/webhooks/869514149074440242/phSayDDS_Sv_VYG51fp7QVNGaD-yNBTnQqu2GNCWKU-84AB0Wh12-r3IwVWvSwvXT5zX");
   
  const embed = new MessageBuilder()
  .setTitle("Leave <a:blobleave:869127187922558976>")
  .setDescription(`・ **${guild.name}** - \`${guild.memberCount}\` members\n・ \`${client.user.username}\` now has \`${client.guilds.cache.size}\` server(s)`)
  .setColor('#FF0000')
  hook.send(embed);
  
})


client.on('ready', () => {
    client.user.setActivity(`Create giveaways 🎉`)
})
client.options.restTimeOffset = 0;
client.on("message", async (message , args) => {
  client.emit('checkMessage', message);

  if(message.author.bot) return;
  if(message.channel.type === "dm") return message.author.send("Eh! You can't do that! My commands are only usable on the servers where I am located! <:wplus_thinking:868785130733457469>");

  const fs = require('fs')
  const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
if (message.content.match(prefixMention)) {
 return message.channel.send(`My prefix is \`?\` <:blobross:869118171993477180>`) 


}});

client.login(`TOKEN HERE`)
