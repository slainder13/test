const Discord = require('discord.js')
const ms = require('ms')

module.exports = {

    name: "mute",
    description: "Permet de mute un membre",
    permission: Discord.PermissionFlagsBits.ModerateMembers,
    dm: false,
    category: "Modération",
    options: [
        {
            type: "user",
            name: "membre",
            description: "membre à mute",
            required: true,
            autocomplete: false,
        }, {
            type: "string",
            name: "temps",
            description: "temps du mute",
            required: true,
            autocomplete: false,
        }, {
            type: "string",
            name: "raison",
            description: "raison du mute",
            required: false,
            autocomplete: false,
        }
    ],

    async run(bot, message, args) {

        let user = await args.getUser("membre")
        if(!user) return message.reply("Pas de membre !")
        let member = message.guild.members.cache.get(user.id)
        if(!member) return message.reply("Pas de membre !")

        
        let time = args.getString("temps")
        if(!time) return message.reply("Pas de temps!")
        if(isNaN(ms(time))) return message.reply("Format invalide!")
        if(ms(time) > 86400000) return message.reply("Le mute de peut pas durer plus de 28 jours !")

        let reason = args.getString("raison")
        if(!reason) reason = "Pas de raison fournie.";

        if(message.user.id === user.id) return message.reply("Essaie pas de te mute !")
        if((await message.guild.fetchOwner()).id === user.id) return message.reply("Ne mute pas le propriétaire du serveur !")
        if(!member.moderatable) return message.reply("Je ne peut pas mute ce membre!")
        if(message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu ne peux pas mute ce membre !")
        if(member.isCommunicationDisabled()) return message.reply("Ce membre est déja mute !")

        try {await user.send(`Tu as mute du serveur ${message.guild.name} par ${message.user} pendant ${time} pour la raison : \`${reason}\``)} catch(err) {}

        let embed = new Discord.EmbedBuilder()
        .setColor(bot.color)
        .setTitle(`Mute de ${user.tag}`)
        .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
        .setDescription(`
        > Modérateur : ${message.user}
        > Victime : ${user}
        > Durée : ${time}
        > Raison : ${reason}`)
        .setTimestamp()
        .setFooter({text: `Mute de ${user.tag}`})

        await message.reply({ embeds: [embed] });

        await member.timeout(ms(time), reason)
    }
}