const helper = require('../lib/helper');
const timeout = require('../lib/timeout');
const timeoutDb = require('../db/timeout');

const usageTimeoutMods = [
    'usage:',
    's-timeout <@user> <duration-in-minutes> # timeout a member',
    's-timeout <@user>                                            # check how long a member is timed out for',
    's-untimeout <@user>                                       # un timeout a member',
    's-timeoutlist                                                        # list all members timed out',

].join('\n')

const usageTimeoutNonMods = [
    'usage:',
    's-timeout <@user> # check how long a member is timed out for',
].join('\n')

async function checkTimeout(message, command, args) {
    const wasMod = await modTimeout(message, command, args);
    if (!wasMod) {
        await nonModTimeout(message, command, args);
        return
    }
}

/**
 * @returns {boolean} was it a mod that performed action
 */
async function modTimeout(message, command, args) {
    if (null == helper.getHighestAdminHelperRole(message)) {
        return false;
    }

    if (command === 'timeout') {
        if (args.length === 2) {
            timeoutMember(message, command, args);
            return true;
        }

        if (args.length === 1) {
            timeoutEndDate(message, args[0]);
            return true;
        }

        message.channel.send(usageTimeoutMods);
    }

    if (command === 'untimeout') {
        helper.removeTimeoutForMemberId(
            message.guild,
            helper.userIdFromString(args[0]),
            helper.userStringFromId(message.author.id),
            message.channel
        );

        return true;
    }

    if (command === 'timeoutlist') {
        const stillInTimeout = await timeoutDb.getAllUnprocessed();
        let messageString = 'member: <time in mins>\n';
        for (const member of stillInTimeout) {
            messageString += `${helper.userStringFromId(member.discordId)}: ${timeout.timeUntilTimeout(member.end)}\n`
        }
        if (messageString === 'member: <time in mins>\n') {
            message.channel.send('no timed out members');
            return true;
        }
        message.channel.send(messageString);

        return true;
    }

    return true;
}

function nonModTimeout(message, command, args) {
    if (command === 'timeout') {
        if (args.length === 1) {
            timeoutEndDate(message, args[0]);
            return;
        }

        message.channel.send(usageTimeoutNonMods);
    }
}

async function timeoutMember(message, command, args) {
    if (isNaN(args[1])) {
        message.channel.send('duration must be a valid number');
    }

    const targetMemberId = helper.userIdFromString(args[0]);
    if ('' === targetMemberId) {
        return
    }
    if (helper.isMod(message.guild, targetMemberId)) {
        let emoji = helper.getEmojiByName(message.guild, 'angerykirby');
        if (!emoji) {
            emoji = '';
        }
        message.channel.send(`cant timeout a owner/staff ${emoji}`);
        return
    }

    const targetMember = helper.memberById(message.guild, targetMemberId);
    const timeoutRole = helper.roleFromName(message.guild, 'timeout');

    await timeoutDb.insert(targetMemberId, args[1]);
    const reasonNoLink = `timeout role given to ${targetMember} by ${helper.userStringFromId(message.author.id)}`;
    const reasonString = [
        reasonNoLink,
        `messagelink: ${helper.getLinkToMessage(message)}`
    ].join('\n');
    targetMember.roles.add(timeoutRole, reasonString);
    message.channel.send(reasonNoLink);
}

async function timeoutEndDate(message, discordUserString) {
    const discordId = helper.userIdFromString(discordUserString);
    if (isNaN(discordId)) {
        message.channel.send('not a valid discord member');
        return;
    }

    let row = await timeoutDb.getById(discordId);
    if (!row[0]) {
        message.channel.send('member is not timed out');
        return;
    }
    row = row[0];
    const endDate = row.end;
    if (!endDate) {
        message.channel.send('no end date');
        return;
    }

    const minsTillEnd = timeout.timeUntilTimeout(endDate);
    if (minsTillEnd) {
        message.channel.send(`${helper.userStringFromMessage(message)} ${minsTillEnd} mins till they are unmuted`);
    } else {
        message.channel.send(`error computing minutes`);
    }
}

module.exports = { checkTimeout };