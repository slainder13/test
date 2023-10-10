const Discord = require('discord.js')

module.exports = {

    name: "clear",
    description: "Permet d'éffacer des messages en masses",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "Modération",
    options: [
        {
            type: "number",
            name: "nombre",
            description: "Nombre de messages à supprimer",
            required: true,
            autocomplete: false,
        }, {
        
            type: "channel",
            name: "salon",
            description: "Le salon où effacer les messages",
            required: false,
            autocomplete: false,
        }
    ],

    async run(bot, message, args) {

        let channel = args.getChannel("salon")
        if(!channel) channel = message.channel;
        if(channel.id !== message.channel.id && !message.guild.channels.cache.get(channel.id)) return message.reply("Pas de salon !")

        let number = args.getNumber("nombre")
        if(parseInt(number) <= 0 || parseInt(number) > 100) return message.reply("Veuillez entrer un nombre entre `0` et `100` inclus !")

        try {

            let messages = await channel.bulkDelete(parseInt(number))
            await message.reply({content: `J'ai bien supprimé \`${messages.size}\` message(s) !`, ephemeral: true})
            
        } catch (err) {

            let messages = [...(await channel.messages.fetch()).values()].filter(async m => m.createdAt <= 1209600000)
            if(messages.length <= 0) return message.reply("Aucun message à supprimer car ils datent plus de 14 jours!")
            await channel.bulkDelete(messages)

            if(messages.length <= 0) return message.reply("Aucun message à supprimer car ils datent tous de plus de 14 jours !")
            await message.reply({content: `J'ai pu supprimé uniquement \`${messages.size}\` message(s) car les autres dataient de plus de 14 jours !`, ephemeral: true})
            
        }
    }
}