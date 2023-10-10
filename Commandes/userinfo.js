const Discord = require('discord.js')

module.exports = {

    name: "userinfo",
    description: "Permet d'afficher des informations sur un utilisateur",
    permission: "Aucune",
    dm: true,
    category: "Informations",
    options: [
        {
            type: "user",
            name: "utilisateur",
            description: "Quel est l'utilisateurs",
            required: true,
            autocomplete: false,
        },
    ],
    
    async run(bot, message, args) {
        
        let user = await args.getUser("utilisateur")
        let embed = new Discord.EmbedBuilder()
        .setTitle(`Informations de ${user.tag}`)
        .setThumbnail(user.displayAvatarURL({dynamic: true}))
        .setColor(bot.color)
        .setDescription(`
         __**User Infos**__
         > **Name :** ${user.tag} | ${user.toString()}
         > **Tag :** ${user.tag}
         > **ID :** ${user.id}
         __**Informations Compte**__
         
         > **A rejoint le :** J'en sais rien moi tu m'as pris pour qui ?
         > **Créer :** <t:${parseInt(user.createdTimestamp / 1000)}:R>
         `)
         .setTimestamp()
         .setFooter({text: "Informations de l'utilisateur"})
         
         await message.reply({ embeds: [embed] });

    }
}