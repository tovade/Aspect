const Command = require('../../structures/bases/command');
const { historyModel } = require('../../database/models/export/index');

const historyActions = [
    'warnings',
    'restrictions',
    'mutes',
    'kicks',
    'bans',
];

const userRegex = RegExp(/<@!?(\d{17,19})>/);

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'history',
            description: 'Views the history of another member!',
            category: 'Moderation',
            usage: '<member>',
            examples: [
                'history @Coltz',
                'history 611466971371929602',
            ],
        });
    }

    async execute(message, args) {
        const userID = userRegex.exec(args[0]) ? userRegex.exec(args[0])[1] : args[0];
        const user = await this.client.users.fetch(userID).catch(() => message.author);

        const historyDoc = await historyModel.findOne({
            guildID: message.guild.id,
            memberID: user.id,
        });

        if (!historyDoc) {
            return message.channel.send(`${user.tag} dosn't have any history.`);
        }

        let number = 0;
        let string = '';

        for (const action of historyActions) {
            number += historyDoc[action];
            string += `${action} ${historyDoc[action]}, `;
        }

        if (number < 1) var color = 'GREEN'; // eslint-disable-line no-var
        else if (number < 3) color = 'ORANGE';
        else color = 'RED';

        const embed = {
            color: color,
            author: {
                name: `${user.tag} - ${user.id}`,
                icon_url: user.displayAvatarURL({ dybamic: true, format: 'png' }),
            },
            description: `${string.substring(0, string.length - 2)}.`,
        };

        message.channel.send({ embed: embed });
    }
}; 