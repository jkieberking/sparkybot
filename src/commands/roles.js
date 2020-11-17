const helper = require('../lib/helper');

const BOT_ROLES = [
    'voicemaster',
]

function checkRoleCount(message, command, args) {
    if (command == 'rolecount') {
        const guild = message.guild;
        let roles = helper.allRolesFromName(guild, args[0].toLowerCase());
        roles = roles.sort(function(a, b){
            return a.name.length - b.name.length
        });

        if (roles.array().length !== 0) {
            messageArray = [];
            let numRoles = 0;
            for (const [roleId, role] of roles) {
                if (BOT_ROLES.includes(role.name.toLowerCase())) { continue; }
                if (numRoles++ > 1) { break; }
                const memberCount = guild.roles.cache.get(roleId).members.size;
                let membersMessage = (1 === memberCount) ? 'member' : 'members';
                messageArray.push(`**${role.name}** currently has **${memberCount}** **${membersMessage}**`);
            }

            message.channel.send(messageArray.join(' and '));
        } else {
            message.channel.send('no role with that name')
        }
    }
}

const LIST_LIMIT = 50;

function checkRoleList(message, command, args) {
    if (command === 'rolelist') {
        const usage = 's-rolelist <role> <page>'
        try {
            if (![1,2].includes(args.length)) {
                message.channel.send(usage);
            }
            
            let roles = helper.allRolesFromName(message.guild, args[0].toLowerCase());
            roles = roles.sort(function(a, b){
                return a.name.length - b.name.length
            });

            if (roles.array().length !== 0) {
                const role = roles.first();
                let members = role.members.map(m=> m.nickname ? m.nickname : m.user.username);
                members.sort();
                members = getSlicedMembersList(members, args[1]);
                if (members.length === 0) {
                    message.channel.send('no members found');
                    return;
                }
                message.channel.send(members.join(', '));
            } else {
                message.channel.send(usage);
            }
        } catch (e) {
            console.log(e);
            message.log(usage);
        }
    }
}

function getSlicedMembersList(memberList, page=1) {
    page = parseInt(page) - 1;
    memberList = memberList.slice(page*LIST_LIMIT, (page + 1) * LIST_LIMIT);
    // just making sure we don't return an array longer than the limit 
    memberList = memberList.slice(0, LIST_LIMIT);
    return memberList;
}

module.exports = { checkRoleCount, checkRoleList };