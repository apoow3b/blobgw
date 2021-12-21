const Discord = require('discord.js');
const ms = require('ms');
const path = require('path');
const fs = require('fs')
const db =require("quick.db")
const config = require("../config.json")

module.exports.run = async (client, message, args) => {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(`<:bloberror:869118676740239411> ${message.author}, you don't have the permission to use this command!\`\`\`Permissions: MANAGE_MESSAGES or Giveaway role\`\`\``);
    if (!args[0]) {
        return message.channel.send(`<:bloberror:869118676740239411> ${message.author}, please insert a valid duration (ex: ${config.prefix}gstart **10m** 1 price)`);
    }

    if (!args[1]) {
        return message.channel.send(`<:bloberror:869118676740239411> ${message.author}, please insert a valid number of winner (ex: ${config.prefix}gstart 10m **1** price)`);
    }

    if (!args[2]) {
        return message.channel.send(`<:bloberror:869118676740239411> ${message.author}, please insert a valid price (ex: ${config.prefix}gstart 10m 1 **price**)`);
    }

    message.delete();

    let embed = await message.channel.send(
        new Discord.MessageEmbed()
        .setTitle(`Finish`)
        .setFooter(`${client.user.username}`, client.user.avatarURL())
        .setTimestamp()
        .setColor('fcc21b')
        .setDescription('Do you want to add restrictions?\n\nType `[role_id]` for need to have a role to participate or type `no` for no restrictions !')
    )
    let error = false;
    let id;
    await message.channel.awaitMessages(m => m.author.id === message.author.id, {
        max: 1,
        time: 60000,
        errors: ["time"]
    }).then(collected => {
        id = collected.first().content;
        collected.first().delete()
    }).catch((err) => {
        error = true;
        embed.edit(
            new Discord.MessageEmbed()
            .setTitle(`Error!`)
            .setFooter(`${client.user.username}`, client.user.avatarURL())
            .setTimestamp()
                .setColor('FF0000')
            .setDescription("<:bloberror:869118676740239411> Time elapsed!")
        );
        return;
    });
    if (error) return;
    if (id.toLowerCase() === 'no') {
        let giveawayMessage = await client.giveawaysManager.start(message.channel, {
            time: ms(args[0]),
            prize: args.slice(2).join(" "),
            winnerCount: parseInt(args[1]),
            messages: {
                giveaway: "<:blobtada:869513959483510824> **New Giveaway!** <:blobtada:869513959483510824>",
                giveawayEnded: "<:blobtada:869513959483510824> **Giveaway Ended!** <:blobtada:869513959483510824>",
                timeRemaining: `\nTime left: **{duration}**!\nHosted by: ${message.author}`,
                inviteToParticipate: "React with <:blobtada:869513959483510824> to enter!",
                winMessage: "<:blobtada:869513959483510824> Congratulations, {winners}! You won **{prize}**!",
                embedFooter: `${client.user.username}`,
                noWinner: `> Giveaway cancelled, no participation\n> Hosted by: ${message.author}`,
                winners: `Winner(s)`,
                endedAt: "Ended!",
                units: {
                    seconds: "seconds",
                    minutes: "minutes",
                    hours: "hours",
                    days: "days",
                    pluralS: false
                }
            }
        });
        let conditionsRoles = require(path.resolve(path.join('./database/conditionRole.json')));
        conditionsRoles[giveawayMessage.messageID] = {
            conditionRole: 'none'
        }
        fs.writeFile(path.resolve(path.join('./database/conditionRole.json')), JSON.stringify(conditionsRoles, null, 2), (err) => {
            if (err) console.log(err)
        });
        return;
    }
    let role = message.guild.roles.cache.find(r => r.id === id);
    if (!role) {
        return embed.edit(`<:bloberror:869118676740239411> ${message.author}, please insert a valid role id!`)
    }
    embed.delete()
    let giveawayMessage = await client.giveawaysManager.start(message.channel, {
        time: ms(args[0]),
        prize: args.slice(2).join(" "),
        winnerCount: parseInt(args[1]),
        messages: {
            giveaway: "<:blobtada:869513959483510824> **New Giveaway!** <:blobtada:869513959483510824>",
            giveawayEnded: "<:blobtada:869513959483510824> **Giveaway Ended!** <:blobtada:869513959483510824>",
            timeRemaining: `\nTime left: **{duration}**!\nHosted by: ${message.author}\nYou need to have ${role}`,
            inviteToParticipate: "React with <:blobtada:869513959483510824> to enter!",
            winMessage: "<:blobtada:869513959483510824> Congratulations, {winners}! You won **{prize}**!",
            embedFooter: `${client.user.username}`,
            noWinner: `> Giveaway cancelled, no participation\n> Hosted by: ${message.author}`,
            winners: `Winner(s)`,
            endedAt: "Ended!",
            units: {
                seconds: "seconds",
                minutes: "minutes",
                hours: "hours",
                days: "days",
                pluralS: false
            }
        }
    });

    if (message.guild.roles.cache.find(r => r.id === id)) {
        let role = message.guild.roles.cache.find(r => r.id === id);

        let conditionsRoles = require(path.resolve(path.join('./database/conditionRole.json')));
        conditionsRoles[giveawayMessage.messageID] = {
            conditionRole: 'none'
        }
        fs.writeFile(path.resolve(path.join('./database/conditionRole.json')), JSON.stringify(conditionsRoles, null, 2), (err) => {
            if (err) console.log(err)
        });
        let conditionRole = conditionsRoles[giveawayMessage.messageID].conditionsRoles;

        conditionsRoles[giveawayMessage.messageID] = {
            conditionRole: role.id
        }
        fs.writeFile(path.resolve(path.join('./database/conditionRole.json')), JSON.stringify(conditionsRoles, null, 2), (err) => {
            if (err) console.log(err)
        });
    }
}

module.exports.help = {
    name: "giveaway-start",
    aliases: ["gstart"]
}
