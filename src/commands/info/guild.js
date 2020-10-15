const Command = require('../../structures/bases/command');
const moment = require('moment');

const verificationLevels = {
    NONE: 'None',
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    VERY_HIGH: 'Very High',
};
const regions = {
    brazil: 'Brazil',
    europe: 'Europe',
    hongkong: 'Hong Kong',
    india: 'India',
    japan: 'Japan',
    russia: 'Russia',
    singapore: 'Singapore',
    southafrica: 'South Africa',
    sydney: 'Sydney',
    'us-central': 'US Central',
    'us-east': 'US East',
    'us-west': 'US West',
    'us-south': 'US South',
};

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'guild',
            description: 'Display information about a guild.',
            category: 'Info',
        });
    }

    async execute(message) {
        const guild = message.guild;

        const embed = {
            color: 'BLUE',
            description: `Info on **${guild.name}** (ID: ${guild.id})`,
            thumbnail: {
                url: guild.iconURL({ dynamic: true, format: 'png' }),
            },
            fields: [
                {
                    name: '❯ Channels',
                    value: [
                        `• ${guild.channels.cache.filter(c => c.type == 'text').size} text`,
                        `• ${guild.channels.cache.filter(c => c.type == 'voice').size} voice`,
                    ].join('\n'),
                },
                {
                    name: '❯ Member',
                    value: [
                        `• ${guild.memberCount} members`,
                        `• ${guild.owner.user.tag} (ID: ${guild.owner.id})`,
                    ].join('\n'),
                },
                {
                    name: '❯ Other',
                    value: [
                        `• Roles: ${guild.roles.cache.size}`,
                        `• Region: ${regions[guild.region]}`,
                        `• Created At: ${moment(guild.createdAt).format('L')}, ${moment(guild.createdAt).fromNow()}`,
                        `• Verification Level: ${verificationLevels[guild.verificationLevel]}`,
                    ].join('\n'),
                },
            ],
        };

        message.channel.send({ embed: embed });
    }
}; 