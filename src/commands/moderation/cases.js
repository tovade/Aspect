const Command = require('../../structures/bases/command');
const { caseModel } = require('../../database/models/export/index');
const moment = require('moment');

const userRegex = RegExp(/<@!?(\d{17,19})>/);

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'cases',
            description: 'View all the cases of a member!',
            category: 'Moderation',
            usage: '<member>',
            examples: [
                'cases @Coltz',
                'cases 611466971371929602',
            ],
        });
    }

    async execute(message, args) {
        const userID = userRegex.exec(args[0]) ? userRegex.exec(args[0])[1] : args[0];
        const user = await this.client.users.fetch(userID).catch(() => message.author);

        const caseDoc = await caseModel.find({
            guildID: message.guild.id,
            memberID: user.id,
        });

        if (!caseDoc.length) {
            return message.channel.send(`${user.tag} dosn't have any cases.`);
        }

        const embed = {
            color: 'BLUE',
            description: caseDoc.map(Case => `${Case.action} - [Case ${Case.case}](${Case.messageLink}) - ${moment(Case.date).calendar()}`).join('\n'),
        };

        message.channel.send({ embed: embed });
    }
}; 