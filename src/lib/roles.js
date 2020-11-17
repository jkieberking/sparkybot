const rolesToNamesMap = {
    'diamond': ':gem: Diamond'
}

function addToRole(message, member, roleName) {
    const role = message.guild.roles.cache.find(role => role.name === rolesToNamesMap[roleName]);
    member.addRole(role);
}

module.exports = { addToRole }