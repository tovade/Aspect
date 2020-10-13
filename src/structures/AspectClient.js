const { Client, Collection } = require('discord.js');
const Util = require('./util');

module.exports = class AspectClient extends Client {

    constructor(options = {}) {
        super({
            disableMentions: 'everyone',
        });

        this.token = options.bot_token;

        this.prefix = options.prefix;

        this.commands = new Collection();

        this.utils = new Util(this);

        this.once('ready', () => console.log('Yo this is ready!'));

        this.on('message', (message) => {
            if (!message.content.startsWith(this.prefix) || message.bot || !message.guild) return;

            const [cmd, ...args] = message.content.slice(this.prefix.length).trim().split(/ +/g);

            const command = this.commands.get(cmd);

            if (!command) return;

            try {
                command.execute(message, args);
            }
            catch (err) {
                console.log(err);
                message.channel.send('There seems to have been an error while executing this command.');
            }
        });
    }

    async start() {
        super.login(this.token);
        this.utils.loadCommands();
    }
};