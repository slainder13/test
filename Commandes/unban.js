const Discord = require('discord.js')

module.exports = {

    name: "unban",
    description: "Permet de déban un utilisateur",
    description: "Permet de débannir un utilisateur",
    permission: Discord.PermissionFlagsBits.BanMembers,
    dm: false,
    category: "Modération",
    options : [
        {
            type: "user",
            name: "utilisateur",
            description: "Utilisateur à unban",
            required: true,
            autocomplete: false,
        }, {
            type: "string",
            name: "raison",
            description: "Raison du unban",
            required: false,
            autocomplete: false,
        }
    ],

    async run(bot, message, args) {

        try {

            let user = args.getUser("utilisateur")
            if (!user) return message.reply("Pas d'utilisateur !")

            let reason = args.getString("raison")
            if(!reason) reason = "Pas de raison fournie";

            if(!(await message.guild.bans.fetch()).get(user.id)) return message.reply("Cet utilisateur n'est pas banni")

            try {await user.send(`Tu as été unban du serveur ${message.guild.name} par ${message.author} pour la raison : \`${reason}\``)} catch (err) {}

            let embed = new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setTitle(`Unban de ${user.tag}`)
            .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
            .setDescription(`
            > Modérateur : ${message.user}
            > Membre : ${user}
            > Raison : ${reason}`)
            .setTimestamp()
            .setFooter({text: `Unban de ${user.tag}`})
    
            await message.reply({ embeds: [embed] });

            await message.guild.members.unban(user, reason)

        } catch (err) {

            return message.reply("Pas de d'utilisateur !")
        }

    }
}
