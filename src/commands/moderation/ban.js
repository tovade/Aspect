const Command = require('../../structures/bases/command');
const { caseModel } = require('../../database/models/export/index');

const userRegex = RegExp(/<@!?(\d{17,19})>/);
const daysRegex = RegExp(/--days=([0-7])/);

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'ban',
            description: 'Bans a member from the server... Duh!',
            category: 'Moderation',
            usage: '<member> [--ref=number] [--days=number] [...reason]',
        });
    }

    async execute(message, args) {
        const userID = userRegex.exec(args[0]) ? userRegex.exec(args[0])[1] : args[0];
        const user = await this.client.users.fetch(userID).catch(() => null);

        const reason = args.slice(1);
        const banOptions = args.slice(1, 4);

        for (let i = 0; banOptions.length > i; i++) {
            const option = banOptions[i];

            const guildDoc = this.client.guildCache.get(message.guild.id);
            const refRegex = RegExp(`^--ref=(([1-9][0-9]?|${guildDoc.caseCount}))$`);

            if (refRegex.test(option)) {
                const caseNumber = parseInt(refRegex.exec(option)[1]);

                const refNumber = await caseModel.findOne({
                    guildID: message.guild.id,
                    committerID: user.id,
                    case: caseNumber,
                }).catch(err => console.log(err));

                if (refNumber) {
                    var ref = `[${caseNumber}](${refNumber.messageLink})`; // eslint-disable-line no-var
                    reason.shift();
                }
            }

            if (daysRegex.test(option)) {
                var days = daysRegex.exec(option)[1]; // eslint-disable-line no-var
                reason.shift();
            }
        }

        message.guild.members.ban(user.id, { reason: reason.join(' '), days: parseInt(days) });
        this.client.utils.modlog(message, user, this.client, 'Ban', reason.join(' '), 'RED', ref);
    }
}; 