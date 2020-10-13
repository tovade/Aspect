const { Client } = require('discord.js');

module.exports = class AspectClient extends Client {

    constructor(options = {}) {
        super({
            disableMentions: 'everyone',
        });

        this.token = options.bot_token;
        this.prefix = options.prefix;

        this.once('ready', () => console.log('Yo this is ready!'));

        this.on('message', (message) => {
            if (message.content == `${this.prefix}ping`) {
                return message.channel.send('Pong!');
            }
        });
    }

    async start() {
        super.login(this.token);
    }
};