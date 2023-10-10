const Discord = require('discord.js');

module.exports = {
    name: "setcaptcha",
    description: "Permet de configurer le captcha",
    permission: Discord.PermissionFlagsBits.ManageGuild,
    dm: false,
    category: "Administration",
    options: [
        {
            type: "string",
            name: "état",
            description: "État du captcha (on ou off)",
            required: true,
            autocomplete: true,
        },
        {
            type: "channel",
            name: "salon",
            description: "Salon du captcha (renseigné si on)",
            required: false,
            autocomplete: false,
        },
        {
            type: "role",
            name: "rôle",
            description: "Rôle prédéfini pour les utilisateurs ayant passé le captcha (renseigné si on)",
            required: false,
            autocomplete: false,
        }
    ],

    async run(bot, message, args, db) {
        let etat = args.getString("état");
        if (etat !== "on" && etat !== "off") return message.reply("Indique on ou off");

        if (etat === "off") {
            db.query(`UPDATE server SET captcha  = 'false', role = 'none' WHERE guild = ${message.guild.id}`)
            await message.reply("Le captcha est bien désactivé !")
        } else {
            let channel = args.getChannel("salon");
            if (!channel) return message.reply("Indique un salon pour activer le captcha !");
            channel = message.guild.channels.cache.get(channel.id);
            if (!channel) return message.reply("Pas de salon trouvé");

            let role = args.getRole("rôle");
            if (!role) return message.reply("Indique un rôle prédéfini pour les utilisateurs ayant passé le captcha !");
            role = message.guild.roles.cache.get(role.id);
            if (!role) return message.reply("Pas de rôle trouvé");

            db.query(`UPDATE server SET captcha = '${channel.id}', role = '${role.id}' WHERE guild = ${message.guild.id}`);
            await message.reply(`Le captcha est bien activé sur le salon ${channel} avec le rôle prédéfini ${role} !`);
        }
    }
}
