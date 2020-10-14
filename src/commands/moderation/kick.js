const Command = require('../../structures/bases/command');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'kick',
            description: 'Kicks a member from the server... Duh!',
        });
    }

    async execute(message, args, mentionedMember) {
        const reason = args.slice(1).join(' ');

        mentionedMember.kick([reason]).catch(err => console.log(err));
        this.client.utils.modlog(message, mentionedMember.user, 'Kick', reason, 'ORANGE');
    }
}; 