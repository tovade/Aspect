const Command = require('../../structures/bases/command');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'ping',
            description: 'Pong!',
        });
    }

    async execute(message) {
        const msg = await message.channel.send('Pinging...');

        const messagePing = msg.createdTimestamp - message.createdTimestamp;

        msg.edit(`🏓 Pong! \`${messagePing}\` \nHeart beat: \`${this.client.ws.ping}\``);
    }
}; 