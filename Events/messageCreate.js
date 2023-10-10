const Discord = require("discord.js")

module.exports = async(bot, message) => {

    let db = bot.db;
    if(message.author.bot || message.channel.type === Discord.ChannelType.DM) return;

    db.query(`SELECT * FROM server WHERE guild = '${message.guild.id}'`, async (err, req) => {

        if(req.length < 1) {

            db.query(`INSERT INTO server (guild, captcha, antiraid, role) VALUES (${message.guild.id}, 'false', 'false', 'none')`)
        }
    })

    db.query(`SELECT * FROM xp WHERE guild = '${message.guild.id}' AND user = '${message.author.id}'`, async (err, req) => {

        if(req.length < 1) {

            db.query(`INSERT INTO xp (guild, user, xp, level) VALUES ('${message.guild.id}', '${message.author.id}', '0', '0')`)

        } else {

            let level = parseInt(req[0].level)
            let xp = parseInt(req[0].xp)

            if((level +1) * 1000 <= xp) {

                db.query(`UPDATE xp SET	xp = '${xp - ((level + 1) * 1000)}' WHERE guild = '${message.guild.id}' AND user = '${message.author.id}'`)
                db.query(`UPDATE xp SET	level = '${level + 1}' WHERE guild = '${message.guild.id}' AND user = '${message.author.id}'`)

                await message.channel.send(`${message.author} est passé niveau ${level +1}, félicitation !`)
            } else {

                let xptogive = Math.floor(Math.random() * 25) +1;

                db.query(`UPDATE xp SET	xp = '${xp + xptogive}' WHERE guild = '${message.guild.id}' AND user = '${message.author.id}'`)
            }
        }
    })
}