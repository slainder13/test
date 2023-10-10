const Discord = require('discord.js');
const Player = require("discord-player")
const intents = new Discord.IntentsBitField(3276799);
const bot = new Discord.Client({intents});
const loadCommands = require('./Loaders/loadCommands');
const loadEvents = require('./Loaders/loadEvents');
const config = require("./config");

bot.commands = new Discord.Collection()
bot.color = "#77B5FE";
bot.function = {
    createId: require("./Fonctions/createId"),
    generateCaptcha: require("./Fonctions/generateCaptcha"),
}

bot.login(config.token)
loadCommands(bot)
loadEvents(bot)