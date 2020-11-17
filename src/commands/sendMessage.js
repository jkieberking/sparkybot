const CHANNEL_NAME = 0;

function checkSendMessageToChannel(message, command, args) {
    if (command == 'message') {
        const channelName = args[CHANNEL_NAME];
        const messageArray = args.slice(1);
        const messageString = messageArray.join(' ');

        if (args.length > 1) {
            let channel = message.guild.channels.cache.find(channel => channel.name === channelName);
            channel.send(messageString);
        } else {
            message.channel.send('usage: `s-message <channel-name> <message>`');
        }
        message.delete(100);
    }
}

module.exports = { checkSendMessageToChannel };