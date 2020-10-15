const Command = require('../../structures/bases/command');
const { lockdownModel } = require('../../database/models/export/index');
const ms = require('ms');

const channelRegex = RegExp(/<#(\d{17,19})>/);
const msRegex = RegExp(/(\d+(s|m|h|d|w))/);

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'lockdown',
            description: 'Lockdown a channel for a certain length.',
            category: 'Moderation',
            usage: '<channel> <time>',
            examples: [
                'lockdown #General 10m',
                'lockdown 727242067201360042 1h',
            ],
        });
    }

    async execute(message, args) {
        const channelID = channelRegex.exec(args[0]) ? channelRegex.exec(args[0])[1] : args[0];
        const channel = message.guild.channels.cache.get(channelID);

        const time = msRegex.test(args[1]) ? msRegex.exec(args[1])[1] : null;

        if (!channel) {
            return message.channel.send('You need to mention a channel to put into lockdown.');
        }
        else if (!time) {
            return message.channel.send('You need to specifiy how long you want to lockdown the channel for.');
        }

        let lockdownDoc = await lockdownModel.findOne({
            guildID: message.guild.id,
            channelID: channel.id,
        });

        if (lockdownDoc) {
            return message.channel.send('This channel is already on lockdown.');
        }

        lockdownDoc = new lockdownModel({
            guildID: message.guild.id,
            channelID: channel.id,
            length: Date.now() + ms(time),
        });

        await lockdownDoc.save().catch(err => console.log(err));
    }
}; 