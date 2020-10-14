const Command = require('../../structures/bases/command');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'kick',
            description: 'Kicks a member from the server... Duh!',
        });
    }

    async execute(message, args, mentionedMember) {
        const reason = args.slice(1);
        const kickOptions = args.slice(1, 2);

        for (let i = 0; kickOptions.length > i; i++) {
            const option = kickOptions[i];

            const guildDoc = this.client.guildCache.get(message.guild.id);
            const refRegex = RegExp(`^--ref=(([1-9][0-9]?|${guildDoc.caseCount}))$`);

            if (refRegex.test(option)) {
                var ref = refRegex.exec(option)[1]; // eslint-disable-line no-var
                reason.shift();
            }
        }

        mentionedMember.kick([reason]).catch(err => console.log(err));
        this.client.utils.modlog(message, mentionedMember.user, this.client, 'Kick', reason, 'ORANGE', ref);
    }
}; 