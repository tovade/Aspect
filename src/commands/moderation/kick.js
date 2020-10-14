const Command = require('../../structures/bases/command');
const { caseModel } = require('../../database/models/export/index');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'kick',
            description: 'Kicks a member from the server... Duh!',
            category: 'Moderation',
            usage: '<member> [--ref=case] [...reason]',
            examples: [
                'kick @Coltz',
                'kick @Coltz dumb.',
                'kick @Tomson --ref=123 coz.',
            ],
        });
    }

    async execute(message, args, mentionedMember) {
        const reason = args.slice(1);
        const kickOptions = args.slice(1, 2);

        for (let i = 0; kickOptions.length > i; i++) {
            const option = kickOptions[i];

            const guildDoc = this.client.guildCache.get(message.guild.id);
            const refRegex = RegExp(`^--ref=(([1-9][0-9]?|${guildDoc.caseCount}))$`);

            const refExec = refRegex.exec(option);

            if (!refExec) break;

            if (refExec) {
                const caseNumber = parseInt(refExec[1]);

                const refNumber = await caseModel.findOne({
                    guildID: message.guild.id,
                    committerID: mentionedMember.id,
                    case: caseNumber,
                }).catch(err => console.log(err));

                if (refNumber) {
                    var ref = `[${caseNumber}](${refNumber.messageLink})`; // eslint-disable-line no-var
                    reason.shift();
                }
            }
        }

        mentionedMember.kick([reason.join(' ')]).catch(err => console.log(err));
        this.client.utils.modlog(message, mentionedMember.user, this.client, 'Kick', reason.join(' '), 'ORANGE', ref);
    }
}; 