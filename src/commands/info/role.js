const Command = require('../../structures/bases/command');
const moment = require('moment');

const mentionedRegex = RegExp(/<@&(\d+)>/);

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'role',
            description: 'Display information about a role.',
            category: 'Info',
            usage: '[role]',
            examples: [
                'role',
                'role @Role',
                'role 717862005293187172',
            ],
        });
    }

    async execute(message, args) {
        const roleID = mentionedRegex.test(args[0]) ? mentionedRegex.exec(args[0])[1] : args[0];
        const role = message.guild.roles.cache.get(roleID) || message.member.roles.highest;

        const embed = {
            color: 'BLUE',
            description: `Info on **${role.name}** (ID: ${role.id})`,
            thumbnail: {
                url: role.guild.iconURL({ dynamic: true, format: 'png' }),
            },
            fields: [
                {
                    name: '❯ Info',
                    value: [
                        `• Colour: ${role.color.toString(16)}`,
                        `• Hoisted: ${role.hoisted ? 'Yes' : 'No'}`,
                        `• Mentionable: ${role.mentionable ? 'Yes' : 'No'}`,
                        `• Creation Date: ${moment(role.createdAt).format('L')}, ${moment(role.createdAt).fromNow()}`,
                    ].join('\n'),
                },
                {
                    name: '❯ Permissions',
                    value: [
                        role.permissions.toArray().map(p => '• ' + this.client.utils.capitalise(p.replace(/_/g, ' '))).join('\n'),
                    ].join('\n'),
                },
            ],
        };

        message.channel.send({ embed: embed });
    }
}; 