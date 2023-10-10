const Discord = require('discord.js')

module.exports = {

    name: "kick",
    description: "Permet de kick un membre",
    permission: Discord.PermissionFlagsBits.KickMembers,
    dm: false,
    category: "Modération",

    options : [
        {
            type: "user",
            name: "membre",
            description: "Membre à kick",
            required: true,
            autocomplete: false,
        }, {
            type: "string",
            name: "raison",
            description: "Raison",
            required: false,
            autocomplete: false,
        }
    ],

    async run(bot, message, args) {
        
        let user = await args.getUser("membre")
        if(!user) return message.reply("Pas de membre à kick !")
        let member = message.guild.members.cache.get(user.id)
        if(!member) return message.reply("Pas de membre à kick !")

        let reason = args.getString("raison")
        if(!reason) reason = "Aucune raison fournie.";

        if(message.user.id === user.id) return message.reply("Essaie pas de te kick !")
        if((await message.guild.fetchOwner()).id === user.id) return message.reply("Ne kick pas le propriétaire du serveur !")
        if(!member && !member.kickable) return message.reply("Je ne peux pas kick ce membre!")
        if(member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu ne peux pas kick ce membre !")

        try {await user.send(`Tu as été kick du serveur ${message.guild.name} par ${message.user} pour la raison : \`${reason}\``)} catch(err) {}

        let embed = new Discord.EmbedBuilder()
        .setColor(bot.color)
        .setTitle(`Explusion de ${user.tag}`)
        .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
        .setDescription(`
            > Modérateur : ${message.user}
            > Victime : ${user}
            > Raison : ${reason}`)
        .setTimestamp()
        .setFooter({text: `Kick de ${user.tag}`})

        await message.reply({ embeds: [embed] });

        await member.kick(reason)
    } 
}