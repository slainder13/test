const Discord = require('discord.js')
const config = require("../config");

module.exports = {
    name: 'botinfo',
    description: "Permet d'afficher des informations sur le bot",
    permission: "Aucune",
    dm: true,
    category: "Informations",

    async run(bot, message, args) {

            let embed = new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setTitle("Informations")
            .setDescription(`
            **__Informations du robot__**

            > **Developpeur :** <@${config.ownerID}>
            > **Nom :** ${bot.user.username}
            > **Tag :** ${bot.user.discriminator}
            > **ID :** ${bot.user.id}
            > **Discord Version :** V${Discord.version}
            > **Node Version :** ${process.version}
            > **Uptime :** ${Math.round(bot.uptime / (1000 * 60 * 60)) + "h " + (Math.round(bot.uptime / (1000 * 60)) % 60) + "m " + (Math.round(bot.uptime / 1000) % 60) + "s "}
            `)
            .setTimestamp()
            .setFooter({text: "Informations du robot"})

            await message.reply({ embeds: [embed] });
    }
}