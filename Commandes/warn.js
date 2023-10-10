const Discord = require('discord.js')

module.exports = {

    name: "warn",
    description: "Warn un membre",
    permission: Discord.PermissionFlagsBits.ModerateMembers,
    dm: false,
    category: "Modération",
    options: [
        {
            type: "user",
            name: "membre",
            description: "Membre à warn",
            required: true,
            autocomplete: false,
        }, {
        
            type: "string",
            name: "raison",
            description: "Raison du warn",
            required: false,
            autocomplete: false,
        }
    ],

    async run(bot, message, args, db) {

        let user = args.getUser("membre")
        if(!user) return message.reply("Pas de membre !")
        let member = message.guild.members.cache.get(user.id)
        if(!member) return message.reply("Pas de membre !")

        let reason = args.getString("raison")
        if(!reason) reason = "Aucune raison n'a été fournie.";

        if(message.user.id === user.id) return message.reply("Essaie pas de te warn !")
        if((await message.guild.fetchOwner()).id === user.id) return message.reply("Ne warn pas le propriétaire du serveur !")
        if(!member && !member.bannable) return message.reply("Je ne peux pas warn ce membre!")
        if(member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("Tu ne peux pas warn ce membre !")

        try { await user.send(`Vous avez été warn sur le serveur ${message.guild.name} pour la raison : \`${reason}\``) } catch (err) {}

        let embed = new Discord.EmbedBuilder()
        .setColor(bot.color)
        .setTitle(`Warn de ${user.tag}`)
        .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
        .setDescription(`
        > Modérateur : ${message.user}
        > Membre : ${user}
        > Raison : ${reason}`)
        .setTimestamp()
        .setFooter({text: `Warn de ${user.tag}`})

        await message.reply({ embeds: [embed] });

        let ID = await bot.function.createId("WARN")

        db.query(`INSERT INTO warns (guild, user, author, warn, reason, date) VALUES ('${message.guild.id}', '${user.id}', '${message.user.id}', '${ID}', '${reason.replace(/'/g, "\\'")}', '${Date.now()}')`)
    }
}