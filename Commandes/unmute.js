const Discord = require('discord.js')
const ms = require('ms')

module.exports = {

    name: "unmute",
    description: "Permet de démute un membre",
    permission: Discord.PermissionFlagsBits.ModerateMembers,
    dm: false,
    category: "Modération",
    options: [
        {
            type: "user",
            name: "membre",
            description: "membre à unmute",
            required: true,
            autocomplete: false,
        }, {
            type: "string",
            name: "raison",
            description: "raison du unmute",
            required: false,
            autocomplete: false,
        }
    ],

    async run(bot, message, args) {

        let user = args.getUser("membre")
        if(!user) return message.reply("Pas de membre !")
        let member = message.guild.members.cache.get(user.id)
        if(!member) return message.reply("Pas de membre !")

        let reason = args.getString("raison")
        if(!reason) reason = "Pas de  raison fournie";
        if(!member.moderatable) return message.reply("Je ne peux pas unmute ce membre !")
        if(message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu ne peux pas unmute ce membre !")
        if(!member.isCommunicationDisabled()) return message.reply("Ce membre n'est pas mute !")

        try {await user.send(`Tu as été unmute du serveur ${message.guild.name} par ${message.user} pour la raison : \`${reason}\``)} catch(err) {}

        let embed = new Discord.EmbedBuilder()
        .setColor(bot.color)
        .setTitle(`Unmute de ${user.tag}`)
        .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
        .setDescription(`
        > Modérateur : ${message.user}
        > Membre : ${user}
        > Raison : ${reason}`)
        .setTimestamp()
        .setFooter({text: `Unmute de ${user.tag}`})

        await message.reply({ embeds: [embed] });

        await member.timeout(null, reason)
    }
}