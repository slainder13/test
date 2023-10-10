const { EmbedBuilder } = require('discord.js');
const { QueryType, useMasterPlayer } = require('discord-player');
const player = useMasterPlayer();

module.exports = {
    name: "8d",
    description: "Permet de mettre de la musique en 8d",
    permission: "Aucune",
    dm: false,
    category: "Musique",
    options: [
        {
            type: "string",
            name: "musique",
            description: "Musique à jouer",
            required: true,
            autocomplete: false,
        }
    ],

    async run(bot, interaction) {
        const { options } = interaction;
        const musiqueOption = options.getString("musique");

        try {
            if (!interaction.member.voice.channel) {
                return interaction.reply({ content: "Vous n'êtes pas dans un salon vocal.", ephemeral: true });
            }

            let queue = player.node.get(interaction.guild.id);

            if (!queue) {
                player.node.create(interaction.guild.id, {
                    volume: false,
                    disableHistory: false,
                    leaveOnEmpty: true,
                    leaveOnEmptyCooldown: 30000,
                    leaveOnEnd: true,
                    leaveOnEndCooldown: 30000,
                    selfDeaf: true,
                    metadata: {
                        channel: interaction.channel,
                        requestedBy: interaction.user,
                    },
                });

                queue = player.node.get(interaction.guild.id);
            }

            queue.filters.ffmpeg.toggle('8D');
            const embed = new EmbedBuilder()
                .setDescription(`Le système audio est désormais en 8d, si vous souhaitez le désactiver, faites .stop et rejouez de la musique ensuite`)
                .setFooter({ text: interaction.user.username });

            await interaction.reply({ embeds: [embed] });
        } catch (err) {
            await interaction.reply({ content: "Une erreur est survenue !", ephemeral: true });
            console.log(err);
        }
    },
};
