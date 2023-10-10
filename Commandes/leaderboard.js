const Discord = require('discord.js')
const Canvas = require("discord-canvas-easy")

module.exports = {

    name: "leaderboard",
    description: "Permet d'afficher le leaderboard",
    permission: "Aucune",
    dm: false,
    category: "Expérience",
    options : [],

    async run(bot, message, args, db) {

        db.query(`SELECT * FROM xp WHERE guild = '${message.guild.id}'`, async (err, req) => {

            if(req.length < 1) return message.reply("Personne n'a d'xp")

            await message.deferReply()

            const calculXp = (xp, level) => {

                let xptotal = 0;
                for(let i = 0; i < level + 1; i++) xptotal += i * 1000
            
                xptotal += xp;
                return xptotal;
            }

            let leaderboard = await req.sort((a, b) => calculXp(parseInt(b.xp), parseInt(b.level)) - calculXp(parseInt(a.xp), parseInt(a.level)))

            const Leaderboard = await new Canvas.Leaderboard()
            .setBot(bot)
            .setGuild(message.guild)
            .setBackground("https://cdn.discordapp.com/attachments/1085613661055361055/1121856608465596476/INen.gif")
            .setColorFont("#ffffff")

            for(let i = 0; i < (req.length > 10 ? 10 : req.length); i++) {

                await Leaderboard.addUser(await bot.users.fetch(leaderboard[i].user), parseInt(leaderboard[i].level), parseInt(leaderboard[i].xp), (parseInt(leaderboard[i].level) + 1) * 1000)
            }

            const Image  = await Leaderboard.toLeaderboard()

            await message.followUp({files: [new Discord.AttachmentBuilder(Image.toBuffer(), {name: "leaderboard.png"})]})

        })
    }
}
