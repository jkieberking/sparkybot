const config = require('../../config.json')
const timeoutDb = require('../db/timeout');

/**
 * @param {*} discordId 
 */
function userStringFromMessage(message) {
    return '<@' + message.author.id + '>';
}

function userStringFromId(id) {
    return '<@' + id + '>';
}

function userIdFromString(string) {
    return string.match('<@[!]?(.*)>')[1]
}

function memberById(guild, id) {
    return guild.members.cache.get(id);
}

function checkAndWarnIfNotCommands(message) {
    if (message.channel.name !== 'commands') {
        useCommandInCommandsChannel(message);
    }
}

function useCommandInCommandsChannel(message) {
    message.channel.send(`${userStringFromMessage(message)}, please use this command in ${channelFromName(message.guild, 'commands')}, I have sent it there for you`);
}

function getHighestAdminHelperRole(message) {
    return message.member.roles.cache.find(role => {
        for (const adminHelper of ['owner', 'staff', 'helper']) {
            if (role.name.toLowerCase().includes(adminHelper)) {
                return true;
            }
        }
    });
}

function isMod(guild, discordId) {
    const member = memberById(guild, discordId);
    if (!member) {
        return false;
    }

    const modRole = member.roles.cache.find(role => {
        for (const adminHelper of ['owner', 'staff', 'mod']) {
            if (role.name.toLowerCase().includes(adminHelper)) {
                return true;
            }
        }
    });

    if (modRole) {
        return true;
    }

    return false;
}

function roleFromName(guild, roleName) {
    return guild.roles.cache.find(role => {
        if (role.name.toLowerCase().includes(roleName)) {
            return true;
        }
    });
}

function allRolesFromName(guild, roleName) {
    return guild.roles.cache.filter(role => {
        if (role.name.toLowerCase().includes(roleName)) {
            return true;
        }
        
        return false;
    });
}

function channelFromName(guild, channelName) {
    return guild.channels.cache.find(channel => {
        if (channel.name.toLowerCase().includes(channelName)) {
            return true;
        }
    });
}

function getLinkToMessage(message) {
    const serverId = message.guild.id;
    const channelId = message.channel.id;
    const messageId = message.id;

    return `https://discordapp.com/channels/${serverId}/${channelId}/${messageId}`;
}

function removeTimeoutForMemberId(guild, memberId, remover, channel) {
    let member = memberById(guild, memberId);
    if (!member) {
        channel.send(`${remover} tried to remove ${userStringFromId(memberId)} from timeout role, but they left discord, or can't be found`);
        timeoutDb.process(memberId);
        return;
    }
    let role = roleFromName(guild, 'timeout')
    let removeMessage = `timeout role removed from ${userStringFromId(memberId)} by ${remover}`
    member.removeRole(role, removeMessage)
    timeoutDb.process(memberId);

    channel.send(removeMessage);
}

function getEmojiByName(guild, name) {
    return guild.emojis.cache.find(emoji => emoji.name === name);
}

function updateMemberCount(guild, newMemberCount) {
    let channel = guild.channels.cache.find(channel => channel.id === config.member_count_channel_id);
    let newChannelName = `User Count: ${newMemberCount}`;
    channel.setName(newChannelName);
}

module.exports = {
    userStringFromMessage,
    userStringFromId,
    userIdFromString,
    memberById,
    checkAndWarnIfNotCommands,
    useCommandInCommandsChannel,
    getHighestAdminHelperRole,
    roleFromName,
    channelFromName,
    getLinkToMessage,
    removeTimeoutForMemberId,
    isMod,
    getEmojiByName,
    updateMemberCount,
    allRolesFromName
}