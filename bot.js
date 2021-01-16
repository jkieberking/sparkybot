const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const embedCommands = require('./src/commands/embeds');
const sensConvert = require('./src/commands/sensConvert');
const textCommands = require('./src/commands/text');
const sendMessageAsBot = require('./src/commands/sendMessage');
const customCommands = require('./src/commands/customCommand');
const submitCommands = require('./src/commands/score/submit');
const scoreCommands = require('./src/commands/score/scoreCommands')
const timeout = require('./src/commands/timeout');
const timeoutDb = require('./src/db/timeout');
const helper = require('./src/lib/helper');
const coin = require('./src/commands/coin');
const role = require('./src/commands/roles');
const _ = require('lodash');
const fs = require('fs');
 
client.on("ready", () => {
    fs.readFile('storage/voltaic-logo', 'utf8', function(err, data) {
        console.log(data);
    });
    console.log("bot started");
});
 
client.on("message", message => {
    try {
        const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        if (message.author.bot) return;

        // check if prefix set and matches
        if (config.prefix.length === 0) throw new Error('prefix not set');
        let foundPrefix = false;
        for (const prefix of config.prefix) {
            if (message.content.indexOf(prefix) === 0) {
                foundPrefix = true;
            }
        }
        if (!foundPrefix) {
            return;
        }

        if (['help', 'listcommands', 'commands'].includes(command)) {
            customCommands.listCommands(message, command, args);
        }

        try {
            textCommands.checkTextCommands(message, command, args);
            sensConvert.checkSensConvertCommands(message, command, args);
            customCommands.customCommands(message, command, args);
            submitCommands.submitScores(message, command, args);
            timeout.checkTimeout(message, command, args);
            coin.checkCoinCommand(message, command, args);
            role.checkRoleCount(message, command, args);
        } catch(error) {
            console.log(error);
        } 

        if (!helper.isMod(message.guild, message.author.id)) {
            return;
        }

        if (command === 'welcome') {
            embedCommands.sendWelcomeToChannel(message);
        }

        try {
            customCommands.createCommand(message,command, args);
            customCommands.deleteCommand(message,command, args);
            sendMessageAsBot.checkSendMessageToChannel(message, command, args);
            scoreCommands.checkCommands(message,command, args);
            role.checkRoleList(message, command, args);
        } catch(error) {
            console.log(error);
        }
    } catch (error) {
        console.log(error);
    }
});

client.on('guildMemberAdd', member => {
    try {
        let guild = client.guilds.cache.find(guild => guild.id === config.guild_id);
        let memberCount = guild.memberCount;
        let botCount = helper.roleFromName(guild, 'bots').members.array().length;
        helper.updateMemberCount(guild, memberCount - botCount);
    } catch (e) {
        console.log(e);
    }
});

client.on('guildMemberRemove', member => {
    try {
        let guild = client.guilds.cache.find(guild => guild.id === config.guild_id);
        let memberCount = guild.memberCount;
        let botCount = helper.roleFromName(guild, 'bots').members.array().length;
        helper.updateMemberCount(guild, memberCount - botCount);
    } catch (e) {
        console.log(e);
    }
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
    // think there is an error when someone leaves a custom channel and the channel is deleted before
    // we can get the name of it, in that case just fail silently
    try {
        let newUserChannel = newMember.voiceChannel
        let oldUserChannel = oldMember.voiceChannel
        const guild = client.guilds.cache.find(guild => guild.id === config.guild_id)
        const auditChannel = helper.channelFromName(guild, 'log-voice');

        let embed = new Discord.MessageEmbed()
            .setTimestamp();

        let statusString = '';

        if(oldUserChannel === undefined && newUserChannel !== undefined) {
            statusString += '*' + oldMember.displayName + '*' + ' entered ' + newUserChannel.name;
            embed.setTitle(statusString);
            embed.setColor('#7DD420');
            auditChannel.send(embed);
        } else if(newUserChannel === undefined){
            statusString += '*' + oldMember.displayName + '*' + ' left ' + oldUserChannel.name;
            embed.setTitle(statusString);
            embed.setColor('D8534E');
            auditChannel.send(embed);
        }
    } catch(error) {
        console.log(error);
    }
});
client.login(config.token);

/** crons - TODO refactor this to another file */
const CronJob = require('cron').CronJob;

var job = new CronJob('5 * * * * *', async function() {
    try {
        const guild = client.guilds.cache.find(guild => guild.id === config.guild_id)
        const eventChannel = helper.channelFromName(guild, 'log-events');
        const rowsToBeProcessed = await timeoutDb.getAllForProcessing();
        for (const row of rowsToBeProcessed) {
            helper.removeTimeoutForMemberId(
                guild,
                row['discordId'],
                'sparkybot',
                eventChannel
            )
        }
    } catch (error) {
        console.log(error);
    }
}, null, true, 'America/Los_Angeles');
job.start();