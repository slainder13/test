const Discord = require('discord.js');

module.exports = {
    name: "ban",
    description: "Permet de bannir un membre",
    permission: Discord.PermissionFlagsBits.BanMembers,
    dm: false,
    category: "Modération",
    options: [
        {
            type: "user",
            name: "membre",
            description: "Membre à ban",
            required: true,
            autocomplete: false,
        },
        {
            type: "string",
            name: "raison",
            description: "Raison du ban",
            required: false,
            autocomplete: false,
        }
    ],

    async run(bot, message, args) {
        try {
            let user = await bot.users.fetch(args._hoistedOptions[0].value);
            if (!user) return message.reply({ content: "Pas de membre à bannir !" });
            let member = message.guild.members.cache.get(user.id);

            let reason = args.getString("raison");
            if (!reason) reason = "Aucune raison fournie.";

            if (message.user.id === user.id) return message.reply({ content: "Essaie pas de te bannir !" });
            if ((await message.guild.fetchOwner()).id === user.id) return message.reply({ content: "Ne ban pas le propriétaire du serveur !" });
            if (!member && !member.bannable) return message.reply({ content: "Je ne peux pas bannir ce membre !" });
            if (member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply({ content: "Tu ne peux pas bannir ce membre !" });
            if ((await message.guild.bans.fetch()).get(user.id)) return message.reply({ content: "Ce membre est déjà banni !" });

            try {
                await user.send(`Tu as été banni du serveur ${message.guild.name} par ${message.user} pour la raison : \`${reason}\``);} catch (err) {}

            let embed = new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setTitle(`Bannisement de ${user.tag}`)
            .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
            .setDescription(`
            > Modérateur : ${message.user}
            > Victime : ${user}
            > Raison : ${reason}
            `)
            .setTimestamp()
            .setFooter({text: `Bannisement de ${user.tag}`})

            await message.reply({ embeds: [embed] });

            await message.guild.bans.create(user.id, { reason: reason });
        } catch (err) {
            return message.reply({ content: "Pas de membre à bannir" });
        }
    }
};