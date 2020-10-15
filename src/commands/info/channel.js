const Command = require('../../structures/bases/command');
const moment = require('moment');

const mentionedRegex = RegExp(/<#(\d+)>/);

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'channel',
            description: 'Display information about a channel.',
            category: 'Info',
            usage: '[channel]',
            examples: [
                'channel',
                'channel #Channel',
                'channel 727242067201360042',
            ],
        });
    }

    async execute(message, args) {
        const channelID = mentionedRegex.test(args[0]) ? mentionedRegex.exec(args[0])[1] : args[0];
        const channel = message.guild.channels.cache.get(channelID) || message.channel;

        const embed = {
            color: 'BLUE',
            description: `Info on **${channel.name}** (ID: ${channel.id})`,
            thumbnail: {
                url: channel.guild.iconURL({ dynamic: true, format: 'png' }),
            },
            fields: [
                {
                    name: '❯ Info',
                    value: [
                        `• Type: ${this.client.utils.capitalise(channel.type)}`,
                        `• Topic: ${channel.topic ? channel.topic.length > 50 ? channel.topic.substring(0, 50) + '...' : channel.topic : 'None'}`,
                        `• NSFW: ${channel.nsfw ? 'Yes' : 'No'}`,
                        `• Creation Date: ${moment(channel.createdAt).format('L')}, ${moment(channel.createdAt).fromNow()}`,
                    ].join('\n'),
                },
            ],
        };

        message.channel.send({ embed: embed });
    }
}; 