const Discord = require("discord.js");
const client = new Discord.Client();

function sendWelcomeToChannel(message) {
    const ppw = client.emojis.get("629879183497232454");
    
    const rules = message.channel.guild.channels.find(channel => channel.id === '583486075323023380');
    const roles = message.channel.guild.channels.find(channel => channel.id === '447204176393666570');
    const tweets = message.channel.guild.channels.find(channel => channel.id === '626189188831903806');
    const streams = message.channel.guild.channels.find(channel => channel.id === '295657100636323840');
    const clips = message.channel.guild.channels.find(channel => channel.id === '439237455053455360');
    const commands = message.channel.guild.channels.find(channel => channel.id === '601484132006232064');
    const bright = message.channel.guild.channels.find(channel => channel.id === '594716194951528490');
    const pastelle = message.channel.guild.channels.find(channel => channel.id === '579874219723063296');

    let welcome = new Discord.RichEmbed()
            .setTitle("Welcome to Sparky :zap:")
            .setColor("#D13762")
            .setDescription('Sparky is a community based around self improvement, primarly in fps/shooters but not exclusively.');
        
        let starting = new Discord.RichEmbed()
            .setTitle("Starting out :books:")
            .setColor("#8E5BAD")
            .setDescription(`:white_small_square: Read the ${rules} and self-assign ${roles}.
            :white_small_square: Fold / mute the categories/channels that you're not interested in.
            :white_small_square: Feel free to make use of our :video_game: Game Tips and :notebook_with_decorative_cover: Improving tips.
            :white_small_square: Post ${clips}, ${tweets} and ${streams} in the respective channels.
            :white_small_square: We got more than 3 music bots, check it out in ${commands}.
            :white_small_square: Try and match your name on discord with your in-game name.`);
     
        let invite = new Discord.RichEmbed()
            .setTitle("Invite your friends :mailbox_with_mail:")
            .setColor ("#62C377")
            .setDescription(':small_blue_diamond: Perma invite link: https://discord.gg/sparky');
        
        let sparkyAim = new Discord.RichEmbed()
            .setTitle("Sparky Aim :dart:")
            .setColor (3133378)
            .setDescription(`An aim community centered around self-improvement, with the intend to improve/challenge both great and upcoming aimers. \n \n Apply here: https://forms.gle/g4TrwSi8bbce1Xt2A`);
        
        let sparkySkill = new Discord.RichEmbed()
            .setTitle("Sparky Skill :cherry_blossom:")
            .setColor (16029119)
            .setDescription(`Sparky skill is a group of people who excel in their game, \n notable for their aim technique. \n \n Apply here: *coming soon*`);
        
        let benchmarks = new Discord.RichEmbed()
            .setTitle("Skill rank benchmarks :bar_chart:")
            .setColor ("#FF2262")
            .setDescription(`In order to upgrade your skill rank, you have to graduate through the form. You can check out the benchmarks below to see if you're eligible for an upgrade. Benchmarks: http://bit.ly/2PdgZlm`);
        
        let graduate = new Discord.RichEmbed()
            .setTitle("Graduate :mortar_board:")
            .setColor ("#2F3137")
            .setDescription(`The skill ranks are seperate from sparky aim. Graduate here: http://bit.ly/2NvOVqY`);
        
        let socials = new Discord.RichEmbed()
            .setTitle("Socials :rocket:")
            .setColor (15662913)
            .setDescription(`:white_small_square: Website: https://sparky.gg \n \
            :small_blue_diamond: Steam: <https://steamcommunity.com/groups/sparkyaim> \n \
            :small_blue_diamond: Steam Fans: <https://steamcommunity.com/groups/sparkysfanclub> \n \
            :small_blue_diamond: Twitter:  <https://twitter.com/SparkyAimers> \n \
            :small_blue_diamond: Twitch: <https://www.twitch.tv/team/sparkyaim> \n \
            :small_blue_diamond: Instagram: <https://www.instagram.com/sparkyaim> \n`);
        
        let boosting = new Discord.RichEmbed()
            .setTitle("Boosting Sparky :hibiscus:")
            .setColor (13397462)
            .setThumbnail('https://i.imgur.com/uV2A8kZ.png')
            .setDescription(`If you boost Sparky you'll be granted: \n \n :white_small_square: Evolving boosting badge \n :white_small_square: Boosters role \n :white_small_square:   Boost icon in member list \n :white_small_square: Exclusive ${bright} and ${pastelle} colors.`);
            
        message.channel.send(welcome);
        message.channel.send(starting);
        message.channel.send(invite);
        message.channel.send(sparkyAim);
        message.channel.send(sparkySkill);
        message.channel.send(benchmarks);
        message.channel.send(graduate);
        message.channel.send(socials);
        message.channel.send(boosting);
        sendSupportSparkyEmbed(message);
}

function sendUpgradeEmbed(message) {
    let upgrade = new Discord.RichEmbed()
            .setTitle("Want to increase your skill rank? :mortar_board: ")
            .setColor (11342935)
            .setDescription("Check out our benchmarks: http://bit.ly/2PdgZlm \n Graduate here: http://bit.ly/2NvOVqY");
    
    message.channel.send(upgrade);
}

function sendSparkyAimEmbed(message) {
    let sparkyAim = new Discord.RichEmbed()
            .setTitle("Sparky Aim :zap:")
            .setColor (16755763)
            .setDescription(`An aim group for people who are already great at aiming, \n \
                or are trying to improve to become the best they can be. \n \
                Minimum requirements: \n \n \`01\` Platinum level aim {intermediate} | \
                benchmarks: http://bit.ly/2PdgZlm \n \
                \`02\` Experience in FPS games \n \n You can apply here: https://forms.gle/g4TrwSi8bbce1Xt2A`
            );
    
    message.channel.send(sparkyAim);
}

function sendSupportSparkyEmbed(message) {
    let supportSparky = new Discord.RichEmbed()
    .setTitle("Supporting Sparky :money_with_wings:")
    .setColor (10527594)
    .setThumbnail('https://i.imgur.com/cJ0TZg1.png')
    .setDescription(":white_small_square: [Become a Patron](https://www.patreon.com/sparkygg) and support Sparky\n \
    :white_small_square: Purchase a [Sparky mousepad](https://www.inkedgaming.com/collections/art/sparky-logo)\n \
    :white_small_square: Use our [InkedGaming affiliate link](https://www.inkedgaming.com/?rfsn=3266061.81e879&utm_source=refersion&utm_medium=affiliate&utm_campaign=3266061.81e879)\n \
    :white_small_square: Or use our InkedGaming coupon code: `sparkyaim`\n \
    :white_small_square: Use our Epic Games creator code `sparkygg`\n \
    :white_small_square: Subscribe [via twitch](https://www.twitch.tv/siniaims), donate bits or [donate via paypal](https://www.paypal.me/syntensity)"
    );

    message.channel.send(supportSparky);
}

module.exports = { sendWelcomeToChannel, sendUpgradeEmbed, sendSparkyAimEmbed, sendSupportSparkyEmbed };