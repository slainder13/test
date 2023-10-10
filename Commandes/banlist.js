const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, PermissionFlagsBits, ComponentType } = require('discord.js');
const Discord = require('discord.js')
const ms = require("ms");

module.exports = {
    name:"banlist",
    description: "This command serve to get the list of all server bans!",
    permission: Discord.PermissionFlagsBits.BanMembers,
    dm: false,
    category: "Modération",
    options: [],

    async run(bot, interaction) {

        const fetchBans = await interaction.guild.bans.fetch();
        const ID = fetchBans.map((m) => m.user.id);

        let i = 0;
        const allBans = [];
        const allBans2 = [];
        const IDArray = [];

        for (const member of fetchBans.map((m) => m.user.tag).values()) {
            allBans.push(`${i + 1}. ${member}`);
            allBans2.push(member);
            ++i;
        }

        
        for(const id of ID) {
            IDArray.push(id);
        }

        const BansEmbed = new EmbedBuilder()
            .setTitle("Ban Lists")
            .setDescription(`> **Nombre de ban :** \`${fetchBans.size}\`\n\`\`\`${allBans.join("\n")}\`\`\``)
            .setColor(bot.color)
            .setTimestamp()
            .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() });

        const NotBans = new EmbedBuilder()
            .setTitle("Ban Lists")
            .setDescription("Il n'y a pas de bannissements sur ce serveur !")
            .setColor("bot.color")
            .setTimestamp()
            .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() });

        if (allBans2.length <= 0) return interaction.reply({ embeds: [NotBans], ephemeral: true });

        const select = new StringSelectMenuBuilder()
            .setCustomId("unbans")
            .setPlaceholder("Unban un membre");

        for (let i = 0; i < allBans2.length; i++) {
            const id = IDArray[i];
            select.addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel(`${allBans2[i]}`)
                    .setDescription(`unban ${allBans2[i]}`)
                    .setValue(`${id}|${allBans2[i]}`)
            )
        }

        const TropDeLengthDansUnSelectMenu = new EmbedBuilder()
            .setTitle("Ban Lists")
            .setDescription("You can't unban because the select menu has exceeded the rate limits of 25!")
            .setColor("Random")
            .setTimestamp()
            .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() });

        if (allBans2.length > 25) return interaction.reply({ embeds: [TropDeLengthDansUnSelectMenu], ephemeral: true });

        const row = new ActionRowBuilder()
            .addComponents(select);

        const msg = await interaction.reply({ embeds: [BansEmbed], components: [row] });

        const time = ms("63 360 000")
        const collector = msg.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time });

        collector.on("collect", async i => {
            if (!i.member.permissions.has(PermissionFlagsBits.BanMembers)) return i.reply({ content: "Vous n'avez pas la permission d'effectuer cette action !", ephemeral: true });
            const memberID = await i.values.toString().split("|")[0];


            await interaction.guild.members.unban(memberID).then(async (user) => {
                const Embed = new EmbedBuilder()
                    .setTitle("Unban")
                    .setDescription(`\`${user.tag}\` a été débanni avec succès !`)
                    .setColor("Random")
                    .setTimestamp()
                    .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() });

                await i.reply({ embeds: [Embed], ephemeral: true });
                await msg.delete();
            }).catch((err) => {
                return message.reply({ content: "Une erreur est survenue" });
            });
        });
    },
};